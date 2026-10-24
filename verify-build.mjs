// Compare the pipeline output (with her injected) against the shipped data/*.json.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'E:\\weiwei\\Stronghold-Protocol';
const SHIPPED = path.join(ROOT, 'data');
const BUILT = path.join(ROOT, '.cache', 'build-out');
const FILES = ['chess', 'garrisons', 'tokens', 'bonds', 'config', 'items', 'bands', 'effects', 'choices', 'enemies', 'factions', 'waves', 'stages', 'bosses'];

for (const f of FILES) {
  const a = JSON.parse(fs.readFileSync(path.join(SHIPPED, f + '.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(path.join(BUILT, f + '.json'), 'utf8'));
  const ak = Object.keys(a), bk = Object.keys(b);
  const added = bk.filter((k) => !(k in a));
  const removed = ak.filter((k) => !(k in b));
  const changed = bk.filter((k) => (k in a) && JSON.stringify(a[k]) !== JSON.stringify(b[k]));
  const flag = (added.length || removed.length || changed.length) ? '  <<<' : '';
  console.log(`${f.padEnd(10)} 现有 ${String(ak.length).padStart(4)}  ->  管线 ${String(bk.length).padStart(4)}   +${added.length} -${removed.length} ~${changed.length}${flag}`);
  if (added.length) console.log(`     新增: ${added.slice(0, 12).join(', ')}${added.length > 12 ? ' …' : ''}`);
  if (removed.length) console.log(`     移除: ${removed.slice(0, 12).join(', ')}${removed.length > 12 ? ' …' : ''}`);
  if (changed.length) console.log(`     改动: ${changed.slice(0, 12).join(', ')}${changed.length > 12 ? ' …' : ''}`);
}

console.log('\n===== 她生成的棋子记录 =====');
const chess = JSON.parse(fs.readFileSync(path.join(BUILT, 'chess.json'), 'utf8'));
for (const id of ['chess_char_6_21_a', 'chess_char_6_21_b']) {
  const c = chess[id];
  if (!c) { console.log(`  ${id} 缺失!`); continue; }
  console.log(`\n--- ${id} ---`);
  for (const k of ['name', 'appellation', 'rarity', 'profession', 'subProfessionId', 'subProfessionName', 'position', 'nationId', 'tier', 'price', 'sellPrice', 'upgradeNum', 'identifier', 'shopSortId', 'visible', 'bonds', 'garrisonIds', 'rangeId', 'dmgType', 'attackKind', 'projectile', 'canHitFly', 'targetPriority', 'tokens']) {
    console.log(`  ${k.padEnd(18)} ${JSON.stringify(c[k])}`);
  }
  console.log(`  stats              ${JSON.stringify(c.stats)}`);
  console.log(`  trait              ${JSON.stringify(c.trait?.desc)}`);
  console.log(`  module             ${JSON.stringify(c.module)}`);
  console.log(`  assets             ${JSON.stringify(c.assets)}`);
  console.log(`  rangeGrid          ${JSON.stringify(c.rangeGrid)}`);
  console.log(`  skill(default)     ${c.skill?.skillId} / ${c.skill?.name}  trigger=${JSON.stringify(c.skill?.trigger?.rule)} type=${c.skill?.skillType} durType=${c.skill?.durationType}`);
  console.log(`  skills[]           ${(c.skills || []).map((s) => `${s.skillId}(def=${s.isDefault})`).join(', ')}`);
  console.log(`  talents            ${(c.talents || []).map((t) => `[${t.index}]${t.name}`).join('  ')}`);
}
console.log('\n===== 她的特质 =====');
const gar = JSON.parse(fs.readFileSync(path.join(BUILT, 'garrisons.json'), 'utf8'));
for (const g of ['garrison_aglna2_a', 'garrison_aglna2_b']) console.log(`  ${g}: ${JSON.stringify(gar[g])}`);
console.log('\n===== 她的召唤物 =====');
const tok = JSON.parse(fs.readFileSync(path.join(BUILT, 'tokens.json'), 'utf8'));
console.log('  token_10071_aglna2_agairp:', JSON.stringify(tok['token_10071_aglna2_agairp'], null, 1)?.slice(0, 900));
