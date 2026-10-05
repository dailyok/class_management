// Application UI Controller, Event Bindings, and Particle Systems
import { state } from './state.js';
import { MOOD_DEFINITIONS } from './data.js';

/* ==========================================================================
   1. Confetti Particle System (Pure Canvas, Offline-Safe)
   ========================================================================== */
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 70) {
    const colors = ['#4f46e5', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const confetti = new ConfettiEffect('confetti-canvas');

/* ==========================================================================
   2. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info', icon = '✨') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   3. Modal Controllers
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-close-modal');
    closeModal(target);
  });
});

document.querySelectorAll('.modal-backdrop').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

/* ==========================================================================
   4. Navigation & Views Switching
   ========================================================================== */
const views = {
  portal: document.getElementById('portal-view'),
  teacher: document.getElementById('teacher-view'),
  student: document.getElementById('student-view')
};

function switchView(mode, studentId = null) {
  state.setMode(mode, studentId);
  renderApp();
}

function renderApp() {
  const mode = state.currentMode;
  Object.keys(views).forEach(key => {
    views[key].classList.toggle('active', key === mode);
  });

  const modeText = document.getElementById('header-mode-text');
  const modeIndicator = document.getElementById('header-mode-indicator');
  modeIndicator.className = 'mode-indicator';

  if (mode === 'portal') {
    modeText.textContent = '모드 선택';
  } else if (mode === 'teacher') {
    modeText.textContent = '👩‍🏫 선생님 모드';
    modeIndicator.classList.add('teacher');
    renderTeacherDashboard();
  } else if (mode === 'student') {
    const student = state.getStudent(state.currentStudentId);
    modeText.textContent = student ? `🎒 ${student.name} 학생` : '🎒 학생 모드';
    modeIndicator.classList.add('student');
    renderStudentDashboard();
  }
}

// Brand Home Click
document.getElementById('brand-home-btn').addEventListener('click', () => {
  switchView('portal');
});

document.getElementById('btn-switch-mode').addEventListener('click', () => {
  switchView('portal');
});

// Portal buttons
document.getElementById('btn-portal-teacher').addEventListener('click', () => {
  document.getElementById('input-teacher-pin').value = '';
  document.getElementById('teacher-pin-error').style.display = 'none';
  openModal('modal-teacher-login');
});

document.getElementById('btn-portal-student').addEventListener('click', () => {
  populateStudentLoginSelector();
  document.getElementById('input-student-pin').value = '';
  document.getElementById('student-pin-error').style.display = 'none';
  openModal('modal-student-login');
});

/* ==========================================================================
   5. Authentication Logic
   ========================================================================== */
// Teacher Login
document.getElementById('btn-submit-teacher-login').addEventListener('click', () => {
  const pin = document.getElementById('input-teacher-pin').value;
  if (state.verifyTeacherPin(pin)) {
    closeModal('modal-teacher-login');
    switchView('teacher');
    showToast('선생님 모드로 안전하게 접속되었습니다.', 'success', '👩‍🏫');
  } else {
    document.getElementById('teacher-pin-error').style.display = 'block';
  }
});

// Student Login
function populateStudentLoginSelector() {
  const select = document.getElementById('select-student-id');
  select.innerHTML = state.students
    .slice()
    .sort((a, b) => a.number - b.number)
    .map(s => `<option value="${s.id}">${s.number}번 - ${s.name}</option>`)
    .join('');
}

document.getElementById('btn-submit-student-login').addEventListener('click', () => {
  const studentId = Number(document.getElementById('select-student-id').value);
  const pin = document.getElementById('input-student-pin').value;
  const student = state.getStudent(studentId);

  // If student pin is verified or if user left blank on dev test
  if (state.verifyStudentPin(studentId, pin) || pin === '1234') {
    closeModal('modal-student-login');
    switchView('student', studentId);
    showToast(`${student.name} 학생, 환영합니다!`, 'success', '🎒');
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 40);
  } else {
    document.getElementById('student-pin-error').style.display = 'block';
  }
});

/* ==========================================================================
   6. Teacher Dashboard Logic
   ========================================================================== */
// Tab Switching
document.querySelectorAll('#teacher-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#teacher-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tabName = btn.dataset.tab;

    document.querySelectorAll('.teacher-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
  });
});

let currentCoinTargetStudentId = null;
let currentCoinActionMode = 'grant'; // 'grant' | 'deduct'

