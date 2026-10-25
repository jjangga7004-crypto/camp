// nav scrolled
const nav=document.getElementById('nav');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>10)},{passive:true});
// mobile menu
const sheet=document.getElementById('msheet');
document.getElementById('hamb').onclick=()=>sheet.classList.add('open');
document.getElementById('mclose').onclick=()=>sheet.classList.remove('open');
sheet.querySelectorAll('a').forEach(a=>a.onclick=()=>sheet.classList.remove('open'));
sheet.onclick=e=>{if(e.target===sheet)sheet.classList.remove('open')};
// program tabs
const ptabs=document.querySelectorAll('.tabbar .tab');
function openTab(id){
  ptabs.forEach(t=>t.classList.toggle('active',t.dataset.t===id));
  document.querySelectorAll('.tpanel').forEach(p=>p.classList.toggle('active',p.id===id));
}
ptabs.forEach(t=>t.onclick=()=>openTab(t.dataset.t));
document.querySelectorAll('a[href="#loop"],a[href="#special"],a[href="#tutor"]').forEach(a=>{
  a.addEventListener('click',()=>openTab(a.getAttribute('href').slice(1)));
});
// open tab from URL hash (program page deep-link)
if(location.hash){
  const id=location.hash.slice(1);
  if(document.getElementById(id) && document.getElementById(id).classList.contains('tpanel')){ openTab(id); const pg=document.getElementById('programs'); if(pg) addEventListener('load',()=>setTimeout(()=>pg.scrollIntoView({behavior:'instant'}),0)); }
}

// 수능 D-day (2026-11-19, KST). 수능 당일이 지나면 시즌 문구를 숨긴다.
// 다음 해엔 SUNEUNG_DATE 하나만 바꾸면 D-N 배지·"수능 N일 전" 문구가 전부 따라온다.
const SUNEUNG_DATE='2026-11-19';
(function(){
  const [y,m,d]=SUNEUNG_DATE.split('-').map(Number);
  const exam=Date.UTC(y,m-1,d-1,15); // 수능일 00:00 KST (=전날 15:00 UTC)
  const days=Math.ceil((exam-Date.now())/864e5);
  // 수능이 지나면 시즌 문구를 걷어낸다. [data-dday-after] 요소는 지우지 않고 시즌 중립 문구로 교체한다
  // (헤드라인처럼 지워버리면 안 되는 자리를 위한 것).
  if(days<0){
    document.querySelectorAll('[data-dday-after]').forEach(el=>{el.innerHTML=el.dataset.ddayAfter});
    document.querySelectorAll('.dday,.promo .p0,#special .nowline,[data-dday-phrase]').forEach(el=>el.remove());
    return;
  }
  document.querySelectorAll('[data-dday]').forEach(el=>el.textContent=days===0?'D-DAY':'D-'+days);
  document.querySelectorAll('[data-dday-phrase]').forEach(el=>el.textContent=days===0?'수능 당일':'수능 '+days+'일 전');
  // 헤드라인 안의 '남은 일수' 숫자. 날짜를 하드코딩하지 않고 SUNEUNG_DATE에서 매일 자동으로 줄어든다.
  // 수능 당일(0일)은 "0일만 해도 다르다"가 되어버리므로 숫자를 채우지 않고 휴식 문구로 교체한다.
  if(days===0){
    document.querySelectorAll('[data-dday-after]').forEach(el=>{el.innerHTML=el.dataset.ddayAfter});
  }else{
    document.querySelectorAll('[data-dday-num]').forEach(el=>el.textContent=days);
  }
})();

/* STATS-BEGIN */
// 누적 모의고사 응시 횟수(재시험 포함). STAT_BASE_DATE 까지는 학생 점수 시트의 실측이고,
// 그 뒤 수업일은 요일별 하루 평균으로 자동 가산한 추산이다. 새 집계를 받으면 아래 상수만 고친다.
const STAT_BASE_DATE='2026-10-24';  // 실측 기준일(이 날 수업까지)
const STAT_BASE_YEAR=5885;          // 올해 시즌 4/18~기준일 누적(재시험 포함, 점수가 적힌 칸 수)
const STAT_LAST_YEAR=8101;          // 작년 시즌 전체(재시험 포함, 같은 방식으로 센 값)
const STAT_STUDENTS=122;            // 올해 점수 시트에 이름이 오른 학생 수
const STAT_RATE={0:141,3:50,6:192}; // 일·수·토 수업일 하루 평균(2026-08-29~10-24 실측)
const STAT_END='2026-11-08';        // 30주차 마지막 수업일 — 이후엔 더 늘리지 않는다
function statCalc(nowMs){
  const kst=new Date(nowMs+9*36e5);
  const today=Date.UTC(kst.getUTCFullYear(),kst.getUTCMonth(),kst.getUTCDate());
  const ymd=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d);};
  const end=Math.min(ymd(STAT_END),today-864e5); // 끝난 수업일만 센다(오늘은 제외)
  let add=0;
  for(let t=ymd(STAT_BASE_DATE)+864e5;t<=end;t+=864e5) add+=STAT_RATE[new Date(t).getUTCDay()]||0;
  const year=STAT_BASE_YEAR+add;
  return {
    year:Math.round(year/10)*10,
    five:Math.round((STAT_LAST_YEAR+year)/2*5/100)*100,
    per:Math.round(year/STAT_STUDENTS),
    running:today<=ymd(STAT_END)
  };
}
(function(){
  const els=document.querySelectorAll('[data-stat]');
  if(!els.length) return;
  const v=statCalc(Date.now());
  const fmt=n=>n.toLocaleString('ko-KR');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [, bm, bd]=STAT_BASE_DATE.split('-').map(Number);
  document.querySelectorAll('[data-stat-date]').forEach(el=>el.textContent=bm+'월 '+bd+'일');
  if(!v.running) document.querySelectorAll('[data-stat-note]').forEach(el=>{el.textContent=el.dataset.statNoteDone});
  els.forEach(el=>{
    const to=v[el.dataset.stat]; if(to==null) return;
    el.textContent=fmt(to);
    if(reduce||!('IntersectionObserver' in window)) return;
    const io=new IntersectionObserver(es=>{
      if(!es[0].isIntersecting) return; io.disconnect();
      const t0=performance.now(),dur=1100;
      (function tick(t){
        const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
        el.textContent=p<1?fmt(Math.round(to*e)):fmt(to);
        if(p<1) requestAnimationFrame(tick);
      })(t0);
    },{threshold:.4});
    io.observe(el);
  });
})();
/* STATS-END */
