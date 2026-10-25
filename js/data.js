/**
 * data.js – Authentic Ragnarok Online Database
 * Grounded in RateMyServer Item Database (Pre-re) & Classic Refine Tables
 * Weapon Lv 1: Phracon (Safe +7)
 * Weapon Lv 2: Emveretarcon (Safe +6)
 * Weapon Lv 3: Oridecon (Safe +5)
 * Weapon Lv 4: Oridecon (Safe +4)
 * Armor: Elunium (Safe +4)
 */

// ---- Equipment Catalog ----
const EQUIPMENT = [
  // ========================
  // WEAPON LEVEL 1 (Uses Phracon, Safe to +7)
  // ========================
  {
    id: 'knife',
    itemId: 1201,
    name: 'Knife [3]',
    icon: 'images/items/1201.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Dagger',
    baseAtk: 17,
    slots: 3,
    price: 50,
    sellPrice: 25,
    desc: 'มีดสั้นพื้นฐาน เหมาะสำหรับผู้เริ่มต้นและโนวิซ',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'cutter',
    itemId: 1202,
    name: 'Cutter [3]',
    icon: 'images/items/1202.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Dagger',
    baseAtk: 30,
    slots: 3,
    price: 1250,
    sellPrice: 625,
    desc: 'มีดคัตเตอร์คมกริบ เพิ่มพลังโจมตีในระดับเริ่มต้น',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'main_gauche',
    itemId: 1207,
    name: 'Main Gauche [4]',
    icon: 'images/items/1207.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Dagger',
    baseAtk: 43,
    slots: 4,
    price: 2400,
    sellPrice: 1200,
    desc: 'มีดสั้น 4 รู ยอดนิยมตลอดกาลสำหรับใส่การ์ดเฉพาะทาง',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'short_sword',
    itemId: 1101,
    name: 'Short Sword [2]',
    icon: 'images/items/1101.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'One-handed Sword',
    baseAtk: 24,
    slots: 2,
    price: 200,
    sellPrice: 100,
    desc: 'ดาบสั้นน้ำหนักเบา ควงได้คล่องแคล่ว',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'rod',
    itemId: 1601,
    name: 'Rod [3]',
    icon: 'images/items/1601.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Staff',
    baseAtk: 15,
    matkRate: 15,
    slots: 3,
    price: 50,
    sellPrice: 25,
    desc: 'คทาเวทมนตร์สำหรับนักเวทย์เริ่มต้น เพิ่ม MATK 15%',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'bow',
    itemId: 1701,
    name: 'Bow [3]',
    icon: 'images/items/1701.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Bow',
    baseAtk: 15,
    slots: 3,
    price: 1000,
    sellPrice: 500,
    desc: 'ธนูไม้ธรรมดา ใช้งานง่าย ระยะยิงไกล',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'axe',
    itemId: 1301,
    name: 'Axe [3]',
    icon: 'images/items/1301.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Axe',
    baseAtk: 38,
    slots: 3,
    price: 500,
    sellPrice: 250,
    desc: 'ขวานมือเดียวขนาดกะทัดรัด สำหรับพ่อค้าและนักรบ',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'club',
    itemId: 1501,
    name: 'Club [3]',
    icon: 'images/items/1501.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Mace',
    baseAtk: 23,
    slots: 3,
    price: 250,
    sellPrice: 125,
    desc: 'กระบองไม้เนื้อแข็ง ไม่เสียหายง่าย',
    refineMat: 'phracon',
    safeLevel: 7
  },
  {
    id: 'jur',
    itemId: 1250,
    name: 'Jur [3]',
    icon: 'images/items/1250.gif',
    type: 'Weapon',
    weaponLevel: 1,
    subClass: 'Katar',
    baseAtk: 60,
    slots: 3,
    price: 2800,
    sellPrice: 1400,
    desc: 'กรงเล็บสังหาร 3 รู สำหรับแอสซาสซิน',
    refineMat: 'phracon',
    safeLevel: 7
  },

  // ========================
  // WEAPON LEVEL 2 (Uses Emveretarcon, Safe to +6)
  // ========================
  {
    id: 'stiletto',
    itemId: 1213,
    name: 'Stiletto [3]',
    icon: 'images/items/1213.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Dagger',
    baseAtk: 87,
    slots: 3,
    price: 19800,
    sellPrice: 9900,
    desc: 'มีดสเตเล็ตโตปลายแหลมสูง พลังโจมตีรวดเร็วและแม่นยำ',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'blade',
    itemId: 1107,
    name: 'Blade [3]',
    icon: 'images/items/1107.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'One-handed Sword',
    baseAtk: 53,
    slots: 3,
    price: 2900,
    sellPrice: 1450,
    desc: 'ดาบเบลดมาตรฐาน คมสองด้าน เหมาะแก่การตีบวกสูง',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'ring_pommel',
    itemId: 1113,
    name: 'Ring Pommel Saber [3]',
    icon: 'images/items/1113.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'One-handed Sword',
    baseAtk: 100,
    slots: 3,
    price: 24000,
    sellPrice: 12000,
    desc: 'ดาบเซเบอร์ด้ามห่วง น้ำหนักสมดุลยอดเยี่ยม',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'katana',
    itemId: 1154,
    name: 'Katana [4]',
    icon: 'images/items/1154.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Two-handed Sword',
    baseAtk: 60,
    slots: 4,
    price: 2000,
    sellPrice: 1000,
    desc: 'ดาบซามูไร 4 รู ยอดฮิตสำหรับการตีบวก +10 ใส่การ์ดแมงแดง/มดลาย',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'bastard_sword',
    itemId: 1157,
    name: 'Bastard Sword [3]',
    icon: 'images/items/1157.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Two-handed Sword',
    baseAtk: 115,
    slots: 3,
    price: 22500,
    sellPrice: 11250,
    desc: 'ดาบสองมือขนาดใหญ่ สร้างความเสียหายรุนแรง',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'wand',
    itemId: 1604,
    name: 'Wand [2]',
    icon: 'images/items/1604.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Staff',
    baseAtk: 45,
    matkRate: 15,
    slots: 2,
    price: 2500,
    sellPrice: 1250,
    desc: 'คทาเวทมนตร์เลเวล 2 เพิ่มพลังคาถา MATK 15%',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'composite_bow',
    itemId: 1704,
    name: 'Composite Bow [4]',
    icon: 'images/items/1704.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Bow',
    baseAtk: 29,
    slots: 4,
    price: 2500,
    sellPrice: 1250,
    desc: 'ธนูคอมโพสิต 4 รู ราชาแห่งธนูการ์ดผสมสำหรับ Hunter',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'crossbow',
    itemId: 1707,
    name: 'Crossbow [3]',
    icon: 'images/items/1707.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Bow',
    baseAtk: 65,
    slots: 3,
    price: 17000,
    sellPrice: 8500,
    desc: 'หน้าไม้พลังสูง ยิงลูกธนูได้รุนแรงต่อเนื่อง',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'mace',
    itemId: 1504,
    name: 'Mace [3]',
    icon: 'images/items/1504.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Mace',
    baseAtk: 37,
    slots: 3,
    price: 1600,
    sellPrice: 800,
    desc: 'กระบองเหล็กหนา ไม่เสียหายจากการต่อสู้',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'chain',
    itemId: 1510,
    name: 'Chain [3]',
    icon: 'images/items/1510.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Mace',
    baseAtk: 84,
    slots: 3,
    price: 23000,
    sellPrice: 11500,
    desc: 'กระบองโซ่ 3 รู ยอดนิยมสูงสุดของพรีสต์สายทุบและมองก์',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },
  {
    id: 'jamadhar',
    itemId: 1252,
    name: 'Jamadhar [1]',
    icon: 'images/items/1252.gif',
    type: 'Weapon',
    weaponLevel: 2,
    subClass: 'Katar',
    baseAtk: 165,
    slots: 1,
    price: 37000,
    sellPrice: 18500,
    desc: 'กาตาร์เลเวล 2 พลังโจมตีมหาศาลสำหรับแอสซาสซิน',
    refineMat: 'emveretarcon',
    safeLevel: 6
  },

  // ========================
  // WEAPON LEVEL 3 (Uses Oridecon, Safe to +5)
  // ========================
  {
    id: 'gladius',
    itemId: 1219,
    name: 'Gladius [3]',
    icon: 'images/items/1219.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Dagger',
    baseAtk: 105,
    slots: 3,
    price: 43000,
    sellPrice: 21500,
    desc: 'มีดกลาเดียส 3 รู สุดยอดมีดตีบวกสำหรับสายมีดฟันรัว',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'damascus',
    itemId: 1224,
    name: 'Damascus [1]',
    icon: 'images/items/1224.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Dagger',
    baseAtk: 118,
    slots: 1,
    price: 49000,
    sellPrice: 24500,
    desc: 'มีดดามัสกัส ทนทานเป็นเลิศและไม่พังเสียหาย',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'haedonggum',
    itemId: 1124,
    name: 'Haedonggum [2]',
    icon: 'images/items/1124.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'One-handed Sword',
    baseAtk: 120,
    slots: 2,
    price: 50000,
    sellPrice: 25000,
    desc: 'ดาบแฮดงกัม เพิ่ม INT+3 และพลังโจมตีสูง',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'saber',
    itemId: 1123,
    name: 'Saber [3]',
    icon: 'images/items/1123.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'One-handed Sword',
    baseAtk: 115,
    slots: 3,
    price: 49000,
    sellPrice: 24500,
    desc: 'ดาบเซเบอร์ 3 รู ดาบมือเดียวที่เหมาะกับการใส่การ์ดเฉพาะเผ่า/ขนาด',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'two_handed_sword',
    itemId: 1160,
    name: 'Two-Handed Sword [2]',
    icon: 'images/items/1160.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Two-handed Sword',
    baseAtk: 160,
    slots: 2,
    price: 60000,
    sellPrice: 30000,
    desc: 'ดาบสองมือทรงพลัง คลาสสิกของไนท์สาย Two-Hand Quicken',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'claymore',
    itemId: 1163,
    name: 'Claymore [0]',
    icon: 'images/items/1163.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Two-handed Sword',
    baseAtk: 180,
    slots: 0,
    price: 74000,
    sellPrice: 37000,
    desc: 'ดาบเคลย์มอร์ขนาดมหึมา พลังทำลายล้างสูงสุดในบรรดาร้านค้า',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'arbalest',
    itemId: 1713,
    name: 'Arbalest [1]',
    icon: 'images/items/1713.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Bow',
    baseAtk: 90,
    slots: 1,
    price: 48000,
    sellPrice: 24000,
    desc: 'ธนูอาร์บาเลสต์ เพิ่ม DEX + 2 แม่นยำและรุนแรง',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'gakkung',
    itemId: 1714,
    name: 'Gakkung Bow [1]',
    icon: 'images/items/1714.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Bow',
    baseAtk: 100,
    slots: 1,
    price: 42000,
    sellPrice: 21000,
    desc: 'ธนูคักคุงสไตล์เกาหลี ดีดสายยิงได้อย่างทรงพลัง',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'hunter_bow',
    itemId: 1718,
    name: 'Hunter Bow [0]',
    icon: 'images/items/1718.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Bow',
    baseAtk: 125,
    slots: 0,
    price: 64000,
    sellPrice: 32000,
    desc: 'ธนูสำหรับนักล่าโดยเฉพาะ เมื่อใช้คู่กับ Hunting Arrow เพิ่มดาเมจ 50%',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'arc_wand',
    itemId: 1610,
    name: 'Arc Wand [1]',
    icon: 'images/items/1610.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Staff',
    baseAtk: 60,
    matkRate: 15,
    slots: 1,
    price: 45000,
    sellPrice: 22500,
    desc: 'คทาอาร์กแวนด์ INT + 3, MATK + 15% คทายอดนิยมของวิซาร์ด',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'stunner',
    itemId: 1522,
    name: 'Stunner [0]',
    icon: 'images/items/1522.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Mace',
    baseAtk: 140,
    slots: 0,
    price: 60000,
    sellPrice: 30000,
    desc: 'กระบองสตันเนอร์ มีโอกาสทำให้ศัตรูติดสถานะ Stun มึนงง',
    refineMat: 'oridecon',
    safeLevel: 5
  },
  {
    id: 'katar_l3',
    itemId: 1251,
    name: 'Katar [1]',
    icon: 'images/items/1251.gif',
    type: 'Weapon',
    weaponLevel: 3,
    subClass: 'Katar',
    baseAtk: 148,
    slots: 1,
    price: 61000,
    sellPrice: 30500,
    desc: 'กาตาร์เลเวล 3 กรงเล็บแห่งความเงียบสังหาร',
    refineMat: 'oridecon',
    safeLevel: 5
  },

  // ========================
  // WEAPON LEVEL 4 (Uses Oridecon, Safe to +4)
  // ========================
  {
    id: 'muramasa',
    itemId: 1164,
    name: 'Muramasa [0]',
    icon: 'images/items/1164.gif',
    type: 'Weapon',
    weaponLevel: 4,
    subClass: 'Two-handed Sword',
    baseAtk: 155,
    slots: 0,
    price: 250000,
    sellPrice: 100000,
    desc: 'ดาบมารมุรามาสะ เพิ่ม CRI + 30, ASPD + 8% ดาบในตำนานของไนท์สายคริ',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'dragon_slayer',
    itemId: 1166,
    name: 'Dragon Slayer [1]',
    icon: 'images/items/1166.gif',
    type: 'Weapon',
    weaponLevel: 4,
    subClass: 'Two-handed Sword',
    baseAtk: 150,
    slots: 1,
    price: 180000,
    sellPrice: 80000,
    desc: 'ดาบพิฆาตมังกร ทะลวงพลังป้องกันของมอนสเตอร์เผ่ามังกรทั้งหมด',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'infiltrator',
    itemId: 1259,
    name: 'Infiltrator [0]',
    icon: 'images/items/1259.gif',
    type: 'Weapon',
    weaponLevel: 4,
    subClass: 'Katar',
    baseAtk: 140,
    slots: 0,
    price: 220000,
    sellPrice: 90000,
    desc: 'อินฟิลทราเตอร์ สุดยอดกาตาร์เพิ่มความเสียหายต่อกึ่งมนุษย์ 50%',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'rudra_bow',
    itemId: 1720,
    name: 'Rudra Bow [0]',
    icon: 'images/items/1720.gif',
    type: 'Weapon',
    weaponLevel: 4,
    subClass: 'Bow',
    baseAtk: 150,
    slots: 0,
    price: 200000,
    sellPrice: 85000,
    desc: 'ธนูรูดรา ธนูธาตุศักดิ์สิทธิ์ สามารถร่าย Heal และ Cure ได้',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'wizardry_staff',
    itemId: 1617,
    name: 'Wizardry Staff [0]',
    icon: 'images/items/1617.gif',
    type: 'Weapon',
    weaponLevel: 4,
    subClass: 'Staff',
    baseAtk: 120,
    matkRate: 15,
    slots: 0,
    price: 260000,
    sellPrice: 110000,
    desc: 'ไม้เท้าวิซาร์ดรีชั้นครู เพิ่ม INT + 6, DEX + 2 ลดเวลาร่ายเวทมนตร์',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'gungnir',
    itemId: 1413,
    name: 'Gungnir [0]',
    icon: 'images/items/1413.gif',
    type: 'Weapon',
    weaponLevel: 4,
    isGod: true,
    subClass: 'Spear',
    baseAtk: 120,
    slots: 0,
    price: 210000,
    sellPrice: 95000,
    desc: 'หอกกุงเนียร์แห่งเทพโอดิน ธาตุลมและโจมตีโดนเป้าหมายแน่นอน 100%',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'excalibur',
    itemId: 1128,
    name: 'Excalibur [0]',
    icon: 'images/items/1128.gif',
    type: 'Weapon',
    weaponLevel: 4,
    isGod: true,
    subClass: 'One-handed Sword',
    baseAtk: 150,
    slots: 0,
    price: 320000,
    sellPrice: 140000,
    desc: 'ดาบศักดิ์สิทธิ์เอกซ์คาลิเบอร์ ธาตุ Holy เพิ่ม INT + 5, LUK + 10',
    refineMat: 'oridecon',
    safeLevel: 4
  },
  {
    id: 'angra_manyu',
    itemId: 1599,
    name: 'Angra Manyu [0]',
    icon: 'images/items/1599.gif',
    type: 'Weapon',
    weaponLevel: 4,
    isGod: true,
    subClass: 'Mace',
    baseAtk: 200,
    slots: 0,
    price: 1000000,
    sellPrice: 500000,
    desc: 'อาวุธระดับพระเจ้า! ATK+3800, MATK+200%, ดูดเลือดและฟันรัว 100%',
    refineMat: 'oridecon',
    safeLevel: 4
  },

  // ========================
  // ARMOR (All use Elunium, Safe to +4)
  // ========================
  {
    id: 'cotton_shirt',
    itemId: 2301,
    name: 'Cotton Shirt [0]',
    icon: 'images/items/2301.gif',
    type: 'Armor',
    subClass: 'Armor',
    baseDef: 10,
    slots: 0,
    price: 10,
    sellPrice: 5,
    desc: 'เสื้อผ้าฝ้ายเบาสบาย ชุดเริ่มต้นของนักเดินทาง',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'leather_jacket',
    itemId: 2303,
    name: 'Leather Jacket [1]',
    icon: 'images/items/2303.gif',
    type: 'Armor',
    subClass: 'Armor',
    baseDef: 16,
    slots: 1,
    price: 1000,
    sellPrice: 500,
    desc: 'เสื้อแจ็คเก็ตหนังฟอก ทนทานต่อลมและฝุ่นทราย',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'wooden_mail',
    itemId: 2307,
    name: 'Wooden Mail [0]',
    icon: 'images/items/2307.gif',
    type: 'Armor',
    subClass: 'Armor',
    baseDef: 23,
    slots: 0,
    price: 5500,
    sellPrice: 2750,
    desc: 'เกราะไม้ทำจากเปลือกไม้ทนทาน ป้องกันได้ดี',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'chain_mail',
    itemId: 2314,
    name: 'Chain Mail [1]',
    icon: 'images/items/2314.gif',
    type: 'Armor',
    subClass: 'Armor',
    baseDef: 35,
    slots: 1,
    price: 65000,
    sellPrice: 32500,
    desc: 'เกราะโซ่ถัก 1 รู เกราะยอดนิยมระดับกลางของนักรบทุกคน',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'full_plate',
    itemId: 2321,
    name: 'Full Plate [1]',
    icon: 'images/items/2321.gif',
    type: 'Armor',
    subClass: 'Armor',
    baseDef: 48,
    slots: 1,
    price: 120000,
    sellPrice: 60000,
    desc: 'เกราะฟูลเพลทเหล็กกล้าทั้งตัว ป้องกันการโจมตีทางกายภาพได้สูงสุด',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'guard',
    itemId: 2101,
    name: 'Guard [1]',
    icon: 'images/items/2101.gif',
    type: 'Armor',
    subClass: 'Shield',
    baseDef: 12,
    slots: 1,
    price: 500,
    sellPrice: 250,
    desc: 'โล่ขนาดเล็ก น้ำหนักเบา ป้องกันการโจมตีเบื้องต้น',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'buckler',
    itemId: 2103,
    name: 'Buckler [1]',
    icon: 'images/items/2103.gif',
    type: 'Armor',
    subClass: 'Shield',
    baseDef: 18,
    slots: 1,
    price: 14000,
    sellPrice: 7000,
    desc: 'โล่บัคเลอร์ทรงกลม โล่ยอดฮิตสำหรับใส่การ์ดกบแดงกันคน',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'shield',
    itemId: 2105,
    name: 'Shield [1]',
    icon: 'images/items/2105.gif',
    type: 'Armor',
    subClass: 'Shield',
    baseDef: 25,
    slots: 1,
    price: 56000,
    sellPrice: 28000,
    desc: 'โล่เหล็กขนาดใหญ่สำหรับไนท์และครูเซเดอร์',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'valkyrja_shield',
    itemId: 2115,
    name: "Valkyrja's Shield [1]",
    icon: 'images/items/2115.gif',
    type: 'Armor',
    subClass: 'Shield',
    baseDef: 38,
    slots: 1,
    price: 350000,
    sellPrice: 150000,
    desc: 'โล่วาลคิรี! ลดความเสียหายจากธาตุน้ำ, ไฟ, มืด, ผีดิบ 20% และ MDEF + 5',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'hood',
    itemId: 2501,
    name: 'Hood [1]',
    icon: 'images/items/2501.gif',
    type: 'Armor',
    subClass: 'Garment',
    baseDef: 8,
    slots: 1,
    price: 1000,
    sellPrice: 500,
    desc: 'ผ้าคลุมศีรษะธรรมดา สวมใส่ได้ทุกอาชีพ',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'muffler',
    itemId: 2503,
    name: 'Muffler [1]',
    icon: 'images/items/2503.gif',
    type: 'Armor',
    subClass: 'Garment',
    baseDef: 12,
    slots: 1,
    price: 15000,
    sellPrice: 7500,
    desc: 'ผ้าพันคอ 1 รู ยอดนิยมสำหรับใส่การ์ดวิสเปอร์หรือเรดิก',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'manteau',
    itemId: 2505,
    name: 'Manteau [1]',
    icon: 'images/items/2505.gif',
    type: 'Armor',
    subClass: 'Garment',
    baseDef: 18,
    slots: 1,
    price: 52000,
    sellPrice: 26000,
    desc: 'ผ้าคลุมแมนโตเนื้อหนา ป้องกันการโจมตีได้อย่างดีเยี่ยม',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'shoes',
    itemId: 2403,
    name: 'Shoes [1]',
    icon: 'images/items/2403.gif',
    type: 'Armor',
    subClass: 'Footgear',
    baseDef: 12,
    slots: 1,
    price: 12000,
    sellPrice: 6000,
    desc: 'รองเท้า 1 รู ยอดนิยมสำหรับใส่การ์ดโซฮีหรือมาดาร์เกอร์',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'boots',
    itemId: 2405,
    name: 'Boots [1]',
    icon: 'images/items/2405.gif',
    type: 'Armor',
    subClass: 'Footgear',
    baseDef: 16,
    slots: 1,
    price: 38000,
    sellPrice: 19000,
    desc: 'รองเท้าบูทเหล็กแข็งแกร่ง สำหรับอาชีพสายต่อสู้',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'helm',
    itemId: 2228,
    name: 'Helm [1]',
    icon: 'images/items/2228.gif',
    type: 'Armor',
    subClass: 'Headgear',
    baseDef: 18,
    slots: 1,
    price: 44000,
    sellPrice: 22000,
    desc: 'หมวกเหล็กหนาคลุมทั้งศีรษะ ป้องกันได้สูงสุด',
    refineMat: 'elunium',
    safeLevel: 4
  },
  {
    id: 'angel_wing',
    itemId: 2254,
    name: 'Angel Wing [0]',
    icon: 'images/items/2254.gif',
    type: 'Armor',
    subClass: 'Headgear',
    baseDef: 15,
    slots: 0,
    price: 300000,
    sellPrice: 120000,
    desc: 'ปีกนางฟ้า! AGI + 2, LUK + 2 และ MDEF + 3 หมวกแฟชั่นในตำนาน',
    refineMat: 'elunium',
    safeLevel: 4
  }
];

