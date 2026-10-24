// Read an MP4's own metadata (duration / resolution / fps) without ffmpeg: walk the atom tree.
import fs from 'node:fs';

const file = process.argv[2];
const fd = fs.openSync(file, 'r');
const size = fs.statSync(file).size;

function readAt(pos, len) {
  const b = Buffer.alloc(len);
  fs.readSync(fd, b, 0, len, pos);
  return b;
}
/** Walk atoms in [start,end) at one level; returns {type,start,size,headerLen}[] */
function atoms(start, end) {
  const out = [];
  let p = start;
  while (p + 8 <= end) {
    const h = readAt(p, 16);
    let sz = h.readUInt32BE(0);
    const type = h.toString('latin1', 4, 8);
    let headerLen = 8;
    if (sz === 1) { sz = Number(h.readBigUInt64BE(8)); headerLen = 16; }
    else if (sz === 0) sz = end - p;
    if (sz < headerLen || p + sz > end) break;
    out.push({ type, start: p, size: sz, headerLen, body: p + headerLen });
    p += sz;
  }
  return out;
}
function find(list, type) { return list.find((a) => a.type === type); }

console.log('文件:', file);
console.log('大小:', (size / 1048576).toFixed(1), 'MB');

const top = atoms(0, size);
console.log('\n顶层 atom:', top.map((a) => `${a.type}(${(a.size / 1048576).toFixed(1)}MB)`).join('  '));

const moov = find(top, 'moov');
if (!moov) { console.log('没有 moov（可能是分片 MP4，需要读 moof）'); process.exit(0); }
const moovKids = atoms(moov.body, moov.start + moov.size);

// mvhd: version(1) flags(3) [creation,modification,timescale,duration] (v0: 4+4+4+4; v1: 8+8+4+8)
const mvhd = find(moovKids, 'mvhd');
if (mvhd) {
  const b = readAt(mvhd.body, 120);
  const v = b[0];
  let timescale, duration;
  if (v === 1) { timescale = b.readUInt32BE(20); duration = Number(b.readBigUInt64BE(24)); }
  else { timescale = b.readUInt32BE(12); duration = b.readUInt32BE(16); }
  const sec = duration / timescale;
  console.log(`\n时长: ${sec.toFixed(1)} 秒  = ${Math.floor(sec / 60)} 分 ${Math.round(sec % 60)} 秒`);
}

// tracks: tkhd (width/height in 16.16 fixed point), mdhd/mvhd for timescale, stsd for codec
console.log('\n轨道:');
for (const trak of moovKids.filter((a) => a.type === 'trak')) {
  const kids = atoms(trak.body, trak.start + trak.size);
  const tkhd = find(kids, 'tkhd');
  const mdia = find(kids, 'mdia');
  let w = 0, h = 0, kind = '';
  if (tkhd) {
    const b = readAt(tkhd.body, 96);
    const v = b[0];
    const off = v === 1 ? 88 : 76;
    w = b.readUInt32BE(off) / 65536;
    h = b.readUInt32BE(off + 4) / 65536;
  }
  let codec = '', fps = '';
  if (mdia) {
    const mk = atoms(mdia.body, mdia.start + mdia.size);
    const hdlr = find(mk, 'hdlr');
    if (hdlr) kind = readAt(hdlr.body + 8, 4).toString('latin1');
    const minf = find(mk, 'minf');
    if (minf) {
      const ik = atoms(minf.body, minf.start + minf.size);
      const stbl = find(ik, 'stbl');
      if (stbl) {
        const sk = atoms(stbl.body, stbl.start + stbl.size);
        const stsd = find(sk, 'stsd');
        if (stsd) codec = readAt(stsd.body + 12, 4).toString('latin1');
        const stts = find(sk, 'stts');
        const mdhd = find(mk, 'mdhd');
        if (stts && mdhd) {
          const mb = readAt(mdhd.body, 32);
          const ts = mb[0] === 1 ? mb.readUInt32BE(20) : mb.readUInt32BE(12);
          const sb = readAt(stts.body, 16);
          const n = sb.readUInt32BE(4);
          if (n > 0) {
            const e = readAt(stts.body + 8, 8);
            const cnt = e.readUInt32BE(0), delta = e.readUInt32BE(4);
            if (delta > 0 && ts > 0) fps = (ts / delta).toFixed(2) + ' fps (前 ' + cnt + ' 帧)';
          }
        }
      }
    }
  }
  console.log(`  [${kind || '?'}] ${codec || '?'}  ${w}x${h}  ${fps}`);
}
fs.closeSync(fd);
