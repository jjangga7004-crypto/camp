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
