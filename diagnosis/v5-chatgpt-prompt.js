(()=>{
 const answerLabel=(key)=>{
  const q=QUESTIONS.find(x=>x.key===key);
  const v=state.answers[key];
  return q&&v!==undefined?q.options[v]?.[0]||'未回答':'未回答';
 };
 const buildPrompt=()=>{
  const d=diagnosis();
  const proposals=proposalList(d.primary,d.secondary);
  const plan=roadmap(d.primary);
  const symptoms=symptomLabels();
  const estimateData=typeof estimate==='function'?estimate(d):null;
  const axes=d.axes.map(a=>`- ${a.label}：${a.score}/100（${a.desc}）`).join('\n');
  const pricing=estimateData?`${estimateData.planName}／${estimateData.min}万〜${estimateData.max}万円程度`:'診断画面の概算費用を参照';
  const scope=estimateData?estimateData.scope.map(x=>`- ${x}`).join('\n'):'- 実物確認後に決定';
  return `あなたは、中小企業の業務改善・DX・営業設計・業務アプリ設計に強い実務コンサルタントです。\n以下は「小さな会社の仕事詰まり診断」の結果です。顧客へ無理にシステムを売るのではなく、既存のExcel・Google Workspace・LINE・フォーム・生成AI・簡易Webアプリなどを活かし、最小の費用と負担で成果が出る提案を作ってください。\n\n【最重要ルール】\n- 診断結果をそのまま信じ切らず、仮説として扱う\n- 高額なシステム導入ありきにしない\n- 経営者と社員の負担が増える設計を避ける\n- まず1業務を小さく試し、効果測定してから広げる\n- 不明点は推測で断定せず、追加確認事項として分ける\n- 実装できない機能や根拠のない効果を約束しない\n- 専門用語を抑え、中小企業の社長が判断できる言葉で書く\n\n【顧客情報】\n会社名・屋号：${state.company||'未入力'}\n決裁者：${state.sales.decision}\n予算感：${state.sales.budget}\n温度感：${state.sales.temperature}\n改善後に増やしたいもの：${state.future||answerLabel('goal')}\n営業メモ：${state.sales.memo||'未入力'}\n\n【診断の結論】\n診断タイプ：${d.type.name}\n最も強い詰まり：${d.primary.label}（${d.primary.score}/100）\n次に強い詰まり：${d.secondary.label}（${d.secondary.score}/100）\n診断の確信度：${d.confidence}\n表面の悩み：${symptoms.join('／')||'未選択'}\n隠れた原因：${d.type.hidden}\n経営への影響：${d.type.impact}\n診断要約：${d.type.summary}\n\n【6方向の診断点数】\n${axes}\n\n【主な回答】\n- 問い合わせ・依頼の対応状況：${answerLabel('response')}\n- 社長が1週間不在の場合：${answerLabel('owner_absence')}\n- 二重入力・転記：${answerLabel('double_entry')}\n- 書類・写真・履歴の検索：${answerLabel('search_time')}\n- 問い合わせ後・見積後の追客：${answerLabel('sales_follow')}\n- 請求・入金・利益の把握：${answerLabel('money_view')}\n- 担当者不在時の引き継ぎ：${answerLabel('handover')}\n- Web・Googleマップ・SNSの更新：${answerLabel('marketing')}\n- 問題の発生頻度：${answerLabel('frequency')}\n\n【診断画面で出した改善候補】\n${proposals.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\n【改善ロードマップ案】\n7日：${plan[0]}\n30日：${plan[1]}\n90日：${plan[2]}\n\n【概算費用】\n${pricing}\n想定範囲：\n${scope}\n\n次の順番で、具体的な実行提案を作成してください。\n\n1. 診断結果の読み解き\n表面の悩みと本当の原因を分け、診断が妥当な理由と、誤診の可能性を説明してください。\n\n2. 商談で追加確認すべき質問\n優先度順に10問以内。各質問について「なぜ必要か」も一言付けてください。\n\n3. 最初に提案する最小プラン\n2〜4週間で実施できる範囲に絞り、納品物、使用ツール、顧客側の作業、こちら側の作業を明確にしてください。\n\n4. 具体的な仕組みの設計\n入力→処理→確認→保存→通知の流れを、実務で使える形で設計してください。例外対応と担当者不在時も含めてください。\n\n5. 実装方法の候補\n無料・低予算案、標準案、将来拡張案の3段階で比較してください。各案について、費用感、制作工数、メリット、弱点、向いている条件を示してください。\n\n6. 見積もりのたたき台\n診断画面の概算費用を参考にしつつ、作業項目、数量、単価または一式金額、含むもの、含まないもの、追加費用が発生する条件を示してください。価格が妥当でない場合は修正案を出してください。\n\n7. 効果測定\n導入前後で測る数字を3〜5個に絞り、測定方法と合格基準を示してください。効果を保証する表現は避けてください。\n\n8. リスクと失敗防止\n現場が使わない、入力が増える、情報が古くなる、社長依存が別の担当者依存へ移る、といった失敗を防ぐ方法を示してください。\n\n9. 顧客への提案文\n社長へ口頭で説明する200〜300字の提案文と、メールで送る提案概要を作ってください。売り込みすぎず「今はやらなくてよいこと」も明記してください。\n\n10. 次のアクション\n初回商談後にこちらが行うことを、今日・3日以内・7日以内に分けてチェックリスト化してください。`;
 };
 const inject=()=>{
  if(MODE!=='face'||typeof diagnosis!=='function')return;
  const sales=document.querySelector('#sales');
  if(!sales||!sales.innerHTML)return;
  sales.querySelector('#chatgptPromptCard')?.remove();
  const prompt=buildPrompt();
  const card=document.createElement('div');
  card.id='chatgptPromptCard';
  card.className='card panel chatgpt-prompt-card';
  card.innerHTML=`<div class="head"><div><span class="tag blue">社内専用</span><h3>ChatGPTに渡す実行プロンプト</h3><p class="sub">診断結果から、追加ヒアリング・実装方法・見積もり・提案文まで作らせるためのプロンプトです。顧客向け画面や診断書には表示されません。</p></div><button class="btn primary" id="copyChatgptPrompt">プロンプトをコピー</button></div><details><summary>内容を確認する</summary><textarea id="chatgptPromptText" readonly></textarea></details><div class="notice good"><b>使い方：</b>コピーしてChatGPTへ貼り付け、顧客の業種・社員数・現在使っているツール・実際の書類や画面の情報を追加してください。最終提案と金額は、必ず実物確認後に判断します。</div>`;
  const pricing=sales.querySelector('#salesPricing');
  if(pricing)pricing.insertAdjacentElement('afterend',card);else sales.appendChild(card);
  const text=card.querySelector('#chatgptPromptText');
  text.value=prompt;
  card.querySelector('#copyChatgptPrompt').onclick=async()=>{
   try{await navigator.clipboard.writeText(prompt);toast('ChatGPT用プロンプトをコピーしました')}catch{ text.focus();text.select();toast('長押ししてコピーしてください') }
  };
 };
 const originalRender=window.render;
 if(typeof originalRender==='function')window.render=function(){originalRender();inject()};
 inject();
})();