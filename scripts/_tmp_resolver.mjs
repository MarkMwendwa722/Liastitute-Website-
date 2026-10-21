// TEMP validation — mirrors productFeed.ts resolver (copy from that file).
const CANONICAL_GOOGLE_CATEGORY = {
  'Home Appliances': 'Home & Garden > Household Appliances',
  'Kitchen Appliances': 'Home & Garden > Kitchen & Dining > Kitchen Appliances',
  Tools: 'Home & Garden > Lawn & Garden > Garden Tools',
  'Office Equipment': 'Office Supplies > Office Equipment',
  'Networking & Communication': 'Electronics > Communications > Telecommunications',
  'Security Cameras & Surveillance Systems': 'Electronics > Security & Surveillance',
  Lighting: 'Home & Garden > Lighting',
  Electrical: 'Electronics > Electrical',
  Electronics: 'Electronics',
  'Automotive Accessories': 'Vehicles & Parts > Automotive Parts & Accessories > Automotive Accessories',
  Furniture: 'Home & Garden > Furniture',
  'Bathroom Organizers': 'Home & Garden > Bathroom',
  'Kids & Baby': 'Sports & Outdoors > Cycling > Bikes',
  'Fitness Equipment': 'Sports & Outdoors > Exercise & Fitness > Fitness Equipment',
  "Toys & Kids' Gifts": 'Toys & Games > Toys',
};
const CATEGORY_KEYWORDS = [
  ['Security Cameras & Surveillance Systems', ['cctv','surveillance','security camera','solar powered camera','solar camera']],
  ['Networking & Communication', ['wifi','wi-fi','router','mikrotik','ruijie','access point','walkie','radio','baofeng','telephone','landline','sim card','gsm','two-way','server rack','network cabinet','fixed wireless','phone','network']],
  ['Office Equipment', ['receipt','thermal','printer','money counting','cash register','point of sale','pos ']],
  ['Kitchen Appliances', ['kettle','blender','cooker','pressure cooker','crepe','chapati','cookware','kitchen scale','microwave']],
  ['Home Appliances', ['washing machine','dryer','fridge','refrigerator','iron box','steam iron','dry iron']],
  ['Lighting', ['flood light','light bulb','lamp','led strip','light']],
  ["Kids & Baby", ['tricycle','kids',"kid's",' kid ','push handle','bicycle','bike','baby','children']],
  ['Fitness Equipment', ['fitness','exercise','treadmill','dumbbell','gym']],
  ['Automotive Accessories', ['jump starter','vehicle','automotive','car compressor','inspection mirror','search mirror']],
  ['Tools', ['sprayer','knapsack','drill','garden tool','hammer','saw','wrench']],
  ['Furniture', ['office chair','chair','desk','sofa','table','bed','furniture']],
  ['Bathroom Organizers', ['bathroom','organizer','shower','towel rack']],
  ["Toys & Kids' Gifts", ['piggy bank','toy','puzzle','doll','lego']],
];
function resolve(p) {
  const raw = (p.googleProductCategory || '').trim();
  if (raw.includes(' > ')) return raw;
  const hay = `${p.name || ''} ${p.slug || ''}`.toLowerCase();
  for (const [label, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => hay.includes(k))) {
      const full = CANONICAL_GOOGLE_CATEGORY[label];
      if (full) return { full, label, inferred: true };
    }
  }
  return { full: CANONICAL_GOOGLE_CATEGORY[raw] || raw, label: null, inferred: false };
}

(async () => {
  const all = [];
  for (let page = 1; page <= 50; page++) {
    let j;
    try {
      const r = await fetch('https://api.lijustore.co.ke/api/products?limit=100&page=' + page);
      if (!r.ok) break;
      j = await r.json();
    } catch { break; }
    if (!j.success || !j.data || !j.data.length) break;
    for (const p of j.data) if (!all.some((x) => x._id === p._id)) all.push(p);
    if (all.length >= (j.pagination.total || 0)) break;
    if (page >= (j.pagination.pages || page)) break;
  }

  console.log('--- products whose stored gc is BROAD (single segment) -> resolved ---');
  for (const p of all) {
    const raw = (p.googleProductCategory || '').trim();
    if (raw.includes(' > ') || !raw) continue;
    const r = resolve(p);
    console.log(
      (r.inferred ? 'INFERRED' : 'kept     ') + ' | raw=' + JSON.stringify(raw) + ' -> ' + JSON.stringify(r.full) +
      (r.label ? '  [' + r.label + ']' : '') + ' | ' + p.name.slice(0, 60),
    );
  }

  console.log('\n--- consistency: group resolved category by product and count duplicates within store category buckets ---');
  const counts = {};
  for (const p of all) {
    const r = resolve(p);
    const key = r.full;
    counts[key] = (counts[key] || 0) + 1;
  }
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(3) + 'x  ' + k);
})().catch((e) => console.error(e));