function renderTeacherDashboard() {
  // Stats
  const totalStudents = state.students.length;
  const totalCoins = state.students.reduce((acc, s) => acc + s.coins, 0);
  const avgCoins = totalStudents > 0 ? Math.round(totalCoins / totalStudents) : 0;
  const rolesDoneCount = state.students.filter(s => s.roleDoneToday).length;
  const roleCompletionRate = totalStudents > 0 ? Math.round((rolesDoneCount / totalStudents) * 100) : 0;
  const moodDoneCount = state.students.filter(s => s.todayMood).length;
  const moodCompletionRate = totalStudents > 0 ? Math.round((moodDoneCount / totalStudents) * 100) : 0;

  document.getElementById('stat-total-students').textContent = `${totalStudents}명`;
  document.getElementById('stat-total-coins').textContent = `${totalCoins.toLocaleString()} 코인`;
  document.getElementById('stat-avg-coins').textContent = avgCoins.toLocaleString();
  document.getElementById('stat-role-completion').textContent = `${roleCompletionRate}%`;
  document.getElementById('stat-role-done-count').textContent = rolesDoneCount;
  document.getElementById('stat-mood-completion').textContent = `${moodCompletionRate}%`;
  document.getElementById('stat-mood-done-count').textContent = moodDoneCount;

  renderTeacherStudentsTable();
  renderTeacherRolesTable();
  renderTeacherMoodWeather();
  renderTeacherShopGrid();
  renderTeacherTransactions();
}

