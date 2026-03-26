// ================================================================
// 통합 시간표 생성기 - generator.js
// Part 1: 초기화, 드래그앤드롭, 파일 파싱
// ================================================================

// ==========================================
// 전역 상태
// ==========================================
const AppState = {
    weekly: null,           // 주간시간표 raw data
    weeklyFormat: 'formatA', // 'formatA'(컴시간) or 'formatB'(APPIN)
    selection: [],          // 학생별 선택과목 [{name, data}, ...]
    info: null,             // 선택과목 상세 정보 (템플릿)
    extensions: {},         // 내선번호 {이름: 번호}
    bellSchedule: {},       // 시정표 {교시: 시간}
    logoBase64: '',         // 로고 이미지 Base64
    selectedTheme: 'serenity',
    parsedTeacherSchedules: [] // 교사별 시간표 (IRONMIN 형식)
};

// ==========================================
// 테마 정의 (12종)
// ==========================================
const THEMES = {
    'serenity':      { name: 'Serenity',      gradient: 'linear-gradient(135deg, #92A8D1 0%, #B8CAE6 100%)', primary: '#92A8D1', primaryLight: '#B8CAE6', accent: '#D1E2F7' },
    'classic-blue':  { name: 'Classic Blue',  gradient: 'linear-gradient(135deg, #0F4C81 0%, #2E86AB 100%)', primary: '#0F4C81', primaryLight: '#2E86AB', accent: '#4A90A4' },
    'midnight':      { name: 'Midnight',      gradient: 'linear-gradient(135deg, #2C3E50 0%, #4A6274 100%)', primary: '#2C3E50', primaryLight: '#4A6274', accent: '#7F8C9B' },
    'living-coral':  { name: 'Living Coral',  gradient: 'linear-gradient(135deg, #FF6F61 0%, #FF8A80 100%)', primary: '#FF6F61', primaryLight: '#FF8A80', accent: '#FFB3BA' },
    'rose':          { name: 'Rose',          gradient: 'linear-gradient(135deg, #D4708F 0%, #E8A0B4 100%)', primary: '#D4708F', primaryLight: '#E8A0B4', accent: '#F2C4D0' },
    'ultra-violet':  { name: 'Ultra Violet',  gradient: 'linear-gradient(135deg, #6B5B95 0%, #8E7DBE 100%)', primary: '#6B5B95', primaryLight: '#8E7DBE', accent: '#B19CD9' },
    'greenery':      { name: 'Greenery',      gradient: 'linear-gradient(135deg, #88B04B 0%, #A8CC8C 100%)', primary: '#88B04B', primaryLight: '#A8CC8C', accent: '#C8D4B8' },
    'ocean':         { name: 'Ocean',         gradient: 'linear-gradient(135deg, #1A8A7D 0%, #3BB5A6 100%)', primary: '#1A8A7D', primaryLight: '#3BB5A6', accent: '#8CD4CA' },
    'amber':         { name: 'Amber',         gradient: 'linear-gradient(135deg, #D48C2E 0%, #E5AD5E 100%)', primary: '#D48C2E', primaryLight: '#E5AD5E', accent: '#F0D0A0' },
    'marsala':       { name: 'Marsala',       gradient: 'linear-gradient(135deg, #955251 0%, #B87071 100%)', primary: '#955251', primaryLight: '#B87071', accent: '#D4A5A5' },
    'slate':         { name: 'Slate',         gradient: 'linear-gradient(135deg, #5A7D8B 0%, #7FA3B0 100%)', primary: '#5A7D8B', primaryLight: '#7FA3B0', accent: '#B0CED6' },
    'graphite':      { name: 'Graphite',      gradient: 'linear-gradient(135deg, #4A4A4A 0%, #717171 100%)', primary: '#4A4A4A', primaryLight: '#717171', accent: '#A0A0A0' }
};

// ==========================================
// DOM 참조
// ==========================================
const DOM = {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    btnGenTemplate: document.getElementById('btn-gen-template'),
    btnRedownload: document.getElementById('btn-redownload'),
    btnToStep3: document.getElementById('btn-to-step3'),
    btnGenerate: document.getElementById('btn-generate'),
    step1Status: document.getElementById('step1-status'),
    themeGrid: document.getElementById('theme-grid'),
    toastContainer: document.getElementById('toast-container'),
    loadingOverlay: document.getElementById('loading-overlay')
};

// 파일 입력 + 드롭존 매핑
const FILE_MAP = {
    weekly:    { dropId: 'drop-weekly',    inputId: 'file-weekly',    statusId: 'status-weekly' },
    selection: { dropId: 'drop-selection', inputId: 'file-selection', statusId: 'status-selection' },
    ext:       { dropId: 'drop-ext',       inputId: 'file-ext',       statusId: 'status-ext' },
    bell:      { dropId: 'drop-bell',      inputId: 'file-bell',      statusId: 'status-bell' },
    info:      { dropId: 'drop-info',      inputId: 'file-info',      statusId: 'status-info' },
    logo:      { dropId: 'drop-logo',      inputId: 'file-logo',      statusId: null }
};

// ==========================================
// 유틸리티 함수
// ==========================================
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function showLoading(msg = '생성 중...') {
    DOM.loadingOverlay.querySelector('.loading-text').textContent = msg;
    DOM.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    DOM.loadingOverlay.style.display = 'none';
}

