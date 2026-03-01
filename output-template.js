// ================================================================
// 통합 시간표 결과물 템플릿 엔진 - output-template.js
// Part 1: 색상 유틸리티 + CSS 생성
// ================================================================

// ==========================================
// 색상 유틸리티
// ==========================================
function normalizeHex(hex) {
    const s = String(hex || '').trim().replace('#', '');
    if (s.length === 3) return s.split('').map(c => c + c).join('');
    if (s.length === 6) return s;
    return '92A8D1';
}

function hexToRgb(hex) {
    const n = normalizeHex(hex);
    return { r: parseInt(n.slice(0,2),16), g: parseInt(n.slice(2,4),16), b: parseInt(n.slice(4,6),16) };
}

function rgbToHex(rgb) {
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [rgb.r, rgb.g, rgb.b].map(c => clamp(c).toString(16).padStart(2,'0')).join('');
}

function mixColors(a, b, w = 0.5) {
    const c1 = hexToRgb(a), c2 = hexToRgb(b);
    w = Math.max(0, Math.min(1, w));
    return rgbToHex({ r: c1.r*w + c2.r*(1-w), g: c1.g*w + c2.g*(1-w), b: c1.b*w + c2.b*(1-w) });
}

function withAlpha(color, alpha) {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(0,Math.min(1,alpha))})`;
}

function getLuminance(color) {
    const rgb = hexToRgb(color);
    const t = c => { const n = c/255; return n <= 0.03928 ? n/12.92 : Math.pow((n+0.055)/1.055, 2.4); };
    return 0.2126*t(rgb.r) + 0.7152*t(rgb.g) + 0.0722*t(rgb.b);
}

// ==========================================
// 테마별 CSS 변수 생성
// ==========================================
function generateThemeCSS(themeName) {
    const themes = {
        'serenity':     { primary:'#92A8D1', primaryLight:'#B8CAE6', accent:'#D1E2F7', bg:'#F7FAFC', card:'#FFFFFF', header:'#92A8D1' },
        'classic-blue': { primary:'#0F4C81', primaryLight:'#2E86AB', accent:'#4A90A4', bg:'#F7FAFC', card:'#FFFFFF', header:'#0F4C81' },
        'midnight':     { primary:'#2C3E50', primaryLight:'#4A6274', accent:'#7F8C9B', bg:'#F5F6F8', card:'#FFFFFF', header:'#2C3E50' },
        'living-coral': { primary:'#FF6F61', primaryLight:'#FF8A80', accent:'#FFB3BA', bg:'#FFF8F7', card:'#FFFFFF', header:'#FF6F61' },
        'rose':         { primary:'#D4708F', primaryLight:'#E8A0B4', accent:'#F2C4D0', bg:'#FDF7F9', card:'#FFFFFF', header:'#D4708F' },
        'ultra-violet': { primary:'#6B5B95', primaryLight:'#8E7DBE', accent:'#B19CD9', bg:'#F8F7FB', card:'#FFFFFF', header:'#6B5B95' },
        'greenery':     { primary:'#88B04B', primaryLight:'#A8CC8C', accent:'#C8D4B8', bg:'#F7FAF4', card:'#FFFFFF', header:'#88B04B' },
        'ocean':        { primary:'#1A8A7D', primaryLight:'#3BB5A6', accent:'#8CD4CA', bg:'#F4FAF9', card:'#FFFFFF', header:'#1A8A7D' },
        'amber':        { primary:'#D48C2E', primaryLight:'#E5AD5E', accent:'#F0D0A0', bg:'#FDFAF4', card:'#FFFFFF', header:'#D48C2E' },
        'marsala':      { primary:'#955251', primaryLight:'#B87071', accent:'#D4A5A5', bg:'#FAF7F7', card:'#FFFFFF', header:'#955251' },
        'slate':        { primary:'#5A7D8B', primaryLight:'#7FA3B0', accent:'#B0CED6', bg:'#F6F9FA', card:'#FFFFFF', header:'#5A7D8B' },
        'graphite':     { primary:'#4A4A4A', primaryLight:'#717171', accent:'#A0A0A0', bg:'#F5F5F5', card:'#FFFFFF', header:'#4A4A4A' }
    };

    const t = themes[themeName] || themes['serenity'];
    const backgroundColor = mixColors(t.bg, '#ffffff', 0.85);
    const cardBackground = mixColors(t.card, '#ffffff', 0.94);
    const surfaceSoft = mixColors(t.accent, '#ffffff', 0.64);
    const headerBg = mixColors(t.header, '#ffffff', 0.82);
    const headerText = getLuminance(headerBg) > 0.58 ? '#1f2937' : '#ffffff';
    const textColor = mixColors(t.primary, '#0f172a', 0.22);
    const subtleText = mixColors(t.primary, '#64748b', 0.22);
    const borderColor = mixColors(t.primary, '#cbd5e1', 0.24);
    const lineSoft = mixColors(borderColor, '#ffffff', 0.52);
    const rowAlt = mixColors(surfaceSoft, '#ffffff', 0.3);
    const rowHover = mixColors(t.primaryLight, '#ffffff', 0.36);
    const emptyBg = mixColors(surfaceSoft, '#ffffff', 0.46);
    const chipBg = mixColors(t.primaryLight, '#ffffff', 0.34);
    const chipBorder = mixColors(t.primary, '#d5dfeb', 0.3);
    const chipText = mixColors(t.primary, '#334155', 0.35);
    const teacherChipBg = mixColors(t.accent, '#ffffff', 0.4);
    const teacherChipBorder = mixColors(t.primary, '#d8dee8', 0.25);
    const teacherChipText = mixColors(t.primary, '#475569', 0.3);
    const bodyGlowA = withAlpha(t.primaryLight, 0.3);
    const bodyGlowB = withAlpha(t.primary, 0.14);
    const bodyGradStart = mixColors(t.bg, '#ffffff', 0.9);
    const bodyGradEnd = mixColors(t.accent, '#ffffff', 0.72);
    const containerBg = withAlpha(cardBackground, 0.92);
    const panelBorder = withAlpha(t.primary, 0.25);
    const tabHoverBg = withAlpha(t.primaryLight, 0.16);
    const tabHoverBorder = withAlpha(t.primary, 0.2);
    const activeBorder = withAlpha(t.primary, 0.34);
    const modalBackdrop = withAlpha(t.primary, 0.32);
    const modalTop = mixColors(t.bg, '#ffffff', 0.78);
    const modalBottom = mixColors(t.card, '#ffffff', 0.96);

    return `
:root {
    --primary-color: ${t.primary};
    --primary-light: ${t.primaryLight};
    --accent-color: ${t.accent};
    --background-color: ${backgroundColor};
    --card-background: ${cardBackground};
    --surface-soft: ${surfaceSoft};
    --header-bg: ${headerBg};
    --header-text: ${headerText};
    --text-color: ${textColor};
    --subtle-text: ${subtleText};
    --border-color: ${borderColor};
    --line-soft: ${lineSoft};
    --empty-bg: ${emptyBg};
    --row-alt: ${rowAlt};
    --row-hover: ${rowHover};
    --panel-border: ${panelBorder};
    --tab-hover-bg: ${tabHoverBg};
    --tab-hover-border: ${tabHoverBorder};
    --active-border: ${activeBorder};
    --modal-backdrop: ${modalBackdrop};
    --modal-top: ${modalTop};
    --modal-bottom: ${modalBottom};
    --chip-bg: ${chipBg};
    --chip-border: ${chipBorder};
    --chip-text: ${chipText};
    --teacher-chip-bg: ${teacherChipBg};
    --teacher-chip-border: ${teacherChipBorder};
    --teacher-chip-text: ${teacherChipText};
    --container-bg: ${containerBg};
    --body-glow-a: ${bodyGlowA};
    --body-glow-b: ${bodyGlowB};
    --body-grad-start: ${bodyGradStart};
    --body-grad-end: ${bodyGradEnd};
    --schedule-max-width: 980px;
}`;
}

// ==========================================
// 결과물 전체 CSS
// ==========================================
function generateOutputCSS(themeName) {
    return `
${generateThemeCSS(themeName)}

* { box-sizing: border-box; }
body {
    font-family: 'Pretendard Variable', 'Noto Sans KR', sans-serif;
    margin: 0; min-height: 100vh; padding: 28px 16px;
    color: var(--text-color);
    background:
        radial-gradient(circle at 8% 6%, var(--body-glow-a) 0%, transparent 44%),
        radial-gradient(circle at 94% 0%, var(--body-glow-b) 0%, transparent 38%),
        linear-gradient(155deg, var(--body-grad-start) 0%, var(--body-grad-end) 100%);
}
body.modal-open { overflow: hidden; }

#app-container {
    max-width: 1240px; margin: 0 auto;
    background: var(--container-bg);
    border: 1px solid var(--panel-border);
    border-radius: 24px; backdrop-filter: blur(4px); padding: 34px;
}

h1 {
    display: flex; align-items: center; justify-content: center;
    text-align: center; gap: 14px; font-size: 2rem; line-height: 1.25;
    margin: 0 0 10px 0; letter-spacing: -0.02em;
}
.title-icon { height: 2.3em; border-radius: 10px; max-width: 150px; object-fit: contain; }

/* 시계 */
.clock-container {
    margin: 15px auto 25px; background: var(--surface-soft);
    padding: 8px 24px; border-radius: 20px; border: 1px solid var(--border-color);
    font-size: 15px; font-weight: 600; color: var(--text-color);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); width: fit-content;
}

/* 탭 네비게이션 */
.tab-navigation {
    display: flex; gap: 8px; margin-bottom: 22px; padding: 7px;
    background: var(--surface-soft); border: 1px solid var(--border-color);
    border-radius: 14px; overflow-x: auto;
}
.tab-button {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px;
    padding: 11px 14px; border: 1px solid transparent; border-radius: 10px;
    background: transparent; color: var(--text-color); cursor: pointer;
    transition: all 0.2s; font-weight: 600; font-size: 14px; white-space: nowrap;
    font-family: inherit;
}
.tab-button:hover:not(.active) { background: var(--tab-hover-bg); border-color: var(--tab-hover-border); }
.tab-button.active { background: var(--card-background); border-color: var(--active-border); color: var(--primary-color); }

/* 검색 */
#search-section {
    background: var(--surface-soft); border: 1px solid var(--border-color);
    padding: 22px; border-radius: 16px; margin-bottom: 24px;
}
.search-container { position: relative; max-width: 560px; margin: 0 auto; }
#search-input, #teacher-search {
    width: 100%; padding: 14px 18px 14px 46px;
    border: 1px solid var(--border-color); border-radius: 999px;
    font-size: 15px; background: var(--card-background); color: var(--text-color);
    outline: none; font-family: inherit; box-sizing: border-box;
}
#search-input:focus, #teacher-search:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--subtle-text); pointer-events: none; font-size: 20px; }
.autocomplete-dropdown {
    position: absolute; top: calc(100% + 8px); left: 0; right: 0;
    background: var(--card-background); border: 1px solid var(--border-color);
    border-radius: 12px; max-height: 280px; overflow-y: auto; z-index: 1000; display: none;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.autocomplete-item {
    padding: 11px 14px; cursor: pointer; border-bottom: 1px solid var(--line-soft);
    font-size: 14px; color: var(--text-color);
}
.autocomplete-item:last-child { border-bottom: 0; }
.autocomplete-item:hover, .autocomplete-item.selected { background-color: var(--surface-soft); }

/* 즐겨찾기 */
.favorites-section { margin-top: 18px; }
.favorites-title { font-size: 13px; color: var(--subtle-text); margin-bottom: 10px; text-align: center; font-weight: 500; }
.favorite-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.favorite-chip {
    background: var(--card-background); padding: 7px 12px; border-radius: 999px;
    font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid var(--border-color);
    color: var(--text-color); transition: all 0.2s; font-family: inherit;
}
.favorite-chip:hover { background: var(--surface-soft); border-color: var(--primary-light); transform: translateY(-1px); }

/* 시간표 헤더 */
.schedule-header {
    display: flex; justify-content: space-between; gap: 14px; align-items: flex-end;
    margin: 0 auto 14px; width: min(100%, var(--schedule-max-width));
}
.schedule-info h2 { margin: 0; font-size: 1.52rem; line-height: 1.3; letter-spacing: -0.02em; }
.schedule-info h2 small { color: var(--subtle-text); font-size: 0.78em; font-weight: 500; }
.schedule-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.action-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px 13px; border: 1px solid var(--border-color);
    background: var(--card-background); color: var(--text-color);
    border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600;
    transition: all 0.2s; font-family: inherit;
}
.action-btn:hover { background: var(--surface-soft); border-color: var(--primary-light); }
.action-btn.favorited { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }

/* 내선번호 배지 */
.ext-badge {
    background-color: var(--surface-soft); color: var(--text-color);
    font-size: 15px; padding: 4px 12px; border-radius: 20px;
    margin-left: 12px; vertical-align: middle;
    display: inline-flex; align-items: center; gap: 5px; font-weight: 600;
}

