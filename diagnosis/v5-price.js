(() => {
 const AXIS_PRICE={
  sales:{min:5,max:12,label:'売上機会の改善'},owner:{min:8,max:18,label:'社長依存の解消'},waste:{min:5,max:12,label:'手作業・情報整理の改善'},customer:{min:8,max:18,label:'顧客対応の仕組み化'},money:{min:8,max:18,label:'請求・利益管理の見える化'},people:{min:5,max:15,label:'引き継ぎ・標準化'}
 };
 const AXIS_SCOPE={
  sales:['見込み客・見積案件の一覧化','次回連絡日の管理','問い合わせ導線の改善'],
  owner:['判断ルールの整理','確認・承認状況の一覧化','社員向けの簡易マニュアル'],
  waste:['保存場所と入力項目の整理','テンプレート・管理表の作成','小さな自動化の設定'],
  customer:['問い合わせの一覧化','対応状況・担当者の管理','返信テンプレートの整備'],
  money:['請求・入金状況の一覧化','案件別の売上・原価・利益管理','確認用ダッシュボード'],
  people:['業務手順と判断基準の整理','引き継ぎチェックリスト','共有フォルダ・情報管理の整備']
 };
 function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
 function estimate(d){
  const base=AXIS_PRICE[d.primary.id]||AXIS_PRICE.waste;
  const severe=Object.values(state.answers).filter(v=>Number(v)>=2).length;
  const critical=Object.values(state.answers).filter(v=>Number(v)>=3).length;
  const symptomCount=state.selectedSymptoms.length;
  const secondaryStrong=d.secondary&&d.secondary.score>=55;
  let addMin=0,addMax=0;
  if(symptomCount>=6){addMin+=2;addMax+=4}
  if(severe>=5){addMin+=2;addMax+=4}
  if(critical>=3){addMin+=2;addMax+=5}
  if(secondaryStrong){addMin+=2;addMax+=5}
  const freq=state.answers.frequency??0;
  if(freq===3){addMin+=1;addMax+=3}
  let min=clamp(base.min+addMin,3,25),max=clamp(base.max+addMax,6,40);
  if(d.primary.score<45&&freq<=1){min=3;max=7}
  if(max-min<4)max=min+4;
  const complexity=(d.primary.score>=70||critical>=3||secondaryStrong)?'standard':(d.primary.score<45&&freq<=1?'starter':'light');
  const planName=complexity==='starter'?'まず試すプラン':complexity==='light'?'小さく仕組み化プラン':'仕組み化プラン';
  const reason=complexity==='starter'?'大規模な導入は不要で、整理・テンプレート化・簡易管理から始められるためです。':complexity==='light'?'既存のExcel・Google・LINEなどを活かしながら、1つの業務を小さく改善できるためです。':'複数の情報や担当者が関わるため、整理だけでなく共有・管理・自動化まで含める方が効果を出しやすいためです。';
  const lowHours=clamp(Math.round(3+d.primary.score/18+severe*.6),5,18);
  const highHours=clamp(Math.round(lowHours*1.9),10,35);
  const valueLow=Math.round(lowHours*2500/1000)*1000;
  const valueHigh=Math.round(highHours*2500/1000)*1000;
  const midPrice=((min+max)/2)*10000;
  const midValue=(valueLow+valueHigh)/2;
  const paybackLow=clamp(Math.round((min*10000)/Math.max(valueHigh,1)),1,24);
  const paybackHigh=clamp(Math.ceil((max*10000)/Math.max(valueLow,1)),2,30);
  const scope=[...(AXIS_SCOPE[d.primary.id]||AXIS_SCOPE.waste)];
  if(secondaryStrong){const extra=(AXIS_SCOPE[d.secondary.id]||[]).find(x=>!scope.includes(x));if(extra)scope.push(extra)}
  return {min,max,planName,reason,lowHours,highHours,valueLow,valueHigh,paybackLow,paybackHigh,scope:scope.slice(0,4),complexity};
 }
 function yen(n){return n.toLocaleString('ja-JP')+'円'}
 function planCards(e){
  const starter={name:'まず試す',price:'3万〜7万円',desc:'1つの仕事だけ整理・改善します。',items:['現状確認','テンプレート・管理表','初期設定と説明']};
  const standard={name:'小さく仕組み化',price:`${e.min}万〜${e.max}万円`,desc:'今回の診断結果に最も合う目安です。',items:e.scope.slice(0,3)};
  const full={name:'複数業務をつなぐ',price:'20万〜40万円',desc:'複数部署・複数業務をまとめて整える場合です。',items:['複数業務の設計','通知・自動化','導入後の改善支援']};
  return [starter,standard,full].map((p,i)=>`<div class="price-plan ${i===1?'recommended':''}">${i===1?'<span class="recommended-label">今回のおすすめ</span>':''}<h4>${p.name}</h4><div class="plan-price">${p.price}</div><p>${p.desc}</p><ul>${p.items.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('');
 }
 function pricingHtml(d){
  const e=estimate(d);
  return `<div id="pricingEstimate" class="card panel price-diagnosis section-gap"><div class="head"><div><h3>あなたの会社の改善費用目安</h3><p class="sub">回答内容と改善範囲から算出した概算です。</p></div><span class="tag green">概算見積もり</span></div><div class="price-summary"><div class="price-main"><div class="price-eyebrow">おすすめ：${e.planName}</div><div class="price-range">${e.min}万〜${e.max}万円<small>程度</small></div><p class="price-reason">${e.reason} この金額には、現状確認・改善設計・簡易ツールまたは管理表の制作・初期設定・操作説明・軽微な修正を含む想定です。</p></div><div class="price-return"><span>回答から見た時間削減の可能性</span><strong>月${e.lowHours}〜${e.highHours}時間</strong><p>時給2,500円で換算すると、月${yen(e.valueLow)}〜${yen(e.valueHigh)}分の時間に相当します。概算の投資回収目安は約${e.paybackLow}〜${e.paybackHigh}か月です。</p></div></div><div class="price-plans">${planCards(e)}</div><div class="price-includes"><div class="price-box"><h4>この費用に含まれる想定</h4><ul>${['現在の作業・書類・画面の確認','改善方法と進め方の設計',...e.scope,'初期設定・操作説明','納品後の軽微な修正'].slice(0,7).map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="price-box"><h4>正式見積もり前に確認すること</h4><ul>${['月の処理件数・利用人数','例外対応の多さ','現在使っているExcel・LINE・システム','どこまで自社で対応するか','希望する開始時期と優先順位'].map(x=>`<li>${x}</li>`).join('')}</ul></div></div><p class="price-disclaimer">※診断結果だけで契約や金額は確定しません。実際の書類や画面を1つ確認したうえで正式な範囲と費用を提示します。相談後に依頼する必要はありません。削減時間と回収期間は回答内容をもとにした概算で、効果を保証するものではありません。</p></div>`;
 }
 function inject(){
  if(typeof diagnosis!=='function'||typeof state==='undefined')return;
  const d=diagnosis();
  const result=$('#result');
  if(result&&result.innerHTML){result.querySelector('#pricingEstimate')?.remove();const target=result.querySelector('.no-need');target?.insertAdjacentHTML('beforebegin',pricingHtml(d));}
  if(MODE==='face'){
   const sales=$('#sales');
   if(sales&&sales.innerHTML&&!sales.querySelector('#salesPricing')){const e=estimate(d);sales.insertAdjacentHTML('beforeend',`<div id="salesPricing" class="card panel price-diagnosis sales-price-card"><div class="head"><div><h3>概算費用の伝え方</h3><p class="sub">安さだけではなく、含まれる範囲と回収イメージまで伝えます。</p></div></div><div class="price-range">${e.min}万〜${e.max}万円<small>程度</small></div><p class="price-reason">「大規模なシステムではなく、まず${e.scope[0]}から小さく始める場合の目安です。正式な金額は実物を確認してから出します」と説明してください。</p></div>`)}
   const report=$('#report');
   if(report&&report.innerHTML&&!report.querySelector('#reportPricing')){const e=estimate(d);const sec=`<div id="reportPricing" class="rsec"><h3>7．概算費用と回収イメージ</h3><p><b>${e.planName}：${e.min}万〜${e.max}万円程度</b></p><p>${esc(e.reason)}</p><p>想定削減時間：月${e.lowHours}〜${e.highHours}時間／投資回収目安：約${e.paybackLow}〜${e.paybackHigh}か月</p><p class="sub">実際の書類・画面・件数を確認後に正式見積もりを提示します。</p></div>`;const sections=report.querySelectorAll('.rsec');const last=sections[sections.length-1];last?.insertAdjacentHTML('beforebegin',sec)}
  }
 }
 const originalRender=window.render;
 if(typeof originalRender==='function')window.render=function(){originalRender();inject()};
 inject();
})();