function updateStepIndicator(currentStep) {
    document.querySelectorAll('.step-item').forEach(item => {
        const num = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed');
        if (num < currentStep) item.classList.add('completed');
        else if (num === currentStep) item.classList.add('active');
    });
    document.querySelectorAll('.step-connector').forEach((c, i) => {
        c.classList.toggle('completed', i + 1 < currentStep);
    });
}

function setUploadStatus(type, text, success = true) {
    const statusId = FILE_MAP[type].statusId;
    if (!statusId) return;
    const el = document.getElementById(statusId);
    if (el) {
        el.textContent = text;
        el.style.color = success ? '#059669' : '#ef4444';
    }
    const dropZone = document.getElementById(FILE_MAP[type].dropId);
    if (dropZone) {
        dropZone.classList.toggle('uploaded', success);
    }
}

// ==========================================
// 드래그 앤 드롭 통합 설정
// ==========================================
function setupDragAndDrop(type) {
    const config = FILE_MAP[type];
    const dropZone = document.getElementById(config.dropId);
    const fileInput = document.getElementById(config.inputId);
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', (e) => {
        if (e.target !== fileInput && e.target.tagName !== 'LABEL') fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFiles(e.target.files, type);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
    });
    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, () => dropZone.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, () => dropZone.classList.remove('dragover'), false);
    });
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFiles(files, type);
        }
    }, false);
}

// ==========================================
// 파일 처리 분기
// ==========================================
function handleFiles(files, type) {
    Array.from(files).forEach(file => {
        if (type === 'logo') {
            processLogoFile(file);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            switch (type) {
                case 'weekly':    processWeeklyFile(json, file.name); break;
                case 'selection': processSelectionFile(json, file.name); break;
                case 'ext':       processExtFile(json); break;
                case 'bell':      processBellFile(json); break;
                case 'info':      processInfoFile(json, file.name); break;
            }
            checkStep1Ready();
        };
        reader.onerror = () => {
            showToast(`"${file.name}" 파일 읽기 오류`, 'error');
            setUploadStatus(type, '❌ 파일 읽기 오류', false);
        };
        reader.readAsArrayBuffer(file);
    });
}

// ==========================================
// 엑셀 포맷 감지
// ==========================================
function detectTimetableFormat(data) {
    if (data.length >= 4) {
        const row3 = data[2] || [];
        if (row3.includes('월') || row3.includes('화') || row3.includes('수')) {
            return 'formatB';
        }
        for (let i = 0; i < Math.min(10, data.length); i++) {
            const rowStr = (data[i] || []).join('');
            if (rowStr.includes('번호') && rowStr.includes('교사') && rowStr.includes('시수')) {
                return 'formatB';
            }
        }
    }
    return 'formatA';
}

// ==========================================
// 교시 구조 계산
// ==========================================
function calculatePeriodStructure(totalCells, weeklyRaw) {
    if (weeklyRaw && weeklyRaw.length >= 3) {
        const result = parseDynamicPeriodStructure(weeklyRaw, totalCells);
        if (result) return result;
    }
    const patterns = [
        [7,7,7,6,6],[7,7,6,7,6],[7,7,7,7,7],[6,6,6,6,6],
        [8,8,8,7,7],[7,7,6,6,6],[7,6,6,6,6],[8,8,7,7,7],
        [8,7,7,7,7],[7,7,4,7,5]
    ];
    for (const p of patterns) {
        if (p.reduce((a, b) => a + b, 0) === totalCells) {
            return { periodCounts: p, maxPeriods: Math.max(...p) };
        }
    }
    return { periodCounts: [7,7,7,6,6], maxPeriods: 7 };
}

function parseDynamicPeriodStructure(weeklyRaw, totalCells) {
    const daysInOrder = ['월','화','수','목','금'];
    const row2 = weeklyRaw[1] || [];
    const row3 = weeklyRaw[2] || [];

    const dayPositions = [];
    for (let col = 0; col < row2.length; col++) {
        const v = row2[col];
        if (v && daysInOrder.includes(String(v).trim())) {
            dayPositions.push({ day: String(v).trim(), startCol: col });
        }
    }

    const dayPeriodMap = {};
    for (let i = 0; i < dayPositions.length; i++) {
        const cur = dayPositions[i];
        const next = dayPositions[i + 1];
        const endCol = next ? next.startCol - 1 : row3.length - 1;
        let maxP = 0;
        for (let col = cur.startCol; col <= endCol; col++) {
            if (col < row3.length && row3[col] != null) {
                const pNum = parseFloat(String(row3[col]).trim());
                if (!isNaN(pNum) && pNum >= 1) maxP = Math.max(maxP, pNum);
            }
        }
        if (maxP > 0) dayPeriodMap[cur.day] = maxP;
    }

    const periodCounts = daysInOrder.map(d => dayPeriodMap[d] || 0);
    const total = periodCounts.reduce((a, b) => a + b, 0);
    if (total > 0) {
        return { periodCounts, maxPeriods: Math.max(...periodCounts) };
    }
    return null;
}