/* 테이블 */
.table-container {
    border: 1px solid var(--border-color); border-radius: 14px; overflow: auto;
    background: var(--card-background); width: min(100%, var(--schedule-max-width));
    margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
table {
    width: 100%; min-width: 760px; border-collapse: separate;
    border-spacing: 0; font-size: 14px; table-layout: fixed;
}
th, td {
    text-align: center; vertical-align: middle;
    border-right: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);
    padding: 8px 6px; line-height: 1.45; color: var(--text-color);
}
thead th {
    background: var(--header-bg); color: var(--header-text);
    font-weight: 700; padding: 12px 8px; position: sticky; top: 0; z-index: 2;
}
th:last-child, td:last-child { border-right: 0; }
tbody tr:last-child td { border-bottom: 0; }
tbody td { height: 80px; background-color: var(--card-background); transition: background-color 0.2s; }
tbody tr:nth-child(even) td { background: var(--row-alt); }

/* 오늘 하이라이트 (교사탭) */
.today-header { background-color: var(--primary-color) !important; color: white !important; }
.today-badge {
    font-size: 10px; background: white; color: var(--primary-color);
    padding: 2px 6px; border-radius: 10px; margin-left: 4px;
    vertical-align: top; font-weight: 800; display: inline-block;
}
.today-cell { border-left: 2px solid var(--primary-color) !important; border-right: 2px solid var(--primary-color) !important; }
tr:last-child .today-cell { border-bottom: 2px solid var(--primary-color) !important; }

/* 클릭 가능 셀 (교사탭 교체) */
tbody td.clickable-cell { cursor: pointer; position: relative; }
tbody td.clickable-cell:hover { background-color: var(--empty-bg); box-shadow: inset 0 0 0 2px var(--primary-color); z-index: 10; }
tbody td.clickable-cell:hover::after {
    content: "🔄 교체/대체 찾기"; position: absolute; bottom: 5px; right: 5px;
    font-size: 10px; background: var(--primary-color); color: white;
    padding: 2px 6px; border-radius: 4px; font-weight: 600;
}

/* 빈 교시 */
.empty-cell, .empty-period { background-color: var(--empty-bg) !important; color: var(--subtle-text); }
.empty-cell-label { color: var(--subtle-text); font-size: 12px; }

/* 과목 표시 */
td .subject-name { font-weight: 700; font-size: 14px; color: var(--text-color); margin-bottom: 4px; }
td .details { margin-top: 6px; line-height: 1.3; }
.location-chip {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 3px 9px; border-radius: 999px;
    background: var(--chip-bg); border: 1px solid var(--chip-border);
    color: var(--chip-text); font-size: 11px; font-weight: 600;
}
.teacher-name {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px; color: var(--teacher-chip-text); font-weight: 600;
    padding: 3px 8px; background: var(--teacher-chip-bg);
    border: 1px solid var(--teacher-chip-border); border-radius: 999px;
}

/* 선택과목 태그 (교사탭) */
.subject-tag {
    display: inline-block; width: 22px; height: 22px; line-height: 22px;
    text-align: center; border-radius: 50%; color: white;
    font-weight: 700; font-size: 12px; margin-right: 8px;
    text-shadow: 0 1px 1px rgba(0,0,0,0.3);
}
.elective-class-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 24px; height: 24px; padding: 0 8px; border-radius: 999px;
    background: var(--primary-color); color: #fff;
    font-size: 11px; font-weight: 700; line-height: 1;
}

/* 교사 사이드바 */
.teacher-layout { display: flex; gap: 20px; align-items: flex-start; }
.teacher-sidebar { 
    width: 250px; 
    min-width: 250px;
    display: flex; 
    flex-direction: column; 
    background: var(--surface-soft); 
    border: 1px solid var(--border-color);
    border-radius: 12px; 
    position: sticky;
    top: 20px;
    overflow: hidden;
    height: calc(48px + 110px * 7 + 18px);
    max-height: calc(48px + 110px * 7 + 18px);
}
.teacher-sidebar-header { padding: 14px 14px 0; flex-shrink: 0; }
.teacher-sidebar-search { position: relative; margin-bottom: 12px; }
.teacher-sidebar-search input {
    width: 100%; padding: 10px 12px 10px 36px;
    border: 1px solid var(--border-color); border-radius: 10px;
    font-size: 13px; background: var(--card-background); color: var(--text-color);
    outline: none; box-sizing: border-box; font-family: inherit;
}
.teacher-sidebar-search input:focus { border-color: var(--primary-color); }
.teacher-sidebar-search .sidebar-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--subtle-text); pointer-events: none; display: flex;
}
.teacher-sidebar-list { overflow-y: auto; padding: 0 8px 8px; flex: 1; }
.teacher-sidebar-list::-webkit-scrollbar { width: 4px; }
.teacher-sidebar-list::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
.sidebar-section-label {
    font-size: 11px; font-weight: 600; color: var(--subtle-text);
    text-transform: uppercase; letter-spacing: 0.04em;
    padding: 8px 8px 6px; user-select: none;
    display: flex; align-items: center; justify-content: space-between;
}
.sidebar-fav-clear {
    background: none; border: none; color: var(--subtle-text);
    cursor: pointer; padding: 2px 4px; font-size: 10px; font-weight: 500;
    border-radius: 6px; transition: all 0.15s; line-height: 1; font-family: inherit;
}
.sidebar-fav-clear:hover { color: var(--text-color); background: var(--row-hover); }
.sidebar-divider { height: 1px; background: var(--border-color); margin: 4px 8px 8px; }
.teacher-sidebar-item {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 9px 12px; border: none; border-radius: 9px;
    background: transparent; color: var(--text-color);
    font-size: 13.5px; font-weight: 500; cursor: pointer;
    transition: all 0.15s; text-align: left; line-height: 1.3;
    box-sizing: border-box; font-family: inherit;
}
.teacher-sidebar-item:hover { background: var(--row-hover); }
.teacher-sidebar-item.active { background: var(--primary-color); color: #fff; font-weight: 600; }
.teacher-sidebar-item .sidebar-fav-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--primary-color); flex-shrink: 0;
}
.teacher-sidebar-item.active .sidebar-fav-dot { background: rgba(255,255,255,0.6); }
.teacher-main-content { flex: 1; min-width: 0; }

/* 학생목록 모달 */
.student-list-modal {
    position: fixed; inset: 0; z-index: 2200;
    display: none; align-items: center; justify-content: center; padding: 22px;
}
.student-list-modal.open { display: flex; }
.student-list-modal-backdrop { position: absolute; inset: 0; background: var(--modal-backdrop); }
.student-list-modal-dialog {
    position: relative; width: min(860px, 100%); max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    background: linear-gradient(180deg, var(--modal-top) 0%, var(--modal-bottom) 100%);
    border: 1px solid var(--border-color); border-radius: 18px;
    animation: modalIn 0.3s ease-out;
}
.student-list-modal-header {
    padding: 18px 20px 12px; border-bottom: 1px solid var(--line-soft);
    display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
}
.student-list-modal-body { padding: 0 20px; overflow: auto; max-height: 70vh; }
.student-list-modal-footer {
    padding: 14px 20px 18px; border-top: 1px solid var(--line-soft);
    display: flex; justify-content: flex-end; gap: 8px;
}
.modal-close-btn {
    border: 1px solid var(--border-color); background: var(--card-background);
    color: var(--text-color); border-radius: 10px; font-size: 16px;
    width: 34px; height: 34px; cursor: pointer; line-height: 1;
}
.modal-secondary-btn, .modal-primary-btn {
    padding: 8px 13px; border-radius: 10px; border: 1px solid var(--border-color);
    background: var(--card-background); color: var(--text-color);
    cursor: pointer; font-size: 13px; font-weight: 600; font-family: inherit;
}
.modal-primary-btn { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
.student-list-table { width: 100%; min-width: 360px; border-collapse: collapse; table-layout: fixed; font-size: 13px; }
.student-list-table th, .student-list-table td { padding: 3px 8px; border-bottom: 1px solid var(--line-soft); border-right: 0; line-height: 1.15; font-size: 12.5px; }
.student-list-table th { position: sticky; top: 0; z-index: 1; background: var(--surface-soft); font-weight: 700; padding: 8px; }

/* 교체/보강 모달 (교사탭) */
.swap-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: none; justify-content: center;
    align-items: center; z-index: 9999; backdrop-filter: blur(4px);
}
.swap-modal-content {
    background: var(--card-background); width: 90%; max-width: 700px; max-height: 85vh;
    border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; overflow: hidden; animation: modalIn 0.3s ease-out;
}
.swap-modal-header {
    padding: 20px 25px; border-bottom: 1px solid var(--border-color);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--surface-soft);
}
.swap-modal-header h3 { margin: 0; font-size: 1.2em; color: var(--text-color); }
.swap-close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--subtle-text); padding: 0; line-height: 1; transition: color 0.2s; }
.swap-close-btn:hover { color: var(--primary-color); }
.swap-modal-body { padding: 25px; overflow-y: auto; background: var(--card-background); }

/* 교체 모달 탭 */
.swap-modal-tabs { display: flex; border-bottom: 2px solid var(--border-color); margin-bottom: 20px; }
.swap-modal-tab {
    flex: 1; padding: 12px 16px; text-align: center; font-size: 14px;
    font-weight: 600; cursor: pointer; border: none; background: none;
    color: var(--subtle-text); transition: all 0.2s; font-family: inherit; position: relative;
}
.swap-modal-tab:hover { color: var(--text-color); background: var(--empty-bg); }
.swap-modal-tab.active { color: var(--primary-color); }
.swap-modal-tab.active::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
    height: 3px; background: var(--primary-color); border-radius: 2px 2px 0 0;
}
.swap-tab-content { display: none; }
.swap-tab-content.active { display: block; }

/* 교체 결과 */
.result-section { margin-bottom: 25px; }
.result-section h4 {
    margin: 0 0 15px 0; color: var(--primary-color); font-size: 1.1em;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 2px solid var(--border-color); padding-bottom: 8px;
}
.result-list {
    list-style: none; padding: 0; margin: 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;
}
.result-item {
    background: var(--empty-bg); padding: 12px 15px; border-radius: 8px;
    border: 1px solid var(--border-color); font-size: 14px; color: var(--text-color);
}
.result-item strong { color: var(--primary-color); font-size: 15px; }
.result-item span { font-size: 12px; color: var(--subtle-text); display: block; margin-top: 4px; }
.no-result {
    color: var(--subtle-text); font-size: 14px; text-align: center;
    padding: 20px; background: var(--empty-bg); border-radius: 8px;
}
.error-notice {
    background: #FFF5F5; border-left: 4px solid #FC8181;
    padding: 15px; margin-bottom: 20px; color: #C53030;
    font-size: 14px; border-radius: 4px; line-height: 1.5;
}
.info-notice {
    background: #EBF8FF; border-left: 4px solid #63B3ED;
    padding: 15px; margin-bottom: 20px; color: #2B6CB0;
    font-size: 14px; border-radius: 4px; line-height: 1.5;
}

/* 다자간 순환 교체 */
.multi-filter-box {
    background: var(--surface-soft); border: 1px solid var(--border-color);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 18px;
}
.multi-filter-label { font-size: 13px; font-weight: 700; color: var(--text-color); margin-bottom: 10px; }
.multi-filter-slots { display: flex; flex-wrap: wrap; gap: 8px; }
.multi-filter-btn {
    padding: 6px 14px; border: 1.5px solid var(--border-color); border-radius: 20px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    background: var(--card-background); color: var(--text-color);
    font-family: inherit; transition: all 0.18s;
}
.multi-filter-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.multi-filter-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.multi-filter-clear {
    margin-top: 10px; padding: 4px 14px; border: none; border-radius: 12px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    background: #FC8181; color: white; font-family: inherit;
}

