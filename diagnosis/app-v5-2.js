const SETTINGS_KEY='workEasyV5Settings';
const SESSION_KEY=(document.body.dataset.mode==='face'?'workEasyV5FaceSession':'workEasyV5PublicSession');
const MODE=document.body.dataset.mode||'public';
const DEFAULT_SETTINGS={business:'デジタル御用聞き',person:'担当者未定',website:'',line:'',email:'',phone:'',form:'',area:'岡山県内を中心に対応'};
const DEFAULT={screen:'welcome',selectedSymptoms:[],questionIndex:0,answers:{},future:'',company:'',sales:{decision:'不明',budget:'未確認',temperature:'中',memo:''},contact:{...DEFAULT_SETTINGS}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],clone=o=>JSON.parse(JSON.stringify(o));
function loadSettings(){try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch{return {...DEFAULT_SETTINGS}}}
function loadSession(){try{const x=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'{}');return {...clone(DEFAULT),...x,answers:{...(x.answers||{})},sales:{...DEFAULT.sales,...(x.sales||{})},contact:loadSettings()}}catch{return {...clone(DEFAULT),contact:loadSettings()}}}
let state=loadSession();
function save(){sessionStorage.setItem(SESSION_KEY,JSON.stringify({...state,contact:undefined}))}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(state.contact))}
function resetDiagnosis(){const contact=loadSettings();state={...clone(DEFAULT),contact};sessionStorage.removeItem(SESSION_KEY);save()}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}
function currentQuestion(){return QUESTIONS[state.questionIndex]}
function answeredQuestions(){return QUESTIONS.filter(q=>state.answers[q.key]!==undefined).length}
function progress(){if(!state.selectedSymptoms.length)return state.screen==='welcome'?0:10;return Math.min(100,20+Math.round(answeredQuestions()/QUESTIONS.length*70)+(state.future?10:0))}
function allowed(id){if(['welcome','symptoms'].includes(id))return true;if(id==='questions')return state.selectedSymptoms.length>=1;if(['thinking','result','future','contact'].includes(id))return answeredQuestions()===QUESTIONS.length;if(MODE==='face'&&['sales','settings','report'].includes(id))return answeredQuestions()===QUESTIONS.length;return false}
function show(id,{scroll=true}={}){if(!allowed(id)){toast('先に診断を進めてください');return}state.screen=id;save();$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));const titles={welcome:['小さな会社の「仕事詰まり」を見つけます','自分でも気づきにくい、時間・売上・社長依存の詰まりを診断します。'],symptoms:['最近起きていることを選んでください','専門用語ではなく、実際に起きている現象から診断します。'],questions:['会社の状態をもう少し確認します','答えにくい数字は不要です。近いものを選んでください。'],thinking:['隠れた原因を整理しています','表面の悩みだけでなく、根本の詰まりを分析しています。'],result:['診断結果','表面の悩み・隠れた原因・経営への影響まで整理しました。'],future:['改善後の優先目的','何を増やしたいかで、改善の順番を調整します。'],contact:['無料相談','必要な方だけ、実際の業務に当てはめて確認できます。'],sales:['営業担当メモ','対面営業版専用です。'],settings:['連絡先設定','顧客向け画面に表示する内容を設定します。'],report:['顧客向け診断書','PDFとして保存できます。']};$('#pageTitle').textContent=titles[id][0];$('#pageSub').textContent=titles[id][1];if(scroll)window.scrollTo({top:0,behavior:'smooth'})}
function toggleSymptom(id){const y=window.scrollY;if(state.selectedSymptoms.includes(id))state.selectedSymptoms=state.selectedSymptoms.filter(x=>x!==id);else{if(state.selectedSymptoms.length>=8){toast('最大8つまで選べます');return}state.selectedSymptoms=[...state.selectedSymptoms,id]}save();render();show('symptoms',{scroll:false});window.scrollTo(0,y)}
function selectAnswer(key,val){const y=window.scrollY;state.answers[key]=Number(val);save();render();show('questions',{scroll:false});window.scrollTo(0,y)}
function nextQuestion(){const q=currentQuestion();if(state.answers[q.key]===undefined){toast('1つ選んでください');return}if(state.questionIndex<QUESTIONS.length-1){state.questionIndex++;save();render();show('questions')}else{save();render();show('thinking');setTimeout(()=>{render();show('result')},1100)}}
function prevQuestion(){if(state.questionIndex===0){show('symptoms');return}state.questionIndex--;save();render();show('questions')}
function axisScores(){const raw={sales:0,owner:0,waste:0,customer:0,money:0,people:0},max={sales:0,owner:0,waste:0,customer:0,money:0,people:0};state.selectedSymptoms.forEach(id=>{const s=SYMPTOMS.find(x=>x.id===id);if(!s)return;Object.entries(s.axes).forEach(([a,v])=>{raw[a]+=v;max[a]+=4})});QUESTIONS.forEach(q=>{if(!q.axis)return;const v=state.answers[q.key]??0;raw[q.axis]+=v*2;max[q.axis]+=6});const freq=state.answers.frequency??0;Object.keys(raw).forEach(a=>{raw[a]+=freq;max[a]+=3});const scores={};Object.keys(raw).forEach(a=>scores[a]=Math.min(100,Math.round(raw[a]/Math.max(1,max[a])*100)));return scores}
function sortedAxes(){const scores=axisScores();return Object.keys(scores).map(id=>({id,...AXES[id],score:scores[id]})).sort((a,b)=>b.score-a.score)}
function diagnosis(){const axes=sortedAxes(),primary=axes[0],secondary=axes[1],type=DIAGNOSIS_TYPES[primary.id];return {axes,primary,secondary,type,confidence:primary.score-secondary.score>=18?'高い':primary.score-secondary.score>=8?'中':'要確認'}}
function symptomLabels(){return state.selectedSymptoms.map(id=>SYMPTOMS.find(x=>x.id===id)?.label).filter(Boolean)}
function riskLevel(score){return score>=70?['高','high']:score>=45?['中','mid']:['低','low']}
function proposalList(primary,secondary){const map={
 owner:['社長への確認が必要な場面を3種類に整理する','よくある判断をルール化し、社員が自分で進められるようにする','顧客・案件の状況を一覧にして、社長への確認回数を減らす','見積・返信・承認のテンプレートを作る','社長が見なくてもよい仕事を切り分ける'],
 customer:['問い合わせ・依頼を一か所で確認できるようにする','未対応・対応中・完了を一覧で見えるようにする','よくある質問への返信案をすぐ作れるようにする','担当者ごとの対応履歴を残す','進捗連絡を定型化し、お客様からの確認連絡を減らす'],
 sales:['問い合わせ後・見積後の次回連絡日を一覧にする','見込み客の状態を「新規・見積中・検討中・受注」で整理する','過去顧客への再提案候補を見つける','ホームページ・Googleマップの導線を見直す','見積提出までの時間を短くする'],
 waste:['同じ情報の二重入力をなくす','書類・写真・顧客情報の保存場所を統一する','毎回作り直す文章や書類をテンプレート化する','日報・報告書を音声や短いメモから作れるようにする','日程調整・確認・リマインドを一つの流れにする'],
 money:['請求予定・請求済み・入金済みを一覧にする','案件ごとの売上・原価・利益を見えるようにする','請求漏れと入金遅れを確認できるようにする','月末にまとめている作業を週単位へ分散する','赤字になりやすい案件の共通点を見つける'],
 people:['担当者が休んでも分かる手順書を作る','顧客・案件情報を個人の端末から共有場所へ移す','新人が最初に覚える仕事をチェックリスト化する','担当者ごとのやり方を一つの標準へまとめる','引き継ぎに必要な情報を案件ごとに残す']};
 const base=[...(map[primary.id]||[])];if(secondary&&secondary.score>=45){const extra=(map[secondary.id]||[]).find(x=>!base.includes(x));if(extra)base.push(extra)}return base.slice(0,6)}
