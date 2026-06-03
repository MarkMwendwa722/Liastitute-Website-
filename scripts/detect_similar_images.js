const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'Photos');
const OUT_FILE = path.join(__dirname, '..', 'tmp', 'similar_groups.json');

function hexToBin(hex) {
  return hex.split('').map(ch => parseInt(ch, 16).toString(2).padStart(4, '0')).join('');
}

function hamming(a, b) {
  const ba = hexToBin(a);
  const bb = hexToBin(b);
  let diff = 0;
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) {
    if (ba[i] !== bb[i]) diff++;
  }
  return diff + Math.abs(ba.length - bb.length);
}

async function run() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error('Photos directory not found:', PHOTOS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(PHOTOS_DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log('Found', files.length, 'image files');

  const hashes = [];
  for (const file of files) {
    const p = path.join(PHOTOS_DIR, file);
    try {
      const img = await Jimp.read(p);
      const hash = img.hash(); // perceptual hash as hex string
      hashes.push({ file, hash });
      console.log('Hashed', file, hash);
    } catch (err) {
      console.error('Failed to process', file, err.message);
    }
  }

  const groups = [];
  const used = new Set();
  const threshold = 8; // Hamming distance threshold for similarity

  for (let i = 0; i < hashes.length; i++) {
    if (used.has(hashes[i].file)) continue;
    const group = { canonical: hashes[i].file, members: [hashes[i].file] };
    used.add(hashes[i].file);
    for (let j = i + 1; j < hashes.length; j++) {
      if (used.has(hashes[j].file)) continue;
      const d = hamming(hashes[i].hash, hashes[j].hash);
      if (d <= threshold) {
        group.members.push(hashes[j].file);
        used.add(hashes[j].file);
      }
    }
    groups.push(group);
  }

  // ensure output dir
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ groups, threshold }, null, 2));
  console.log('Wrote groups to', OUT_FILE);
  console.log('Groups summary:');
  groups.forEach((g, idx) => {
    if (g.members.length > 1) console.log(idx + 1 + ':', g.members.length, '->', g.members.join(', '));
  });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