// ---- Materials Catalog ----
const MATERIALS = [
  {
    id: 'phracon',
    itemId: 1010,
    name: 'Phracon',
    icon: 'images/items/1010.gif',
    desc: 'หินตีบวกอาวุธ Level 1 (ปลอดภัยถึง +7)',
    buyPrice: 200,
    sellPrice: 100,
    category: 'refine'
  },
  {
    id: 'emveretarcon',
    itemId: 1011,
    name: 'Emveretarcon',
    icon: 'images/items/1011.gif',
    desc: 'หินตีบวกอาวุธ Level 2 (ปลอดภัยถึง +6)',
    buyPrice: 1000,
    sellPrice: 500,
    category: 'refine'
  },
  {
    id: 'oridecon',
    itemId: 984,
    name: 'Oridecon',
    icon: 'images/items/984.gif',
    desc: 'หินแร่บริสุทธิ์ สำหรับตีบวกอาวุธ Level 3 และ 4',
    buyPrice: 15000,
    sellPrice: 7500,
    category: 'refine'
  },
  {
    id: 'elunium',
    itemId: 985,
    name: 'Elunium',
    icon: 'images/items/985.gif',
    desc: 'หินแร่ศักดิ์สิทธิ์ สำหรับตีบวกเครื่องป้องกันและชุดเกราะทุกชนิด (ปลอดภัยถึง +4)',
    buyPrice: 15000,
    sellPrice: 7500,
    category: 'refine'
  },
  {
    id: 'rough_oridecon',
    itemId: 756,
    name: 'Rough Oridecon',
    icon: 'images/items/756.gif',
    desc: 'เศษแร่โอริเดคอน (รวบรวมครบ 5 ก้อน สามารถหลอมเป็น Oridecon ได้ 1 ก้อน)',
    buyPrice: 2500,
    sellPrice: 1200,
    category: 'refine'
  },
  {
    id: 'rough_elunium',
    itemId: 757,
    name: 'Rough Elunium',
    icon: 'images/items/757.gif',
    desc: 'เศษแร่อีลูเนียม (รวบรวมครบ 5 ก้อน สามารถหลอมเป็น Elunium ได้ 1 ก้อน)',
    buyPrice: 2500,
    sellPrice: 1200,
    category: 'refine'
  },
  {
    id: 'enriched_o',
    itemId: 7619,
    name: 'Enriched Oridecon',
    icon: 'images/items/7619.gif',
    desc: 'โอริเดคอนเกรดพิเศษ เพิ่มอัตราความสำเร็จในการตีบวกอาวุธอย่างมาก',
    buyPrice: 65000,
    sellPrice: 25000,
    category: 'refine'
  },
  {
    id: 'enriched_e',
    itemId: 7620,
    name: 'Enriched Elunium',
    icon: 'images/items/7620.gif',
    desc: 'อีลูเนียมเกรดพิเศษ เพิ่มอัตราความสำเร็จในการตีบวกชุดเกราะอย่างมาก',
    buyPrice: 65000,
    sellPrice: 25000,
    category: 'refine'
  },
  {
    id: 'obb',
    itemId: 603,
    name: 'Old Blue Box (OBB)',
    icon: 'images/items/603.gif',
    desc: 'กล่องสมบัติสีฟ้าโบราณ กดเปิดเพื่อสุ่มรับอาวุธและชุดเกราะระดับ 1 - 3!',
    buyPrice: 30000,
    sellPrice: 12000,
    category: 'box',
    isUsable: true
  },
  {
    id: 'ovb',
    itemId: 617,
    name: 'Old Violet Box (OVB)',
    icon: 'images/items/617.gif',
    desc: 'กล่องสมบัติสีม่วงลึกลับ กดเปิดเพื่อสุ่มรับอาวุธและอุปกรณ์หายากระดับ 3 - 4!',
    buyPrice: 120000,
    sellPrice: 50000,
    category: 'box',
    isUsable: true
  }
];

