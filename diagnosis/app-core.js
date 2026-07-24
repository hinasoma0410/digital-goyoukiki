const PAINS=[
 ['invoice','請求書・領収書','請求や経費整理を後回しにしてしまう','事務'],
 ['estimate','見積書','案件ごとに作り直すのが面倒','営業'],
 ['reply','メール・LINE返信','営業時間外まで返信している','営業'],
 ['inquiry','問い合わせ対応','内容確認、返信、共有に時間がかかる','営業'],
 ['photos','写真整理','現場写真がスマホに散らばる','現場'],
 ['daily','日報・報告書','帰社後に思い出して書いている','現場'],
 ['documents','書類探し','必要な資料がすぐ見つからない','事務'],
 ['schedule','日程調整','候補日のやり取りが何往復もする','事務'],
 ['sns','SNS投稿','何を投稿するか毎回悩む','集客'],
 ['website','ホームページ','古い、問い合わせにつながらない','集客'],
 ['google','Googleマップ','情報や写真を放置している','集客'],
 ['busy','とにかく時間がない','代表者や一人の担当者に集中している','人・体制']
];
const SERVICES={
 invoice:{name:'請求・経費作業の簡略化',price:70000,desc:'請求書や領収書の入力、分類、保存方法をまとめて簡単にします。',free:'請求書と領収書の保存場所を1つに決める',self:'毎月使う請求書テンプレートを1つに統一する',support:'領収書整理と請求作業の流れを仕組み化する'},
 estimate:{name:'見積作成の仕組み化',price:80000,desc:'過去案件や定型文を使い、見積書のたたき台を早く作れるようにします。',free:'よく使う見積項目を10個書き出す',self:'過去見積から定型文をテンプレート化する',support:'見積入力ルールとひな形を整備する'},
 reply:{name:'返信文作成の仕組み化',price:50000,desc:'よくある返信を整理し、メールやLINEの返信時間を短くします。',free:'よくある質問を5つ整理する',self:'返信テンプレートを用意する',support:'問い合わせ内容ごとの返信フローを整える'},
 inquiry:{name:'問い合わせ対応の整理',price:150000,desc:'問い合わせの要約、分類、返信案、担当共有をまとめます。',free:'問い合わせ種類を3つに分ける',self:'受付から返信までの流れを紙に書き出す',support:'要約・分類・担当共有・返信案作成を仕組み化する'},
 photos:{name:'現場写真の整理',price:80000,desc:'案件ごとに写真をまとめ、探す時間を減らします。',free:'案件ごとのフォルダ名ルールを決める',self:'撮影後すぐに案件フォルダへ移す習慣をつくる',support:'写真の保存・共有ルールを整備する'},
 daily:{name:'日報・報告書の簡略化',price:70000,desc:'短いメモや音声から、日報のたたき台を作れるようにします。',free:'日報に書く項目を5つに絞る',self:'メモ形式で先に下書きを残す',support:'日報作成の流れを簡素化する'},
 documents:{name:'書類整理の仕組み化',price:50000,desc:'フォルダ名や保存場所を統一し、誰でも探せる状態にします。',free:'探すことが多い書類を3種類決める',self:'保存場所とファイル名ルールを決める',support:'書類整理ルールを全員で使える形にする'},
 schedule:{name:'予約・日程調整の簡略化',price:50000,desc:'候補日提示、予約、リマインドの手間を減らします。',free:'候補日の出し方を1パターンに統一する',self:'日程調整の定型文をつくる',support:'予約・確認・リマインドの流れを整える'},
 sns:{name:'SNS投稿の仕組み化',price:50000,desc:'投稿企画、文章、画像作成の流れを簡単にします。',free:'よく発信したい内容を3つ決める',self:'1週間分の投稿ネタを先に並べる',support:'投稿企画と制作フローを整える'},
 website:{name:'問い合わせ導線の改善',price:100000,desc:'強みや実績を整理し、問い合わせしやすいホームページやLPに改善します。',free:'問い合わせボタンが押しやすいか見直す',self:'実績と強みを1ページで見直す',support:'導線設計とページ改善を行う'},
 google:{name:'Googleビジネス改善',price:50000,desc:'地域検索で見つけてもらうための情報や写真を整えます。',free:'営業時間や基本情報を確認する',self:'最新写真を5枚追加する',support:'検索で見つかりやすい状態へ整える'},
 busy:{name:'仕事の棚卸しと省力化',price:50000,desc:'時間を奪っている仕事を整理し、減らせる作業を一つずつ見つけます。',free:'1週間で面倒だった仕事を書き出す',self:'自分しかできない仕事と他でもできる仕事を分ける',support:'優先順位と仕組み化の順番を整理する'}
};
const GENERAL_QUESTIONS=[
 {key:'freq', text:'選んだ仕事は、全体としてどのくらい発生しますか？', options:['毎日','週に数回','週1回','月に数回','月1回']},
 {key:'duration', text:'1回あたり、どのくらい時間がかかりますか？', options:['10分未満','10〜30分','30分〜1時間','1〜2時間','2時間以上']},
 {key:'owner', text:'主に誰が担当していますか？', options:['自分・代表者','事務担当','営業担当','複数人']},
 {key:'tools', text:'今の管理方法に近いものを選んでください', options:['紙・Excel・LINEが中心','複数のツールに分かれている','専用システムはあるが使いにくい','ある程度まとまっている']}
];
const DEFAULT_CONTACT={business:'デジタル御用聞き',person:'担当者未定',website:'',line:'',email:'',phone:'',form:'',area:'岡山県内を中心に対応'};
const MODE=document.body.dataset.mode||'public';
const STORAGE_KEY= MODE==='face' ? 'workEasyFaceV4' : 'workEasyPublicV4';
const DEFAULT={screen:'welcome',questionIndex:0,selectedPains:[],compare:{mostTime:'',mostPostpone:'',mostImpact:'',mostRepeat:''},general:{freq:'週に数回',duration:'30分〜1時間',owner:'自分・代表者',tools:'紙・Excel・LINEが中心'},future:'',company:'',sales:{decision:'不明',budget:'未確認',temperature:'中',memo:''},contact:{...DEFAULT_CONTACT}};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], clone=o=>JSON.parse(JSON.stringify(o));
function load(){
 try{
  const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  return {...clone(DEFAULT),...x,compare:{...DEFAULT.compare,...(x.compare||{})},general:{...DEFAULT.general,...(x.general||{})},sales:{...DEFAULT.sales,...(x.sales||{})},contact:{...DEFAULT.contact,...(x.contact||{})}};
 }catch{return clone(DEFAULT)}
}
let state=load();
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
function painById(id){return PAINS.find(x=>x[0]===id)}
function selectedPainObjects(){return state.selectedPains.map(painById).filter(Boolean)}
function progress(){
 let n=10;
 if(state.selectedPains.length) n=25;
 if(answeredCount()>0) n=25+Math.round(answeredCount()/totalQuestions()*55);
 if(state.future) n=95;
 return Math.min(100,n);
}
function totalQuestions(){return 4+GENERAL_QUESTIONS.length}
function answeredCount(){
 let c=0;
 Object.values(state.compare).forEach(v=>{if(v)c++});
 GENERAL_QUESTIONS.forEach(q=>{if(state.general[q.key])c++});
 return c;
}
function comparisonQuestions(){
 return [
  {key:'mostTime', text:'選んだ候補の中で、一番時間を使っているのはどれですか？'},
  {key:'mostPostpone', text:'選んだ候補の中で、一番後回しになりやすいのはどれですか？'},
  {key:'mostImpact', text:'選んだ候補の中で、遅れると売上やお客様への影響が大きいのはどれですか？'},
  {key:'mostRepeat', text:'選んだ候補の中で、同じ作業の繰り返しが多いのはどれですか？'}
 ];
}
function currentQuestion(){
 const idx=state.questionIndex;
 if(idx<4){
  const q=comparisonQuestions()[idx];
  return {...q,type:'compare',options:selectedPainObjects().map(x=>({value:x[0],label:x[1],desc:x[2]}))};
 }
 const g=GENERAL_QUESTIONS[idx-4];
 return {...g,type:'general',options:g.options.map(x=>({value:x,label:x,desc:''}))};
}
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
 const titles={welcome:['仕事を少しラクにする方法を探します',MODE==='public'?'約3分。難しい専門用語は使いません。':'営業担当がお客様と一緒に使う診断版です。'],pain:['当てはまるものを最大3つ選んでください','最初に1つへ絞らず、候補を比べて優先順位を出します。'],question:['比較しながら診断します','1問ずつ進むので、考え込みすぎなくて大丈夫です。'],thinking:['診断しています','比較結果をもとに、優先順位を整理しています。'],result:['診断結果','最優先・次点・後回しの順に整理しました。'],future:['空いた時間の使い道','改善後の未来を選ぶと、提案の方向性がより明確になります。'],contact:['無料相談','必要な方だけ、次の相談へ進めます。'],sales:['営業担当メモ','対面営業版専用です。'],settings:['連絡先設定','後から差し替えできるようにしています。'],report:['顧客向け診断書','PDFとして保存できます。']};
 $('#pageTitle').textContent=titles[id][0]; $('#pageSub').textContent=titles[id][1];
 if(opts.scroll!==false) window.scrollTo({top:0,behavior:'smooth'});
}
function togglePain(id){
 const y=window.scrollY;
 if(state.selectedPains.includes(id)) state.selectedPains=state.selectedPains.filter(x=>x!==id);
 else {if(state.selectedPains.length>=3){toast('最大3つまで選べます');return}state.selectedPains=[...state.selectedPains,id]}
 Object.keys(state.compare).forEach(k=>{if(state.compare[k]&&!state.selectedPains.includes(state.compare[k]))state.compare[k]=''});
 save();render();show('pain',{scroll:false});window.scrollTo(0,y);
}
function setAnswer(key,val,type){const y=window.scrollY;if(type==='compare')state.compare[key]=val;else state.general[key]=val;save();render();show('question',{scroll:false});window.scrollTo(0,y)}
function nextQuestion(){const q=currentQuestion();const answered=q.type==='compare'?!!state.compare[q.key]:!!state.general[q.key];if(!answered){toast('1つ選んでください');return}if(state.questionIndex<totalQuestions()-1){state.questionIndex++;save();render();show('question')}else{save();render();show('thinking');setTimeout(()=>{render();show('result')},1200)}}
function prevQuestion(){if(state.questionIndex<=0){show('pain');return}state.questionIndex--;save();render();show('question')}
function ownerMultiplier(){return {'自分・代表者':1,'事務担当':1,'営業担当':1,'複数人':2}[state.general.owner]||1}
function monthlyHours(){const f={'毎日':22,'週に数回':12,'週1回':4,'月に数回':3,'月1回':1}[state.general.freq]||12;const d={'10分未満':8,'10〜30分':20,'30分〜1時間':45,'1〜2時間':90,'2時間以上':150}[state.general.duration]||45;return Math.max(1,Math.round(f*d*ownerMultiplier()/60))}
function possibleSavedHours(){let rate=.35;if(state.compare.mostRepeat)rate+=.12;if(state.general.tools==='紙・Excel・LINEが中心')rate+=.15;if(state.general.tools==='複数のツールに分かれている')rate+=.1;if(state.general.owner==='自分・代表者')rate+=.08;return Math.max(1,Math.round(monthlyHours()*Math.min(.75,rate)))}
function rankResults(){
 const items=state.selectedPains.map(id=>({id,name:painById(id)?.[1]||id,desc:painById(id)?.[2]||'',category:painById(id)?.[3]||'',score:0,reasons:[]}));
 const add=(val,points,reason)=>{const it=items.find(x=>x.id===val);if(it){it.score+=points;it.reasons.push(reason)}};
 add(state.compare.mostTime,28,'時間の負担が大きい');add(state.compare.mostPostpone,18,'後回しになりやすい');add(state.compare.mostImpact,30,'売上・顧客への影響が大きい');add(state.compare.mostRepeat,14,'繰り返しが多く仕組み化しやすい');
 items.forEach(it=>{if(state.general.freq==='毎日')it.score+=6;else if(state.general.freq==='週に数回')it.score+=4;else if(state.general.freq==='週1回')it.score+=2;if(state.general.duration==='1〜2時間'||state.general.duration==='2時間以上')it.score+=6;else if(state.general.duration==='30分〜1時間')it.score+=3;if(state.general.tools==='紙・Excel・LINEが中心')it.score+=6;else if(state.general.tools==='複数のツールに分かれている')it.score+=4;if(state.general.owner==='自分・代表者')it.score+=4});
 items.sort((a,b)=>b.score-a.score);return items;
}
function confidence(rank){if(rank.length<=1)return '中';const diff=(rank[0].score||0)-(rank[1].score||0);return diff>=18?'高':diff>=8?'中':'やや低い'}
function firstStepFor(id){const s=SERVICES[id];return s?{free:s.free,self:s.self,support:s.support}:{free:'困っている作業を書き出す',self:'手順を簡単にまとめる',support:'一緒に改善手順を整理する'}}
function contactBtn(label,url,kind=''){return url?`<a class="btn ${kind}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`:`<button class="btn ${kind} disabled">${label}<br><small>準備中</small></button>`}
function salesScript(top){return `【入り方】\n今日はシステムの営業ではなく、普段の仕事の中で一番もったいない時間を一緒に確認します。\n\n【診断の結論】\n最優先で改善する仕事は「${top.name}」です。\n理由は、${top.reasons.join('、')}からです。\n\n【数字で伝える】\n今の回答では、関連業務に月約${monthlyHours()}時間使っている可能性があります。\n全部を変えるのではなく、まず月約${possibleSavedHours()}時間減らせるかを小さく試します。\n\n【次の一歩】\n最初におすすめするのは「${SERVICES[top.id].name}」です。\n無料でできる改善 → 自社でできる改善 → 支援でできる改善の順に話します。\n\n【次に聞くこと】\n実際の書類や画面を一つ見せてもらい、月の件数、例外対応、担当者、開始希望時期を確認します。`}
