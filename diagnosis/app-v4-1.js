
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

const CAPABILITIES={
 invoice:['領収書を撮影して保存先をそろえる','請求書の入力漏れや送付忘れをチェックする','毎月の請求状況を一覧で確認する','請求書や領収書を取引先・月別で探せるようにする','経費集計のたたき台を短時間で作る'],
 estimate:['過去の見積項目や単価を再利用する','項目を選ぶだけで見積書のたたき台を作る','よく使う説明文や注意事項を自動で入れる','見積書をPDF化してすぐ送れるようにする','顧客ごとの見積履歴や修正履歴を残す'],
 reply:['よくある質問への返信案をすぐ作る','メールやLINEの文章を相手に合わせて整える','営業時間外の問い合わせを翌営業日に整理する','返信漏れがないよう対応状況を一覧にする','担当者ごとに使える返信テンプレートを共有する'],
 inquiry:['問い合わせ内容を自動で要約・分類する','内容に応じた返信案をすぐ作る','担当者へ自動で振り分け・共有する','未対応・対応中・完了を一覧で確認する','LINE・メール・フォームの履歴をまとめて管理する'],
 photos:['現場名や顧客名ごとに写真を整理する','工事前・工事中・完成後で分類する','撮影日や担当者から必要な写真を探す','顧客へ送る写真をすぐ選べるようにする','写真付き報告書のたたき台を作る'],
 daily:['音声や短いメモから日報の下書きを作る','日報の入力項目を統一する','写真付きの日報や作業報告を作る','未提出の日報を確認する','月ごとの作業内容や課題を一覧にする'],
 documents:['保存場所とファイル名を統一する','書類を顧客名・案件名・日付で検索する','最新版がどれか分かるようにする','社内で同じ書類を共有できるようにする','よく使う資料へすぐアクセスできる一覧を作る'],
 schedule:['空いている候補日を簡単に提示する','予約受付と日程確定を一つの流れにする','前日や当日のリマインドを送る','担当者ごとの予定を共有する','日程変更やキャンセルの履歴を残す'],
 sns:['投稿テーマとネタを先に整理する','文章や見出しのたたき台を作る','投稿画像の制作手順を統一する','1週間・1か月分の投稿予定を管理する','過去投稿を再利用して作成時間を減らす'],
 website:['強み・実績・料金を分かりやすく整理する','スマートフォンで見やすいページにする','LINEや問い合わせフォームへ迷わず進める導線を作る','施工事例やお客様の声を追加する','地域名やサービス名で見つけてもらいやすくする'],
 google:['営業時間・住所・サービス情報を正しく整える','最新写真や施工事例を追加する','口コミへの返信文を作りやすくする','投稿内容を定期的に更新する','地域検索から電話・経路案内・問い合わせにつなげる'],
 busy:['1週間の仕事を一覧にして時間の使い方を見える化する','自分しかできない仕事と任せられる仕事を分ける','繰り返し作業をテンプレート化する','依頼・確認・進捗を一か所で管理する','優先順位と改善する順番を整理する']
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