// ==========================================
// 주간시간표 파싱 → 교사별 시간표 배열
// ==========================================
function processWeeklyFile(json, fileName) {
    AppState.weeklyFormat = detectTimetableFormat(json);
    AppState.weekly = json;
    const formatName = AppState.weeklyFormat === 'formatB' ? 'APPIN 양식' : '컴시간 양식';

    const schedules = parseTeacherSchedules(json, AppState.weeklyFormat);
    AppState.parsedTeacherSchedules = schedules;

    setUploadStatus('weekly', `✅ ${schedules.length}명 파싱 완료 (${formatName})`);
    showToast(`주간시간표: ${schedules.length}명 감지 (${formatName})`, 'success');
}

function parseTeacherSchedules(json, format) {
    let schedules = [];

    if (format === 'formatB') {
        let dayHeaders = [];
        let periodHeaders = [];
        let dataStartRow = -1;

        for (let i = 0; i < Math.min(10, json.length); i++) {
            const row = json[i];
            if (row.includes('월') && (row.includes('화') || row.includes('교사'))) {
                let currentDay = '';
                for (let c = 2; c < row.length; c++) {
                    if (row[c] && typeof row[c] === 'string' && ['월','화','수','목','금'].some(d => row[c].includes(d))) {
                        currentDay = row[c].replace(/[^월화수목금]/g, '');
                    }
                    dayHeaders[c] = currentDay;
                }
                periodHeaders = json[i + 1] || [];
                dataStartRow = i + 2;
                break;
            }
        }

        if (dataStartRow !== -1) {
            for (let i = dataStartRow; i < json.length; i++) {
                const subjRow = json[i];
                if (!subjRow || subjRow.length < 2) continue;
                const teacherName = subjRow[1];
                if (typeof teacherName === 'string' && teacherName.trim() !== '' && !teacherName.includes('교사')) {
                    const locRow = json[i + 1] || [];
                    const schedule = { '월': [], '화': [], '수': [], '목': [], '금': [] };
                    for (let c = 2; c < periodHeaders.length; c++) {
                        const day = dayHeaders[c];
                        const period = periodHeaders[c];
                        if (day && period && schedule[day]) {
                            const pIdx = parseInt(period) - 1;
                            const subj = subjRow[c] ? subjRow[c].toString().trim() : '';
                            const loc = locRow[c] ? locRow[c].toString().trim() : '';
                            schedule[day][pIdx] = (subj || loc) ? `${loc} ${subj}`.trim() : null;
                        }
                    }
                    schedules.push({ name: teacherName.trim(), schedule, maxPeriods: 7, periodCounts: [7,7,7,7,7] });
                    i++;
                }
            }
        }
    } else {
        let dayHeaders = [];
        let periodHeaders = [];
        let dataStartRow = -1;

        const VALID_DAYS = ['월','화','수','목','금'];
        for (let i = 0; i < Math.min(10, json.length); i++) {
            const row = json[i];
            if (row.some(v => v && VALID_DAYS.includes(String(v).trim()))) {
                let currentDay = '';
                for (let c = 1; c < row.length; c++) {
                    const cell = row[c];
                    if (cell && typeof cell === 'string' && VALID_DAYS.includes(cell.trim()))
                        currentDay = cell.trim();
                    if (currentDay) dayHeaders[c] = currentDay;
                }
            }
            if (row.includes(1) && row.includes(2) && row.includes(3)) {
                periodHeaders = row;
                dataStartRow = i + 1;
                break;
            }
        }

        if (dataStartRow !== -1) {
            for (let i = dataStartRow; i < json.length; i++) {
                const row = json[i];
                const teacherName = row[0];
                if (!teacherName || typeof teacherName !== 'string' || teacherName.trim() === '' || teacherName.includes('교사명')) continue;
                const schedule = { '월': [], '화': [], '수': [], '목': [], '금': [] };
                for (let c = 1; c < periodHeaders.length; c++) {
                    const day = dayHeaders[c];
                    const pVal = periodHeaders[c];
                    if (!day || !VALID_DAYS.includes(day)) continue;
                    if (!pVal || typeof pVal !== 'number') continue;
                    const pIdx = pVal - 1;
                    if (pIdx < 0 || pIdx > 8) continue;
                    if (schedule[day] && row[c]) {
                        const cleaned = String(row[c]).replace(/_x000D_/g, '').replace(/\r?\n/g, '\n').trim();
                        schedule[day][pIdx] = cleaned || null;
                    }
                }
                schedules.push({ name: teacherName.trim(), schedule, maxPeriods: 7, periodCounts: [7,7,7,7,7] });
            }
        }
    }

    return schedules;
}

// ==========================================
// 선택과목 파일 파싱
// ==========================================
function processSelectionFile(json, fileName) {
    AppState.selection.push({ name: fileName, data: json });
    const names = AppState.selection.map(f => f.name).join(', ');
    setUploadStatus('selection', `✅ ${AppState.selection.length}개 파일 등록`);
}

// ==========================================
// 내선번호 파싱
// ==========================================
function processExtFile(json) {
    AppState.extensions = {};
    let count = 0;
    json.forEach(row => {
        if (row[2] && row[4]) {
            let rawName = String(row[2]).trim();
            let idx = rawName.indexOf('(');
            if (idx !== -1) rawName = rawName.substring(0, idx).trim();
            let ext = String(row[4]).trim();
            if (rawName && !rawName.includes('성명') && !rawName.includes('과목') && ext.length > 0) {
                AppState.extensions[rawName] = ext;
                count++;
            }
        }
        if (row[8] && row[10]) {
            let rawName = String(row[8]).trim();
            let idx = rawName.indexOf('(');
            if (idx !== -1) rawName = rawName.substring(0, idx).trim();
            let ext = String(row[10]).trim();
            if (rawName && !rawName.includes('성명') && !rawName.includes('과목') && ext.length > 0) {
                AppState.extensions[rawName] = ext;
                count++;
            }
        }
    });
    setUploadStatus('ext', `✅ ${count}명 번호 등록`);
}

