// State Management & Business Logic with LocalStorage Persistence
import {
  INITIAL_ROLES,
  INITIAL_STUDENTS,
  INITIAL_SHOP_ITEMS,
  LEVEL_TIERS,
  DEFAULT_TEACHER_PIN,
  INITIAL_TRANSACTIONS,
  INITIAL_INVENTORY
} from './data.js';

const STORAGE_KEY = 'class_economy_app_v1';

class AppState {
  constructor() {
    this.subscribers = [];
    this.currentMode = 'portal'; // 'portal' | 'teacher' | 'student'
    this.currentStudentId = null;
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.students = parsed.students || INITIAL_STUDENTS;
        this.roles = parsed.roles || INITIAL_ROLES;
        this.shopItems = parsed.shopItems || INITIAL_SHOP_ITEMS;
        this.transactions = parsed.transactions || INITIAL_TRANSACTIONS;
        this.inventory = parsed.inventory || INITIAL_INVENTORY;
        this.teacherPin = parsed.teacherPin || DEFAULT_TEACHER_PIN;
        return;
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage, using initial seed.", e);
    }

    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.roles = JSON.parse(JSON.stringify(INITIAL_ROLES));
    this.shopItems = JSON.parse(JSON.stringify(INITIAL_SHOP_ITEMS));
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.teacherPin = DEFAULT_TEACHER_PIN;
    this.saveState();
  }

  saveState() {
    const payload = {
      students: this.students,
      roles: this.roles,
      shopItems: this.shopItems,
      transactions: this.transactions,
      inventory: this.inventory,
      teacherPin: this.teacherPin
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Storage save error", e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  // --- Auth & Navigation ---
  setMode(mode, studentId = null) {
    this.currentMode = mode;
    this.currentStudentId = studentId;
    this.notify();
  }

  verifyTeacherPin(pin) {
    return String(pin).trim() === String(this.teacherPin).trim();
  }

  changeTeacherPin(newPin) {
    if (!newPin || newPin.length < 4) return false;
    this.teacherPin = String(newPin).trim();
    this.saveState();
    return true;
  }

  verifyStudentPin(studentId, pin) {
    const student = this.getStudent(studentId);
    if (!student) return false;
    return String(student.pin).trim() === String(pin).trim();
  }

  changeStudentPin(studentId, newPin) {
    const student = this.getStudent(studentId);
    if (!student || !newPin || newPin.length < 4) return false;
    student.pin = String(newPin).trim();
    this.saveState();
    return true;
  }

  // --- Student & Level Calculations ---
  getStudent(id) {
    return this.students.find(s => s.id === Number(id));
  }

  getRole(roleId) {
    return this.roles.find(r => r.id === Number(roleId));
  }

  getLevelInfo(exp) {
    let currentTier = LEVEL_TIERS[0];
    let nextTier = LEVEL_TIERS[1] || null;

    for (let i = 0; i < LEVEL_TIERS.length; i++) {
      if (exp >= LEVEL_TIERS[i].minExp) {
        currentTier = LEVEL_TIERS[i];
        nextTier = LEVEL_TIERS[i + 1] || null;
      }
    }

    let progress = 100;
    let neededForNext = 0;
    if (nextTier) {
      const range = nextTier.minExp - currentTier.minExp;
      const current = exp - currentTier.minExp;
      progress = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
      neededForNext = nextTier.minExp - exp;
    }

    return {
      level: currentTier.level,
      name: currentTier.name,
      icon: currentTier.icon,
      color: currentTier.color,
      currentExp: exp,
      nextTier,
      progress,
      neededForNext
    };
  }

  // --- Currency & Transactions ---
  nowString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  grantCoins(studentIds, amount, reason = "선생님 보너스 지급") {
    const numAmount = Math.max(1, Number(amount));
    const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
    const leveledUpStudents = [];

    ids.forEach(id => {
      const student = this.getStudent(id);
      if (!student) return;

      const oldLevelInfo = this.getLevelInfo(student.exp);
      student.coins += numAmount;
      student.exp += numAmount; // 1 Coin earned = 1 EXP
      const newLevelInfo = this.getLevelInfo(student.exp);

      if (newLevelInfo.level > oldLevelInfo.level) {
        leveledUpStudents.push({
          student,
          oldLevel: oldLevelInfo,
          newLevel: newLevelInfo
        });
      }

      this.transactions.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        studentId: student.id,
        studentName: student.name,
        type: 'earn',
        amount: numAmount,
        reason,
        date: this.nowString()
      });
    });

    this.saveState();
    return leveledUpStudents;
  }

  deductCoins(studentIds, amount, reason = "학급 규칙에 따른 차감") {
    const numAmount = Math.max(1, Number(amount));
    const ids = Array.isArray(studentIds) ? studentIds : [studentIds];

    ids.forEach(id => {
      const student = this.getStudent(id);
      if (!student) return;
      student.coins = Math.max(0, student.coins - numAmount);
      // Notice: EXP is cumulative earned, so deducting coins does not reduce lifetime EXP.

      this.transactions.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        studentId: student.id,
        studentName: student.name,
        type: 'spend',
        amount: numAmount,
        reason,
        date: this.nowString()
      });
    });

    this.saveState();
  }

  // --- Mood Management ---
  setMood(studentId, moodId, note = "") {
    const student = this.getStudent(studentId);
    if (!student) return false;
    student.todayMood = moodId;
    student.moodNote = note.trim();
    this.saveState();
    return true;
  }

  // --- 1-Person 1-Role & To-Do ---
  toggleRoleDone(studentId) {
    const student = this.getStudent(studentId);
    if (!student) return false;
    student.roleDoneToday = !student.roleDoneToday;
    this.saveState();
    return student.roleDoneToday;
  }

  assignRole(studentId, roleId) {
    const student = this.getStudent(studentId);
    if (!student) return false;
    student.roleId = Number(roleId);
    this.saveState();
    return true;
  }

  // --- Shop & Inventory ---
  buyShopItem(studentId, itemId) {
    const student = this.getStudent(studentId);
    const item = this.shopItems.find(i => i.id === Number(itemId));

    if (!student || !item) {
      return { success: false, message: "학생 또는 상품을 찾을 수 없습니다." };
    }

    if (item.stock !== undefined && item.stock <= 0) {
      return { success: false, message: "선택하신 상품은 현재 품절되었습니다." };
    }

    if (student.coins < item.price) {
      return { success: false, message: `잔액이 부족합니다. (필요: ${item.price}코인, 보유: ${student.coins}코인)` };
    }

    // Deduct coins
    student.coins -= item.price;
    if (item.stock !== undefined && item.stock > 0) {
      item.stock -= 1;
    }

    // Create Inventory Entry
    const inventoryEntry = {
      id: Date.now() + Math.floor(Math.random() * 500),
      studentId: student.id,
      itemId: item.id,
      title: item.title,
      icon: item.icon,
      category: item.category,
      purchasedAt: this.nowString(),
      isUsed: false,
      usedAt: null
    };
    this.inventory.unshift(inventoryEntry);

    // Record Transaction
    this.transactions.unshift({
      id: Date.now() + Math.floor(Math.random() * 1000),
      studentId: student.id,
      studentName: student.name,
      type: 'spend',
      amount: item.price,
      reason: `[상점 구매] ${item.title}`,
      date: this.nowString()
    });

    this.saveState();
    return { success: true, item, inventoryEntry };
  }

  useInventoryItem(inventoryId) {
    const item = this.inventory.find(i => i.id === Number(inventoryId));
    if (!item) return false;
    if (item.isUsed) return false;

    item.isUsed = true;
    item.usedAt = this.nowString();
    this.saveState();
    return true;
  }

  // --- Shop Management (Teacher) ---
  addShopItem(itemData) {
    const newId = (this.shopItems.length > 0 ? Math.max(...this.shopItems.map(i => i.id)) : 0) + 1;
    const newItem = {
      id: newId,
      title: itemData.title,
      desc: itemData.desc,
      price: Number(itemData.price),
      icon: itemData.icon || "🎁",
      category: itemData.category || "일반",
      stock: itemData.stock !== "" && itemData.stock !== undefined ? Number(itemData.stock) : 99,
      tag: itemData.tag || "신규",
      badgeColor: itemData.badgeColor || "bg-indigo"
    };
    this.shopItems.unshift(newItem);
    this.saveState();
    return newItem;
  }

  updateShopItem(itemId, itemData) {
    const index = this.shopItems.findIndex(i => i.id === Number(itemId));
    if (index === -1) return false;
    this.shopItems[index] = {
      ...this.shopItems[index],
      ...itemData,
      price: Number(itemData.price),
      stock: Number(itemData.stock)
    };
    this.saveState();
    return true;
  }

  deleteShopItem(itemId) {
    this.shopItems = this.shopItems.filter(i => i.id !== Number(itemId));
    this.saveState();
    return true;
  }

  // --- Backup & Reset ---
  resetToDefaults() {
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.roles = JSON.parse(JSON.stringify(INITIAL_ROLES));
    this.shopItems = JSON.parse(JSON.stringify(INITIAL_SHOP_ITEMS));
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.teacherPin = DEFAULT_TEACHER_PIN;
    this.saveState();
  }

  exportDataJson() {
    return JSON.stringify({
      students: this.students,
      roles: this.roles,
      shopItems: this.shopItems,
      transactions: this.transactions,
      inventory: this.inventory,
      teacherPin: this.teacherPin
    }, null, 2);
  }

  importDataJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.students && Array.isArray(parsed.students)) {
        this.students = parsed.students;
        if (parsed.roles) this.roles = parsed.roles;
        if (parsed.shopItems) this.shopItems = parsed.shopItems;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.inventory) this.inventory = parsed.inventory;
        if (parsed.teacherPin) this.teacherPin = parsed.teacherPin;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error("Import failed", e);
    }
    return false;
  }
}

export const state = new AppState();