// ============================================================
// OFFICIAL CLASSIC RAGNAROK ONLINE REFINE SUCCESS RATES
// Array index = current level (0 = +0 to +1, 1 = +1 to +2, ..., 9 = +9 to +10)
// ============================================================
const REFINE_RATES_CLASSIC = {
  // Weapon Level 1 (Safe to +7)
  weapon_lv1: {
    normal:   [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.60, 0.40, 0.20],
    enriched: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.85, 0.70, 0.50]
  },
  // Weapon Level 2 (Safe to +6)
  weapon_lv2: {
    normal:   [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.60, 0.40, 0.20, 0.20],
    enriched: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.80, 0.65, 0.45, 0.40]
  },
  // Weapon Level 3 (Safe to +5)
  weapon_lv3: {
    normal:   [1.00, 1.00, 1.00, 1.00, 1.00, 0.60, 0.50, 0.30, 0.20, 0.20],
    enriched: [1.00, 1.00, 1.00, 1.00, 1.00, 0.80, 0.70, 0.50, 0.40, 0.35]
  },
  // Weapon Level 4 (Safe to +4)
  weapon_lv4: {
    normal:   [1.00, 1.00, 1.00, 1.00, 0.60, 0.40, 0.40, 0.20, 0.20, 0.10],
    enriched: [1.00, 1.00, 1.00, 1.00, 0.80, 0.65, 0.60, 0.40, 0.35, 0.25]
  },
  // All Armors (Safe to +4)
  armor: {
    normal:   [1.00, 1.00, 1.00, 1.00, 0.60, 0.40, 0.40, 0.20, 0.20, 0.10],
    enriched: [1.00, 1.00, 1.00, 1.00, 0.80, 0.65, 0.60, 0.40, 0.35, 0.25]
  }
};