function roadmap(primary){const plans={owner:['社長への確認が必要な仕事を1週間記録する','判断ルールと確認先を整理し、社員が進められる仕事を増やす','顧客・案件・承認状況を一覧化し、社長の確認時間を定点観測する'],customer:['問い合わせ経路と未対応案件を洗い出す','受付・担当・返信・完了の状態を一つの一覧で管理する','返信漏れと対応時間を確認し、自動通知や返信案作成を追加する'],sales:['最近3か月の問い合わせと見積を一覧にする','次回連絡日と受注確度を管理し、追客ルールを決める','ホームページ・Googleマップ・既存顧客への再提案をつなげる'],waste:['転記・探索・作り直しの時間を1週間記録する','保存場所・テンプレート・入力項目を統一する','繰り返し作業を自動化し、削減時間を測る'],money:['請求予定・請求済み・入金済みを一枚にまとめる','案件ごとに売上・原価・利益を見えるようにする','月次の数字確認を短時間で行えるダッシュボードへ広げる'],people:['休むと止まる仕事を3つ特定する','手順・判断基準・保存場所をチェックリスト化する','新人教育と引き継ぎで使い、属人化が減ったか確認する']};return plans[primary.id]}
function noNeed(primary){const low=primary.score<45;const freq=state.answers.frequency??0;if(low||freq<=1)return '現時点では高額なシステム導入は必要ありません。まずは保存場所・役割・手順をそろえ、実際にどれだけ時間が減るか確認する方が安全です。';if(state.answers.double_entry>=2||state.answers.search_time>=2)return 'いきなり大規模な基幹システムへ入れ替える必要はありません。まずは情報の置き場所と入力ルールを整え、小さな自動化から始めるべきです。';return '最初から全社導入する必要はありません。最優先の業務を1つだけ試し、30日後に効果を確認してから広げるのがおすすめです。'}
function contactBtn(label,url,kind=''){return url?`<a class="btn ${kind}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`:`<button class="btn ${kind} disabled">${label}<br><small>準備中</small></button>`}