// ==========================================
// 시정표 파싱
// ==========================================
function processBellFile(json) {
    AppState.bellSchedule = {};
    json.forEach(row => {
        if (row[0] && row[1]) {
            AppState.bellSchedule[parseInt(row[0])] = row[1].toString().trim();
        }
    });
    setUploadStatus('bell', `✅ 시정표 등록 완료`);
}

// ==========================================
// 선택과목 상세정보 파싱
// ==========================================
function processInfoFile(json, fileName) {
    AppState.info = json;
    setUploadStatus('info', `✅ ${fileName} 업로드 완료`);
    showToast('선택과목 상세정보가 업로드되었습니다.', 'success');
    checkStep3Ready();
}

// ==========================================
// 로고 파일 처리
// ==========================================
function processLogoFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        AppState.logoBase64 = e.target.result;
        document.getElementById('logo-placeholder').style.display = 'none';
        const preview = document.getElementById('logo-preview');
        preview.src = AppState.logoBase64;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// ================================================================
// Part 2: 선택과목 템플릿 생성, 학생 데이터 처리
// ================================================================

// ==========================================
// 단계 전환 확인 함수
// ==========================================
function checkStep1Ready() {
    const ready = AppState.weekly && AppState.selection.length > 0;
    DOM.btnGenTemplate.disabled = !ready;
    if (ready) {
        DOM.btnGenTemplate.textContent = '선택과목 정보 템플릿 생성 → 2단계로';
        DOM.step1Status.textContent = '✅ 파일 준비 완료! 템플릿 생성 버튼을 눌러주세요.';
        DOM.step1Status.style.color = '#059669';
    }
}

function checkStep3Ready() {
    if (AppState.weekly && AppState.selection.length > 0) {
        DOM.btnGenerate.disabled = false;
        DOM.btnGenerate.textContent = '통합 시간표 HTML 생성 및 다운로드 🚀';
    }
}

// ==========================================
// 선택과목 정보 템플릿 생성
// ==========================================
function generateInfoTemplate() {
    try {
        const allSelections = {};
        AppState.selection.forEach(file => {
            if (!file.data || file.data.length < 2) return;
            const header = file.data[0];
            const rows = file.data.slice(1);
            rows.forEach(row => {
                if (!row || row.length < 6) return;
                const grade = row[1];
                if (!grade) return;
                for (let i = 5; i < Math.min(header.length, row.length); i++) {
                    const subjectName = header[i];
                    const selectionGroup = row[i];
                    if (subjectName && selectionGroup) {
                        const key = `${grade}_${subjectName}_${selectionGroup}`;
                        allSelections[key] = { grade, subjectName, selectionGroup };
                    }
                }
            });
        });

        let selectionList = Object.values(allSelections);
        selectionList.sort((a, b) => {
            if (a.grade !== b.grade) return String(a.grade).localeCompare(String(b.grade));
            return a.selectionGroup.localeCompare(b.selectionGroup, undefined, { numeric: true });
        });

        const groupTimings = extractGroupTimings();

        const findTimeInfo = (grade, group) => {
            let allTimes = [];
            const check = (key) => { if (groupTimings[key]) allTimes.push(...groupTimings[key]); };
            check(`${grade}_${group}`);
            check(`${grade}_${group.toUpperCase()}`);
            if (group.length > 0) check(`${grade}_${group.charAt(0).toUpperCase()}`);
            return allTimes.filter((t, i, self) => i === self.findIndex(x => x.day === t.day && x.period === t.period));
        };

        const templateRows = [['학년', '선택반명', '교과명', '수업교실', '수업교사명', '수업시간', '축약-교과명']];
        selectionList.forEach(sel => {
            const timeArr = findTimeInfo(sel.grade, sel.selectionGroup);
            const timeStr = timeArr.map(t => `${t.day}${t.period}`).join(',');
            templateRows.push([sel.grade, sel.selectionGroup, sel.subjectName, '', '', timeStr, '']);
        });

        AppState.info = templateRows;

        downloadExcel(templateRows, '선택과목정보_템플릿', '선택과목정보_템플릿.xlsx');

        DOM.step2.style.display = 'block';
        DOM.step3.style.display = 'block';
        DOM.btnRedownload.disabled = false;
        updateStepIndicator(2);
        checkStep3Ready();
        showToast('템플릿이 생성되었습니다! 수정 후 2단계에 업로드하거나, 바로 3단계로 진행하세요.', 'success');

    } catch (error) {
        console.error('[ERROR] Template generation:', error);
        showToast('템플릿 생성 중 오류: ' + error.message, 'error');
    }
}

