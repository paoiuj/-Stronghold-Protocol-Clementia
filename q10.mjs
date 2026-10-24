import fs from 'node:fs';
const R = 'E:\\weiwei\\Stronghold-Protocol';
const a7 = JSON.parse(fs.readFileSync(R + '\\docs\\research\\07-assets.json', 'utf8'));
console.log('=== 07-assets.json 顶层键 ===');
console.log(' ', Object.keys(a7).join(', '));
console.log('\n=== operators 条目数:', Object.keys(a7.operators || {}).length);
console.log('\n=== 蒂比 operators[char_4191_tippi] 完整内容（模板） ===');
console.log(JSON.stringify(a7.operators['char_4191_tippi'], null, 1));
console.log('\n=== tokens 条目数:', Object.keys(a7.tokens || {}).length);
const tk = Object.keys(a7.tokens || {});
if (tk.length) {
  console.log('  tokens 键示例:', tk.slice(0, 5).join(', '));
  console.log('  tokens[', tk[0], '] =', JSON.stringify(a7.tokens[tk[0]], null, 1));
}
console.log('\n=== 她是否已在 07-assets.json 里 ===');
console.log('  operators 里有 char_1015_aglna2:', !!(a7.operators || {})['char_1015_aglna2']);
console.log('  tokens 里有 token_10071_aglna2_agairp:', !!(a7.tokens || {})['token_10071_aglna2_agairp']);
console.log('\n=== arts.professionIcon / subProfessionIcon 里有没有 skywalker ===');
console.log('  arts 键:', Object.keys(a7.arts || {}).join(', '));
for (const k of ['professionIcon', 'professionIconLargeWhite', 'subProfessionIcon']) {
  const m = a7.arts?.[k];
  if (m) console.log(`  arts.${k} 键数 ${Object.keys(m).length}, 含 skywalker: ${!!m.skywalker}, 含 slower: ${!!m.slower}`);
}