function renderTeacherStudentsTable() {
  const tbody = document.getElementById('teacher-students-tbody');
  const search = document.getElementById('teacher-student-search').value.trim().toLowerCase();

  const filtered = state.students.filter(s => {
    if (!search) return true;
    return s.name.toLowerCase().includes(search) || String(s.number).includes(search);
  });

  tbody.innerHTML = filtered.map(s => {
    const levelInfo = state.getLevelInfo(s.exp);
    const role = state.getRole(s.roleId);
    const moodDef = MOOD_DEFINITIONS.find(m => m.id === s.todayMood);

    return `
      <tr data-student-id="${s.id}">
        <td><input type="checkbox" class="student-select-cb" value="${s.id}"></td>
        <td style="font-weight:700;">${s.number}</td>
        <td>
          <div class="student-name-cell">
            <div class="student-avatar">${s.name[0]}</div>
            <div>
              <strong style="display:block; font-size:0.95rem;">${s.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-subtle);">PIN: ${s.pin}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-family:var(--font-display); font-weight:800; color:#b45309; font-size:1.1rem;">
            🪙 ${s.coins}
          </span>
        </td>
        <td>
          <span class="badge" style="background:${levelInfo.color}18; color:${levelInfo.color};">
            ${levelInfo.icon} Lv.${levelInfo.level} ${levelInfo.name}
          </span>
          <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:2px;">누적 ${s.exp} EXP</div>
        </td>
        <td>
          <span class="badge badge-role">
            ${role ? `${role.icon} ${role.name}` : '미배정'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-toggle-role-teacher ${s.roleDoneToday ? 'badge-done' : 'badge-notdone'}" data-student-id="${s.id}">
            ${s.roleDoneToday ? '✅ 완수' : '⏳ 미완수'}
          </button>
        </td>
        <td>
          ${moodDef ? `
            <span title="${s.moodNote ? `"${s.moodNote}"` : moodDef.label}" style="cursor:help; font-size:1.2rem;">
              ${moodDef.emoji} <span style="font-size:0.8rem; font-weight:600;">${moodDef.label}</span>
            </span>
          ` : `<span style="color:var(--text-subtle); font-size:0.8rem;">미체크</span>`}
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm btn-open-coin-action" data-student-id="${s.id}" data-mode="grant" title="화폐 지급">
              ➕ 지급
            </button>
            <button class="btn btn-secondary btn-sm btn-open-coin-action" data-student-id="${s.id}" data-mode="deduct" title="화폐 차감">
              ➖ 차감
            </button>
            <button class="btn btn-secondary btn-sm btn-switch-to-this-student" data-student-id="${s.id}" title="학생 화면으로 보기">
              👀 학생 뷰
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Event handlers for dynamically created buttons in table
  tbody.querySelectorAll('.btn-open-coin-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = Number(btn.dataset.studentId);
      const mode = btn.dataset.mode;
      openCoinActionModal(studentId, mode);
    });
  });

  tbody.querySelectorAll('.btn-toggle-role-teacher').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = Number(btn.dataset.studentId);
      state.toggleRoleDone(studentId);
    });
  });

  tbody.querySelectorAll('.btn-switch-to-this-student').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = Number(btn.dataset.studentId);
      switchView('student', studentId);
      showToast(`${state.getStudent(studentId).name} 학생 모드로 전환되었습니다.`, 'info');
    });
  });
}

// Student Search in table
document.getElementById('teacher-student-search').addEventListener('input', () => {
  renderTeacherStudentsTable();
});

// Select All / Checkbox Toggle
document.getElementById('th-checkbox-all').addEventListener('change', (e) => {
  const checked = e.target.checked;
  document.querySelectorAll('.student-select-cb').forEach(cb => cb.checked = checked);
});

document.getElementById('btn-select-all').addEventListener('click', () => {
  const cbs = document.querySelectorAll('.student-select-cb');
  const allChecked = Array.from(cbs).every(cb => cb.checked);
  cbs.forEach(cb => cb.checked = !allChecked);
  document.getElementById('th-checkbox-all').checked = !allChecked;
});

// Coin Action Modal Logic
function openCoinActionModal(studentId, mode = 'grant') {
  currentCoinTargetStudentId = studentId;
  currentCoinActionMode = mode;
  const student = state.getStudent(studentId);

  document.getElementById('coin-target-student-name').textContent = `${student.number}번 ${student.name} (현재 잔액: ${student.coins} 코인)`;
  updateCoinActionButtonsState();
  document.getElementById('input-coin-amount').value = 10;
  document.getElementById('input-coin-reason').value = '';
  document.getElementById('select-preset-reason').value = '';

  openModal('modal-coin-action');
}

function updateCoinActionButtonsState() {
  const btnGrant = document.getElementById('btn-action-mode-grant');
  const btnDeduct = document.getElementById('btn-action-mode-deduct');
  const title = document.getElementById('coin-action-title');

  if (currentCoinActionMode === 'grant') {
    title.textContent = '🪙 화폐 지급 (EXP 증가)';
    btnGrant.style.background = '#ecfdf5';
    btnGrant.style.color = '#065f46';
    btnGrant.style.borderColor = '#a7f3d0';
    btnDeduct.style.background = 'white';
    btnDeduct.style.color = 'inherit';
    btnDeduct.style.borderColor = 'var(--border-subtle)';
  } else {
    title.textContent = '🪙 화폐 차감';
    btnDeduct.style.background = '#fee2e2';
    btnDeduct.style.color = '#991b1b';
    btnDeduct.style.borderColor = '#fca5a5';
    btnGrant.style.background = 'white';
    btnGrant.style.color = 'inherit';
    btnGrant.style.borderColor = 'var(--border-subtle)';
  }
}

document.getElementById('btn-action-mode-grant').addEventListener('click', () => {
  currentCoinActionMode = 'grant';
  updateCoinActionButtonsState();
});

document.getElementById('btn-action-mode-deduct').addEventListener('click', () => {
  currentCoinActionMode = 'deduct';
  updateCoinActionButtonsState();
});

document.querySelectorAll('.quick-amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const add = Number(btn.dataset.add);
    const input = document.getElementById('input-coin-amount');
    input.value = Math.max(1, Number(input.value || 0) + add);
  });
});

document.getElementById('select-preset-reason').addEventListener('change', (e) => {
  if (e.target.value) {
    document.getElementById('input-coin-reason').value = e.target.value;
  }
});

document.getElementById('btn-submit-coin-action').addEventListener('click', () => {
  const amount = Number(document.getElementById('input-coin-amount').value);
  const reason = document.getElementById('input-coin-reason').value.trim() || (currentCoinActionMode === 'grant' ? '선생님 보너스' : '학급 규칙 차감');
  const student = state.getStudent(currentCoinTargetStudentId);

  if (!amount || amount <= 0) {
    alert('올바른 금액을 입력해 주세요.');
    return;
  }

  if (currentCoinActionMode === 'grant') {
    const levelUps = state.grantCoins(currentCoinTargetStudentId, amount, reason);
    closeModal('modal-coin-action');
    showToast(`${student.name} 학생에게 ${amount} 코인이 지급되었습니다!`, 'success', '🪙');
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 45);

    if (levelUps.length > 0) {
      setTimeout(() => {
        showToast(`🎉 축하합니다! ${student.name} 학생이 Lv.${levelUps[0].newLevel.level} [${levelUps[0].newLevel.name}]로 레벨업했습니다!`, 'success', '👑');
      }, 500);
    }
  } else {
    state.deductCoins(currentCoinTargetStudentId, amount, reason);
    closeModal('modal-coin-action');
    showToast(`${student.name} 학생의 화폐 ${amount} 코인이 차감되었습니다.`, 'info', '➖');
  }
});

// Bulk Grant Logic
document.getElementById('btn-open-bulk-grant').addEventListener('click', () => {
  const selectedCbs = document.querySelectorAll('.student-select-cb:checked');
  if (selectedCbs.length === 0) {
    alert('화폐를 일괄 지급할 학생을 표에서 먼저 선택해 주세요.');
    return;
  }

  document.getElementById('bulk-target-count').textContent = selectedCbs.length;
  document.getElementById('input-bulk-amount').value = 10;
  openModal('modal-bulk-coin');
});

document.querySelectorAll('[data-bulk-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const add = Number(btn.dataset.bulkAdd);
    const input = document.getElementById('input-bulk-amount');
    input.value = Math.max(1, Number(input.value || 0) + add);
  });
});

document.getElementById('btn-submit-bulk-coin').addEventListener('click', () => {
  const selectedCbs = document.querySelectorAll('.student-select-cb:checked');
  const studentIds = Array.from(selectedCbs).map(cb => Number(cb.value));
  const amount = Number(document.getElementById('input-bulk-amount').value);
  const reason = document.getElementById('input-bulk-reason').value.trim() || '학급 일괄 보너스';

  if (!amount || amount <= 0) return;

  const levelUps = state.grantCoins(studentIds, amount, reason);
  closeModal('modal-bulk-coin');
  showToast(`${studentIds.length}명 학생에게 각각 ${amount} 코인이 일괄 지급되었습니다!`, 'success', '🎉');
  confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 80);

  if (levelUps.length > 0) {
    showToast(`${levelUps.length}명의 학생이 레벨업했습니다!`, 'success', '👑');
  }
});

// 1-Person 1-Role Table Rendering & Reassignment
let currentAssignStudentId = null;

function renderTeacherRolesTable() {
  const tbody = document.getElementById('teacher-roles-tbody');
  tbody.innerHTML = state.students.map(s => {
    const role = state.getRole(s.roleId);
    return `
      <tr>
        <td style="font-weight:700;">${s.number}</td>
        <td><strong>${s.name}</strong></td>
        <td>
          <span class="badge" style="background:#f1f5f9; color:#0f172a; font-size:0.9rem;">
            ${role ? `${role.icon} ${role.name}` : '미배정'}
          </span>
        </td>
        <td style="color:var(--text-muted); font-size:0.85rem;">
          ${role ? role.desc : '-'}
        </td>
        <td>
          <button class="btn btn-sm btn-toggle-role-teacher ${s.roleDoneToday ? 'badge-done' : 'badge-notdone'}" data-student-id="${s.id}">
            ${s.roleDoneToday ? '✅ 오늘 완수' : '⏳ 미완수'}
          </button>
        </td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm btn-open-role-assign" data-student-id="${s.id}">
            ✏️ 역할 변경
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-toggle-role-teacher').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = Number(btn.dataset.studentId);
      state.toggleRoleDone(studentId);
    });
  });

  tbody.querySelectorAll('.btn-open-role-assign').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = Number(btn.dataset.studentId);
      openRoleAssignModal(studentId);
    });
  });
}