// ============================================================
// REFINE COST & MATERIAL HELPERS
// ============================================================

/**
 * Helper to resolve item object from object or string ID
 */
function resolveItemDef(item) {
  if (!item) return null;
  if (typeof item === 'string') {
    return EQUIPMENT.find(e => e.id === item) || null;
  }
  return item;
}

/**
 * Returns required material ID based on item type and weapon level
 */
function getRequiredMaterial(item, isEnriched = false) {
  const def = resolveItemDef(item);
  if (!def) return 'oridecon';
  if (isEnriched) {
    return def.type === 'Weapon' ? 'enriched_o' : 'enriched_e';
  }
  if (def.type === 'Armor') {
    return 'elunium';
  }
  switch (def.weaponLevel) {
    case 1: return 'phracon';
    case 2: return 'emveretarcon';
    case 3:
    case 4:
    default: return 'oridecon';
  }
}

/**
 * Returns classic Zeny cost per refine attempt
 */
function getRefineCost(item, level) {
  const def = resolveItemDef(item);
  if (!def || def.type === 'Armor') {
    return 2000;
  }
  switch (def.weaponLevel) {
    case 1: return 50;
    case 2: return 200;
    case 3: return 5000;
    case 4: return 20000;
    default: return 2000;
  }
}

/**
 * Returns safe refine level (+4, +5, +6, or +7)
 */
