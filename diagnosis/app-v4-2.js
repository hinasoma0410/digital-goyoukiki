function allowed(id){
 if(['welcome','pain'].includes(id)) return true;
 if(id==='question') return state.selectedPains.length>=1;
 if(id==='thinking') return answeredCount()>=totalQuestions();
 if(['result','future','contact'].includes(id)) return answeredCount()>=totalQuestions();
 if(MODE==='face' && ['sales','settings','report'].includes(id)) return answeredCount()>=totalQuestions();
 return false;
}
function show(id, opts={scroll:true}){
 if(!allowed(id)){toast('先に診断を進めてください');return}
 state.screen=id; save();
 $$('.view').forEach(v=>v.classList.toggle('active', v.id===id));
 $$('nav button').forEach(b=>b.classList.toggle('active', b.dataset.view===id));
 const titles={
  welcome:['仕事を少しラクにする方法を探します', MODE==='public'?'約3分。難しい専門用語は使いません。':'営業担当がお客様と一緒に使う診断版です。'],
  pain:['当てはまるものを最大3つ選んでください','最初に1つへ絞らず、候補を比べて優先順位を出します。'],
  question:['比較しながら診断します','1問ずつ進むので、考え込みすぎなくて大丈夫です。'],
  thinking:['診断しています','比較結果をもとに、優先順位を整理しています。'],
  result:['診断結果','最優先・次点・後回しの順に整理しました。'],
  future:['空いた時間の使い道','改善後の未来を選ぶと、提案の方向性がより明確になります。'],
  contact:['無料相談','必要な方だけ、次の相談へ進めます。'],
  sales:['営業担当メモ','対面営業版専用です。'],
  settings:['連絡先設定','後から差し替えできるようにしています。'],
  report:['顧客向け診断書','PDFとして保存できます。']
 };
 $('#pageTitle').textContent=titles[id][0]; $('#pageSub').textContent=titles[id][1];
 if(opts.scroll!==false) window.scrollTo({top:0,behavior:'smooth'});
}
function togglePain(id){
 const y=window.scrollY;
 if(state.selectedPains.includes(id)) state.selectedPains=state.selectedPains.filter(x=>x!==id);
 else {
  if(state.selectedPains.length>=3){toast('最大3つまで選べます'); return}
  state.selectedPains=[...state.selectedPains,id];
 }
 Object.keys(state.compare).forEach(k=>{ if(state.compare[k] && !state.selectedPains.includes(state.compare[k])) state.compare[k]=''; });
 save(); render(); show('pain',{scroll:false}); window.scrollTo(0,y);
}
function setAnswer(key,val,type){
 const y=window.scrollY;
 if(type==='compare') state.compare[key]=val; else state.general[key]=val;
 save(); render(); show('question',{scroll:false}); window.scrollTo(0,y);
}
function nextQuestion(){
 const q=currentQuestion();
 const answered = q.type==='compare' ? !!state.compare[q.key] : !!state.general[q.key];
 if(!answered){toast('1つ選んでください');return}
 if(state.questionIndex < totalQuestions()-1){state.questionIndex++; save(); render(); show('question');}
 else {save(); render(); show('thinking'); setTimeout(()=>{render(); show('result');}, 1200)}
}
function prevQuestion(){
 if(state.questionIndex<=0){show('pain');return}
 state.questionIndex--; save(); render(); show('question');
}
function ownerMultiplier(){return {'自分・代表者':1,'事務担当':1,'営業担当':1,'複数人':2}[state.general.owner]||1}
function monthlyHours(){const f={'毎日':22,'週に数回':12,'週1回':4,'月に数回':3,'月1回':1}[state.general.freq]||12; const d={'10分未満':8,'10〜30分':20,'30分〜1時間':45,'1〜2時間':90,'2時間以上':150}[state.general.duration]||45; return Math.max(1,Math.round(f*d*ownerMultiplier()/60))}
function possibleSavedHours(){let rate=.35; if(state.compare.mostRepeat) rate+=.12; if(state.general.tools==='紙・Excel・LINEが中心') rate+=.15; if(state.general.tools==='複数のツールに分かれている') rate+=.1; if(state.general.owner==='自分・代表者') rate+=.08; return Math.max(1,Math.round(monthlyHours()*Math.min(.75,rate)))}
function rankResults(){
 const items=state.selectedPains.map(id=>({id,name:painById(id)?.[1]||id,desc:painById(id)?.[2]||'',category:painById(id)?.[3]||'',score:0,reasons:[]}));
 const add=(key,val,points,reason)=>{const it=items.find(x=>x.id===val); if(it){it.score+=points; it.reasons.push(reason)}};
 add('mostTime',state.compare.mostTime,28,'時間の負担が大きい');
 add('mostPostpone',state.compare.mostPostpone,18,'後回しになりやすい');
 add('mostImpact',state.compare.mostImpact,30,'売上・顧客への影響が大きい');
 add('mostRepeat',state.compare.mostRepeat,14,'繰り返しが多く仕組み化しやすい');
 items.forEach(it=>{
  if(state.general.freq==='毎日') it.score+=6; else if(state.general.freq==='週に数回') it.score+=4; else if(state.general.freq==='週1回') it.score+=2;
  if(state.general.duration==='1〜2時間' || state.general.duration==='2時間以上') it.score+=6; else if(state.general.duration==='30分〜1時間') it.score+=3;
  if(state.general.tools==='紙・Excel・LINEが中心') it.score+=6; else if(state.general.tools==='複数のツールに分かれている') it.score+=4;
  if(state.general.owner==='自分・代表者') it.score+=4;
 });
 items.sort((a,b)=>b.score-a.score);
 return items;
}
function confidence(rank){ if(rank.length<=1) return '中'; const diff=(rank[0].score||0)-(rank[1].score||0); return diff>=18 ? '高' : diff>=8 ? '中' : 'やや低い'; }
function capabilityProposal(top){
 const base=[...(CAPABILITIES[top?.id]||[])];
 if(!top) return [];
 const extras=[];
 if(state.general.owner==='自分・代表者') extras.push('代表者に集中している作業を、他の人でも進められる形にする');
 if(state.general.owner==='複数人') extras.push('担当者ごとの進捗や対応状況を一つの画面で共有する');
 if(state.general.tools==='紙・Excel・LINEが中心') extras.push('紙・Excel・LINEに分かれた情報を、探しやすい形へまとめる');
 if(state.general.tools==='複数のツールに分かれている') extras.push('複数ツールへの二重入力や転記を減らす');
 if(state.general.tools==='専用システムはあるが使いにくい') extras.push('今のシステムを全部捨てず、使いにくい部分だけ補助する');
 if(state.general.freq==='毎日' || state.general.freq==='週に数回') extras.push('毎日・毎週発生する作業を、定型化して処理時間を短くする');
 return [...new Set([...base,...extras])].slice(0,6);
}
function firstStepFor(id){const s=SERVICES[id]; return s ? {free:s.free,self:s.self,support:s.support} : {free:'困っている作業を書き出す',self:'手順を簡単にまとめる',support:'一緒に改善手順を整理する'} }
function contactBtn(label,url,kind=''){ return url ? `<a class="btn ${kind}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : `<button class="btn ${kind} disabled">${label}<br><small>準備中</small></button>`; }
function salesScript(top){
 return `【入り方】\n今日はシステムの営業ではなく、普段の仕事の中で一番もったいない時間を一緒に確認します。\n\n【診断の結論】\n最優先で改善する仕事は「${top.name}」です。\n理由は、${top.reasons.join('、')}からです。\n\n【数字で伝える】\n今の回答では、関連業務に月約${monthlyHours()}時間使っている可能性があります。\n全部を変えるのではなく、まず月約${possibleSavedHours()}時間減らせるかを小さく試します。\n\n【次の一歩】\n最初におすすめするのは「${SERVICES[top.id].name}」です。\n無料でできる改善 → 自社でできる改善 → 支援でできる改善の順に話します。\n\n【次に聞くこと】\n実際の書類や画面を一つ見せてもらい、月の件数、例外対応、担当者、開始希望時期を確認します。`; }