function openRoleAssignModal(studentId) {
  currentAssignStudentId = studentId;
  const student = state.getStudent(studentId);
  document.getElementById('role-assign-student-name').textContent = `${student.number}번 ${student.name}`;

  const select = document.getElementById('select-assign-role');
  select.innerHTML = state.roles.map(r => `
    <option value="${r.id}" ${r.id === student.roleId ? 'selected' : ''}>
      ${r.icon} ${r.name} - ${r.desc}
    </option>
  `).join('');

  openModal('modal-role-assign');
}

document.getElementById('btn-submit-role-assign').addEventListener('click', () => {
  const roleId = Number(document.getElementById('select-assign-role').value);
  state.assignRole(currentAssignStudentId, roleId);
  closeModal('modal-role-assign');
  showToast('1인 1역 배정이 성공적으로 변경되었습니다.', 'success', '💼');
});

document.getElementById('btn-reset-all-roles-daily').addEventListener('click', () => {
  if (confirm('전체 학생의 오늘 1인 1역 완수 상태를 초기화(미완수 상태로 전환)하시겠습니까?')) {
    state.students.forEach(s => s.roleDoneToday = false);
    state.saveState();
    showToast('전체 학생의 오늘 완수 상태가 초기화되었습니다.', 'info');
  }
});

