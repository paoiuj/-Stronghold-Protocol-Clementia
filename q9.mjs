import fs from 'node:fs';
import path from 'node:path';
const R = 'E:\\weiwei\\Stronghold-Protocol';
const A = path.join(R, 'public', 'assets');

console.log('=== data/assets.json 顶层结构 ===');
const aj = JSON.parse(fs.readFileSync(path.join(R, 'data', 'assets.json'), 'utf8'));
console.log('  顶层键:', Object.keys(aj).join(', '));
console.log('  stats:', JSON.stringify(aj.stats));

console.log('\n=== chars[char_4191_tippi] 完整内容（蒂比） ===');
console.log(JSON.stringify(aj.chars['char_4191_tippi'], null, 1));

console.log('\n=== tokens 里一个条目（看召唤物素材怎么登记） ===');
const tkey = Object.keys(aj.tokens || {})[0];
console.log(`  key=${tkey}`);
console.log(JSON.stringify(aj.tokens[tkey], null, 1).slice(0, 1200));

console.log('\n=== prof 目录里有哪些图标（找 sub_*_icon） ===');
const profDir = path.join(A, 'prof');
const profs = fs.readdirSync(profDir).filter((f) => /sub_/.test(f));
console.log('  sub_* 图标:', profs.slice(0, 40).join(', '));
console.log('  共', profs.length, '个');
console.log('  skywalker 相关:', profs.filter((f) => /skywalker|sky/i.test(f)).join(', ') || '（无）');
console.log('  slower 相关:', profs.filter((f) => /slower/i.test(f)).join(', ') || '（无）');

console.log('\n=== 蒂比的 skillIcon 素材 ===');
for (const f of ['skchr_tippi_1.png', 'skchr_tippi_2.png']) {
  const p = path.join(A, 'skill', f);
  console.log(`  ${f}: ${fs.existsSync(p) ? fs.statSync(p).size + ' B' : '缺失'}`);
}
console.log('\n=== token spine 目录示例 ===');
const tokSpine = path.join(A, 'spine', 'token');
console.log('  spine/token 下的目录:', fs.readdirSync(tokSpine).slice(0, 10).join(', '));
const t0 = fs.readdirSync(tokSpine)[0];
console.log(`  ${t0} 内容:`, fs.readdirSync(path.join(tokSpine, t0), { recursive: true }).join(', '));
