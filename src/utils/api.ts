// Utility to get the API base URL dynamically
// Public category groups shown throughout the storefront.
export const CATEGORIES = [
  'All',
  'Home Appliances Kenya',
  'Kitchen & Commercial Equipment',
  'Fitness, Outdoor & Kids',
  'Electronics & Entertainment',
  'Furniture & Home Essentials',
  'Home Office Equipment',
  'Security & Safety Equipment',
  'Tools, Electrical & Automotive',
];

const CATEGORY_GROUPS: Record<string, string[]> = {
  'Home Appliances Kenya': ['Home Appliances', 'Home & Living'],
  'Kitchen & Commercial Equipment': ['Kitchen Appliances'],
  'Fitness, Outdoor & Kids': ['Fitness Equipment', 'Kids & Baby', "Toys & Kids' Gifts"],
  'Electronics & Entertainment': ['Electronics', 'Lighting', 'Networking & Communication'],
  'Furniture & Home Essentials': ['Furniture', 'Bathroom Organizers'],
  'Home Office Equipment': ['Office Equipment'],
  'Security & Safety Equipment': ['Security Cameras & Surveillance Systems'],
  'Tools, Electrical & Automotive': ['Automotive Accessories', 'Solar & Power Backup', 'Tools', 'Electrical'],
};

export function getDisplayCategory(category: string) {
  return Object.entries(CATEGORY_GROUPS).find(([, productCategories]) =>
    productCategories.includes(category),
  )?.[0] ?? category;
}

export function productMatchesCategory(productCategory: string, selectedCategory: string) {
  if (selectedCategory === 'All') return true;
  return selectedCategory === productCategory || getDisplayCategory(productCategory) === selectedCategory;
}