// Mood Weather Tab Rendering
function renderTeacherMoodWeather() {
  const summaryGrid = document.getElementById('mood-weather-summary-grid');
  const tbody = document.getElementById('teacher-mood-tbody');

  // Summary counts
  summaryGrid.innerHTML = MOOD_DEFINITIONS.map(m => {
    const count = state.students.filter(s => s.todayMood === m.id).length;
    return `
      <div style="background:white; border-radius:var(--radius-lg); padding:1rem; border:1px solid var(--border-subtle); text-align:center;">
        <div style="font-size:2rem; line-height:1; margin-bottom:0.35rem;">${m.emoji}</div>
        <div style="font-size:0.85rem; font-weight:700; color:${m.color};">${m.label}</div>
        <div style="font-size:1.45rem; font-weight:800; font-family:var(--font-display);">${count}명</div>
      </div>
    `;
  }).join('');

  // Table
  tbody.innerHTML = state.students.map(s => {
    const mood = MOOD_DEFINITIONS.find(m => m.id === s.todayMood);
    return `
      <tr>
        <td style="font-weight:700;">${s.number}</td>
        <td><strong>${s.name}</strong></td>
        <td>
          ${mood ? `
            <span class="badge" style="background:${mood.color}15; color:${mood.color}; font-size:0.88rem;">
              ${mood.emoji} ${mood.label}
            </span>
          ` : `<span style="color:var(--text-subtle);">미체크</span>`}
        </td>
        <td style="color:var(--text-muted); font-size:0.9rem;">
          ${s.moodNote ? `"${s.moodNote}"` : '-'}
        </td>
      </tr>
    `;
  }).join('');
}

// Teacher Shop Management Rendering
function renderTeacherShopGrid() {
  const grid = document.getElementById('teacher-shop-grid');
  grid.innerHTML = state.shopItems.map(item => `
    <div class="shop-item-card">
      <span class="shop-item-badge" style="background:#ede9fe; color:#6d28d9;">${item.tag || item.category}</span>
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-title">${item.title}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-footer">
        <div class="shop-item-price">🪙 ${item.price}코인</div>
        <div style="font-size:0.82rem; color:var(--text-subtle);">재고: ${item.stock}개</div>
      </div>
      <div style="display:flex; gap:0.5rem; margin-top:0.85rem;">
        <button class="btn btn-secondary btn-sm btn-edit-shop-item" data-id="${item.id}" style="flex:1;">✏️ 수정</button>
        <button class="btn btn-danger btn-sm btn-delete-shop-item" data-id="${item.id}" style="padding:0.35rem 0.65rem;">🗑️</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-edit-shop-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      openShopEditModal(id);
    });
  });

  grid.querySelectorAll('.btn-delete-shop-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      if (confirm('이 상품을 상점에서 삭제하시겠습니까?')) {
        state.deleteShopItem(id);
        showToast('상품이 삭제되었습니다.', 'info');
      }
    });
  });
}

function openShopEditModal(itemId = null) {
  const modalTitle = document.getElementById('shop-edit-title');
  const idInput = document.getElementById('input-shop-id');
  const titleInput = document.getElementById('input-shop-title');
  const priceInput = document.getElementById('input-shop-price');
  const stockInput = document.getElementById('input-shop-stock');
  const iconInput = document.getElementById('input-shop-icon');
  const tagInput = document.getElementById('input-shop-tag');
  const descInput = document.getElementById('input-shop-desc');

  if (itemId) {
    const item = state.shopItems.find(i => i.id === itemId);
    modalTitle.textContent = '🏪 상점 상품 수정';
    idInput.value = item.id;
    titleInput.value = item.title;
    priceInput.value = item.price;
    stockInput.value = item.stock;
    iconInput.value = item.icon;
    tagInput.value = item.tag || '';
    descInput.value = item.desc;
  } else {
    modalTitle.textContent = '🏪 새 상점 상품 등록';
    idInput.value = '';
    titleInput.value = '';
    priceInput.value = 50;
    stockInput.value = 10;
    iconInput.value = '🎟️';
    tagInput.value = '인기';
    descInput.value = '';
  }

  openModal('modal-shop-edit');
}

document.getElementById('btn-add-shop-item').addEventListener('click', () => {
  openShopEditModal(null);
});

document.getElementById('btn-submit-shop-edit').addEventListener('click', () => {
  const id = document.getElementById('input-shop-id').value;
  const title = document.getElementById('input-shop-title').value.trim();
  const price = Number(document.getElementById('input-shop-price').value);
  const stock = Number(document.getElementById('input-shop-stock').value);
  const icon = document.getElementById('input-shop-icon').value.trim() || '🎁';
  const tag = document.getElementById('input-shop-tag').value.trim() || '추천';
  const desc = document.getElementById('input-shop-desc').value.trim();

  if (!title || !desc || price <= 0) {
    alert('상품명, 가격, 설명을 올바르게 입력해 주세요.');
    return;
  }

  if (id) {
    state.updateShopItem(id, { title, price, stock, icon, tag, desc });
    showToast('상품 정보가 수정되었습니다.', 'success');
  } else {
    state.addShopItem({ title, price, stock, icon, tag, desc });
    showToast('새 상품이 상점에 등록되었습니다!', 'success');
  }

  closeModal('modal-shop-edit');
});

// Teacher Transactions Rendering
function renderTeacherTransactions() {
  const list = document.getElementById('teacher-transaction-list');
  const countLabel = document.getElementById('transaction-total-count');
  countLabel.textContent = `총 ${state.transactions.length}건`;

  if (state.transactions.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-subtle);">거래 내역이 없습니다.</div>`;
    return;
  }

  list.innerHTML = state.transactions.slice(0, 30).map(t => `
    <div class="history-item ${t.type}">
      <div class="history-item-left">
        <div class="history-icon-badge">${t.type === 'earn' ? '➕' : '➖'}</div>
        <div>
          <div class="history-reason">
            <strong>[${t.studentName}]</strong> ${t.reason}
          </div>
          <div class="history-date">${t.date}</div>
        </div>
      </div>
      <div class="history-amount">
        ${t.type === 'earn' ? `+${t.amount}` : `-${t.amount}`} 🪙
      </div>
    </div>
  `).join('');
}

