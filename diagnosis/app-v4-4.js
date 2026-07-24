function bind(){
 $$('[data-view]').forEach(el=>el.onclick=()=>show(el.dataset.view));
 $$('[data-go]').forEach(el=>el.onclick=()=>show(el.dataset.go));
 const start=$('[data-action="start"]');if(start)start.onclick=()=>show('pain');
 $$('[data-pain]').forEach(el=>el.onclick=()=>togglePain(el.dataset.pain));
 const painNext=$('[data-action="pain-next"]');if(painNext)painNext.onclick=()=>{if(!state.selectedPains.length){toast('1つ以上選んでください');return}state.questionIndex=0;save();render();show('question')};
 $$('[data-answer]').forEach(el=>el.onclick=()=>setAnswer(el.dataset.answer,el.dataset.value,el.dataset.answerType));
 const qNext=$('[data-action="question-next"]');if(qNext)qNext.onclick=nextQuestion;
 const qBack=$('[data-action="question-back"]');if(qBack)qBack.onclick=prevQuestion;
 $$('[data-future]').forEach(el=>el.onclick=()=>{const y=window.scrollY;state.future=el.dataset.future;save();render();show('future',{scroll:false});window.scrollTo(0,y)});
 const decision=$('#decision');if(decision)decision.onchange=()=>{state.sales.decision=decision.value;save()};
 const budget=$('#budget');if(budget)budget.onchange=()=>{state.sales.budget=budget.value;save()};
 const temperature=$('#temperature');if(temperature)temperature.onchange=()=>{state.sales.temperature=temperature.value;save()};
 const companyName=$('#companyName');if(companyName)companyName.onchange=()=>{state.company=companyName.value;save()};
 const salesMemo=$('#salesMemo');if(salesMemo)salesMemo.onchange=()=>{state.sales.memo=salesMemo.value;save()};
 $$('[data-contact]').forEach(el=>el.onchange=()=>{state.contact[el.dataset.contact]=el.value});
 const saveSettings=$('#saveSettings');if(saveSettings)saveSettings.onclick=()=>{$$('[data-contact]').forEach(el=>state.contact[el.dataset.contact]=el.value);save();toast('設定を保存しました');render();show('settings',{scroll:false})};
 const copyScript=$('#copyScript'),scriptText=$('#scriptText');if(copyScript&&scriptText)copyScript.onclick=async()=>{try{await navigator.clipboard.writeText(scriptText.textContent);toast('コピーしました')}catch(e){toast('コピーできませんでした')}};
 $('#restartBtn').onclick=()=>{if(confirm('診断内容を最初からやり直しますか？')){const contact=clone(state.contact),company=state.company;state=clone(DEFAULT);state.contact=contact;state.company=company;save();render();show('welcome');toast('診断内容をリセットしました')}};
}
render();show(state.screen&&allowed(state.screen)?state.screen:'welcome',{scroll:false});