function getSafeLevel(item) {
  const def = resolveItemDef(item);
  if (!def || def.type === 'Armor') return 4;
  switch (def.weaponLevel) {
    case 1: return 7;
    case 2: return 6;
    case 3: return 5;
    case 4: return 4;
    default: return 4;
  }
}

/**
 * Returns classic RO success rate (0.00 to 1.00)
 */
function getSuccessRate(item, level = 0, isEnriched = false) {
  if (level >= 10) return 0;
  const def = resolveItemDef(item);
  const mode = isEnriched ? 'enriched' : 'normal';
  if (!def || def.type === 'Armor') {
    return REFINE_RATES_CLASSIC.armor[mode][level] ?? 0.1;
  }
  switch (def.weaponLevel) {
    case 1: return REFINE_RATES_CLASSIC.weapon_lv1[mode][level] ?? 0.2;
    case 2: return REFINE_RATES_CLASSIC.weapon_lv2[mode][level] ?? 0.2;
    case 3: return REFINE_RATES_CLASSIC.weapon_lv3[mode][level] ?? 0.2;
    case 4: return REFINE_RATES_CLASSIC.weapon_lv4[mode][level] ?? 0.1;
    default: return 0.2;
  }
}

/**
 * Calculates total refined ATK or DEF
 */