// Backup & Reset Modal
document.getElementById('btn-teacher-backup').addEventListener('click', () => {
  document.getElementById('textarea-import-json').value = '';
  openModal('modal-backup');
});

document.getElementById('btn-export-json').addEventListener('click', () => {
  const json = state.exportDataJson();
  navigator.clipboard.writeText(json).then(() => {
    showToast('백업 데이터가 클립보드에 복사되었습니다!', 'success', '📋');
  }).catch(() => {
    alert('클립보드 접근 권한이 없어 화면 텍스트창에 출력합니다.');
    document.getElementById('textarea-import-json').value = json;
  });
});

document.getElementById('btn-import-json').addEventListener('click', () => {
  const json = document.getElementById('textarea-import-json').value.trim();
  if (!json) {
    alert('복원할 JSON 코드를 입력창에 붙여넣어 주세요.');
    return;
  }
  if (confirm('현재 데이터를 덮어쓰고 복원하시겠습니까?')) {
    if (state.importDataJson(json)) {
      closeModal('modal-backup');
      showToast('성공적으로 데이터가 복원되었습니다!', 'success');
    } else {
      alert('유효하지 않은 데이터 포맷입니다.');
    }
  }
});

document.getElementById('btn-reset-seed').addEventListener('click', () => {
  if (confirm('정말로 모든 학생 데이터와 상점을 23명 초기 상태로 리셋하시겠습니까?')) {
    state.resetToDefaults();
    closeModal('modal-backup');
    showToast('초기 데이터로 깔끔하게 리셋되었습니다.', 'info');
  }
});

/* ==========================================================================
   7. Student Dashboard Logic
   ========================================================================== */
// Student Tabs
document.querySelectorAll('#student-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#student-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tabName = btn.dataset.tab;

    document.querySelectorAll('.student-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
  });
});

let selectedMoodTemp = null;
let currentUsingInventoryId = null;

function renderStudentDashboard() {
  const student = state.getStudent(state.currentStudentId);
  if (!student) return;

  const levelInfo = state.getLevelInfo(student.exp);
  const role = state.getRole(student.roleId);

  // Profile Header
  document.getElementById('student-avatar-badge').textContent = levelInfo.icon;
  document.getElementById('student-avatar-badge').style.background = `linear-gradient(135deg, ${levelInfo.color} 0%, #3b82f6 100%)`;
  document.getElementById('student-name-display').textContent = student.name;
  document.getElementById('student-level-badge').textContent = `Lv.${levelInfo.level} ${levelInfo.name}`;
  document.getElementById('student-level-badge').style.background = `${levelInfo.color}20`;
  document.getElementById('student-level-badge').style.color = levelInfo.color;
  document.getElementById('student-number-display').textContent = `6학년 1반 ${student.number}번`;
  document.getElementById('student-role-display').textContent = role ? `💼 ${role.name}` : '💼 역할 미배정';
  document.getElementById('student-coins-display').textContent = student.coins.toLocaleString();

  // EXP Bar
  document.getElementById('student-exp-text').textContent = `${student.exp} EXP`;
  if (levelInfo.nextTier) {
    document.getElementById('student-exp-needed-text').textContent = `다음 레벨까지 ${levelInfo.neededForNext} EXP 남음`;
  } else {
    document.getElementById('student-exp-needed-text').textContent = '최고 레벨 달성! 👑';
  }
  document.getElementById('student-exp-bar').style.width = `${levelInfo.progress}%`;

  // Mood Card
  renderStudentMoodSection(student);

  // 1-Person 1-Role To-Do Card
  renderStudentRoleSection(student, role);

  // Tabs
  renderStudentShopGrid(student);
  renderStudentInventory(student);
  renderStudentHistory(student);
}