function extractGroupTimings() {
    const groupTimings = {};
    const weeklyRaw = AppState.weekly;

    if (AppState.weeklyFormat === 'formatB') {
        const dayHeaders = weeklyRaw[2] || [];
        const periodHeaders = weeklyRaw[3] || [];
        const columnMap = {};
        let currentDay = '';
        for (let i = 1; i < dayHeaders.length; i++) {
            if (dayHeaders[i] && ['월','화','수','목','금'].includes(dayHeaders[i])) currentDay = dayHeaders[i];
            if (currentDay && periodHeaders[i]) columnMap[i] = { day: currentDay, period: parseInt(periodHeaders[i], 10) };
        }
        for (let i = 4; i < weeklyRaw.length; i++) {
            const subjRow = weeklyRaw[i];
            const locRow = weeklyRaw[i + 1];
            if (!locRow || (locRow[0] !== '' && locRow[0] !== null)) continue;
            for (let col = 1; col < subjRow.length; col++) {
                const subject = subjRow[col];
                const location = locRow[col];
                const timeInfo = columnMap[col];
                if (subject && location && timeInfo) {
                    const subjectMatch = String(subject).match(/^([A-Z])\s?/);
                    const locationMatch = String(location).match(/^(\d)-(\d+)/);
                    if (subjectMatch && locationMatch) {
                        const key = locationMatch[1] + '_' + subjectMatch[1];
                        if (!groupTimings[key]) groupTimings[key] = [];
                        if (!groupTimings[key].some(t => t.day === timeInfo.day && t.period === timeInfo.period)) {
                            groupTimings[key].push(timeInfo);
                        }
                    }
                }
            }
            i++;
        }
    } else {
        const totalCells = weeklyRaw[0].length - 1;
        const periodStructure = calculatePeriodStructure(totalCells, weeklyRaw);
        const daysInOrder = ['월','화','수','목','금'];

        weeklyRaw.forEach(function(row) {
            const scheduleData = row.slice(1);
            let currentIndex = 0;
            for (let i = 0; i < daysInOrder.length; i++) {
                const day = daysInOrder[i];
                const count = periodStructure.periodCounts[i] || 0;
                const daySchedule = scheduleData.slice(currentIndex, currentIndex + count);

                daySchedule.forEach(function(cell, periodIndex) {
                    if (cell) {
                        const cellStr = String(cell).replace(/_x000D_/g, '').replace(/\r?\n/g, ' ').trim();
                        const matchUnderscore = cellStr.match(/^(\d)\d{2}\S*\s+([A-Za-z][A-Za-z0-9]*)_/);
                        const matchSpace = cellStr.match(/^(\d)\d{2}\S*\s+([A-Za-z][A-Za-z0-9]*)\s+/);
                        const match = matchUnderscore || matchSpace;
                        if (match) {
                            const grade = match[1];
                            const group = match[2];
                            const key = grade + '_' + group;
                            if (!groupTimings[key]) groupTimings[key] = [];
                            if (!groupTimings[key].some(t => t.day === day && t.period === periodIndex + 1)) {
                                groupTimings[key].push({ day: day, period: periodIndex + 1 });
                            }
                        }
                    }
                });
                currentIndex += count;
            }
        });
    }

    return groupTimings;
}

// ==========================================
// 엑셀 다운로드 헬퍼
// ==========================================
function downloadExcel(rows, sheetName, fileName) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const colWidths = rows[0].map((_, i) => ({
        wch: rows.reduce((w, r) => Math.max(w, String(r[i] || '').length), 10)
    }));
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
}

// ==========================================
// 과목+교사 파싱 유틸
// ==========================================
function parseSubjectAndTeacher(rawString) {
    if (!rawString) return { subject: '', teacher: '' };
    const patterns = [
        /^(.+?)$(.+?)$$/,
        /^(.+?)\s+([가-힣]{2,4})$/,
        /^(.+)$/
    ];
    for (const pattern of patterns) {
        const match = rawString.match(pattern);
        if (match) {
            if (match.length === 3) {
                let teacher = match[2].trim().replace(/$\d+$$/, '');
                return { subject: match[1].trim(), teacher };
            }
            return { subject: match[1].trim(), teacher: '' };
        }
    }
    return { subject: rawString.trim(), teacher: '' };
}

function cleanTeacherName(name) {
    if (!name) return '';
    return name.replace(/$\d+$$/, '').trim();
}

function normalizeClassroomName(classroom) {
    if (!classroom) return '';
    const s = String(classroom).trim();
    const dashMatch = s.match(/^(\d+)-(\d+)$/);
    if (dashMatch) return dashMatch[1] + dashMatch[2].padStart(2, '0');
    return s;
}