function calculateRefinedStats(item, level = 0) {
  const def = resolveItemDef(item);
  if (!def) {
    return { type: 'ATK', base: 0, refineBonus: 0, total: 0 };
  }
  if (def.type === 'Armor') {
    return {
      type: 'DEF',
      base: def.baseDef || 0,
      refineBonus: Math.round(level * 1.0),
      total: (def.baseDef || 0) + Math.round(level * 1.0)
    };
  }
  let bonus = 0;
  const safe = getSafeLevel(def);
  const baseBonusMap = { 1: 2, 2: 3, 3: 5, 4: 7 };
  const overBonusMap = { 1: 3, 2: 5, 3: 8, 4: 14 };
  const perLevel = baseBonusMap[def.weaponLevel] || 3;
  const perOver = overBonusMap[def.weaponLevel] || 5;

  const normalLevels = Math.min(level, safe);
  const overLevels = Math.max(0, level - safe);
  bonus = (normalLevels * perLevel) + (overLevels * (perLevel + perOver));

  return {
    type: 'ATK',
    base: def.baseAtk || 0,
    refineBonus: bonus,
    total: (def.baseAtk || 0) + bonus
  };
}

/**
 * Calculates exponential sell price for refined equipment.
 * Safe zone (0 to safe): moderate linear scaling (+30% per level).
 * Over-refine zone (> safe): aggressive exponential scaling per level.
 * +10 reaches a massive jackpot valuation!
 */
