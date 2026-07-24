const PROPOSAL_CAPABILITIES={
 invoice:['領収書を撮影して保存先をそろえる','請求書の入力漏れや送付忘れを確認する','毎月の請求状況を一覧で確認する','取引先・月別に請求書や領収書を探せるようにする','経費集計のたたき台を短時間で作る'],
 estimate:['過去の見積項目や単価を再利用する','項目を選ぶだけで見積書のたたき台を作る','よく使う説明文や注意事項を自動で入れる','見積書をPDFにしてすぐ送れるようにする','顧客ごとの見積履歴や修正履歴を残す'],
 reply:['よくある質問への返信案をすぐ作る','メールやLINEの文章を相手に合わせて整える','営業時間外の問い合わせを翌営業日に整理する','返信漏れがないよう対応状況を一覧にする','担当者ごとに返信テンプレートを共有する'],
 inquiry:['問い合わせ内容を要約・分類する','内容に応じた返信案をすぐ作る','担当者へ自動で振り分け・共有する','未対応・対応中・完了を一覧で確認する','LINE・メール・フォームの履歴をまとめる'],
 photos:['現場名や顧客名ごとに写真を整理する','工事前・工事中・完成後で分類する','撮影日や担当者から必要な写真を探す','顧客へ送る写真をすぐ選べるようにする','写真付き報告書のたたき台を作る'],
 daily:['音声や短いメモから日報の下書きを作る','日報の入力項目を統一する','写真付きの日報や作業報告を作る','未提出の日報を確認する','月ごとの作業内容や課題を一覧にする'],
 documents:['保存場所とファイル名を統一する','顧客名・案件名・日付で書類を探す','最新版がどれか分かるようにする','社内で同じ書類を共有できるようにする','よく使う資料の一覧を作る'],
 schedule:['空いている候補日を簡単に提示する','予約受付と日程確定を一つの流れにする','前日や当日のリマインドを送る','担当者ごとの予定を共有する','日程変更やキャンセルの履歴を残す'],
 sns:['投稿テーマとネタを先に整理する','文章や見出しのたたき台を作る','投稿画像の制作手順を統一する','1週間・1か月分の投稿予定を管理する','過去投稿を再利用して作成時間を減らす'],
 website:['強み・実績・料金を分かりやすく整理する','スマートフォンで見やすいページにする','LINEや問い合わせフォームへ進みやすい導線を作る','施工事例やお客様の声を追加する','地域名やサービス名で見つけてもらいやすくする'],
 google:['営業時間・住所・サービス情報を正しく整える','最新写真や施工事例を追加する','口コミへの返信文を作りやすくする','投稿内容を定期的に更新する','地域検索から電話・経路案内・問い合わせにつなげる'],
 busy:['1週間の仕事を一覧にして時間の使い方を見える化する','自分しかできない仕事と任せられる仕事を分ける','繰り返し作業をテンプレート化する','依頼・確認・進捗を一か所で管理する','優先順位と改善する順番を整理する']
};

function proposalItems(){
 const items=[...(PROPOSAL_CAPABILITIES[state.pain]||[])];
 const a=state.answers||{};
 if(a.person==='自分・代表者')items.push('代表者に集中している作業を、他の人でも進められる形にする');
 if(a.person==='複数人')items.push('担当者ごとの進捗や対応状況を一つの画面で共有する');
 if(a.repeat==='毎回ほぼ同じ')items.unshift('繰り返し作業を定型化し、毎回ゼロから考える時間を減らす');
 if(a.amount==='毎日'||a.amount==='週に数回')items.push('毎日・毎週発生する作業を、決まった流れで処理できるようにする');
 return [...new Set(items)].slice(0,6);
}

function proposalMarkup(){
 const items=proposalItems();
 if(!items.length)return '';
 return `<div class="card panel proposal-capabilities" style="margin-top:13px">
  <div class="head"><div><h3>回答内容から、こんなことができます</h3><p class="sub">今の作業内容・担当者・発生頻度に合わせて、実現できる状態を具体化しました。</p></div><span class="tag green">提案イメージ</span></div>
  <div class="grid c2">${items.map((item,i)=>`<div class="rank-item proposal-item"><div class="rank-top"><h4>${i+1}. ${item}</h4><span class="tag ${i<2?'green':'blue'}">${i<2?'まず提案':'追加提案'}</span></div><p>${i<2?'小さく始めやすく、効果を確認しやすい内容です。':'必要に応じて、次の段階で追加できます。'}</p></div>`).join('')}</div>
  <p class="sub" style="margin-top:12px">すべてを一度に導入する必要はありません。最初は1〜2個に絞り、実際に時間が減るか確認してから広げます。</p>
 </div>`;
}

function injectProposal(){
 const result=document.querySelector('#result');
 if(result&&state.pain&&state.step>=4&&!result.querySelector('.proposal-capabilities')){
  const nav=result.querySelector('.navrow');
  if(nav)nav.insertAdjacentHTML('beforebegin',proposalMarkup());
  else result.insertAdjacentHTML('beforeend',proposalMarkup());
 }
 const report=document.querySelector('#report .report');
 if(report&&state.pain&&!report.querySelector('.proposal-report')){
  const sections=report.querySelectorAll('.rsec');
  const target=sections.length>3?sections[3]:null;
  const html=`<div class="rsec proposal-report"><h3>回答内容から実現できること</h3><ul>${proposalItems().map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="sub">最初は1〜2個に絞って試し、効果を確認してから広げます。</p></div>`;
  if(target)target.insertAdjacentHTML('afterend',html);else report.insertAdjacentHTML('beforeend',html);
 }
}

const originalDiagnosisRender=render;
render=function(){originalDiagnosisRender();injectProposal()};
injectProposal();