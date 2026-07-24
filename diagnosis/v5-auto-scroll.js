(()=>{
 const scrollActiveCard=()=>{
  const active=document.querySelector('.view.active');
  if(!active)return;
  const target=active.querySelector('.card')||active;
  const top=target.getBoundingClientRect().top+window.scrollY-12;
  window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
 };
 document.addEventListener('click',e=>{
  const next=e.target.closest('[data-action="question-next"],[data-action="symptom-next"],[data-go="future"],[data-go="contact"]');
  if(!next)return;
  setTimeout(scrollActiveCard,40);
  setTimeout(scrollActiveCard,160);
  setTimeout(scrollActiveCard,1250);
 });
})();