.cycle-card {
    background: var(--empty-bg); border: 1px solid var(--border-color);
    border-radius: 12px; padding: 20px; margin-bottom: 16px; transition: all 0.2s;
}
.cycle-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: var(--primary-color); }
.cycle-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.cycle-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--primary-color); color: white; font-size: 13px; font-weight: 700;
}
.cycle-card-title { font-weight: 700; font-size: 15px; color: var(--text-color); }
.cycle-flow { display: flex; flex-wrap: nowrap; align-items: stretch; gap: 4px; overflow-x: auto; padding-bottom: 4px; }
.cycle-step {
    background: var(--card-background); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 10px 8px; font-size: 12px; line-height: 1.4;
    text-align: center; flex: 0 0 auto; min-width: 120px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.cycle-step .step-teacher { font-weight: 700; color: var(--primary-color); font-size: 12px; }
.cycle-step .step-detail { color: var(--subtle-text); font-size: 11px; margin-top: 2px; }
.cycle-arrow { font-size: 14px; color: var(--primary-color); font-weight: 700; flex-shrink: 0; align-self: center; }
.cycle-summary {
    margin-top: 12px; font-size: 13px; color: var(--subtle-text);
    background: var(--card-background); padding: 10px 14px; border-radius: 8px;
    border: 1px dashed var(--border-color); line-height: 1.7;
}

/* 로딩 스피너 */
.loading-spinner {
    display: flex; align-items: center; justify-content: center;
    padding: 40px; gap: 12px; color: var(--subtle-text); font-size: 15px;
}
.spinner-anim {
    width: 24px; height: 24px; border: 3px solid var(--border-color);
    border-top-color: var(--primary-color); border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* 반별 인쇄 */
.class-schedule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
.student-card { background: var(--card-background); border: 1px solid var(--border-color); border-radius: 10px; padding: 15px; }
.student-card h4 { margin: 0 0 10px 0; color: var(--primary-color); font-size: 1.1em; }

/* 빈 상태 */
.empty-state { text-align: center; padding: 78px 20px; }
.empty-state-icon { margin-bottom: 18px; opacity: 0.45; color: var(--subtle-text); font-size: 4em; }
.empty-state h3 { margin: 0; color: var(--subtle-text); font-weight: 500; }

/* 푸터 */
.footer-credit {
    text-align: center; margin-top: 40px; padding-top: 20px;
    border-top: 1px solid var(--border-color); color: var(--subtle-text);
    font-size: 13px; line-height: 1.6;
}
.footer-credit p { margin: 0; }

/* 학생목록 버튼 */
.student-list-btn {
    padding: 4px 10px; border: 1px solid var(--border-color);
    border-radius: 999px; background: var(--card-background);
    color: var(--text-color); font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.student-list-btn:hover { background: var(--surface-soft); border-color: var(--primary-light); }

.details-with-list-slot {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.student-list-slot { min-height: 24px; display: inline-flex; align-items: center; justify-content: center; }
.student-list-placeholder { display: inline-block; width: 70px; height: 24px; visibility: hidden; }
.entry-divider { margin: 10px 0; border: 0; border-top: 1px solid var(--line-soft); }
.elective-subject-line { display: inline-flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }

/* ========================================
   교사별 탭 레이아웃 (테마 색상, 사이드바 스크롤, 표 높이 동기화)
   ======================================== */
.teacher-layout { 
    display: flex; 
    align-items: flex-start;
    gap: 20px; 
    min-height: 600px;
}
.teacher-sidebar { 
    width: 250px; 
    min-width: 250px;
    display: flex; 
    flex-direction: column; 
    background: var(--surface-soft); 
    border: 1px solid var(--border-color);
    border-radius: 12px; 
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 120px);
    overflow: hidden;
}
.teacher-sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-soft);
    border-radius: 12px 12px 0 0;
    flex-shrink: 0;
}
.teacher-sidebar-list { 
    flex: 1; 
    overflow-y: auto; 
    padding: 8px 12px;
}

/* 사이드바 테마 색상 */
.teacher-sidebar-item.active {
    background-color: var(--primary-color) !important;
    color: white !important;
    border-color: var(--primary-color) !important;
    font-weight: 600;
}
.teacher-sidebar-item.active .sidebar-fav-dot {
    background-color: white !important;
}

.teacher-main-content { 
    flex: 1; 
    min-width: 0; 
    display: flex; 
    flex-direction: column; 
}

/* 교사 시간표 전용 테이블 래퍼 */
.teacher-table-wrap {
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    background: var(--card-background);
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.teacher-table-wrap table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    table-layout: fixed;
    margin: 0;
}
.teacher-table-wrap th, .teacher-table-wrap td {
    text-align: center;
    vertical-align: middle;
    border-right: 1px solid var(--line-soft);
    border-bottom: 1px solid var(--line-soft);
    padding: 8px 6px;
    line-height: 1.45;
    color: var(--text-color);
}
.teacher-table-wrap thead th {
    background: var(--header-bg);
    color: var(--header-text);
    font-weight: 700;
    padding: 12px 8px;
    font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}
.teacher-table-wrap th:last-child,
.teacher-table-wrap td:last-child { border-right: 0; }
.teacher-table-wrap tbody tr:last-child td { border-bottom: 0; }
.teacher-table-wrap tbody tr {
    height: 110px;
}
.teacher-table-wrap tbody td {
    height: 110px;
    min-height: 110px;
    max-height: 110px;
    vertical-align: middle;
}

/* 교시 라벨 */
.period-label {
    height: 110px;
    min-height: 110px;
    max-height: 110px;
    font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: var(--text-color);
    background: var(--card-background) !important;
    width: 80px;
    min-width: 80px;
    vertical-align: middle;
    overflow: hidden;
}
.period-time {
    font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
    font-size: 11px;
    color: var(--subtle-text);
    font-weight: 500;
}

/* 수업 있는 셀 — 항상 흰색 배경 */
.teacher-subject-cell {
    height: 110px;
    min-height: 110px;
    max-height: 110px;
    background: var(--card-background) !important;
    cursor: pointer;
    transition: background-color 0.2s;
    padding: 0;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
}
.teacher-subject-cell > div {
    height: 110px;
    max-height: 110px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 4px;
}

/* 수업이 있는 행만 hover 하이라이트 (교시 라벨 + 수업 셀만, 빈 셀 제외) */
.teacher-table-wrap tbody tr:hover .period-label,
.teacher-table-wrap tbody tr:hover .teacher-subject-cell {
    background: var(--row-hover) !important;
}
/* 빈 셀은 hover 영향 받지 않음 — 별도 지정 불필요 (위 규칙에 포함 안 됨) */

/* 클릭 가능 셀 개별 hover (교체 찾기 툴팁) */
.teacher-subject-cell.clickable-cell:hover {
    background-color: var(--empty-bg) !important;
    box-shadow: inset 0 0 0 2px var(--primary-color);
    z-index: 10;
}

/* 공강/빈 셀 — 수업 셀보다 진한 색으로 시각 분리 */
.teacher-empty-period {
    height: 110px;
    min-height: 110px;
    max-height: 110px;
    background: var(--empty-bg) !important;
    vertical-align: middle;
    overflow: hidden;
}

/* 반응형 */
@media (max-width: 768px) {
    body { padding: 10px; }
    #app-container { border-radius: 16px; padding: 18px 14px; }
    h1 { font-size: 1.45rem; flex-direction: column; gap: 8px; }
    .tab-navigation { gap: 6px; }
    .tab-button { font-size: 13px; padding: 10px 12px; }
    .schedule-header { flex-direction: column; align-items: stretch; gap: 10px; }
    .action-btn { flex: 1; min-width: 100px; }
    table { font-size: 12px; min-width: 680px; }
    th:first-child, td:first-child { position: sticky; left: 0; z-index: 3; background: var(--card-background); }
    thead th:first-child { background: var(--header-bg); }
    .teacher-layout { flex-direction: column; }
    .teacher-sidebar { width: 100%; min-width: 0; max-height: none; position: static; border-radius: 12px; }
    .teacher-table-wrap { border-radius: 12px; }
    .teacher-sidebar-list { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px 12px; max-height: 160px; overflow-y: auto; }
    .teacher-sidebar-item { padding: 7px 12px; border-radius: 999px; font-size: 13px; border: 1px solid var(--border-color); background: var(--card-background); width: auto; }
    .cycle-flow { flex-direction: column; }
    .cycle-arrow { transform: rotate(90deg); }
    .result-list { grid-template-columns: 1fr; }
}

/* 인쇄 */
@media print {
    body { background: white !important; padding: 0 !important; margin: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    #app-container { border: 0 !important; border-radius: 0 !important; padding: 15px !important; max-width: 100% !important; background: #fff !important; }
    #search-section, .schedule-actions, .tab-navigation, .clock-container, .footer-credit, .teacher-sidebar, .swap-modal-overlay, .student-list-modal { display: none !important; }
    
    /* 교사별 레이아웃 인쇄 */
    .teacher-layout { display: block !important; }
    .teacher-main-content { width: 100% !important; }
    .teacher-table-wrap { 
        border: 1px solid #ccc !important; 
        border-radius: 14px !important; 
        box-shadow: none !important; 
        overflow: hidden !important;
        max-width: 100% !important;
    }
    .teacher-table-wrap table {
        width: 100% !important;
        min-width: 0 !important;
        table-layout: fixed !important;
        font-size: 11pt !important;
    }
    .teacher-table-wrap thead th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    .teacher-table-wrap tbody td,
    .teacher-subject-cell,
    .teacher-empty-period,
    .period-label {
        height: 80px !important;
        min-height: 80px !important;
        max-height: 80px !important;
    }
    .teacher-table-wrap tbody tr {
        height: 80px !important;
    }
    .teacher-subject-cell > div {
        height: 80px !important;
        max-height: 80px !important;
    }

    /* 교사 시간표 인쇄 시 학생목록 버튼만 숨김 (화면에서는 정상 표시) */
    .teacher-table-wrap .student-list-btn {
        display: none !important;
    }
    
    /* 공통 테이블 인쇄 */
    .table-container {
        border: 1px solid #ccc !important;
        border-radius: 14px !important;
        box-shadow: none !important;
        overflow: hidden !important;
    }
    
    h1 { font-size: 16pt !important; }
    table { min-width: 0 !important; }
    .today-cell { border: none !important; }
    .today-header { background-color: var(--card-background) !important; color: var(--text-color) !important; }
    .today-badge { display: none; }
    tbody td.clickable-cell::after { display: none; }
    .student-print-page { page-break-before: always !important; page-break-inside: avoid !important; }
    .student-print-page:first-child { page-break-before: auto !important; }
    
    /* 포켓사이즈 인쇄 */
    body.pocket-size .class-schedule-print-container {
        display: grid !important; grid-template-columns: repeat(2, 1fr) !important;
        grid-gap: 2mm !important; max-width: 200mm !important; margin: 0 auto !important;
        padding: 3mm !important; page-break-inside: avoid !important; page-break-after: always !important;
    }
    body.pocket-size .student-print-page {
        max-height: 100mm !important; margin: 0 !important; padding: 2mm !important;
        border: 0.5px solid #666 !important; page-break-inside: avoid !important;
        page-break-before: auto !important; overflow: hidden !important;
    }
    body.pocket-size .schedule-header { display: flex !important; margin-bottom: 2mm !important; padding: 0 !important; }
    body.pocket-size h1, body.pocket-size .schedule-actions { display: none !important; }
    body.pocket-size .schedule-info h2 { font-size: 8pt !important; margin: 0 !important; text-align: left !important; color: #000 !important; }
    body.pocket-size .bell-time { display: none !important; }
    body.pocket-size .student-print-page table { font-size: 5pt !important; table-layout: fixed !important; }
    body.pocket-size .student-print-page th, body.pocket-size .student-print-page td { padding: 0.5mm !important; height: 10mm !important; font-size: 6pt !important; border: 0.3px solid #999 !important; overflow: hidden !important; }
    body.pocket-size .subject-name { font-size: 5.5pt !important; font-weight: bold !important; }
    body.pocket-size .location-chip, body.pocket-size .teacher-name { font-size: 4.5pt !important; padding: 0 1px !important; display: inline !important; }
}
`;
}

// ================================================================
// Part 2: 메인 HTML 구조 생성 + 공통 JavaScript
// ================================================================

function generateOutputHtml(options) {
    const {
        pageTitle, logoBase64, selectedTheme, features,
        optColor1, optColor2, optLinebreak, optChip,
        teacherSchedules, extensions, bellSchedule,
        studentsData, weeklyData, weeklyFormat
    } = options;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} (KST)`;
    const logoHtml = logoBase64 ? `<img src="${logoBase64}" class="title-icon" alt="로고">` : '';

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"><\/script>
    <style>
        ${generateOutputCSS(selectedTheme)}
    </style>
</head>
<body>
    <div id="app-container">
        <h1>${logoHtml}<span>${pageTitle}</span></h1>
        <div class="clock-container" id="real-time-clock"></div>
        <div class="tab-navigation" id="tab-navigation"></div>
        <div id="search-section"></div>
        <div id="schedule-container"></div>
        <div class="footer-credit">
            <p>Last updated: ${timeStr}</p>
            <p>Made by IRONMIN (Jeonju high school)</p>
        </div>
    </div>

    <!-- 학생목록 모달 -->
    <div id="student-list-modal" class="student-list-modal" aria-hidden="true">
        <div class="student-list-modal-backdrop" onclick="closeStudentListModal()"></div>
        <div class="student-list-modal-dialog">
            <div class="student-list-modal-header">
                <div>
                    <h3 id="student-list-modal-title">학생 목록</h3>
                    <div id="student-list-modal-meta">총 0명</div>
                </div>
                <button class="modal-close-btn" onclick="closeStudentListModal()">&times;</button>
            </div>
            <div id="student-list-modal-body" class="student-list-modal-body"></div>
            <div class="student-list-modal-footer">
                <button class="modal-secondary-btn" onclick="closeStudentListModal()">닫기</button>
                <button class="modal-primary-btn" onclick="downloadStudentListExcel()">엑셀 다운로드</button>
            </div>
        </div>
    </div>

    <!-- 교체/보강 모달 (교사탭) -->
    <div id="swap-modal" class="swap-modal-overlay" onclick="if(event.target===this) closeSwapModal()">
        <div class="swap-modal-content">
            <div class="swap-modal-header">
                <h3 id="swap-modal-title">🔄 수업 교체 및 보강 찾기</h3>
                <button class="swap-close-btn" onclick="closeSwapModal()">&times;</button>
            </div>
            <div class="swap-modal-body" id="swap-modal-body"></div>
        </div>
    </div>

    <script>
    // ============================================================
    // 데이터 주입
    // ============================================================
    const allStudents = ${JSON.stringify(studentsData)};
    const allTeacherSchedules = ${JSON.stringify(teacherSchedules)};
    const extNumbers = ${JSON.stringify(extensions)};
    const bellSchedule = ${JSON.stringify(bellSchedule)};
    const weeklyScheduleData = ${weeklyData ? JSON.stringify(weeklyData) : 'null'};
    const weeklyFormat = '${weeklyFormat}';
    const enabledFeatures = ${JSON.stringify(features)};
    const isColoringEnabled = ${optColor1};
    const isFormatBColoringEnabled = ${optColor2};
    const isLineBreakEnabled = ${optLinebreak};
    const isLocationChipEnabled = ${optChip};

    ${generateCommonJS()}
    ${features.student ? generateStudentTabJS() : ''}
    ${features.class ? generateClassTabJS() : ''}
    ${features.classroom ? generateClassroomTabJS() : ''}
    ${features.teacher ? generateTeacherTabJS() : ''}
    ${generateInitJS(features)}
    <\/script>
</body>
</html>`;
}

// ================================================================
// Part 3: 공통 JavaScript + 학생별 탭
// ================================================================

function generateCommonJS() {
    return `
    // ---- 공통 유틸 ----
    const scheduleContainer = document.getElementById('schedule-container');
    let currentMode = '';
    let favorites = JSON.parse(localStorage.getItem('favStudents') || '[]');
    let teacherFavorites = JSON.parse(localStorage.getItem('favTeachers') || '[]');

    // 학생 uniqueId 부여
    allStudents.forEach(s => {
        if (!s.uniqueId) s.uniqueId = s.name + '||' + s.homeroom + '||' + s.number;
    });

    // 교사명 → 데이터 맵
    const teacherMap = {};
    allTeacherSchedules.forEach(t => { teacherMap[t.name] = t; });

    // 반별 데이터
    const classData = {};
    allStudents.forEach(s => {
        if (!classData[s.homeroom]) classData[s.homeroom] = [];
        classData[s.homeroom].push(s);
    });

    // 학생명 인덱스
    const studentIndexByName = {};
    allStudents.forEach(s => {
        const name = String(s.name || '').trim();
        if (!name) return;
        if (!studentIndexByName[name]) studentIndexByName[name] = [];
        const parts = (s.homeroom || '').split('-');
        let sid = '';
        if (parts.length === 2 && s.number) {
            sid = parts[0] + parts[1].padStart(2,'0') + String(s.number).padStart(2,'0');
        }
        studentIndexByName[name].push({ name, homeroom: s.homeroom||'', number: s.number||'', studentId: sid });
    });

    // 학생목록 저장소
    const studentListStore = {};
    let studentListCounter = 0;
    function registerStudentList(payload) {
        studentListCounter++;
        const id = 'sl-' + studentListCounter;
        studentListStore[id] = payload;
        return id;
    }
    function clearStudentListStore() {
        Object.keys(studentListStore).forEach(k => delete studentListStore[k]);
        studentListCounter = 0;
    }

    function resolveStudentRows(names, uniqueIds) {
        // uniqueIds가 있으면 정확한 매칭, 없으면 기존 방식 (하위 호환)
        if (uniqueIds && uniqueIds.length === (names||[]).length) {
            return uniqueIds.map(function(uid, idx) {
                const s = allStudents.find(function(x) { return x.uniqueId === uid; });
                if (s) {
                    const parts = (s.homeroom || '').split('-');
                    let sid = '';
                    if (parts.length === 2 && s.number) {
                        sid = parts[0] + parts[1].padStart(2,'0') + String(s.number).padStart(2,'0');
                    }
                    return { name: s.name, homeroom: s.homeroom, number: s.number, studentId: sid };
                }
                const safe = String(names[idx]||'').trim();
                return { name: safe, homeroom: '', number: '', studentId: '' };
            });
        }
        const usage = {};
        return (names||[]).map(name => {
            const safe = String(name||'').trim();
            if (!usage[safe]) usage[safe] = 0;
            const cands = studentIndexByName[safe] || [];
            const idx = usage[safe]; usage[safe]++;
            if (cands.length > 0) {
                const sel = cands[Math.min(idx, cands.length-1)];
                return { name: sel.name, homeroom: sel.homeroom, number: sel.number, studentId: sel.studentId };
            }
            return { name: safe, homeroom: '', number: '', studentId: '' };
        });
    }

    function escapeHtml(v) {
        if (v == null) return '';
        return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function sanitizeFileName(n) {
        return String(n||'목록').replace(/[\\\\\\/:\\*\\?"<>|]/g,'_').replace(/\\s+/g,'_').slice(0,80)||'목록';
    }

    // 시계
    function updateClock() {
        const now = new Date();
        const days = ['일','월','화','수','목','금','토'];
        const ds = now.getFullYear()+'.'+String(now.getMonth()+1).padStart(2,'0')+'.'+String(now.getDate()).padStart(2,'0')+' ('+days[now.getDay()]+')';
        const ts = now.toLocaleTimeString('ko-KR',{hour12:false});
        const el = document.getElementById('real-time-clock');
        if(el) el.innerHTML = '<span style="font-size:18px">🕒</span> '+ds+' &nbsp;<b>'+ts+'</b>';
    }
    setInterval(updateClock, 1000); updateClock();

    // 학생목록 모달
    function openStudentListModal(listId) {
        const payload = studentListStore[listId];
        const modal = document.getElementById('student-list-modal');
        if (!payload || !modal) return;
        document.getElementById('student-list-modal-title').textContent = payload.title || '학생 목록';
        const rows = resolveStudentRows(payload.students, payload.uniqueIds);
        document.getElementById('student-list-modal-meta').textContent = '총 ' + rows.length + '명';
        let html = '<table class="student-list-table"><thead><tr><th>학년</th><th>반</th><th>번호</th><th>학번</th><th>이름</th></tr></thead><tbody>';
        const sorted = rows.map(r => {
            const p = String(r.homeroom||'').split('-');
            return { grade: p[0]||'', cls: p[1]||'', number: r.number, studentId: r.studentId, name: r.name };
        }).sort((a,b) => parseInt(a.studentId,10) - parseInt(b.studentId,10));
        sorted.forEach(r => {
            html += '<tr><td>'+escapeHtml(r.grade)+'</td><td>'+escapeHtml(r.cls)+'</td><td>'+escapeHtml(r.number)+'</td><td>'+escapeHtml(r.studentId)+'</td><td>'+escapeHtml(r.name)+'</td></tr>';
        });
        html += '</tbody></table>';
        document.getElementById('student-list-modal-body').innerHTML = html;
        modal.dataset.currentListId = listId;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
    }
    function closeStudentListModal() {
        const modal = document.getElementById('student-list-modal');
        if (!modal) return;
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }
    function downloadStudentListExcel() {
        const modal = document.getElementById('student-list-modal');
        if (!modal) return;
        const payload = studentListStore[modal.dataset.currentListId];
        if (!payload) return;
        const rows = resolveStudentRows(payload.students, payload.uniqueIds);
        const exp = rows.map(r => {
            const p = String(r.homeroom||'').split('-');
            return { '학년': p[0]||'', '반': p[1]||'', '번호': r.number, '학번': r.studentId, '이름': r.name };
        }).sort((a,b) => parseInt(a['학번'],10) - parseInt(b['학번'],10));
        if (window.XLSX) {
            const ws = XLSX.utils.json_to_sheet(exp.length > 0 ? exp : [{'학년':'','반':'','번호':'','학번':'','이름':''}]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '학생목록');
            XLSX.writeFile(wb, sanitizeFileName(payload.fileName || payload.title) + '.xlsx');
        }
    }

    // 교실명 정규화
    function normalizeClassroomName(cr) {
        if (!cr) return '';
        const s = String(cr).trim();
        const m = s.match(/^(\\d+)-(\\d+)$/);
        if (m) return m[1] + m[2].padStart(2,'0');
        return s;
    }
    `;
}

function generateStudentTabJS() {
    return `
    // ============================================================
    // 학생별 탭
    // ============================================================
    function setupStudentSearch() {
        const section = document.getElementById('search-section');
        section.style.display = '';
        section.innerHTML =
            '<div class="search-container">' +
                '<span class="search-icon">🔍</span>' +
                '<input type="text" id="search-input" placeholder="학생 이름 또는 학번을 입력하세요...">' +
                '<div class="autocomplete-dropdown" id="autocomplete-dropdown"></div>' +
            '</div>' +
            '<div class="favorites-section">' +
                '<div class="favorites-title">자주 찾는 학생</div>' +
                '<div class="favorite-chips" id="favorite-chips"></div>' +
            '</div>';

        let filteredData = [];
        let selIdx = -1;
        const input = document.getElementById('search-input');
        const dropdown = document.getElementById('autocomplete-dropdown');

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (!q) { filteredData = []; dropdown.style.display = 'none'; return; }
            filteredData = allStudents.filter(s => {
                const n = (s.name||'').toLowerCase();
                const hr = s.homeroom||'';
                const num = s.number ? String(s.number) : '';
                return n.includes(q) || (hr+'-'+num).includes(q) || num.includes(q);
            });
            if (filteredData.length === 0) { dropdown.style.display = 'none'; return; }
            dropdown.innerHTML = filteredData.slice(0,20).map(s => {
                const parts = (s.homeroom||'').split('-');
                let sid = '';
                if (parts.length===2 && s.number) sid = parts[0]+parts[1].padStart(2,'0')+String(s.number).padStart(2,'0');
                const display = sid ? s.name+' ('+sid+')' : s.name;
                return '<div class="autocomplete-item" data-uid="'+s.uniqueId+'">'+display+'</div>';
            }).join('');
            dropdown.style.display = 'block'; selIdx = -1;
            dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
                el.addEventListener('click', () => {
                    input.value = '';
                    dropdown.style.display = 'none';
                    displayStudentSchedule(el.dataset.uid);
                });
            });
        });

        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (!items.length) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx+1, items.length-1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx-1, 0); }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (selIdx >= 0 && items[selIdx]) items[selIdx].click();
                else if (filteredData.length > 0) displayStudentSchedule(filteredData[0].uniqueId);
                return;
            }
            items.forEach((it, i) => it.classList.toggle('selected', i === selIdx));
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) dropdown.style.display = 'none';
        });

        updateStudentFavoriteChips();
    }

    function updateStudentFavoriteChips() {
        const container = document.getElementById('favorite-chips');
        if (!container) return;
        if (favorites.length === 0) {
            container.innerHTML = '<span style="color:var(--subtle-text);font-size:13px;">즐겨찾기한 학생이 없습니다</span>';
            return;
        }
        container.innerHTML = favorites.map(uid => {
            const s = allStudents.find(x => x.uniqueId === uid);
            if (!s) return '';
            const parts = (s.homeroom||'').split('-');
            let sid = '';
            if (parts.length===2 && s.number) sid = parts[0]+parts[1].padStart(2,'0')+String(s.number).padStart(2,'0');
            const display = sid ? s.name+' ('+sid+')' : s.name;
            return '<button class="favorite-chip" onclick="displayStudentSchedule(\\''+uid+'\\')">'+display+'</button>';
        }).join('');
    }

    function toggleStudentFavorite(uid) {
        const idx = favorites.indexOf(uid);
        if (idx > -1) favorites.splice(idx, 1); else favorites.push(uid);
        localStorage.setItem('favStudents', JSON.stringify(favorites));
        updateStudentFavoriteChips();
        displayStudentSchedule(uid);
    }

    function displayStudentSchedule(uid) {
        const student = allStudents.find(s => s.uniqueId === uid);
        if (!student) return;
        clearStudentListStore();
        const isFav = favorites.includes(uid);
        const days = ['월','화','수','목','금'];
        const parts = (student.homeroom||'').split('-');
        let sid = '';
        if (parts.length===2 && student.number) sid = parts[0]+parts[1].padStart(2,'0')+String(student.number).padStart(2,'0');
        const displayName = sid ? student.name+' ('+sid+')' : student.name;

        let html = '<div class="schedule-header">' +
            '<div class="schedule-info"><h2>'+displayName+'</h2></div>' +
            '<div class="schedule-actions">' +
                '<button class="action-btn '+(isFav?'favorited':'')+'" onclick="toggleStudentFavorite(\\''+uid+'\\')">'+
                    (isFav?'⭐ 즐겨찾기됨':'☆ 즐겨찾기')+'</button>' +
                '<button class="action-btn" onclick="window.print()">🖨️ 인쇄</button>' +
            '</div></div>' +
            '<div class="table-container"><table><thead><tr><th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr></thead><tbody>';

        for (let i = 0; i < student.maxPeriods; i++) {
            const timeStr = bellSchedule[i+1] ? '<br><span class="bell-time" style="font-size:11px;color:var(--subtle-text);font-weight:500;">('+bellSchedule[i+1]+')</span>' : '';
            html += '<tr><td>'+(i+1)+'교시'+timeStr+'</td>';
            days.forEach((day, di) => {
                if (i < (student.periodCounts[di]||0)) {
                    const content = student.schedule[day][i] || '';
                    html += '<td>'+(content||'<span class="empty-cell-label"></span>')+'</td>';
                } else {
                    html += '<td class="empty-cell"></td>';
                }
            });
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        scheduleContainer.innerHTML = html;
    }
    `;
}

// ================================================================
// Part 4: 반별 탭 + 교실별 탭
// ================================================================

function generateClassTabJS() {
    return `
    function setupClassView() {
        const section = document.getElementById('search-section');
        section.style.display = '';
        // 반 정렬 (2-1, 2-2, 2-10 순서대로 정렬)
        const classList = Object.keys(classData).sort((a, b) => {
            const [g1, c1] = a.split('-').map(Number);
            const [g2, c2] = b.split('-').map(Number);
            if (g1 !== g2) return (g1 || 0) - (g2 || 0);
            return (c1 || 0) - (c2 || 0);
        });
        section.innerHTML =
            '<div class="favorites-section">' +
                '<div class="favorites-title">반 선택</div>' +
                '<div class="favorite-chips">' +
                    classList.map(c => '<button class="favorite-chip" onclick="displayClassSchedule(\\''+c+'\\')">'+c+'반</button>').join('') +
                '</div>' +
            '</div>';
    }

    function displayClassSchedule(classId) {
        const students = classData[classId] || [];
        if (students.length === 0) { showEmptyState(); return; }
        clearStudentListStore();
        const days = ['월','화','수','목','금'];
        const maxP = Math.max(...students.map(s => s.maxPeriods));

        let html = '<div class="schedule-header">' +
            '<div class="schedule-info"><h2>'+classId+'반 시간표 <small>(총 '+students.length+'명)</small></h2></div>' +
            '<div class="schedule-actions">' +
                '<button class="action-btn" id="pocket-toggle" onclick="togglePocketSize()">📐 포켓사이즈</button>' +
                '<button class="action-btn" onclick="window.print()">🖨️ 인쇄</button>' +
            '</div></div>' +
            '<div class="class-schedule-print-container" id="class-container">';

        students.forEach((student, index) => {
            if (index > 0 && index % 4 === 0) {
                html += '</div><div class="class-schedule-print-container pocket-page-break">';
            }
            const parts = (student.homeroom||'').split('-');
            let sid = '';
            if (parts.length===2 && student.number) sid = parts[0]+parts[1].padStart(2,'0')+String(student.number).padStart(2,'0');
            const displayName = sid ? student.name+' ('+sid+')' : student.name;

            html += '<div class="student-print-page" style="margin-bottom: 50px;">' +
                    '<div class="schedule-header" style="justify-content: flex-start; margin-bottom: 12px; padding: 0 4px;">' +
                    '<div class="schedule-info"><h2 style="font-size: 1.3rem;">'+displayName+'</h2></div>' +
                '</div>' +
                '<div class="table-container"><table><thead><tr><th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr></thead><tbody>';
            for (let i = 0; i < maxP; i++) {
                const timeStr = bellSchedule[i+1] ? '<br><span class="bell-time" style="font-size:11px;color:var(--subtle-text);font-weight:500;">('+bellSchedule[i+1]+')</span>' : '';
                html += '<tr><td>'+(i+1)+'교시'+timeStr+'</td>';
                days.forEach((day, di) => {
                    if (i < (student.periodCounts[di]||0)) {
                        html += '<td>'+(student.schedule[day][i]||'')+'</td>';
                    } else {
                        html += '<td class="empty-cell"></td>';
                    }
                });
                html += '</tr>';
            }
            html += '</tbody></table></div></div>';
        });
        html += '</div>';
        scheduleContainer.innerHTML = html;
    }

    function togglePocketSize() {
        const body = document.body;
        const btn = document.getElementById('pocket-toggle');
        if (body.classList.contains('pocket-size')) {
            body.classList.remove('pocket-size');
            btn.innerHTML = '📐 포켓사이즈';
            btn.style.background = '';
            btn.style.color = '';
        } else {
            body.classList.add('pocket-size');
            btn.innerHTML = '📐 포켓사이즈 ON';
            btn.style.background = 'var(--primary-color)';
            btn.style.color = 'white';
        }
    }
    `;
}

function generateClassroomTabJS() {
    return `
    let classroomData = {};

    function buildClassroomData() {
        classroomData = {};
        const days = ['월','화','수','목','금'];
        
        // 1. 학생 선택과목 데이터에서 교실 추출
        allStudents.forEach(student => {
            days.forEach(day => {
                for (let i = 0; i < student.maxPeriods; i++) {
                    const content = student.schedule[day][i];
                    if (!content) continue;
                    let classroom = '', subject = '', teacher = '', electiveClassName = '';

                    if (content.includes('<span class="elective-class-name"')) {
                        let m = content.match(/<span class="location-chip">([^<]+)<\\/span>/);
                        if (m) classroom = normalizeClassroomName(m[1]);
                        m = content.match(/<div class="subject-name">([^<]+)<\\/div>/);
                        if (m) subject = m[1];
                        m = content.match(/<span class="teacher-name">([^<]+)<\\/span>/);
                        if (m) teacher = m[1];
                        const ecStart = content.indexOf('<span class="elective-class-name"');
                        if (ecStart !== -1) {
                            const ecContentStart = content.indexOf('>', ecStart) + 1;
                            const ecEnd = content.indexOf('</span>', ecContentStart);
                            if (ecContentStart > 0 && ecEnd !== -1) electiveClassName = content.substring(ecContentStart, ecEnd);
                        }
                    } else {
                        let m = content.match(/<div class="subject-name">([^<]+)<\\/div>/);
                        if (m) subject = m[1]; else subject = content.replace(/<[^>]+>/g,'').trim();
                        if (!subject || subject === '자습' || subject === '공강') continue;
                        classroom = normalizeClassroomName(student.homeroom);
                        m = content.match(/<span class="teacher-name">([^<]+)<\\/span>/);
                        if (m) teacher = m[1];
                    }

                    if (!classroom || !subject) continue;
                    addToClassroomData(day, i+1, classroom, subject, teacher, electiveClassName, student.uniqueId, student.homeroom);
                }
            });
        });

        // 2. 전체 교사 시간표에서 추가 교실(1, 3학년 및 일반 교과) 추출
        allTeacherSchedules.forEach(teacher => {
            days.forEach(day => {
                for (let i = 0; i < 7; i++) {
                    let cell = teacher.schedule[day][i];
                    if (cell == null) continue;
                    cell = String(cell).trim();
                    if (cell === '공강' || cell === '') continue;

                    let loc = '', subj = cell;
                    const m = cell.match(/^(\\S+)\\s+([\\s\\S]+)$/);
                    if (m && !/^[A-Z]$/.test(m[1]) && !/^[A-Z]_/.test(m[1]) && !/^[A-Z][0-9]/.test(m[1])) {
                        loc = m[1].trim(); subj = m[2].trim();
                    }

                    // 1-1, 2-3 형식 또는 101, 203 형식 모두 인식
                    if (loc && (loc.match(/^\\d+-\\d+$/) || loc.match(/^\\d{3}$/))) {
                        let normalizedLoc = normalizeClassroomName(loc);
                        const pk = day + (i+1);
                        let exists = false;
                        if (classroomData[normalizedLoc] && classroomData[normalizedLoc][pk]) {
                            exists = classroomData[normalizedLoc][pk].some(x => x.subject === subj && x.teacher === teacher.name);
                        }
                        if (!exists) addToClassroomData(day, i+1, normalizedLoc, subj, teacher.name, '', '', loc);
                    }
                }
            });
        });
    }

    function addToClassroomData(day, period, classroom, subject, teacher, electiveClassName, studentId, homeroom) {
        const pk = day + period;
        if (!classroomData[classroom]) classroomData[classroom] = {};
        if (!classroomData[classroom][pk]) classroomData[classroom][pk] = [];

        let existing;
        if (electiveClassName) {
            existing = classroomData[classroom][pk].find(x => x.subject===subject && x.teacher===teacher && x.electiveClassName===electiveClassName);
        } else {
            existing = classroomData[classroom][pk].find(x => x.subject===subject && x.teacher===teacher && !x.electiveClassName);
        }

        if (existing) {
            if (studentId && !existing.students.includes(studentId)) existing.students.push(studentId);
        } else {
            const entry = { subject, teacher, students: studentId ? [studentId] : [] };
            if (electiveClassName) entry.electiveClassName = electiveClassName;
            else entry.homeroom = homeroom;
            classroomData[classroom][pk].push(entry);
        }
    }

    function setupClassroomView() {
        if (Object.keys(classroomData).length === 0) buildClassroomData();
        const section = document.getElementById('search-section');
        section.style.display = '';
        
        // 정렬: 1~3학년 교실이 먼저, 그 다음 특별실(가나다순)
        const rooms = Object.keys(classroomData).sort((a,b) => {
            const matchA = a.match(/^(\\d)(\\d{2})$/);
            const matchB = b.match(/^(\\d)(\\d{2})$/);
            const ga = matchA ? parseInt(matchA[1]) : 99; // 특별실은 99로 후순위 배치
            const ca = matchA ? parseInt(matchA[2]) : 0;
            const gb = matchB ? parseInt(matchB[1]) : 99;
            const cb = matchB ? parseInt(matchB[2]) : 0;
            
            if (ga !== gb) return ga - gb;
            if (ca !== cb) return ca - cb;
            return a.localeCompare(b);
        });

        section.innerHTML =
            '<div class="favorites-section">' +
                '<div class="favorites-title">교실 선택</div>' +
                '<div class="favorite-chips">' +
                    rooms.map(r => '<button class="favorite-chip" onclick="displayClassroomSchedule(\\''+r+'\\')">'+r+'</button>').join('') +
                '</div>' +
            '</div>';
    }

    function displayClassroomSchedule(roomId) {
        const data = classroomData[roomId] || {};
        const days = ['월','화','수','목','금'];
        closeStudentListModal();
        clearStudentListStore();

        let html = '<div class="schedule-header">' +
            '<div class="schedule-info"><h2>'+roomId+' 교실 사용 현황</h2></div>' +
            '<div class="schedule-actions">' +
                '<button class="action-btn" onclick="window.print()">🖨️ 인쇄</button>' +
            '</div></div>' +
            '<div class="table-container"><table><thead><tr><th>교시</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr></thead><tbody>';

        for (let i = 0; i < 7; i++) {
            const timeStr = bellSchedule[i+1] ? '<br><span class="bell-time" style="font-size:11px;color:var(--subtle-text);font-weight:500;">('+bellSchedule[i+1]+')</span>' : '';
            html += '<tr><td>'+(i+1)+'교시'+timeStr+'</td>';
            days.forEach(day => {
                const pk = day+(i+1);
                const info = data[pk] || [];
                if (info.length > 0) {
                    let filtered = info;
                    const hasElective = info.some(x => x.electiveClassName);
                    const hasFixed = info.some(x => x.homeroom && !x.electiveClassName);
                    if (hasElective && hasFixed) filtered = info.filter(x => x.electiveClassName);

                    const cellContent = filtered.map(item => {
                        const hasStudents = item.students && item.students.length > 0;
                        let detailsHtml = '<div class="details details-with-list-slot">' +
                            '<span class="teacher-name">'+(item.teacher||'')+'</span>' +
                            '<div class="student-list-slot">';
                        if (hasStudents) {
                            const studentNames = item.students.map(function(sid) {
                                var found = allStudents.find(function(s) { return s.uniqueId === sid; });
                                return found ? found.name : sid;
                            });
                            const lid = registerStudentList({
                                title: roomId+' · '+pk+' · '+item.subject,
                                fileName: roomId+'_'+pk+'_'+item.subject+'_학생목록',
                                students: studentNames,
                                uniqueIds: item.students
                            });
                            detailsHtml += '<button class="student-list-btn" onclick="openStudentListModal(\\''+lid+'\\')">학생목록</button>';
                        } else {
                            detailsHtml += '<span class="student-list-placeholder"></span>';
                        }
                        detailsHtml += '</div></div>';

                        let subjHtml = '';
                        if (item.electiveClassName && hasStudents) {
                            subjHtml = '<div class="elective-subject-line"><span class="elective-class-badge">'+item.electiveClassName+'</span><div class="subject-name">'+item.subject+'</div></div>';
                        } else {
                            subjHtml = '<div class="subject-name">'+item.subject+'</div>';
                        }
                        return subjHtml + detailsHtml;
                    }).join('<hr class="entry-divider">');
                    html += '<td>'+cellContent+'</td>';
                } else {
                    html += '<td class="empty-cell"></td>';
                }
            });
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        scheduleContainer.innerHTML = html;
    }
    `;
}

// ================================================================
// Part 5: 교사별 탭 (IRONMIN 전기능 + 사이드바)
// ================================================================

function generateTeacherTabJS() {
    // NOTE: This function returns a JS template literal string.
    // ESCAPING RULES inside the returned template literal:
    //   \\\\  → \\  in output  (one literal backslash)
    //   \\'   → \'  in output  (escaped single quote, safe inside single-quoted strings)
    //   All HTML-building strings use double-quotes " for outer delimiter
    //   to avoid single-quote conflicts entirely.
    return `
    let activeTeacherId = "";

    // ─── Cell Cache: built once on tab load ───────────────────────
    const _cellCache = {};

    function buildCellCache() {
        allTeacherSchedules.forEach(function(t) {
            ["월","화","수","목","금"].forEach(function(day) {
                for (let pi = 0; pi < 7; pi++) {
                    const key = t.name + "|" + day + "|" + pi;
                    const raw = (t.schedule[day] && t.schedule[day][pi]) ? t.schedule[day][pi] : "";
                    _cellCache[key] = _resolveCell(t.name, day, pi, raw);
                }
            });
        });
    }

    function getCachedCell(teacherName, day, pi) {
        const key = teacherName + "|" + day + "|" + pi;
        if (_cellCache.hasOwnProperty(key)) return _cellCache[key];
        const t = teacherMap[teacherName];
        if (!t) return "";
        return (t.schedule[day] && t.schedule[day][pi]) ? t.schedule[day][pi] : "";
    }

    function _resolveCell(teacherName, day, pi, rawCell) {
        var clean = String(rawCell || "").replace(/_x000D_/g, "").replace(/[\\r\\n]/g, " ").trim();

        // rawCell에서 교실번호 추출
        var rawLocation = "";
        var rawFirstWord = "";
        var rawMatchResult = clean.match(/^(\\S+)\\s/);
        if (rawMatchResult) {
            var fw = rawMatchResult[1];
            rawFirstWord = fw;
            var isRoom = /^\\d{3,4}/.test(fw) || /^\\d+-\\d+$/.test(fw) || /[실관동]$/.test(fw);
            var isNotRoom = /^[A-Z]$/.test(fw) || /^[A-Z]_/.test(fw) || /^[A-Z][0-9]/.test(fw) || /^[A-Z][가-힣]/.test(fw);
            if (isRoom && !isNotRoom) {
                rawLocation = normalizeClassroomName(fw);
            }
        }

        for (var i = 0; i < allStudents.length; i++) {
            var s = allStudents[i];
            var sCell = (s.schedule[day] && s.schedule[day][pi]) ? s.schedule[day][pi] : "";
            if (!sCell) continue;

            // 교사명 매칭
            if (sCell.indexOf(">" + teacherName + "<") === -1 && 
                sCell.indexOf('teacher-name">' + teacherName + "<") === -1) continue;

            // 교실 매칭: 학생 셀의 location-chip 또는 홈룸과 비교
            if (rawLocation) {
                var studentLocMatch = sCell.match(/<span class="location-chip">([^<]+)<\\/span>/);
                if (studentLocMatch) {
                    var studentLoc = normalizeClassroomName(studentLocMatch[1]);
                    if (studentLoc !== rawLocation) continue;
                } else {
                    var studentHomeroom = normalizeClassroomName(s.homeroom);
                    if (studentHomeroom !== rawLocation) continue;
                }
            }

            var mSubj = sCell.match(/<div class="subject-name">([^<]+)<\\/div>/);
            var mLoc  = sCell.match(/<span class="location-chip">([^<]+)<\\/span>/);
            var mElec = sCell.match(/<span class="elective-class-name"[^>]*>([^<]+)<\\/span>/);
            if (mSubj) {
                var rec = mSubj[1];
                if (mElec) rec = mElec[1] + "_" + rec;
                if (mLoc) {
                    rec = mLoc[1] + " " + rec;
                } else if (rawLocation && rawFirstWord) {
                    rec = rawFirstWord + " " + rec;
                }
                return rec;
            }
        }

        if (!/[가-힣a-zA-Z]/.test(clean) && !/^\\d+-\\d+$/.test(clean) && !/^\\d{3}$/.test(clean)) return "";
        return clean || "";
    }

    function parseCellData(raw) {
        if (!raw) return { location: "", subjectName: "", hasAlphabet: false, isKong: false };
        var str = String(raw).replace(/_x000D_/g, "").replace(/[\\r\\n]/g, " ").trim();
        var loc = "";
        var subj = str;
        var isLoc = false;
        var isKong = false;

        var m = str.match(/^(\\S+)\\s+([\\s\\S]+)$/);
        if (m) {
            var fw = m[1];
            var rw = m[2].trim();
            isLoc = true;

            if (/^[A-Z]$/.test(fw)) isLoc = false;
            if (/^[A-Z]_/.test(fw)) isLoc = false;
            if (/^[A-Z][0-9]/.test(fw)) isLoc = false;
            if (/^[A-Z][가-힣a-zA-Z]+/.test(fw)) isLoc = false;

            if (fw === "공강" || fw === "자습") {
                isLoc = false;
                isKong = fw === "공강";
                var rwIsRoom = /^\\d{3,4}$/.test(rw) || /^\\d+-\\d+$/.test(rw) || /[실관동]$/.test(rw);
                if (rwIsRoom) {
                    loc = rw;
                    subj = fw;
                } else {
                    loc = "";
                    subj = str;
                }
            } else if (isLoc) {
                loc = fw;
                subj = rw;
                if (rw.indexOf("공강") !== -1) isKong = true;
            }
        } else {
            if (str.indexOf("공강") !== -1) isKong = true;
        }

        if (!isKong && subj.indexOf("공강") !== -1) isKong = true;

        return {
            location: loc,
            subjectName: subj,
            hasAlphabet: /[a-zA-Z]/.test(subj),
            isKong: isKong
        };
    }

    // 공강은 실제 근무시간(임장지도)이므로 isFree = false
    function isFree(tData, day, pi) {
        const cell = getCachedCell(tData.name, day, pi);
        return !cell || String(cell).trim() === "";
    }

    function getStudentsForTeacher(teacherName, day, pi, subjectName, locationStr) {
        var names = [];
        var uniqueIds = [];

        allStudents.forEach(function(s) {
            var c = String((s.schedule[day] && s.schedule[day][pi]) ? s.schedule[day][pi] : "");
            if (!c) return;

            var teacherPattern1 = ">" + teacherName + "<";
            var teacherPattern2 = 'teacher-name">' + teacherName + "<";
            var hasTeacher = c.indexOf(teacherPattern1) !== -1 || c.indexOf(teacherPattern2) !== -1;
            if (!hasTeacher) return;

            if (subjectName) {
                var cleanSubj = subjectName.replace(/[\\r\\n]/g, "").trim();
                var hasSubject = c.indexOf(">" + cleanSubj + "<") !== -1;
                if (!hasSubject) return;
            }

            if (locationStr) {
                var normalizedLoc = normalizeClassroomName(locationStr);
                var studentLocMatch = c.match(/<span class="location-chip">([^<]+)<\\/span>/);
                if (studentLocMatch) {
                    var studentLoc = normalizeClassroomName(studentLocMatch[1]);
                    if (studentLoc !== normalizedLoc) return;
                } else {
                    var studentHomeroom = normalizeClassroomName(s.homeroom);
                    if (studentHomeroom !== normalizedLoc) return;
                }
            }

            names.push(s.name);
            uniqueIds.push(s.uniqueId);
        });
        return { names: names, uniqueIds: uniqueIds };
    }

    function renderTeacherCell(teacherName, day, pi, cellData) {
        var str = String(cellData || "").trim();
        if (!str) return { html: "", style: "", isEmpty: true };

        var parsed = parseCellData(cellData);
        var loc = parsed.location;
        var subj = parsed.subjectName;
        var isKong = parsed.isKong;
        var badgeHtml = "";
        var isElective = false;

        if (!isKong) {
            var em = subj.match(/^([A-Z][0-9]*)\\s*[_]?\\s*([\\s\\S]+)$/);
            if (!em) em = subj.match(/^([A-Z][0-9]*)\\s+([\\s\\S]+)$/);
            if (em) {
                badgeHtml = "<span class=\\"elective-class-badge\\" style=\\"margin-right:6px;\\">" + em[1] + "</span>";
                subj = em[2];
                isElective = true;
            }
        }

        var subjHtml = "<div class=\\"subject-name\\" style=\\"display:flex;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:6px;\\">" + badgeHtml + subj.replace(/[\\r\\n]/g, " ") + "</div>";
        var locHtml = loc ? "<div><span class=\\"location-chip\\">" + loc + "</span></div>" : "";

        var studentHtml = "";
        if (!isKong && (isElective || (loc && !loc.match(/^\\d+-\\d+$/) && !loc.match(/^\\d{1}\\d{2}$/)))) {
            var result = getStudentsForTeacher(teacherName, day, pi, subj, loc);
            if (result.names.length > 0) {
                var lid = registerStudentList({
                    title: teacherName + " · " + day + (pi + 1) + "교시 · " + subj,
                    fileName: teacherName + "_" + day + (pi + 1) + "_" + subj + "_학생목록",
                    students: result.names,
                    uniqueIds: result.uniqueIds
                });
                studentHtml = "<div style=\\"margin-top:8px;\\"><button class=\\"student-list-btn\\" data-lid=\\"" + lid + "\\" onclick=\\"event.stopPropagation();openStudentListModal(this.getAttribute('data-lid'))\\">학생목록</button></div>";
            }
        }

        var cellStyle = "";

        var html = "<div style=\\"display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:8px 4px;\\">" + subjHtml + locHtml + studentHtml + "</div>";
        return { html: html, style: cellStyle, isEmpty: false };
    }

    // ─── Multi-swap cycle finder (3인 + 4인, cache-based) ──────────
    function findMultiSwapCycles(targetName, targetDay, targetPi, maxDepth) {
        const target = teacherMap[targetName];
        if (!target) return [];
        const targetCell = getCachedCell(targetName, targetDay, targetPi);
        if (!targetCell) return [];
        const tp     = parseCellData(targetCell);
        const tClass = tp.location;
        if (tp.hasAlphabet || !tClass) return [];

        const days = ["월","화","수","목","금"];
        const results = [], seen = new Set();
        const firstHop = allTeacherSchedules.filter(function(t) { return t.name !== targetName && isFree(t, targetDay, targetPi); });

        function findClassSlots(teacher, classLoc, excludes) {
            const slots = [];
            days.forEach(function(d) {
                for (let p = 0; p < 7; p++) {
                    if (excludes.some(function(e) { return e.day === d && e.period === p; })) continue;
                    const cell = getCachedCell(teacher.name, d, p);
                    if (!cell || isFree(teacher, d, p)) continue;
                    const pp = parseCellData(cell);
                    if (pp.location === classLoc && !pp.hasAlphabet) slots.push({ day: d, period: p, cell: cell });
                }
            });
            return slots;
        }

        for (let bi = 0; bi < firstHop.length; bi++) {
            const B      = firstHop[bi];
            const bSlots = findClassSlots(B, tClass, [{ day: targetDay, period: targetPi }]);
            for (let bsi = 0; bsi < bSlots.length; bsi++) {
                const slotB = bSlots[bsi];
                for (let ci = 0; ci < allTeacherSchedules.length; ci++) {
                    const C = allTeacherSchedules[ci];
                    if (C.name === targetName || C.name === B.name) continue;
                    if (!isFree(C, slotB.day, slotB.period)) continue;
                    if (maxDepth >= 3) {
                        const cSlots = findClassSlots(C, tClass, [{ day: targetDay, period: targetPi }, { day: slotB.day, period: slotB.period }]);
                        for (let csi = 0; csi < cSlots.length; csi++) {
                            const slotC = cSlots[csi];
                            if (isFree(target, slotC.day, slotC.period)) {
                                const key = [targetName, B.name, C.name].sort().join("|") + "|" + [targetDay + targetPi, slotB.day + slotB.period, slotC.day + slotC.period].sort().join("|");
                                if (!seen.has(key)) {
                                    seen.add(key);
                                    results.push({ type: 3, chain: [
                                        { teacher: targetName, gives: { day: targetDay, period: targetPi, cell: targetCell },      receives: { day: slotC.day, period: slotC.period, cell: slotC.cell, from: C.name } },
                                        { teacher: B.name,     gives: { day: slotB.day, period: slotB.period, cell: slotB.cell }, receives: { day: targetDay, period: targetPi,    cell: targetCell,  from: targetName } },
                                        { teacher: C.name,     gives: { day: slotC.day, period: slotC.period, cell: slotC.cell }, receives: { day: slotB.day, period: slotB.period, cell: slotB.cell,  from: B.name } }
                                    ]});
                                }
                            }
                            if (maxDepth >= 4) {
                                for (let di = 0; di < allTeacherSchedules.length; di++) {
                                    const D = allTeacherSchedules[di];
                                    if (D.name === targetName || D.name === B.name || D.name === C.name) continue;
                                    if (!isFree(D, slotC.day, slotC.period)) continue;
                                    const dSlots = findClassSlots(D, tClass, [{ day: targetDay, period: targetPi }, { day: slotB.day, period: slotB.period }, { day: slotC.day, period: slotC.period }]);
                                    for (let dsi = 0; dsi < dSlots.length; dsi++) {
                                        const slotD = dSlots[dsi];
                                        if (isFree(target, slotD.day, slotD.period)) {
                                            const key4 = [targetName, B.name, C.name, D.name].sort().join("|") + "|" + [targetDay + targetPi, slotB.day + slotB.period, slotC.day + slotC.period, slotD.day + slotD.period].sort().join("|");
                                            if (!seen.has(key4)) {
                                                seen.add(key4);
                                                results.push({ type: 4, chain: [
                                                    { teacher: targetName, gives: { day: targetDay, period: targetPi,    cell: targetCell },      receives: { day: slotD.day, period: slotD.period, cell: slotD.cell, from: D.name } },
                                                    { teacher: B.name,     gives: { day: slotB.day, period: slotB.period, cell: slotB.cell }, receives: { day: targetDay, period: targetPi,    cell: targetCell,  from: targetName } },
                                                    { teacher: C.name,     gives: { day: slotC.day, period: slotC.period, cell: slotC.cell }, receives: { day: slotB.day, period: slotB.period, cell: slotB.cell,  from: B.name } },
                                                    { teacher: D.name,     gives: { day: slotD.day, period: slotD.period, cell: slotD.cell }, receives: { day: slotC.day, period: slotC.period, cell: slotC.cell,  from: C.name } }
                                                ]});
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return results;
    }

    let _multiSwapAll = [], _multiSwapClass = "";

    // ─── Swap modal ────────────────────────────────────────────────
    function openSwapModal(tName, tDay, tPi) {
        const tData = teacherMap[tName];
        if (!tData) return;
        const raw  = getCachedCell(tName, tDay, tPi);
        const pNum = tPi + 1;
        document.getElementById("swap-modal-title").innerHTML = "🔄 <b>" + tDay + "요일 " + pNum + "교시</b> (" + String(raw).replace(/[\\r\\n]/g, " ") + ") 교체/보강 탐색";
        const tp       = parseCellData(raw);
        const tClass   = tp.location;
        const hasAlpha = tp.hasAlphabet;
        const days     = ["월","화","수","목","금"];
        let swapResults = [], subResults = [];

        allTeacherSchedules.forEach(function(other) {
            if (other.name === tName) return;
            if (isFree(other, tDay, tPi)) subResults.push(other.name);
            if (!hasAlpha && tClass) {
                days.forEach(function(od) {
                    for (let p = 0; p < 7; p++) {
                        if (od === tDay && p === tPi) continue;
                        const oc = getCachedCell(other.name, od, p);
                        if (!oc || isFree(other, od, p)) continue;
                        const op = parseCellData(oc);
                        if (op.location === tClass && !op.hasAlphabet && isFree(other, tDay, tPi) && isFree(tData, od, p)) {
                            swapResults.push({ name: other.name, day: od, period: p + 1, subject: String(oc).replace(/[\\r\\n]/g, " ") });
                        }
                    }
                });
            }
        });

        let html = "<div class=\\"swap-modal-tabs\\">" +
            "<button class=\\"swap-modal-tab active\\" data-tab=\\"swap-tab-basic\\" onclick=\\"switchSwapTab(event,this.getAttribute('data-tab'))\\">📋 기본 (2인)</button>" +
            "<button class=\\"swap-modal-tab\\" data-tab=\\"swap-tab-multi\\" onclick=\\"switchSwapTab(event,this.getAttribute('data-tab'))\\">🔄 다자간 (3~4인)</button></div>";

        html += "<div id=\\"swap-tab-basic\\" class=\\"swap-tab-content active\\">";
        if (hasAlpha) {
            html += "<div class=\\"error-notice\\"><b>⚠️ 교체 불가</b><br>선택과목/분반 수업은 1:1 교체가 불가능합니다. 아래 대체/보강 교사에게 연락해주세요.</div>";
        } else {
            html += "<div class=\\"result-section\\"><h4>🔄 1:1 맞교환 가능 선생님</h4>" +
                "<p style=\\"font-size:13px;color:var(--subtle-text);margin-top:-10px;margin-bottom:15px;\\">나의 빈 시간에 동일 학반(" + tClass + "반) 수업이 있고, 해당 선생님도 나의 수업 시간에 비어있는 경우입니다.</p>";
            if (swapResults.length > 0) {
                html += "<ul class=\\"result-list\\">";
                swapResults.forEach(function(r) {
                    const ext = extNumbers[r.name] ? " 📞" + extNumbers[r.name] : "";
                    html += "<li class=\\"result-item\\"><strong>" + r.name + "</strong>" + ext + "<span>" + r.day + "요일 " + r.period + "교시 (" + r.subject + ")</span></li>";
                });
                html += "</ul></div>";
            } else {
                html += "<div class=\\"no-result\\">1:1 교체 가능 교사가 없습니다. <b>다자간 순환 교체</b> 탭을 확인해보세요!</div></div>";
            }
        }
        html += "<div class=\\"result-section\\"><h4>✅ 대체/보강 가능 교사</h4>" +
            "<p style=\\"font-size:13px;color:var(--subtle-text);margin-top:-10px;margin-bottom:15px;\\">" + tDay + "요일 " + pNum + "교시에 수업이 없는 선생님 목록입니다.</p>";
        if (subResults.length > 0) {
            html += "<ul class=\\"result-list\\">";
            subResults.forEach(function(name) {
                const ext = extNumbers[name] ? " 📞" + extNumbers[name] : "";
                html += "<li class=\\"result-item\\" style=\\"padding:8px 12px;\\"><strong>" + name + "</strong>" + ext + "</li>";
            });
            html += "</ul></div>";
        } else {
            html += "<div class=\\"no-result\\">해당 시간에 공강인 교사가 없습니다.</div></div>";
        }
        html += "</div>";

        html += "<div id=\\"swap-tab-multi\\" class=\\"swap-tab-content\\">";
        if (hasAlpha || !tClass) {
            html += "<div class=\\"error-notice\\"><b>⚠️ 다자간 교체 불가</b><br>선택과목이거나 수업장소 정보가 없습니다.</div>";
        } else {
            html += "<div class=\\"info-notice\\"><b>💡 다자간 순환 교체란?</b><br>3~4명의 교사가 동일 학반(" + tClass + "반) 수업을 순환 교체합니다. 각 교사는 다른 교사의 수업 시간에 비어있어야 합니다.</div>";
            html += "<div id=\\"multi-swap-results\\"><div class=\\"loading-spinner\\"><div class=\\"spinner-anim\\"></div>순환 교체 경로 탐색 중...</div></div>";
        }
        html += "</div>";

        document.getElementById("swap-modal-body").innerHTML = html;
        document.getElementById("swap-modal").style.display = "flex";

        if (!hasAlpha && tClass) {
            setTimeout(function() {
                const multiResults = findMultiSwapCycles(tName, tDay, tPi, 4);
                renderMultiSwapResults(multiResults, tClass);
            }, 30);
        }
    }

    function renderMultiSwapResults(results, tClass) {
        const container = document.getElementById("multi-swap-results");
        if (!container) return;
        _multiSwapAll = results; _multiSwapClass = tClass;
        if (results.length === 0) {
            container.innerHTML = "<div class=\\"no-result\\">동일 학반(" + tClass + "반) 조건의 순환 교체 경로가 없습니다.</div>";
            return;
        }
        const dayOrder = ["월","화","수","목","금"];
        const recSlotMap = new Map();
        results.forEach(function(cy) {
            const rec = cy.chain[0].receives;
            const key = rec.day + "|" + rec.period;
            if (!recSlotMap.has(key)) recSlotMap.set(key, { day: rec.day, period: rec.period });
        });
        const sortedSlots = Array.from(recSlotMap.values()).sort(function(a, b) {
            const di = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
            return di !== 0 ? di : a.period - b.period;
        });

        let filterHtml = "<div class=\\"multi-filter-box\\"><div class=\\"multi-filter-label\\">📌 교체 후 내가 들어갈 요일·교시 선택 <span style=\\"font-size:12px;color:var(--subtle-text);font-weight:400;\\">— 선택하면 해당 시간 기준 결과만 표시</span></div><div class=\\"multi-filter-slots\\">";
        sortedSlots.forEach(function(slot) {
            filterHtml += "<button class=\\"multi-filter-btn\\" data-slot=\\"" + slot.day + "|" + slot.period + "\\" onclick=\\"applyMultiFilter(this)\\">" + slot.day + " " + (slot.period + 1) + "교시</button>";
        });
        filterHtml += "</div><button class=\\"multi-filter-clear\\" onclick=\\"clearMultiFilter()\\" style=\\"display:none;\\" id=\\"multi-filter-clear\\">✕ 선택 해제 (전체 보기)</button></div>";
        container.innerHTML = filterHtml + "<div id=\\"multi-filtered-results\\"></div>";
        renderFilteredResults(null);
    }

    function renderFilteredResults(filterKey) {
        const container = document.getElementById("multi-filtered-results");
        if (!container) return;
        let three = _multiSwapAll.filter(function(r) { return r.type === 3; });
        let four  = _multiSwapAll.filter(function(r) { return r.type === 4; });
        const isFiltered = filterKey !== null;

        if (isFiltered) {
            const parts = filterKey.split("|");
            const fDay = parts[0], fp = parseInt(parts[1]);
            three = three.filter(function(cy) { return cy.chain[0].receives.day === fDay && cy.chain[0].receives.period === fp; });
            four  = four.filter(function(cy)  { return cy.chain[0].receives.day === fDay && cy.chain[0].receives.period === fp; });
        }

        let html = "";
        if (three.length > 0) {
            const total3 = _multiSwapAll.filter(function(r) { return r.type === 3; }).length;
            html += "<div class=\\"result-section\\"><h4>🔄 3인 순환 교체 (" + (isFiltered ? three.length + "건 해당" : total3 + "건 발견") + ")</h4><p style=\\"font-size:13px;color:var(--subtle-text);margin-top:-10px;margin-bottom:15px;\\">" + (isFiltered ? three.length + "건 표시" : "3명의 교사가 " + _multiSwapClass + "반 수업을 순환 교체합니다.") + "</p>";
            const list3 = isFiltered ? three : three.slice(0, 20);
            list3.forEach(function(cy, i) { html += renderCycleCard(cy, i + 1); });
            if (!isFiltered && three.length > 20) html += "<div class=\\"no-result\\">외 " + (three.length - 20) + "건 더 있습니다. 위에서 요일·교시를 선택하면 전부 확인 가능합니다.</div>";
            html += "</div>";
        }
        if (four.length > 0) {
            const total4 = _multiSwapAll.filter(function(r) { return r.type === 4; }).length;
            html += "<div class=\\"result-section\\"><h4>🔄 4인 순환 교체 (" + (isFiltered ? four.length + "건 해당" : total4 + "건 발견") + ")</h4><p style=\\"font-size:13px;color:var(--subtle-text);margin-top:-10px;margin-bottom:15px;\\">" + (isFiltered ? four.length + "건 표시" : "4명의 교사가 " + _multiSwapClass + "반 수업을 순환 교체합니다.") + "</p>";
            const list4 = isFiltered ? four : four.slice(0, 15);
            list4.forEach(function(cy, i) { html += renderCycleCard(cy, i + 1); });
            if (!isFiltered && four.length > 15) html += "<div class=\\"no-result\\">외 " + (four.length - 15) + "건 더 있습니다. 위에서 요일·교시를 선택하면 전부 확인 가능합니다.</div>";
            html += "</div>";
        }
        if (three.length === 0 && four.length === 0) {
            html = "<div class=\\"no-result\\">" + (isFiltered ? "선택하신 요일·교시에 해당하는" : "조건을 만족하는") + " 순환 교체 경로가 없습니다.</div>";
        }
        container.innerHTML = html;
    }

    function renderCycleCard(cycle, number) {
        const chain = cycle.chain;
        let html = "<div class=\\"cycle-card\\"><div class=\\"cycle-card-header\\"><span class=\\"cycle-badge\\">" + number + "</span><span class=\\"cycle-card-title\\">" + cycle.type + "인 — " + chain.map(function(c) { return c.teacher; }).join(" → ") + " → " + chain[0].teacher + "</span></div>";
        html += "<div class=\\"cycle-flow\\">";
        chain.forEach(function(step, i) {
            const next      = chain[(i + 1) % chain.length].teacher;
            const ext       = extNumbers[step.teacher] ? " (📞" + extNumbers[step.teacher] + ")" : "";
            const cellClean = String(step.gives.cell).replace(/[\\r\\n]/g, " ");
            html += "<div class=\\"cycle-step\\">" +
                "<div class=\\"step-teacher\\">" + step.teacher + ext + "</div>" +
                "<div class=\\"step-detail\\">" + step.gives.day + " " + (step.gives.period + 1) + "교시</div>" +
                "<div class=\\"step-detail\\" style=\\"font-size:11px;color:var(--subtle-text);\\">" + cellClean + "</div>" +
                "<div class=\\"step-next\\" style=\\"color:var(--primary-color);font-size:11px;margin-top:4px;\\">→ " + next + " 담당</div>" +
                "</div><span class=\\"cycle-arrow\\">→</span>";
        });
        html += "<div class=\\"cycle-step\\" style=\\"border:2px dashed var(--primary-color);background:var(--empty-bg);\\"><div class=\\"step-teacher\\">" + chain[0].teacher + "</div><div class=\\"step-detail\\" style=\\"color:var(--primary-color);font-weight:600;\\">↩ 순환 완료</div></div>";
        html += "</div>";
        html += "<div class=\\"cycle-summary\\"><b>📋 교체 방법:</b><br>";
        chain.forEach(function(step, i) {
            const next = chain[(i + 1) % chain.length].teacher;
            const gc   = String(step.gives.cell).replace(/[\\r\\n]/g, " ");
            const rc   = String(step.receives.cell).replace(/[\\r\\n]/g, " ");
            html += "• <b>" + step.teacher + "</b>: <b>" + step.gives.day + " " + (step.gives.period + 1) + "교시</b> (" + gc + ")에 <b>" + next + "</b> 선생님이 들어오고, 본인은 <b>" + step.receives.day + " " + (step.receives.period + 1) + "교시</b> (" + rc + ")로 이동<br>";
        });
        html += "</div></div>";
        return html;
    }

    function applyMultiFilter(btn) {
        const isActive = btn.classList.contains("active");
        document.querySelectorAll(".multi-filter-btn").forEach(function(b) { b.classList.remove("active"); });
        const clearBtn = document.getElementById("multi-filter-clear");
        if (isActive) { clearBtn.style.display = "none"; renderFilteredResults(null); }
        else { btn.classList.add("active"); clearBtn.style.display = "inline-block"; renderFilteredResults(btn.getAttribute("data-slot")); }
    }
    function clearMultiFilter() {
        document.querySelectorAll(".multi-filter-btn").forEach(function(b) { b.classList.remove("active"); });
        document.getElementById("multi-filter-clear").style.display = "none";
        renderFilteredResults(null);
    }
    function switchSwapTab(event, tabId) {
        document.querySelectorAll(".swap-modal-tab").forEach(function(t) { t.classList.remove("active"); });
        document.querySelectorAll(".swap-tab-content").forEach(function(t) { t.classList.remove("active"); });
        event.target.classList.add("active");
        document.getElementById(tabId).classList.add("active");
    }
    function closeSwapModal() { document.getElementById("swap-modal").style.display = "none"; }

    // ─── Sidebar ──────────────────────────────────────────────────
    function buildTeacherSidebar() {
        removeTeacherSidebar();
        const teacherList  = allTeacherSchedules.map(function(t) { return t.name; }).sort();
        const favTeachers  = teacherList.filter(function(t) { return teacherFavorites.indexOf(t) !== -1; });
        const otherTeachers = teacherList.filter(function(t) { return teacherFavorites.indexOf(t) === -1; });

        let listHtml = "";
        if (favTeachers.length > 0) {
            listHtml += "<div class=\\"sidebar-section-label\\"><span>즐겨찾기</span><button class=\\"sidebar-fav-clear\\" onclick=\\"clearTeacherFavorites()\\">✕ 초기화</button></div>";
            favTeachers.forEach(function(t) { listHtml += "<button class=\\"teacher-sidebar-item\\" data-teacher=\\"" + t + "\\"><span class=\\"sidebar-fav-dot\\"></span>" + t + "</button>"; });
            listHtml += "<div class=\\"sidebar-divider\\"></div>";
        }
        listHtml += "<div class=\\"sidebar-section-label\\">전체 (" + teacherList.length + ")</div>";
        otherTeachers.forEach(function(t) { listHtml += "<button class=\\"teacher-sidebar-item\\" data-teacher=\\"" + t + "\\">" + t + "</button>"; });

        const layout = document.createElement("div");
        layout.className = "teacher-layout"; layout.id = "teacher-layout";
        layout.innerHTML =
            "<div class=\\"teacher-sidebar\\" id=\\"teacher-sidebar\\">" +
                "<div class=\\"teacher-sidebar-header\\"><div class=\\"teacher-sidebar-search\\">" +
                    "<span class=\\"sidebar-search-icon\\">🔍</span>" +
                    "<input type=\\"text\\" id=\\"teacher-sidebar-filter\\" placeholder=\\"이름 검색...\\">" +
                "</div></div>" +
                "<div class=\\"teacher-sidebar-list\\" id=\\"teacher-sidebar-list\\">" + listHtml + "</div>" +
            "</div>" +
            "<div class=\\"teacher-main-content\\" id=\\"teacher-main-content\\">" +
                "<div class=\\"empty-state\\"><div class=\\"empty-state-icon\\">👨‍🏫</div><h3>선생님을 선택하세요</h3></div>" +
            "</div>";
        scheduleContainer.innerHTML = "";
        scheduleContainer.appendChild(layout);

        if (Object.keys(_cellCache).length === 0) buildCellCache();
        setupTeacherSidebarEvents();
    }

    function removeTeacherSidebar() {
        const layout = document.getElementById("teacher-layout");
        if (layout) layout.remove();
        activeTeacherId = "";
    }

    function setupTeacherSidebarEvents() {
        const filter = document.getElementById("teacher-sidebar-filter");
        const list   = document.getElementById("teacher-sidebar-list");
        if (!filter || !list) return;
        list.addEventListener("click", function(e) {
            const item = e.target.closest(".teacher-sidebar-item");
            if (item) selectTeacherFromSidebar(item.dataset.teacher);
        });
        filter.addEventListener("input", function() {
            const q = this.value.trim().toLowerCase();
            list.querySelectorAll(".teacher-sidebar-item").forEach(function(item) {
                item.style.display = (!q || item.dataset.teacher.toLowerCase().indexOf(q) !== -1) ? "" : "none";
            });
            list.querySelectorAll(".sidebar-section-label, .sidebar-divider").forEach(function(el) {
                el.style.display = q.length > 0 ? "none" : "";
            });
        });
    }

    function selectTeacherFromSidebar(name) {
        activeTeacherId = name;
        const list = document.getElementById("teacher-sidebar-list");
        if (list) list.querySelectorAll(".teacher-sidebar-item").forEach(function(item) {
            item.classList.toggle("active", item.dataset.teacher === name);
        });
        displayTeacherSchedule(name);
    }

    function toggleTeacherFavorite(name) {
        const idx = teacherFavorites.indexOf(name);
        if (idx > -1) teacherFavorites.splice(idx, 1); else teacherFavorites.unshift(name);
        if (teacherFavorites.length > 20) teacherFavorites = teacherFavorites.slice(0, 20);
        localStorage.setItem("favTeachers", JSON.stringify(teacherFavorites));
        const saved = activeTeacherId;
        buildTeacherSidebar();
        if (saved && teacherMap[saved]) selectTeacherFromSidebar(saved);
    }
    function clearTeacherFavorites() {
        teacherFavorites = [];
        localStorage.setItem("favTeachers", JSON.stringify(teacherFavorites));
        const saved = activeTeacherId;
        buildTeacherSidebar();
        if (saved && teacherMap[saved]) selectTeacherFromSidebar(saved);
    }

    // ─── Schedule display ─────────────────────────────────────────
    function displayTeacherSchedule(teacherName) {
        const teacher = teacherMap[teacherName];
        if (!teacher) return;
        closeStudentListModal();
        clearStudentListStore();

        const isFav   = teacherFavorites.indexOf(teacherName) !== -1;
        const extNum  = extNumbers[teacherName] ? "<span class=\\"ext-badge\\">📞 " + extNumbers[teacherName] + "</span>" : "";
        const todayIdx = new Date().getDay() - 1;
        const days     = ["월","화","수","목","금"];

        let html = "<div class=\\"schedule-header\\">" +
            "<div class=\\"schedule-info\\"><h2>" + teacher.name + " 선생님 " + extNum + "</h2></div>" +
            "<div class=\\"schedule-actions\\">" +
                "<button class=\\"action-btn " + (isFav ? "favorited" : "") + "\\" data-teacher=\\"" + teacherName + "\\" onclick=\\"toggleTeacherFavorite(this.getAttribute('data-teacher'))\\">" +
                    (isFav ? "⭐ 즐겨찾기됨" : "☆ 즐겨찾기") + "</button>" +
                "<button class=\\"action-btn\\" onclick=\\"window.print()\\">🖨️ 인쇄</button>" +
            "</div></div>" +
            "<div class=\\"teacher-table-wrap\\"><table><thead><tr>" +
            "<th style=\\"font-family:'Pretendard','Apple SD Gothic Neo',sans-serif;\\">교시</th>";

        days.forEach(function(day, i) {
            const isToday = i === todayIdx;
            html += "<th class=\\"" + (isToday ? "today-header" : "") + "\\">" + day + (isToday ? " <span class=\\"today-badge\\">오늘</span>" : "") + "</th>";
        });
        html += "</tr></thead><tbody>";

        for (let i = 0; i < 7; i++) {
            const pNum    = i + 1;
            const timeStr = bellSchedule[pNum] ? "<br><span class=\\"period-time\\">(" + bellSchedule[pNum] + ")</span>" : "";
            html += "<tr><td class=\\"period-label\\">" + pNum + "교시" + timeStr + "</td>";
            days.forEach(function(day, di) {
                const cellData = getCachedCell(teacherName, day, i);
                const isToday  = di === todayIdx;
                const todayCls = isToday ? " today-cell" : "";
                if (cellData && String(cellData).trim() !== "") {
                    const sub = renderTeacherCell(teacherName, day, i, cellData);
                    if (sub.isEmpty) {
                        html += "<td class=\\"teacher-empty-period" + todayCls + "\\"></td>";
                    } else {
                        html += "<td class=\\"teacher-subject-cell" + todayCls + " clickable-cell\\" style=\\"" + sub.style + "\\" data-teacher=\\"" + teacherName + "\\" data-day=\\"" + day + "\\" data-period=\\"" + i + "\\">" + sub.html + "</td>";
                    }
                } else {
                    html += "<td class=\\"teacher-empty-period" + todayCls + "\\"></td>";
                }
            });
            html += "</tr>";
        }
        html += "</tbody></table></div>";

        const target = document.getElementById("teacher-main-content") || scheduleContainer;
        target.innerHTML = html;
        target.querySelectorAll(".clickable-cell").forEach(function(cell) {
            cell.addEventListener("click", function() {
                openSwapModal(cell.dataset.teacher, cell.dataset.day, parseInt(cell.dataset.period, 10));
            });
        });
    }
    `;
}


// ================================================================
// Part 6: 초기화 함수 + export
// ================================================================

function generateInitJS(features) {
    return `
    // ============================================================
    // 초기화
    // ============================================================
    function showEmptyState() {
        const icons = { student:'👨‍🎓', class:'👥', classroom:'🏫', teacher:'👨‍🏫' };
        const labels = { student:'학생 이름을 검색하세요', class:'반을 선택하세요', classroom:'교실을 선택하세요', teacher:'선생님을 선택하세요' };
        if (currentMode === 'teacher') return; // 사이드바에서 처리
        scheduleContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">'+(icons[currentMode]||'🔍')+'</div><h3>'+(labels[currentMode]||'선택하세요')+'</h3></div>';
    }

    function initApp() {
        const tabNav = document.getElementById('tab-navigation');
        const tabIcons = { student:'👨‍🎓', class:'👥', classroom:'🏫', teacher:'👨‍🏫' };
        const tabLabels = { student:'학생별', class:'반별', classroom:'교실별', teacher:'교사별' };
        const modes = [];
        const tabsHtml = [];

        ${features.student ? "modes.push('student'); tabsHtml.push('<button class=\"tab-button\" data-mode=\"student\">'+tabIcons.student+' '+tabLabels.student+'</button>');" : ''}
        ${features.class ? "modes.push('class'); tabsHtml.push('<button class=\"tab-button\" data-mode=\"class\">'+tabIcons.class+' '+tabLabels.class+'</button>');" : ''}
        ${features.classroom ? "modes.push('classroom'); tabsHtml.push('<button class=\"tab-button\" data-mode=\"classroom\">'+tabIcons.classroom+' '+tabLabels.classroom+'</button>');" : ''}
        ${features.teacher ? "modes.push('teacher'); tabsHtml.push('<button class=\"tab-button\" data-mode=\"teacher\">'+tabIcons.teacher+' '+tabLabels.teacher+'</button>');" : ''}

        if (modes.length === 0) {
            tabNav.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">선택된 조회 기능이 없습니다.</div>';
            return;
        }

        currentMode = modes[0];
        tabNav.innerHTML = tabsHtml.join('');
        tabNav.querySelector('.tab-button').classList.add('active');

        tabNav.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                tabNav.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                switchMode();
            });
        });

        switchMode();

        // ESC 키 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { closeStudentListModal(); closeSwapModal(); }
        });
    }

    function switchMode() {
        const section = document.getElementById('search-section');
        closeStudentListModal();
        ${features.teacher ? "removeTeacherSidebar();" : ''}

        switch(currentMode) {
            ${features.student ? "case 'student': section.style.display=''; setupStudentSearch(); showEmptyState(); break;" : ''}
            ${features.class ? "case 'class': section.style.display=''; setupClassView(); showEmptyState(); break;" : ''}
            ${features.classroom ? "case 'classroom': section.style.display=''; setupClassroomView(); showEmptyState(); break;" : ''}
            ${features.teacher ? "case 'teacher': section.style.display='none'; buildTeacherSidebar(); break;" : ''}
        }
    }

    // 시작
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    `;
}