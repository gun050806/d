// 달력: 한 달 단위로 날짜를 보여 주고, 일정이 있는 날에 점을 찍어요.
// items 예: [{ date: '2026-11-12', kind: '시험', mine: false }]
// 점 색: 시험 = 빨강, 그 밖의 학원 일정 = 검정, 내 일정 = 회색 테두리

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const pad = (n) => String(n).padStart(2, '0');
const ymd = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function createCalendar(el, { selected, onSelect }) {
  let [y, m] = selected.split('-').map(Number);
  m -= 1;
  let sel = selected;
  let items = [];

  function marks(date) {
    const day = items.filter((i) => i.date === date);
    const out = [];
    if (day.some((i) => !i.mine && i.kind === '시험')) out.push('exam');
    if (day.some((i) => !i.mine && i.kind !== '시험')) out.push('academy');
    if (day.some((i) => i.mine)) out.push('mine');
    return { out, count: day.length };
  }

  function render() {
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const now = new Date();
    const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());

    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span class="cal__blank"></span>';
    for (let d = 1; d <= days; d++) {
      const date = ymd(y, m, d);
      const { out, count } = marks(date);
      const cls = ['cal__day'];
      if (date === todayStr) cls.push('is-today');
      if (date === sel) cls.push('is-selected');
      const label = `${m + 1}월 ${d}일${count ? `, 일정 ${count}개` : ''}`;
      cells += `<button type="button" class="${cls.join(' ')}" data-date="${date}" aria-label="${label}" aria-pressed="${date === sel}">
        <span class="cal__num">${d}</span>
        <span class="cal__marks">${out.map((k) => `<i class="cal__mark cal__mark--${k}"></i>`).join('')}</span>
      </button>`;
    }

    el.innerHTML = `
      <div class="cal__head">
        <button type="button" class="cal__nav" data-move="-1" aria-label="이전 달">‹</button>
        <strong>${y}년 ${m + 1}월</strong>
        <button type="button" class="cal__nav" data-move="1" aria-label="다음 달">›</button>
      </div>
      <div class="cal__grid">
        ${WEEK.map((w) => `<span class="cal__week">${w}</span>`).join('')}
        ${cells}
      </div>
      <p class="cal__legend">
        <span><i class="cal__mark cal__mark--exam"></i>시험</span>
        <span><i class="cal__mark cal__mark--academy"></i>학원 일정</span>
        <span><i class="cal__mark cal__mark--mine"></i>내 일정</span>
      </p>`;

    el.querySelectorAll('[data-move]').forEach((b) => b.addEventListener('click', () => {
      m += Number(b.dataset.move);
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      render();
    }));
    el.querySelectorAll('[data-date]').forEach((b) => b.addEventListener('click', () => {
      sel = b.dataset.date;
      render();
      onSelect(sel);
    }));
  }

  render();
  return {
    setItems(list) { items = list; render(); },
    get selected() { return sel; }
  };
}

// '2026-11-12' → '11월 12일 (목)'
export function dayLabel(date) {
  const [yy, mm, dd] = date.split('-').map(Number);
  return `${mm}월 ${dd}일 (${WEEK[new Date(yy, mm - 1, dd).getDay()]})`;
}

// 학원 일정이 이 학생에게 보이는지 (전체 또는 내 학교·학년)
export function isForStudent(ev, profile) {
  return (ev.school === '전체' || ev.school === profile.school)
    && (ev.grade === '전체' || ev.grade === profile.grade);
}

// 일정 대상 표시: '전체', '이솔고 고1', '고2' 등
export function targetLabel(ev) {
  const parts = [ev.school, ev.grade].filter((v) => v && v !== '전체');
  return parts.length ? parts.join(' ') : '전체';
}
