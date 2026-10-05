// Initial Data & Seed for 6th Grade Classroom Management
export const INITIAL_ROLES = [
  { id: 1, name: "칠판 도우미", desc: "수업 후 칠판 깨끗이 닦고 분필/지우개 정돈하기", icon: "🧹" },
  { id: 2, name: "환기 지킴이", desc: "쉬는 시간마다 창문 열어 교실 공기 쾌적하게 환기하기", icon: "🪟" },
  { id: 3, name: "우유 당번", desc: "아침 우유 급식 상자 수령 및 배부, 음용 후 상자 정리", icon: "🥛" },
  { id: 4, name: "에너지 지킴이", desc: "교실 비울 때 전등 끄기 및 냉난방 적정온도 점검", icon: "💡" },
  { id: 5, name: "게시판 도우미", desc: "학급 알림판 및 시간표, 주간 학습안내 가지런히 게시", icon: "📌" },
  { id: 6, name: "청소 도구함 정리", desc: "청소 시간 후 빗자루, 대걸레, 쓰레받기 제자리 정돈", icon: "🪣" },
  { id: 7, name: "도서 도우미", desc: "학급 문고 책장 정리 및 도서 대여/반납 일지 관리", icon: "📚" },
  { id: 8, name: "방역 지킴이", desc: "손 소독제 비치 점검 및 창틀/책상 주기적 소독 티슈 안내", icon: "🧴" },
  { id: 9, name: "분리수거 지킴이", desc: "종이, 플라스틱, 캔 등 분리수거 바르게 되었는지 점검", icon: "♻️" },
  { id: 10, name: "급식 줄 도우미", desc: "급식실 이동 전 2열 종대 줄맞춤 및 바른 복도 보행 지도", icon: "🍱" },
  { id: 11, name: "태블릿 기기 당번", desc: "스마트 수업용 태블릿 충전함 보관 및 충전 케이블 연결", icon: "💻" },
  { id: 12, name: "학습지 도우미", desc: "수업 보충 학습지 배부 및 제출 안 한 친구 확인", icon: "📑" },
  { id: 13, name: "시간 알리미", desc: "수업 시작 2분 전 착석 종소리 안내 및 수업 준비 유도", icon: "⏰" },
  { id: 14, name: "체육 부장", desc: "체육 시간 전 체육용품 대여 및 수업 후 수량 확인 반납", icon: "⚽" },
  { id: 15, name: "온·습도 관리사", desc: "교실 온습도계 체크 및 미세먼지 수치 교실 칠판에 기록", icon: "🌡️" },
  { id: 16, name: "학급 식물 지킴이", desc: "창가 화분 식물 상태 살피고 주기적으로 물 주기", icon: "🪴" },
  { id: 17, name: "우산꽂이 정리", desc: "비 오는 날 물 빠짐 매트 확인 및 우산 단정히 정돈", icon: "☂️" },
  { id: 18, name: "분실물 센터장", desc: "교실 바닥에 떨어진 연필, 지우개 등을 분실물함에 보관", icon: "🔍" },
  { id: 19, name: "이동수업 반장", desc: "특별실(과학실/음악실) 이동 시 교실 문단속 및 줄 선도", icon: "🚶" },
  { id: 20, name: "학급 DJ", desc: "아침 등교 시간과 청소 시간에 활기찬 배경음악 재생", icon: "🎵" },
  { id: 21, name: "친절 우체부", desc: "선생님 심부름 및 교무실 전달 문서 수령 보좌", icon: "📮" },
  { id: 22, name: "안전 지킴이", desc: "복도에서 뛰는 학생 계도 및 교실 내 모서리 위험 요소 점검", icon: "🛡️" },
  { id: 23, name: "칭찬 배달부", desc: "친구들의 선행과 미담을 관찰하여 학급 칭찬 우체통에 기록", icon: "💌" }
];

export const LEVEL_TIERS = [
  { level: 1, name: "새싹 모험가", minExp: 0, maxExp: 50, icon: "🌱", color: "#10b981" },
  { level: 2, name: "꿈나무 탐험가", minExp: 50, maxExp: 120, icon: "🌿", color: "#06b6d4" },
  { level: 3, name: "열정 챌린저", minExp: 120, maxExp: 220, icon: "⭐", color: "#3b82f6" },
  { level: 4, name: "학급 히어로", minExp: 220, maxExp: 350, icon: "🛡️", color: "#8b5cf6" },
  { level: 5, name: "마스터 챔피언", minExp: 350, maxExp: 9999, icon: "👑", color: "#f59e0b" }
];

