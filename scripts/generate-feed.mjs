import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.VITE_SITE_URL || 'https://lijustore.co.ke';
const root = process.cwd();
const productsFile = resolve(root, 'src/utils/api.ts');
const outputFile = resolve(root, 'public/products_feed.xml');

// Read the PRODUCTS array by evaluating the file contents
const source = readFileSync(productsFile, 'utf8');

// Extract each product object as a string block
const productRegex = /\{\s*id:\s*(\d+),\s*name:\s*'([^']*)',\s*price:\s*([\d.]+),\s*originalPrice:\s*([\d.]+|null),\s*category:\s*'([^']*)',\s*rating:\s*([\d.]+),\s*reviews:\s*(\d+),\s*image:\s*'([^']+)',\s*description:\s*'([^']*)',\s*stock:\s*(\d+),\s*badge:\s*(?:'([^']*)'|null)\s*\}/g;

// Google product category mapping
const googleCategoryMap = {
  'Home Appliances': 'Home & Garden > Household Appliances',
  'Home & Living': 'Home & Garden > Household Appliances',
  'Kitchen Appliances': 'Home & Garden > Kitchen & Dining > Kitchen Appliances',
  'Fitness Equipment': 'Sports & Outdoors > Exercise & Fitness > Fitness Equipment',
  "Kids & Baby": "Sports & Outdoors > Cycling > Bikes",
  "Toys & Kids' Gifts": 'Toys & Games > Toys',
  'Electronics': 'Electronics',
  'Lighting': 'Home & Garden > Lighting',
  'Networking & Communication': 'Electronics > Communications > Telecommunications',
  'Furniture': 'Home & Garden > Furniture',
  'Bathroom Organizers': 'Home & Garden > Bathroom',
  'Office Equipment': 'Office Supplies > Office Equipment',
  'Security Cameras & Surveillance Systems': 'Electronics > Security & Surveillance',
  'Automotive Accessories': 'Vehicles & Parts > Automotive Parts & Accessories > Automotive Accessories',
  'Solar & Power Backup': 'Home & Garden > Household Appliances',
  'Tools': 'Home & Garden > Lawn & Garden > Garden Tools',
  'Electrical': 'Electronics > Electrical',
};

const brandMap = {
  'Signature Electric Crepe and Chapati Maker': 'Signature',
  'Smart Pro 2-in-1 Blender': 'Smart Pro',
  'Ipcone 2-in-1 Blender': 'Ipcone',
  'Premier 20L Knapsack Sprayer': 'Premier',
  'Bosch 10-Piece Cookware Set': 'Bosch',
  'Baofeng BF-888S Radio Call': 'Baofeng',
  'Edenberg 12-Piece Cookware Set': 'Edenberg',
  'Nunix 2-in-1 Blender': 'Nunix',
  'Bosch 6L Electric Pressure Cooker': 'Bosch',
  'Signature 4-in-1 Blender': 'Signature',
  'Nduthi Style Kids Bike 16 Inch': 'Lijustore',
  'Automatic Money Counting Machine': 'Lijustore',
  'Lady Bird Kids Bicycle 16 Inch': 'Lady Bird',
  'Nunix 2-Burner Table Top Gas Cooker': 'Nunix',
  'GSM Landline Dual SIM Phone 6588': 'Lijustore',
  'Dual Lens 4G Solar Powered CCTV Camera': 'Lijustore',
  'Ergonomic Office Chair Without Headrest': 'Lijustore',
  'Kids Piggy Bank': 'Lijustore',
  'Ailyons 1.8L Electric Cordless Kettle': 'Ailyons',
  'Synix Steam Iron Box': 'Synix',
  'Nunix Dry Iron Box': 'Nunix',
  'Ipcone Dry Iron Box': 'Ipcone',
  'Ramtons RM/399 1.7L Electric Corded Kettle': 'Ramtons',
  'Modio M93 Tablet': 'Modio',
  'Fridge and TV Guard': 'Lijustore',
  'Von 1.7L Corded Electric Kettle': 'Von',
  'Ailyons 1.7L Electric Cordless Kettle': 'Ailyons',
  'Silver Crest 2-in-1 Blender': 'Silver Crest',
  'Ailyons 1.8L Cordless Electric Kettle': 'Ailyons',
  'Multifunctional Vehicle Inverter 12/24V': 'Lijustore',
  'Office Chair Without Headrest': 'Lijustore',
  'Jump Starter Kit with Digital Compressor': 'Lijustore',
  'Triple Lens 4G Solar Powered Camera': 'Lijustore',
  'Triple Lens WiFi Solar Powered Camera': 'Lijustore',
  'Kitchen Scale 10kg': 'Lijustore',
  'Neelux 100W AC Flood Light': 'Neelux',
  '58mm Bluetooth Thermal Receipt Mobile Printer': 'Lijustore',
  '58mm Mobile Thermal Receipt Printer': 'Lijustore',
  'Multifunctional Jump Starter Kit with Compressor': 'Lijustore',
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getGoogleCategory(category) {
  return googleCategoryMap[category] || 'Home & Garden > Household Appliances';
}

function getBrand(name) {
  return brandMap[name] || 'Lijustore';
}

const items = [];
let match;
while ((match = productRegex.exec(source)) !== null) {
  const [, id, name, price, originalPrice, category, rating, reviews, image, description, stock, badge] = match;
  // badge will be undefined when original matched 'null' (unquoted)

  const priceFormatted = `${parseFloat(price).toFixed(2)} KES`;
  const hasSalePrice = originalPrice !== 'null' && originalPrice !== null;
  const salePriceFormatted = hasSalePrice ? `${parseFloat(originalPrice).toFixed(2)} KES` : null;

  let itemXml = `    <item>
      <g:id>${id}</g:id>
      <g:title>${escapeXml(name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${siteUrl}/product/${id}</g:link>
      <g:image_link>${siteUrl}${escapeXml(image)}</g:image_link>
      <g:price>${priceFormatted}</g:price>`;

  if (hasSalePrice) {
    itemXml += `\n      <g:sale_price>${salePriceFormatted}</g:sale_price>`;
  }

  const stockNum = parseInt(stock, 10);
  itemXml += `\n      <g:availability>${stockNum > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(getBrand(name))}</g:brand>
      <g:google_product_category>${escapeXml(getGoogleCategory(category))}</g:google_product_category>
    </item>`;

  items.push(itemXml);
}

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Lijustore - Product Feed</title>
    <link>${siteUrl}</link>
    <description>Google Merchant product feed for Lijustore Kenya — home appliances, electronics, furniture, and more.</description>

${items.join('\n\n')}
  </channel>
</rss>
`;

writeFileSync(outputFile, feed, 'utf8');
console.log(`Wrote ${items.length} products to ${outputFile}`);