function calculateRefinedSellPrice(item, level = 0) {
  const def = resolveItemDef(item);
  if (!def) return 0;

  const baseSell = def.sellPrice || Math.round((def.price || 100) * 0.5);
  if (level <= 0) return baseSell;

  const safe = getSafeLevel(def);

  if (level <= safe) {
    // Linear progression during 100% safe levels (+30% per refine)
    const mult = 1 + (level * 0.3);
    return Math.round(baseSell * mult);
  }

  // Safe baseline multiplier
  const safeBaseMult = 1 + (safe * 0.3);
  const over = level - safe;

  // Exponential scaling per over-refine level (x1.85 per step)
  // +10 gives an extra 1.5x mega jackpot multiplier!
  let overMult = Math.pow(1.85, over);
  if (level >= 10) {
    overMult *= 1.5;
  }

  const totalMult = safeBaseMult * overMult;
  return Math.round(baseSell * totalMult);
}

// ---- Achievement Helper Functions ----
function hasPlus10Matching(d, filterFn) {
  if (!d) return false;
  const plus10Items = d.stats?.plus10Items || {};
  for (const itemId in plus10Items) {
    if (plus10Items[itemId]) {
      const def = EQUIPMENT.find(e => e.id === itemId);
      if (def && filterFn(def)) return true;
    }
  }
  const liveEquips = d.inventory?.equipment || [];
  return liveEquips.some(eq => {
    if ((eq.level || 0) < 10) return false;
    const def = EQUIPMENT.find(e => e.id === eq.id);
    return def && filterFn(def);
  });
}

function getPlus10Progress(d, filterFn, target = 1) {
  return {
    current: hasPlus10Matching(d, filterFn) ? target : 0,
    threshold: target
  };
}

function getArmorSubclassesPlus10Count(d) {
  if (!d) return 0;
  const requiredSubclasses = ['Armor', 'Shield', 'Garment', 'Footgear', 'Headgear'];
  const matched = new Set();
  const plus10Items = d.stats?.plus10Items || {};

  for (const itemId in plus10Items) {
    if (plus10Items[itemId]) {
      const def = EQUIPMENT.find(e => e.id === itemId);
      if (def && def.type === 'Armor' && requiredSubclasses.includes(def.subClass)) {
        matched.add(def.subClass);
      }
    }
  }

  const liveEquips = d.inventory?.equipment || [];
  liveEquips.forEach(eq => {
    if ((eq.level || 0) >= 10) {
      const def = EQUIPMENT.find(e => e.id === eq.id);
      if (def && def.type === 'Armor' && requiredSubclasses.includes(def.subClass)) {
        matched.add(def.subClass);
      }
    }
  });

  return matched.size;
}

function getTotalPlus10Count(d) {
  if (!d) return 0;
  const uniquePlus10 = new Set();
  const plus10Items = d.stats?.plus10Items || {};

  for (const itemId in plus10Items) {
    if (plus10Items[itemId]) {
      uniquePlus10.add(itemId);
    }
  }

  const liveEquips = d.inventory?.equipment || [];
  liveEquips.forEach(eq => {
    if ((eq.level || 0) >= 10) {
      uniquePlus10.add(eq.id);
    }
  });

  return uniquePlus10.size;
}