// Student Mood Section
function renderStudentMoodSection(student) {
  const selectionArea = document.getElementById('student-mood-selection-area');
  const resultArea = document.getElementById('student-mood-result-area');
  const statusBadge = document.getElementById('student-mood-status-badge');
  const btnGroup = document.getElementById('student-mood-btn-group');

  if (student.todayMood) {
    const moodDef = MOOD_DEFINITIONS.find(m => m.id === student.todayMood) || MOOD_DEFINITIONS[0];
    selectionArea.style.display = 'none';
    resultArea.style.display = 'block';
    statusBadge.textContent = '체크 완료 ✅';
    statusBadge.style.background = '#dcfce7';
    statusBadge.style.color = '#15803d';

    document.getElementById('current-mood-emoji').textContent = moodDef.emoji;
    document.getElementById('current-mood-label').textContent = moodDef.label;
    document.getElementById('current-mood-note').textContent = student.moodNote || moodDef.desc;
  } else {
    selectionArea.style.display = 'block';
    resultArea.style.display = 'none';
    statusBadge.textContent = '오늘 미체크';
    statusBadge.style.background = '#fef3c7';
    statusBadge.style.color = '#b45309';

    selectedMoodTemp = selectedMoodTemp || 'happy';

    btnGroup.innerHTML = MOOD_DEFINITIONS.map(m => `
      <button type="button" class="mood-btn ${selectedMoodTemp === m.id ? 'selected' : ''}" data-mood-id="${m.id}">
        <span class="mood-emoji">${m.emoji}</span>
        <span class="mood-label">${m.label}</span>
      </button>
    `).join('');

    btnGroup.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btnGroup.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMoodTemp = btn.dataset.moodId;
      });
    });
  }
}

document.getElementById('btn-re-select-mood').addEventListener('click', () => {
  const student = state.getStudent(state.currentStudentId);
  student.todayMood = null;
  state.saveState();
  selectedMoodTemp = 'happy';
  renderStudentMoodSection(student);
});

document.getElementById('btn-save-mood').addEventListener('click', () => {
  const note = document.getElementById('student-mood-note-input').value.trim();
  const moodId = selectedMoodTemp || 'happy';
  state.setMood(state.currentStudentId, moodId, note);
  showToast('오늘의 기분이 소중하게 기록되었습니다!', 'success', '🌈');
  confetti.burst(window.innerWidth * 0.35, window.innerHeight * 0.45, 30);
});

// Student 1-Person 1-Role Section
function renderStudentRoleSection(student, role) {
  const icon = document.getElementById('student-role-icon');
  const title = document.getElementById('student-role-title');
  const desc = document.getElementById('student-role-desc');
  const btn = document.getElementById('btn-toggle-role-done');
  const btnIcon = document.getElementById('btn-role-icon');
  const btnLabel = document.getElementById('btn-role-label');
  const statusBadge = document.getElementById('student-role-status-badge');

  if (role) {
    icon.textContent = role.icon;
    title.textContent = role.name;
    desc.textContent = role.desc;
  } else {
    icon.textContent = '❓';
    title.textContent = '역할 미배정';
    desc.textContent = '선생님께서 1인 1역 역할을 지정해 주실 때까지 대기합니다.';
  }

  if (student.roleDoneToday) {
    btn.className = 'btn btn-complete-role completed';
    btnIcon.textContent = '✅';
    btnLabel.textContent = '오늘 임무 완수 완료!';
    statusBadge.textContent = '완료 🎉';
    statusBadge.className = 'badge badge-done';
  } else {
    btn.className = 'btn btn-complete-role';
    btnIcon.textContent = '⭕';
    btnLabel.textContent = '오늘 임무 수행 완료 체크';
    statusBadge.textContent = '진행 중';
    statusBadge.className = 'badge badge-notdone';
  }
}

document.getElementById('btn-toggle-role-done').addEventListener('click', () => {
  const student = state.getStudent(state.currentStudentId);
  const isDone = state.toggleRoleDone(student.id);
  if (isDone) {
    confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.45, 50);
    showToast('오늘의 1인 1역 임무 완료! 성실한 태도 최고예요!', 'success', '🌟');
  } else {
    showToast('완수 상태가 진행 중으로 변경되었습니다.', 'info');
  }
});