// Hard-coded products - all images from public/Photos folder
export const PRODUCTS = [
  { id: 1, name: 'Multifunctional Vehicle Inverter 12/24V', price: 3499.0, originalPrice: null, category: 'Automotive Accessories', rating: 4.6, reviews: 124, image: '/Photos/20260311_111103.jpg', description: 'Multifunctional 12/24V vehicle inverter for reliable power on the go.', stock: 42, badge: 'Bestseller' },
  { id: 3, name: 'Signature Electric Crepe and Chapati Maker', price: 3499.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.2, reviews: 34, image: '/Photos/20260311_172634.jpg', description: 'Electric crepe and chapati maker for quick, even cooking.', stock: 25, badge: 'Sale' },
  { id: 5, name: 'Smart Pro 2-in-1 Blender', price: 2199.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.5, reviews: 42, image: '/Photos/20260408_112058.jpg', description: 'Smart Pro 2-in-1 blender for everyday blending needs.', stock: 18, badge: 'New' },
  { id: 7, name: 'Ipcone 2-in-1 Blender', price: 2099.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.1, reviews: 44, image: '/Photos/20260408_113830.jpg', description: 'Ipcone 2-in-1 blender for smooth blending and daily kitchen prep.', stock: 33, badge: 'Sale' },
  { id: 9, name: 'Premier 20L Knapsack Sprayer', price: 1999.0, originalPrice: null, category: 'Tools', rating: 4.4, reviews: 67, image: '/Photos/20260416_101925.jpg', description: 'Premier 20L knapsack sprayer for garden, farm, and outdoor use.', stock: 11, badge: null },
  { id: 10, name: 'Office Chair Without Headrest', price: 3799.0, originalPrice: null, category: 'Office Equipment', rating: 4.5, reviews: 78, image: '/Photos/20260417_102226.jpg', description: 'Comfortable office chair without headrest for home or workplace use.', stock: 5, badge: 'New' },
  { id: 11, name: 'Bosch 10-Piece Cookware Set', price: 6999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.2, reviews: 35, image: '/Photos/20260417_161008.jpg', description: 'Bosch 10-piece cookware set for reliable everyday cooking.', stock: 7, badge: null },
  { id: 14, name: 'Baofeng BF-888S Radio Call', price: 1299.0, originalPrice: null, category: 'Networking & Communication', rating: 4.5, reviews: 89, image: '/Photos/20260420_122155.jpg', description: 'Baofeng BF-888S radio call handset sold per piece.', stock: 28, badge: 'Bestseller' },
  { id: 15, name: '58mm Bluetooth Thermal Receipt Mobile Printer', price: 3499.0, originalPrice: null, category: 'Office Equipment', rating: 4.4, reviews: 67, image: '/Photos/20260421_161011.jpg', description: 'Portable 58mm Bluetooth thermal receipt printer for mobile business use.', stock: 45, badge: null },
  { id: 17, name: 'Jump Starter Kit with Digital Compressor', price: 5999.0, originalPrice: null, category: 'Automotive Accessories', rating: 4.6, reviews: 71, image: '/Photos/20260422_142502.jpg', description: 'Jump starter kit with digital compressor for emergency vehicle support.', stock: 31, badge: 'New' },
  { id: 19, name: 'Triple Lens 4G Solar Powered Camera', price: 7499.0, originalPrice: null, category: 'Security Cameras & Surveillance Systems', rating: 4.2, reviews: 41, image: '/Photos/20260422_181306.jpg', description: 'Triple lens 4G solar powered camera for outdoor surveillance.', stock: 16, badge: 'Sale' },
  { id: 21, name: 'Edenberg 12-Piece Cookware Set', price: 8999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.3, reviews: 55, image: '/Photos/20260423_175912.jpg', description: 'Edenberg 12-piece cookware set for complete kitchen cooking needs.', stock: 10, badge: null },
  { id: 23, name: 'Triple Lens WiFi Solar Powered Camera', price: 7499.0, originalPrice: null, category: 'Security Cameras & Surveillance Systems', rating: 4.4, reviews: 68, image: '/Photos/20260430_121709.jpg', description: 'Triple lens WiFi solar powered camera for home and business security.', stock: 6, badge: null },
  { id: 24, name: 'Kitchen Scale 10kg', price: 799.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.6, reviews: 112, image: '/Photos/20260430_155354.jpg', description: '10kg kitchen scale for accurate weighing during food prep.', stock: 24, badge: 'Sale' },
  { id: 25, name: 'Neelux 100W AC Flood Light', price: 1499.0, originalPrice: null, category: 'Lighting', rating: 4.3, reviews: 46, image: '/Photos/20260430_160913.jpg', description: 'Neelux 100W AC flood light for bright outdoor illumination.', stock: 35, badge: 'Bestseller' },
  { id: 27, name: 'Nunix 2-in-1 Blender', price: 2099.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.5, reviews: 81, image: '/Photos/20260430_161341.jpg', description: 'Nunix 2-in-1 blender for everyday kitchen blending.', stock: 55, badge: null },
  { id: 29, name: 'Bosch 6L Electric Pressure Cooker', price: 4999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.6, reviews: 88, image: '/Photos/20260430_161905.jpg', description: 'Bosch 6L electric pressure cooker for fast, convenient meals.', stock: 19, badge: null },
  { id: 31, name: 'Signature 4-in-1 Blender', price: 4799.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.5, reviews: 65, image: '/Photos/20260430_180243.jpg', description: 'Signature 4-in-1 blender for versatile kitchen preparation.', stock: 29, badge: 'Sale' },
  { id: 32, name: '58mm Mobile Thermal Receipt Printer', price: 3499.0, originalPrice: null, category: 'Office Equipment', rating: 4.4, reviews: 59, image: '/Photos/20260501_105328.jpg', description: '58mm mobile thermal receipt printer for quick receipt printing.', stock: 8, badge: null },
  { id: 34, name: 'Nduthi Style Kids Bike 16 Inch', price: 7499.0, originalPrice: null, category: 'Kids & Baby', rating: 4.2, reviews: 62, image: '/Photos/20260509_130926.jpg', description: '16-inch nduthi style kids bike for young riders.', stock: 32, badge: null },
  { id: 36, name: 'Automatic Money Counting Machine', price: 9998.0, originalPrice: null, category: 'Office Equipment', rating: 4.4, reviews: 74, image: '/Photos/20260509_175745.jpg', description: 'Automatic bill counter for fast and accurate cash counting.', stock: 11, badge: 'Bestseller' },
  { id: 37, name: 'Lady Bird Kids Bicycle 16 Inch', price: 6499.0, originalPrice: null, category: 'Kids & Baby', rating: 4.7, reviews: 109, image: '/Photos/20260511_162916.jpg', description: '16-inch Lady Bird kids bicycle for comfortable riding.', stock: 4, badge: null },
  { id: 40, name: 'Nunix 2-Burner Table Top Gas Cooker', price: 1999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.2, reviews: 51, image: '/Photos/20260512_122039.jpg', description: 'Nunix 2-burner table top gas cooker for compact cooking spaces.', stock: 20, badge: null },
  { id: 42, name: 'GSM Landline Dual SIM Phone 6588', price: 2999.0, originalPrice: null, category: 'Networking & Communication', rating: 4.3, reviews: 56, image: '/Photos/20260514_105923.jpg', description: 'GSM landline phone with dual SIM support, model 6588.', stock: 27, badge: 'New' },
  { id: 44, name: 'Dual Lens 4G Solar Powered CCTV Camera', price: 6499.0, originalPrice: null, category: 'Security Cameras & Surveillance Systems', rating: 4.5, reviews: 93, image: '/Photos/20260514_115725.jpg', description: 'Dual lens 4G solar powered CCTV camera for reliable surveillance.', stock: 52, badge: null },
  { id: 46, name: 'Ergonomic Office Chair Without Headrest', price: 3999.0, originalPrice: null, category: 'Office Equipment', rating: 4.4, reviews: 73, image: '/Photos/20260514_120806.jpg', description: 'Ergonomic office chair without headrest for comfortable work sessions.', stock: 30, badge: 'Sale' },
  { id: 48, name: 'Kids Piggy Bank', price: 1999.0, originalPrice: null, category: 'Kids & Baby', rating: 4.5, reviews: 82, image: '/Photos/20260515_113922.jpg', description: 'Kids piggy bank for fun saving habits.', stock: 7, badge: null },
  { id: 49, name: 'Kids Piggy Bank', price: 2499.0, originalPrice: null, category: 'Kids & Baby', rating: 4.5, reviews: 101, image: '/Photos/20260515_114842.jpg', description: 'Kids piggy bank for encouraging simple saving habits.', stock: 10, badge: 'Sale' },
  { id: 50, name: 'Kids Piggy Bank', price: 2499.0, originalPrice: null, category: 'Kids & Baby', rating: 4.3, reviews: 63, image: '/Photos/20260515_115047.jpg', description: 'Kids piggy bank for storing coins and small savings.', stock: 15, badge: 'Bestseller' },
  { id: 51, name: 'Ailyons 1.8L Electric Cordless Kettle', price: 1299.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.4, reviews: 80, image: '/Photos/20260520_121813.jpg', description: 'Ailyons 1.8L electric cordless kettle for quick boiling.', stock: 17, badge: null },
  { id: 53, name: 'Synix Steam Iron Box', price: 2299.0, originalPrice: null, category: 'Home Appliances', rating: 4.4, reviews: 69, image: '/Photos/20260521_141407.jpg', description: 'Synix steam iron box for neat, wrinkle-free clothes.', stock: 25, badge: 'Sale' },
  { id: 55, name: 'Nunix Dry Iron Box', price: 999.0, originalPrice: null, category: 'Home Appliances', rating: 4.7, reviews: 122, image: '/Photos/20260521_142128.jpg', description: 'Nunix dry iron box for everyday ironing.', stock: 13, badge: 'Bestseller' },
  { id: 57, name: 'Ipcone Dry Iron Box', price: 999.0, originalPrice: null, category: 'Home Appliances', rating: 4.4, reviews: 75, image: '/Photos/20260521_142549.jpg', description: 'Ipcone dry iron box for simple daily ironing.', stock: 46, badge: 'Sale' },
  { id: 59, name: 'Ramtons RM/399 1.7L Electric Corded Kettle', price: 1999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.6, reviews: 98, image: '/Photos/20260521_142949.jpg', description: 'Ramtons RM/399 1.7L electric corded kettle for dependable boiling.', stock: 5, badge: 'Bestseller' },
  { id: 62, name: 'Modio M93 Tablet', price: 12999.0, originalPrice: null, category: 'Electronics', rating: 4.3, reviews: 64, image: '/Photos/20260522_114004.jpg', description: 'Modio M93 tablet for entertainment, learning, and everyday use.', stock: 19, badge: 'Sale' },
  { id: 63, name: 'Fridge and TV Guard', price: 899.0, originalPrice: null, category: 'Electrical', rating: 4.6, reviews: 104, image: '/Photos/20260525_123449.jpg', description: 'Fridge and TV guard for appliance power protection.', stock: 20, badge: 'Bestseller' },
  { id: 65, name: 'Multifunctional Vehicle Inverter 12/24V', price: 3399.0, originalPrice: null, category: 'Automotive Accessories', rating: 4.7, reviews: 130, image: '/Photos/20260525_143428.jpg', description: 'Multifunctional 12/24V vehicle inverter for powering devices while travelling.', stock: 6, badge: 'New' },
  { id: 67, name: 'Von 1.7L Corded Electric Kettle', price: 1999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.4, reviews: 76, image: '/Photos/20260526_093538.jpg', description: 'Von 1.7L corded electric kettle for fast water boiling.', stock: 29, badge: null },
  { id: 69, name: 'Ailyons 1.7L Electric Cordless Kettle', price: 25999.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.8, reviews: 127, image: '/Photos/20260526_104933.jpg', description: 'Ailyons 1.7L electric cordless kettle for convenient boiling.', stock: 1, badge: 'New' },
  { id: 71, name: 'Silver Crest 2-in-1 Blender', price: 2499.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.5, reviews: 87, image: '/Photos/20260526_105738.jpg', description: 'Silver Crest 2-in-1 blender for smooth blending and kitchen prep.', stock: 40, badge: 'Sale' },
  { id: 73, name: 'Multifunctional Jump Starter Kit with Compressor', price: 4499.0, originalPrice: null, category: 'Automotive Accessories', rating: 4.6, reviews: 110, image: '/Photos/20260526_114736.jpg', description: 'Multifunctional jump starter kit with compressor for vehicle emergencies.', stock: 13, badge: null },
  { id: 76, name: 'Ailyons 1.8L Cordless Electric Kettle', price: 2899.0, originalPrice: null, category: 'Kitchen Appliances', rating: 4.6, reviews: 167, image: '/Photos/ailyons 1.8L fk03201.jpg', description: 'Ailyons 1.8L cordless electric kettle for quick and convenient boiling.', stock: 41, badge: 'Bestseller' },
];