// ==========================================
// 학생 데이터 전처리 (processAllData)
// ==========================================
function processAllData() {
    const weeklyRaw = AppState.weekly;
    const fixedSchedules = {};
    const daysInOrder = ['월','화','수','목','금'];
    let periodStructure, maxPeriods;

    if (AppState.weeklyFormat === 'formatB') {
        const dayHeaders = weeklyRaw[2] || [];
        const periodHeaders = weeklyRaw[3] || [];
        let dayRanges = {};
        let currentDay = '';
        for (let i = 1; i < dayHeaders.length; i++) {
            if (dayHeaders[i] && ['월','화','수','목','금'].includes(dayHeaders[i])) {
                currentDay = dayHeaders[i];
                if (!dayRanges[currentDay]) dayRanges[currentDay] = [];
            }
            if (currentDay && periodHeaders[i]) {
                dayRanges[currentDay].push({ period: periodHeaders[i], column: i });
            }
        }
        const periodCounts = daysInOrder.map(d => dayRanges[d] ? dayRanges[d].length : 0);
        maxPeriods = Math.max(...periodCounts, 0);
        periodStructure = { periodCounts, maxPeriods };

        const teacherInfo = {};
        for (let i = 0; i < weeklyRaw.length; i++) {
            const row = weeklyRaw[i];
            if (!row || !row[0]) continue;
            const classMatch = String(row[0]).match(/^(\d)-(\d+)$/);
            if (classMatch) {
                const homeroom = `${classMatch[1]}-${classMatch[2]}`;
                teacherInfo[homeroom] = {};
                daysInOrder.forEach(day => {
                    if (!dayRanges[day]) return;
                    teacherInfo[homeroom][day] = {};
                    dayRanges[day].forEach(pi => {
                        const cellValue = row[pi.column];
                        if (cellValue) {
                            const pidx = parseInt(pi.period, 10);
                            const tm = String(cellValue).match(/([가-힣]{2,4})$/);
                            if (tm) teacherInfo[homeroom][day][pidx] = tm[1];
                        }
                    });
                });
            }
        }

        for (let i = 4; i < weeklyRaw.length; i += 2) {
            const subjRow = weeklyRaw[i];
            const locRow = weeklyRaw[i + 1];
            if (!subjRow || !locRow) continue;
            if (locRow[0] !== '' && locRow[0] !== null && locRow[0] !== undefined) continue;

            daysInOrder.forEach(day => {
                if (!dayRanges[day]) return;
                dayRanges[day].forEach(pi => {
                    const subject = subjRow[pi.column];
                    const location = locRow[pi.column];
                    if (subject && location) {
                        const pidx = parseInt(pi.period, 10);
                        if (/^\d+-\d+$/.test(String(location).trim())) {
                            const homeroom = String(location).trim();
                            if (!fixedSchedules[homeroom]) {
                                fixedSchedules[homeroom] = { schedule: {} };
                                daysInOrder.forEach(d => { fixedSchedules[homeroom].schedule[d] = Array(maxPeriods).fill(null); });
                            }
                            if (pidx >= 1) {
                                const ai = pidx - 1;
                                const tn = teacherInfo[homeroom]?.[day]?.[pidx] || '';
                                const subjStr = String(subject).trim();

                                if (fixedSchedules[homeroom].schedule[day][ai] === null) {
                                    fixedSchedules[homeroom].schedule[day][ai] = {
                                        subject: subjStr,
                                        teacher: tn,
                                        location: ''
                                    };
                                }
                            }
                        }
                    }
                });
            });
        }

        for (let i = 4; i < weeklyRaw.length; i += 2) {
            const subjRow = weeklyRaw[i];
            const locRow = weeklyRaw[i + 1];
            if (!subjRow || !locRow) continue;
            if (locRow[0] !== '' && locRow[0] !== null && locRow[0] !== undefined) continue;
            daysInOrder.forEach(day => {
                if (!dayRanges[day]) return;
                dayRanges[day].forEach(pi => {
                    const subject = subjRow[pi.column];
                    const location = locRow[pi.column];
                    if (subject && location && !/^\d+-\d+$/.test(String(location).trim())) {
                        const classroomName = String(location).trim();
                        const subjectName = String(subject).trim();
                        const pidx = parseInt(pi.period, 10);
                        Object.keys(fixedSchedules).forEach(hr => {
                            const ai = pidx - 1;
                            if (ai >= 0 && fixedSchedules[hr].schedule[day][ai]) {
                                const sch = fixedSchedules[hr].schedule[day][ai];
                                if (sch && sch.subject === subjectName) sch.location = classroomName;
                            }
                        });
                    }
                });
            });
        }

    } else {
        const totalCells = weeklyRaw.length > 0 && weeklyRaw[0].length > 1 ? weeklyRaw[0].length - 1 : 33;
        periodStructure = calculatePeriodStructure(totalCells, weeklyRaw);
        maxPeriods = periodStructure.maxPeriods;

        weeklyRaw.forEach(row => {
            const teacherName = cleanTeacherName(row[0] ? String(row[0]).trim() : '');
            const scheduleData = row.slice(1);
            for (let i = 0; i < daysInOrder.length; i++) {
                const day = daysInOrder[i];
                const count = periodStructure.periodCounts[i] || 0;
                let startIdx = 0;
                for (let j = 0; j < i; j++) startIdx += periodStructure.periodCounts[j] || 0;
                const daySchedule = scheduleData.slice(startIdx, startIdx + count);

                daySchedule.forEach((cell, pIdx) => {
                    if (cell) {
                        const cellStr = String(cell).replace(/_x000D_/g, '').replace(/\r?\n/g, ' ').trim();
                        if (/^\d{3}/.test(cellStr)) {
                            const classId = cellStr.substring(0, 3);
                            const grade = classId.charAt(0);
                            const classNum = classId.substring(1).replace(/^0/, '');
                            const homeroom = `${grade}-${classNum}`;

                            const remainingMatch = cellStr.match(/^\d{3}\S*\s+(.*)/);
                            const remaining = remainingMatch ? remainingMatch[1].trim() : cellStr.substring(4).trim();
                            
                            const isElective = /^[A-Za-z][A-Za-z0-9]*[_\s]/.test(remaining)
                                            || /^[A-Za-z]$/.test(remaining);
                            
                            if (!fixedSchedules[homeroom]) {
                                fixedSchedules[homeroom] = { schedule: {} };
                                daysInOrder.forEach(d => { fixedSchedules[homeroom].schedule[d] = Array(maxPeriods).fill(null); });
                            }
                            
                            if (isElective) {
                                // 선택과목은 고정수업에 넣지 않음
                            } else {
                                let classroom = '';
                                let subjectAndTeacher = remaining;
                                const classroomPatterns = [
                                    /^(\d+\w*)\s+(.+)$/,
                                    /^(\w+실\d*)\s+(.+)$/,
                                    /^(\w+교실\d*)\s+(.+)$/,
                                    /^(\w+관\d*)\s+(.+)$/
                                ];
                                for (const pat of classroomPatterns) {
                                    const m = remaining.match(pat);
                                    if (m) { classroom = m[1]; subjectAndTeacher = m[2]; break; }
                                }
                                const parsed = parseSubjectAndTeacher(subjectAndTeacher);
                                const finalSubject = parsed.subject;
                                const finalTeacher = parsed.teacher || teacherName;

                                if (fixedSchedules[homeroom].schedule[day][pIdx] === null) {
                                    fixedSchedules[homeroom].schedule[day][pIdx] = {
                                        subject: finalSubject,
                                        teacher: finalTeacher,
                                        location: classroom
                                    };
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    const electiveInfoMap = {};
    if (AppState.info && AppState.info.length > 1) {
        AppState.info.slice(1).forEach(row => {
            if (!row[0] || !row[1] || !row[2]) return;
            const normalizedSubject = String(row[2]).replace(/\([^)]*\)/g, '').trim();
            const key = `${row[0]}_${normalizedSubject}_${row[1]}`;
            if (!electiveInfoMap[key]) electiveInfoMap[key] = [];
            electiveInfoMap[key].push({
                subject: row[6] || row[2],
                location: row[3],
                teacher: row[4],
                times: row[5]
            });
        });
    }

    const groupTimingsFallback = extractGroupTimings();
    Object.keys(electiveInfoMap).forEach(key => {
        electiveInfoMap[key].forEach(info => {
            if (!info.times) {
                const parts = key.split('_');
                const grade = parts[0];
                const group = parts[parts.length - 1];
                const gtKey = `${grade}_${group}`;
                const timings = groupTimingsFallback[gtKey] || groupTimingsFallback[`${grade}_${group.charAt(0).toUpperCase()}`];
                if (timings && timings.length > 0) {
                    info.times = timings.map(t => `${t.day}${t.period}`).join(',');
                }
            }
        });
    });

    const useGroupTimingsDirect = Object.keys(electiveInfoMap).length === 0;

    const students = [];
    AppState.selection.forEach(file => {
        const selHeader = file.data[0];
        const selRows = file.data.slice(1);
        selRows.forEach(row => {
            if (!row[1] || !row[2] || !row[4]) return;
            const grade = row[1];
            const classNum = row[2];
            const student = {
                name: row[4],
                studentId: row[3] || '',
                homeroom: `${grade}-${classNum}`,
                number: row[3] || '',
                schedule: {},
                maxPeriods: periodStructure.maxPeriods,
                periodCounts: periodStructure.periodCounts
            };
            daysInOrder.forEach(d => { student.schedule[d] = Array(student.maxPeriods).fill(''); });

            for (let i = 5; i < selHeader.length; i++) {
                const subjectFromHeader = selHeader[i];
                const selGroup = row[i];
                if (subjectFromHeader && selGroup) {
                    const key = `${grade}_${subjectFromHeader}_${selGroup}`;
                    const infoList = electiveInfoMap[key];
                    if (infoList) {
                        infoList.forEach(info => {
                            if (!info.times) return;
                            const details = [];
                            if (info.location) details.push(`<span class="location-chip">${info.location}</span>`);
                            if (info.teacher) details.push(`<span class="teacher-name">${info.teacher}</span>`);
                            const content = `
                                <div class="elective-subject-line">
                                    <span class="elective-class-badge">${selGroup}</span>
                                    <div class="subject-name">${info.subject}</div>
                                </div>
                                <span class="elective-class-name" style="display:none;">${selGroup}</span>
                                ${details.length > 0 ? `<div class="details">${details.join('<br>')}</div>` : ''}
                            `;
                            const timeParts = info.times.split(',').filter(t => t.trim());
                            timeParts.forEach(part => {
                                const dayMatch = part.match(/^[월화수목금]/);
                                const periodMatch = part.match(/\d+$/);
                                if (dayMatch && periodMatch) {
                                    const day = dayMatch[0];
                                    const pi = parseInt(periodMatch[0], 10) - 1;
                                    if (student.schedule[day] && pi >= 0 && pi < student.maxPeriods) {
                                        student.schedule[day][pi] = content;
                                    }
                                }
                            });
                        });
                    } else if (useGroupTimingsDirect) {
                        const gtKey = `${grade}_${selGroup}`;
                        const timings = groupTimingsFallback[gtKey]
                                     || groupTimingsFallback[`${grade}_${String(selGroup).charAt(0).toUpperCase()}`];
                        if (timings) {
                            const content = `
                                <div class="elective-subject-line">
                                    <span class="elective-class-badge">${selGroup}</span>
                                    <div class="subject-name">${subjectFromHeader}</div>
                                </div>
                                <span class="elective-class-name" style="display:none;">${selGroup}</span>
                            `;
                            timings.forEach(t => {
                                const pi = t.period - 1;
                                if (student.schedule[t.day] && pi >= 0 && pi < student.maxPeriods) {
                                    student.schedule[t.day][pi] = content;
                                }
                            });
                        }
                    }
                }
            }

            const fixed = fixedSchedules[student.homeroom];
            if (fixed) {
                daysInOrder.forEach(day => {
                    const dayIdx = daysInOrder.indexOf(day);
                    for (let i = 0; i < student.maxPeriods; i++) {
                        const si = fixed.schedule[day]?.[i];
                        if (i < student.periodCounts[dayIdx] && !student.schedule[day][i] && si) {
                            const details = [];
                            if (si.teacher) details.push(`<span class="teacher-name">${si.teacher}</span>`);
                            if (si.location) details.push(`<span class="location-chip">${si.location}</span>`);
                            student.schedule[day][i] = `
                                <div class="subject-name">${si.subject}</div>
                                ${details.length > 0 ? `<div class="details">${details.join('<br>')}</div>` : ''}
                            `;
                        }
                    }
                });
            }
            students.push(student);
        });
    });

    return students;
}

// ================================================================
// Part 3: 테마 UI, 최종 HTML 생성, 이벤트 초기화
// ================================================================

// ==========================================
// 테마 그리드 렌더링
// ==========================================
function renderThemeGrid() {
    DOM.themeGrid.innerHTML = Object.entries(THEMES).map(([key, theme]) => `
        <div class="theme-option ${key === 'serenity' ? 'selected' : ''}" data-theme="${key}">
            <div class="theme-preview" style="background: ${theme.gradient};"></div>
            <div class="theme-name">${theme.name}</div>
        </div>
    `).join('');

    DOM.themeGrid.addEventListener('click', (e) => {
        const opt = e.target.closest('.theme-option');
        if (!opt) return;
        DOM.themeGrid.querySelectorAll('.theme-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        AppState.selectedTheme = opt.dataset.theme;
    });
}

// ==========================================
// 최종 HTML 생성 및 다운로드
// ==========================================
function generateAndDownloadHtml() {
    const features = {
        student: document.getElementById('feat-student').checked,
        class: document.getElementById('feat-class').checked,
        classroom: document.getElementById('feat-classroom').checked,
        teacher: document.getElementById('feat-teacher').checked,
        subject: document.getElementById('feat-subject').checked
    };

    if (!Object.values(features).some(v => v)) {
        showToast('최소 하나의 조회 기능을 선택해주세요.', 'warning');
        return;
    }

    showLoading('통합 시간표 HTML을 생성하고 있습니다...');

    setTimeout(() => {
        try {
            const studentsData = processAllData();

            const options = {
                pageTitle: document.getElementById('page-title').value.trim() || '통합 시간표 조회 시스템',
                logoBase64: AppState.logoBase64,
                selectedTheme: AppState.selectedTheme,
                features,
                optColor1: document.getElementById('opt-color1').checked,
                optColor2: document.getElementById('opt-color2').checked,
                optLinebreak: document.getElementById('opt-linebreak').checked,
                optChip: document.getElementById('opt-chip').checked,
                teacherSchedules: AppState.parsedTeacherSchedules,
                extensions: AppState.extensions,
                bellSchedule: AppState.bellSchedule,
                studentsData,
                weeklyData: AppState.weekly,
                weeklyFormat: AppState.weeklyFormat
            };

            if (typeof generateOutputHtml !== 'function') {
                throw new Error('output-template.js가 로드되지 않았습니다. 파일을 확인해주세요.');
            }

            const finalHtml = generateOutputHtml(options);

            const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `통합시간표_${new Date().getTime()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            hideLoading();
            showToast('HTML 파일이 성공적으로 생성되었습니다!', 'success');
            updateStepIndicator(3);

        } catch (error) {
            hideLoading();
            console.error('[ERROR] HTML generation:', error);
            showToast('생성 중 오류: ' + error.message, 'error');
        }
    }, 150);
}

// ==========================================
// 이벤트 리스너 초기화
// ==========================================
function init() {
    Object.keys(FILE_MAP).forEach(type => setupDragAndDrop(type));

    renderThemeGrid();

    DOM.btnGenTemplate.addEventListener('click', generateInfoTemplate);

    DOM.btnRedownload.addEventListener('click', () => {
        if (AppState.info && AppState.info.length > 0) {
            downloadExcel(AppState.info, '선택과목정보_템플릿', '선택과목정보_템플릿.xlsx');
            showToast('템플릿이 다시 다운로드되었습니다.', 'success');
        }
    });

    DOM.btnToStep3.addEventListener('click', () => {
        DOM.step3.style.display = 'block';
        updateStepIndicator(3);
        checkStep3Ready();
        DOM.step3.scrollIntoView({ behavior: 'smooth' });
    });

    DOM.btnGenerate.addEventListener('click', generateAndDownloadHtml);

    updateStepIndicator(1);
}

document.addEventListener('DOMContentLoaded', init);