export const INITIAL_STUDENTS = [
  { id: 1, number: 1, name: "강민준", pin: "0001", coins: 85, exp: 85, roleId: 1, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 2, number: 2, name: "김도윤", pin: "0002", coins: 110, exp: 110, roleId: 2, roleDoneToday: true, todayMood: "happy", moodNote: "날씨가 맑아서 기분 좋아요!" },
  { id: 3, number: 3, name: "김서아", pin: "0003", coins: 145, exp: 145, roleId: 3, roleDoneToday: false, todayMood: "excited", moodNote: "오늘 체육 시간 피구 기대돼요!" },
  { id: 4, number: 4, name: "김시우", pin: "0004", coins: 60, exp: 60, roleId: 4, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 5, number: 5, name: "김예준", pin: "0005", coins: 95, exp: 95, roleId: 5, roleDoneToday: true, todayMood: "calm", moodNote: "평범하고 편안한 하루" },
  { id: 6, number: 6, name: "김지안", pin: "0006", coins: 160, exp: 160, roleId: 6, roleDoneToday: false, todayMood: "happy", moodNote: "아침에 맛있는 빵 먹고 옴" },
  { id: 7, number: 7, name: "김하은", pin: "0007", coins: 230, exp: 230, roleId: 7, roleDoneToday: true, todayMood: "excited", moodNote: "도서실 새 책 들어온 거 정리했어요!" },
  { id: 8, number: 8, name: "박서준", pin: "0008", coins: 75, exp: 75, roleId: 8, roleDoneToday: false, todayMood: "tired", moodNote: "어제 늦게 자서 조금 졸려요" },
  { id: 9, number: 9, name: "박지우", pin: "0009", coins: 120, exp: 120, roleId: 9, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 10, number: 10, name: "배서진", pin: "0010", coins: 130, exp: 130, roleId: 10, roleDoneToday: true, todayMood: "happy", moodNote: "오늘 점심 메뉴 돈가스!" },
  { id: 11, number: 11, name: "송유준", pin: "0011", coins: 90, exp: 90, roleId: 11, roleDoneToday: false, todayMood: "calm", moodNote: "태블릿 충전기 꽂아두기 완료" },
  { id: 12, number: 12, name: "신수아", pin: "0012", coins: 175, exp: 175, roleId: 12, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 13, number: 13, name: "오은우", pin: "0013", coins: 105, exp: 105, roleId: 13, roleDoneToday: true, todayMood: "happy", moodNote: "종소리 시간 딱딱 맞춤" },
  { id: 14, number: 14, name: "윤다은", pin: "0014", coins: 80, exp: 80, roleId: 14, roleDoneToday: false, todayMood: "sad", moodNote: "아침에 필통을 집에 두고 왔어요" },
  { id: 15, number: 15, name: "이건우", pin: "0015", coins: 210, exp: 210, roleId: 15, roleDoneToday: false, todayMood: "happy", moodNote: "오늘 교실 온도 22도 쾌적!" },
  { id: 16, number: 16, name: "이도현", pin: "0016", coins: 95, exp: 95, roleId: 16, roleDoneToday: true, todayMood: "calm", moodNote: "다육이 식물에 분무 완료" },
  { id: 17, number: 17, name: "이서연", pin: "0017", coins: 140, exp: 140, roleId: 17, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 18, number: 18, name: "이지호", pin: "0018", coins: 115, exp: 115, roleId: 18, roleDoneToday: false, todayMood: "excited", moodNote: "분실물 연필 주인 찾아줌!" },
  { id: 19, number: 19, name: "정서윤", pin: "0019", coins: 245, exp: 245, roleId: 19, roleDoneToday: true, todayMood: "happy", moodNote: "과학실 이동 질서 정연하게 성공" },
  { id: 20, number: 20, name: "정지민", pin: "0020", coins: 190, exp: 190, roleId: 20, roleDoneToday: true, todayMood: "excited", moodNote: "신나는 플레이리스트 틀었어요" },
  { id: 21, number: 21, name: "조예나", pin: "0021", coins: 85, exp: 85, roleId: 21, roleDoneToday: false, todayMood: null, moodNote: "" },
  { id: 22, number: 22, name: "최우진", pin: "0022", coins: 130, exp: 130, roleId: 22, roleDoneToday: false, todayMood: "calm", moodNote: "교실 뒤쪽 전선 정리함 점검" },
  { id: 23, number: 23, name: "한지우", pin: "0023", coins: 280, exp: 280, roleId: 23, roleDoneToday: true, todayMood: "happy", moodNote: "오늘 3명에게 칭찬 카드 씀" }
];