// ---- Achievements definition ----
const ACHIEVEMENTS = [
  { id: 'first_refine',    name: 'First Swing',      icon: '🔨', desc: 'เริ่มลงมือตีบวกอุปกรณ์ครั้งแรก', req: s => s.totalRefines >= 1,          threshold: 1, key: 'totalRefines' },
  { id: 'first_success',  name: 'Shining Blade',    icon: '✨', desc: 'ตีบวกสำเร็จครั้งแรกในชีวิต', req: s => s.successCount >= 1,          threshold: 1, key: 'successCount' },
  { id: 'refine10',       name: 'Dedicated Smith',  icon: '⚒️', desc: 'ตีบวกอุปกรณ์สะสมครบ 10 ครั้ง', req: s => s.totalRefines >= 10,         threshold: 10,key: 'totalRefines' },
  { id: 'refine100',      name: 'Iron Will',        icon: '🏋️', desc: 'ช่างเหล็กผู้มุ่งมั่น ตีบวกครบ 100 ครั้ง', req: s => s.totalRefines >= 100,        threshold: 100,key:'totalRefines' },
  { id: 'first_fail',     name: 'It Happens',       icon: '💥', desc: 'อุปกรณ์ล้มเหลวครั้งแรก (สัจธรรมของ RO)', req: s => s.failCount >= 1,             threshold: 1, key: 'failCount' },
  { id: 'fail10',         name: 'Cursed Hammer',    icon: '😈', desc: 'ค้อนต้องคำสาป ล้มเหลวสะสม 10 ครั้ง', req: s => s.failCount >= 10,            threshold: 10,key: 'failCount' },
  { id: 'reach_plus7',    name: '+7 Weapon Master',icon: '⭐', desc: 'ตีบวกอาวุธใดก็ได้ขึ้นถึงระดับ +7', req: s => s.maxRefineReached >= 7,      threshold: 7, key: 'maxRefineReached' },
  { id: 'reach_plus10',   name: 'Legendary +10',    icon: '👑', desc: 'ทำสำเร็จ! ตีบวกอุปกรณ์ถึงระดับ +10 ระดับสูงสุด!', req: s => s.maxRefineReached >= 10,     threshold: 10,key: 'maxRefineReached' },
  { id: 'hunt10',         name: 'Monster Slayer',   icon: '🗡️', desc: 'ออกล่ามอนสเตอร์สะสมครบ 10 รอบ', req: s => s.huntCount >= 10,            threshold: 10,key: 'huntCount' },
  { id: 'zeny100k',       name: 'Merchant Prince',  icon: '💰', desc: 'ครอบครองเงินสะสมเกิน 100,000 Zeny', req: s => s.totalZenyEarned >= 100000,  threshold: 100000, key: 'totalZenyEarned' },
  { id: 'buy50',          name: 'Shopping Spree',   icon: '🛒', desc: 'ซื้อแร่และอุปกรณ์จากร้านค้า 50 ชิ้น', req: s => s.totalBought >= 50,          threshold: 50,key: 'totalBought' },
  { id: 'manual_success', name: 'Eagle Eye',        icon: '🎯', desc: 'ตีบวกสำเร็จด้วยโหมดกะจังหวะ (Manual) ครบ 5 ครั้ง', req: s => s.manualSuccess >= 5, threshold: 5, key: 'manualSuccess' },

  // New Equipment Tier & Milestone Achievements
  {
    id: 'master_w1_plus10',
    name: 'ช่างตีมีดฝึกหัด',
    icon: '🗡️',
    desc: 'ตีบวกอาวุธ Lv.1 ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 1),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 1, 1),
    threshold: 1
  },
  {
    id: 'master_w2_plus10',
    name: 'ผู้เชี่ยวชาญคมดาบ',
    icon: '⚔️',
    desc: 'ตีบวกอาวุธ Lv.2 ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 2),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 2, 1),
    threshold: 1
  },
  {
    id: 'master_w3_plus10',
    name: 'มาสเตอร์แห่งศาสตรา',
    icon: '🔱',
    desc: 'ตีบวกอาวุธ Lv.3 ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 3),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 3, 1),
    threshold: 1
  },
  {
    id: 'master_w4_plus10',
    name: 'ตำนานแห่งศาสตราวุธ',
    icon: '⚡',
    desc: 'ตีบวกอาวุธ Lv.4 ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 4),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 4, 1),
    threshold: 1
  },
  {
    id: 'master_god_weapon_plus10',
    name: 'ผู้พิชิตอาวุธเทพ',
    icon: '🌟',
    desc: 'ตีบวกอาวุธเทพ Lv.4 ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 4 && (eq.isGod || eq.id === 'angra_manyu' || eq.id === 'gungnir' || eq.id === 'excalibur')),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Weapon' && eq.weaponLevel === 4 && (eq.isGod || eq.id === 'angra_manyu' || eq.id === 'gungnir' || eq.id === 'excalibur'), 1),
    threshold: 1
  },
  {
    id: 'master_shield_plus10',
    name: 'โล่สุดแกร่ง',
    icon: '🛡️',
    desc: 'ตีบวกโล่ ถึงระดับ +10 ชิ้นแรก',
    req: (s, d) => hasPlus10Matching(d, eq => eq.type === 'Armor' && eq.subClass === 'Shield'),
    getProgress: d => getPlus10Progress(d, eq => eq.type === 'Armor' && eq.subClass === 'Shield', 1),
    threshold: 1
  },
  {
    id: 'fullset_morroc_plus10',
    name: 'ฟูลเซ็ตเทพโมร็อค',
    icon: '⚜️',
    desc: 'เครื่องป้องกันระดับ +10 ครบทุกประเภท (เกราะ, โล่, ผ้าคลุม, รองเท้า, หมวก)',
    req: (s, d) => getArmorSubclassesPlus10Count(d) >= 5,
    getProgress: d => ({ current: getArmorSubclassesPlus10Count(d), threshold: 5 }),
    threshold: 5
  },
  {
    id: 'legendary_refiner_all_plus10',
    name: 'ช่างตีบวกในตำนาน',
    icon: '👑',
    desc: 'ตีบวกไอเทมทุกชนิดในเกมถึงระดับ +10',
    req: (s, d) => getTotalPlus10Count(d) >= EQUIPMENT.length,
    getProgress: d => ({ current: getTotalPlus10Count(d), threshold: EQUIPMENT.length }),
    threshold: 56
  },
];

// ---- NPC speech pool (Official RO Hollgrehenn dialogue) ----
const NPC_SPEECHES = [
  'ข้าเป็นช่างอาวุธ ข้าสามารถตีอุปกรณ์ให้ท่านได้ทุกชนิด บอกมาเลยว่าท่านต้องการให้ข้าจัดการกับอุปกรณ์ชิ้นใด',
  'อาวุธ Lv.1 ใช้ Phracon (ปลอดภัยถึง +7) และ Lv.2 ใช้ Emveretarcon (ปลอดภัยถึง +6) ค่าธรรมเนียมถูกมาก!',
  'อาวุธ Lv.3 และ 4 ต้องใช้ Oridecon เท่านั้น! ส่วนชุดเกราะทุกชนิดใช้ Elunium (ปลอดภัยถึง +4)',
  'ช่วงปลอดภัยขึ้นอยู่กับเลเวลอาวุธ หากเกินกว่านั้นอุปกรณ์อาจจะเสียหายได้นะ!',
  'หากเจ้าใช้ Enriched Oridecon หรือ Enriched Elunium โอกาสสำเร็จจะสูงขึ้นอย่างมาก!',
  'เคร้ง! เคร้ง! เคร้ง! เสียงค้อนกระทบทั่งคือเสียงดนตรีอันไพเราะที่สุดในมิดการ์ด!',
  'ตำนานแห่ง +10 รอคอยผู้กล้าอยู่เสมอ อย่าเพิ่งยอมแพ้กับความล้มเหลวเพียงไม่กี่ครั้ง!',
];
