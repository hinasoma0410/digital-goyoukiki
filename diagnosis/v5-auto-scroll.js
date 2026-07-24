(()=>{
 const mobile=()=>window.matchMedia('(max-width: 700px)').matches;
 const visibleTop=()=>window.visualViewport?.offsetTop||0;
 const desiredGap=()=>mobile()?150:24;

 const scrollActiveCard=()=>{
  const active=document.querySelector('.view.active');
  if(!active)return;
  const target=active.querySelector('.card')||active;
  const rect=target.getBoundingClientRect();
  const top=rect.top+window.scrollY-visibleTop()-desiredGap();
  window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
 };

 const moveToNextScreen=()=>{
  requestAnimationFrame(()=>requestAnimationFrame(scrollActiveCard));
  setTimeout(scrollActiveCard,120);
  setTimeout(scrollActiveCard,420);
 };

 document.addEventListener('click',e=>{
  const next=e.target.closest('[data-action="question-next"],[data-action="symptom-next"],[data-go="future"],[data-go="contact"]');
  if(!next)return;
  moveToNextScreen();
 });
})();