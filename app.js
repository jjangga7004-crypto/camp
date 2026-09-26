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
(function(){
  const exam=Date.UTC(2026,10,18,15); // 11/19 00:00 KST
  const days=Math.ceil((exam-Date.now())/864e5);
  if(days<0){document.querySelectorAll('.dday,.promo .p0,#special .nowline').forEach(el=>el.remove());return;}
  document.querySelectorAll('[data-dday]').forEach(el=>el.textContent=days===0?'D-DAY':'D-'+days);
})();