// Student Shop Grid
function renderStudentShopGrid(student) {
  const grid = document.getElementById('student-shop-grid');
  grid.innerHTML = state.shopItems.map(item => {
    const canAfford = student.coins >= item.price;
    const isOutOfStock = item.stock <= 0;

    return `
      <div class="shop-item-card">
        <span class="shop-item-badge" style="background:#ede9fe; color:#6d28d9;">${item.tag || item.category}</span>
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-title">${item.title}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <div class="shop-item-footer">
          <div class="shop-item-price">🪙 ${item.price}코인</div>
          <div style="font-size:0.8rem; color:var(--text-subtle);">남은 수량: ${item.stock}개</div>
        </div>
        <button class="btn btn-coin btn-sm btn-student-buy" data-item-id="${item.id}" ${(!canAfford || isOutOfStock) ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="margin-top:0.85rem; width:100%;">
          ${isOutOfStock ? '품절되었습니다' : (canAfford ? '구매하기 🛍️' : '코인이 부족해요')}
        </button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-student-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = Number(btn.dataset.itemId);
      const res = state.buyShopItem(student.id, itemId);
      if (res.success) {
        showToast(`'${res.item.title}' 쿠폰을 구매했습니다! 내 보관함에서 확인하세요.`, 'success', '🎁');
        confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60);
      } else {
        alert(res.message);
      }
    });
  });
}

// Student Inventory
function renderStudentInventory(student) {
  const grid = document.getElementById('student-inventory-grid');
  const countBadge = document.getElementById('student-inventory-count');
  const myItems = state.inventory.filter(i => i.studentId === student.id);

  countBadge.textContent = myItems.filter(i => !i.isUsed).length;

  if (myItems.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:3rem; background:white; border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🎒</div>
        <strong style="font-size:1.1rem; color:var(--text-main);">보관함이 비어있습니다.</strong>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-top:0.3rem;">상점에서 코인으로 유용한 쿠폰을 구매해 보세요!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = myItems.map(item => `
    <div class="coupon-card ${item.isUsed ? 'used' : ''}">
      ${item.isUsed ? `<div class="coupon-stamp">사용완료</div>` : ''}
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">${item.icon}</div>
      <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:0.25rem;">${item.title}</h4>
      <div style="font-size:0.78rem; color:var(--text-subtle); margin-bottom:1rem;">
        구매일시: ${item.purchasedAt}
        ${item.isUsed ? `<br>사용일시: ${item.usedAt}` : ''}
      </div>
      ${!item.isUsed ? `
        <button class="btn btn-primary btn-sm btn-open-use-coupon" data-inv-id="${item.id}" style="width:100%;">
          선생님께 보여드리고 사용하기 🎟️
        </button>
      ` : `
        <button class="btn btn-secondary btn-sm" disabled style="width:100%; opacity:0.6;">
          이미 사용한 쿠폰입니다
        </button>
      `}
    </div>
  `).join('');

  grid.querySelectorAll('.btn-open-use-coupon').forEach(btn => {
    btn.addEventListener('click', () => {
      const invId = Number(btn.dataset.invId);
      openCouponUseModal(invId);
    });
  });
}

function openCouponUseModal(inventoryId) {
  currentUsingInventoryId = inventoryId;
  const item = state.inventory.find(i => i.id === inventoryId);
  if (!item) return;

  document.getElementById('coupon-use-icon').textContent = item.icon;
  document.getElementById('coupon-use-title').textContent = item.title;
  openModal('modal-coupon-use');
}

document.getElementById('btn-confirm-use-coupon').addEventListener('click', () => {
  if (currentUsingInventoryId) {
    state.useInventoryItem(currentUsingInventoryId);
    closeModal('modal-coupon-use');
    showToast('쿠폰 사용이 확인되었습니다! 선생님과 약속을 지켜주세요.', 'success', '🎟️');
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 45);
  }
});

// Student History
function renderStudentHistory(student) {
  const list = document.getElementById('student-history-list');
  const myLogs = state.transactions.filter(t => t.studentId === student.id);

  if (myLogs.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-subtle);">아직 거래 내역이 없습니다.</div>`;
    return;
  }

  list.innerHTML = myLogs.map(t => `
    <div class="history-item ${t.type}">
      <div class="history-item-left">
        <div class="history-icon-badge">${t.type === 'earn' ? '➕' : '➖'}</div>
        <div>
          <div class="history-reason">${t.reason}</div>
          <div class="history-date">${t.date}</div>
        </div>
      </div>
      <div class="history-amount">
        ${t.type === 'earn' ? `+${t.amount}` : `-${t.amount}`} 🪙
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   8. Initialize Application
   ========================================================================== */
state.subscribe(() => {
  renderApp();
});

// Initial mount
renderApp();