export const INITIAL_SHOP_ITEMS = [
  {
    id: 1,
    title: "자리 바꾸기 우선 선택권",
    desc: "다음 달 학급 자리 배치 시 원하는 분단/좌석을 1순위로 지정할 수 있습니다.",
    price: 90,
    icon: "💺",
    category: "학급생활",
    stock: 5,
    tag: "인기",
    badgeColor: "bg-indigo"
  },
  {
    id: 2,
    title: "숙제 1회 면제권",
    desc: "일일 과제나 독서록, 일기 작성 중 1회를 면제받습니다. (단원평가 과제 제외)",
    price: 110,
    icon: "📝",
    category: "학습",
    stock: 8,
    tag: "강추",
    badgeColor: "bg-emerald"
  },
  {
    id: 3,
    title: "5분 자유시간 쿠폰",
    desc: "점심시간 또는 쉬는 시간에 5분 동안 태블릿 자율 검색 또는 보드게임을 즐깁니다.",
    price: 50,
    icon: "⏰",
    category: "휴식",
    stock: 15,
    tag: "힐링",
    badgeColor: "bg-amber"
  },
  {
    id: 4,
    title: "급식 1등 줄서기권",
    desc: "오늘 점심시간에 가장 먼저 배식대에 줄을 서서 따뜻한 급식을 빠르게 받습니다.",
    price: 65,
    icon: "🍱",
    category: "학급생활",
    stock: 10,
    tag: "실용",
    badgeColor: "bg-rose"
  },
  {
    id: 5,
    title: "선생님 의자 1교시 착석권",
    desc: "푹신하고 편안한 담임선생님 전용 의자를 내 책상으로 가져와 1교시 동안 앉아 수업을 듣습니다.",
    price: 75,
    icon: "🛋️",
    category: "특별체험",
    stock: 4,
    tag: "VIP",
    badgeColor: "bg-purple"
  },
  {
    id: 6,
    title: "하루 음악 선곡권",
    desc: "아침 자율학습 시간이나 청소 시간에 내가 좋아하는 노래 2곡을 학급 스피커로 재생합니다.",
    price: 40,
    icon: "🎵",
    category: "취미",
    stock: 12,
    tag: "신남",
    badgeColor: "bg-cyan"
  },
  {
    id: 7,
    title: "담임선생님 시크릿 간식 교환권",
    desc: "선생님 보물창고에서 프리미엄 과자 또는 음료수 1개를 선택하여 받습니다.",
    price: 45,
    icon: "🍪",
    category: "간식",
    stock: 20,
    tag: "달콤",
    badgeColor: "bg-orange"
  },
  {
    id: 8,
    title: "일일 담임 보좌관(반장) 체험권",
    desc: "하루 동안 수업 시작 차렷 경례 및 선생님을 보좌하는 특별 일일 반장이 됩니다.",
    price: 130,
    icon: "👑",
    category: "특별체험",
    stock: 3,
    tag: "명예",
    badgeColor: "bg-yellow"
  }
];

export const MOOD_DEFINITIONS = [
  { id: "excited", label: "최고예요", emoji: "🤩", color: "#f59e0b", desc: "기운이 넘치고 너무 신나요!" },
  { id: "happy", label: "좋아요", emoji: "😊", color: "#10b981", desc: "즐겁고 기분 좋은 하루예요." },
  { id: "calm", label: "평온해요", emoji: "😌", color: "#06b6d4", desc: "차분하고 편안한 마음이에요." },
  { id: "tired", label: "피곤해요", emoji: "😴", color: "#8b5cf6", desc: "잠이 조금 부족하거나 지쳐요." },
  { id: "sad", label: "속상해요", emoji: "😢", color: "#3b82f6", desc: "마음이 아프거나 위로가 필요해요." },
  { id: "angry", label: "화나요", emoji: "😡", color: "#ef4444", desc: "답답하거나 짜증나는 일이 있어요." }
];

export const DEFAULT_TEACHER_PIN = "1234";

export const INITIAL_TRANSACTIONS = [
  { id: 101, studentId: 23, studentName: "한지우", type: "earn", amount: 20, reason: "학급 칭찬 우체통 성실 관리 보너스", date: "2026-10-05 14:20" },
  { id: 102, studentId: 7, studentName: "김하은", type: "spend", amount: 90, reason: "[상점 구매] 자리 바꾸기 우선 선택권", date: "2026-10-05 13:45" },
  { id: 103, studentId: 19, studentName: "정서윤", type: "earn", amount: 15, reason: "과학실 이동 질서 선도 칭찬", date: "2026-10-05 11:30" },
  { id: 104, studentId: 2, studentName: "김도윤", type: "earn", amount: 10, reason: "1인 1역(환기 지킴이) 성실 수행", date: "2026-10-05 10:15" },
  { id: 105, studentId: 14, studentName: "윤다은", type: "earn", amount: 10, reason: "아침 독서 시간 정숙 태도 우수", date: "2026-10-05 09:20" }
];

export const INITIAL_INVENTORY = [
  {
    id: 1,
    studentId: 7,
    itemId: 1,
    title: "자리 바꾸기 우선 선택권",
    icon: "💺",
    purchasedAt: "2026-10-05 13:45",
    isUsed: false,
    usedAt: null
  },
  {
    id: 2,
    studentId: 19,
    itemId: 6,
    title: "하루 음악 선곡권",
    icon: "🎵",
    purchasedAt: "2026-10-04 15:10",
    isUsed: true,
    usedAt: "2026-10-05 08:40"
  },
  {
    id: 3,
    studentId: 23,
    itemId: 3,
    title: "5분 자유시간 쿠폰",
    icon: "⏰",
    purchasedAt: "2026-10-04 11:20",
    isUsed: false,
    usedAt: null
  }
];
