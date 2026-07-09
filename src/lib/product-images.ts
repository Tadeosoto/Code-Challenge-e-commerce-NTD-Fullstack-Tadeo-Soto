import { unsplashImage } from "@/lib/site-images";

type ProductImage = { src: string; alt: string };

const categoryImages: Record<string, ProductImage> = {
  Footwear: {
    src: unsplashImage("photo-1542291026-7eec264c27ff", 800),
    alt: "Athletic footwear product photo",
  },
  Electronics: {
    src: unsplashImage("photo-1498049794561-7780e7231661", 800),
    alt: "Consumer electronics on a desk",
  },
  "Home & Office": {
    src: unsplashImage("photo-1593640408182-31c70c8268f5", 800),
    alt: "Home office desk setup",
  },
  Sports: {
    src: unsplashImage("photo-1571019614242-c5c5dee9f50b", 800),
    alt: "Sports and fitness gear",
  },
  Outdoors: {
    src: unsplashImage("photo-1504280390367-361c6d9f38f4", 800),
    alt: "Camping tent in a forest clearing",
  },
  Beauty: {
    src: unsplashImage("photo-1596462502278-27bfdc403348", 800),
    alt: "Beauty and skincare products",
  },
  Kitchen: {
    src: unsplashImage("photo-1556909114-f6e7ad7d3136", 800),
    alt: "Kitchen essentials and cookware",
  },
  Accessories: {
    src: unsplashImage("photo-1523275335684-37898b6baf30", 800),
    alt: "Fashion accessories flat lay",
  },
  "Food & Beverage": {
    src: unsplashImage("photo-1513475382585-d06e58bcb0e0", 800),
    alt: "Coffee and beverage products",
  },
  Clothing: {
    src: unsplashImage("photo-1521572163474-6864f9cf17ab", 800),
    alt: "Folded cotton apparel",
  },
  Books: {
    src: unsplashImage("photo-1512820790803-83ca734da794", 800),
    alt: "Stack of books on a table",
  },
  Games: {
    src: unsplashImage("photo-1512820790803-83ca734da794", 800),
    alt: "Board games and tabletop fun",
  },
  Gifts: {
    src: unsplashImage("photo-1513885535751-8b9238bd345a", 800),
    alt: "Wrapped gift boxes",
  },
  Stationery: {
    src: unsplashImage("photo-1454165804606-c3d57bc86b40", 800),
    alt: "Notebook and writing supplies",
  },
  Pets: {
    src: unsplashImage("photo-1518717758536-85ae29035b6d", 800),
    alt: "Happy dog on a walk outdoors",
  },
  Health: {
    src: unsplashImage("photo-1584308666744-24d5c474f2ae", 800),
    alt: "Vitamins and wellness supplements",
  },
  Tools: {
    src: unsplashImage("photo-1581091226825-a6a2a5aee158", 800),
    alt: "Hand tools on a workbench",
  },
  Misc: {
    src: unsplashImage("photo-1441986300917-64674bd600d8", 800),
    alt: "General retail product display",
  },
};

const skuImages: Record<string, ProductImage> = {
  "CT-005": {
    src: unsplashImage("photo-1504280390367-361c6d9f38f4", 800),
    alt: "Orange camping tent set up among trees",
  },
  "GH-035": {
    src: unsplashImage("photo-1485627658391-1365e4e0dbfe", 800),
    alt: "Garden hose watering plants in a garden",
  },
  "HM-003": {
    src: unsplashImage("photo-1697116470535-8cfe86234ff8", 800),
    alt: "Hammock hung between palm trees on a beach",
  },
  "CC-008": {
    src: unsplashImage("photo-1598902108854-10e335adac99", 800),
    alt: "Foldable camping chair outdoors",
  },
  "HG-011": {
    src: unsplashImage("photo-1585320806297-9794b3e4eeae", 800),
    alt: "Indoor herb plants in pots",
  },
  "IR-004": {
    src: unsplashImage("photo-1441974231531-c6227db76b6e", 800),
    alt: "Forest trail for outdoor adventures",
  },
  "HB-002": {
    src: unsplashImage("photo-1576678927484-cc907957088c", 800),
    alt: "Waterproof hiking boots on a trail",
  },
  "RS-001": {
    src: unsplashImage("photo-1542291026-7eec264c27ff", 800),
    alt: "Red running shoes for daily training",
  },
  "RS-050": {
    src: unsplashImage("photo-1606107557195-0e29a4b5b4aa", 800),
    alt: "Running shoes on a clean background",
  },
  "WE-023": {
    src: unsplashImage("photo-1590658268037-6bf12165a8df", 800),
    alt: "Wireless earbuds on a neutral background",
  },
  "SD-004": {
    src: unsplashImage("photo-1593640408182-31c70c8268f5", 800),
    alt: "Electric standing desk in a home office",
  },
  "CB-010": {
    src: unsplashImage("photo-1513475382585-d06e58bcb0e0", 800),
    alt: "Bag of roasted coffee beans",
  },
  "EK-003": {
    src: unsplashImage("photo-1602143407151-7111542de6e8", 800),
    alt: "Stainless steel electric kettle",
  },
  "PLT-006": {
    src: unsplashImage("photo-1485955900006-10f4d324d411", 800),
    alt: "Ceramic plant pot with greenery",
  },
  "DL-007": {
    src: unsplashImage("photo-1507473885765-e6ed057f782c", 800),
    alt: "Adjustable LED desk lamp",
  },
};

const nameKeywordImages: Array<{ pattern: RegExp; image: ProductImage }> = [
  {
    pattern: /\b(hose|watering)\b/i,
    image: {
      src: unsplashImage("photo-1755717244600-41141c2ab884", 800),
      alt: "Water flowing from a garden hose",
    },
  },
  {
    pattern: /\bhammock\b/i,
    image: {
      src: unsplashImage("photo-1573209580826-13bdfd6db7e7", 800),
      alt: "Hammock between trees at the beach",
    },
  },
  {
    pattern: /\b(tent|camping)\b/i,
    image: {
      src: unsplashImage("photo-1496425745709-5f9297566b46", 800),
      alt: "Camping tent at night under the stars",
    },
  },
  {
    pattern: /\bchair\b/i,
    image: {
      src: unsplashImage("photo-1598902108854-10e335adac99", 800),
      alt: "Outdoor camping chair",
    },
  },
  {
    pattern: /\b(herb|garden)\b/i,
    image: {
      src: unsplashImage("photo-1585320806297-9794b3e4eeae", 800),
      alt: "Herbs growing in a garden",
    },
  },
  {
    pattern: /\b(shoe|boot|sneaker|footwear)\b/i,
    image: {
      src: unsplashImage("photo-1542291026-7eec264c27ff", 800),
      alt: "Athletic footwear",
    },
  },
  {
    pattern: /\b(coffee|tea|beverage)\b/i,
    image: {
      src: unsplashImage("photo-1513475382585-d06e58bcb0e0", 800),
      alt: "Coffee and beverages",
    },
  },
  {
    pattern: /\b(headphone|earbud|speaker|mouse|keyboard|charger|electronics)\b/i,
    image: {
      src: unsplashImage("photo-1498049794561-7780e7231661", 800),
      alt: "Consumer electronics",
    },
  },
];

const defaultImage: ProductImage = {
  src: unsplashImage("photo-1441986300917-64674bd600d8", 800),
  alt: "Retail product display",
};

function matchByName(name: string): ProductImage | null {
  for (const { pattern, image } of nameKeywordImages) {
    if (pattern.test(name)) return image;
  }
  return null;
}

export function getProductCategoryImage(
  category: string,
  productName?: string,
  sku?: string,
): ProductImage {
  const base: ProductImage =
    (sku ? skuImages[sku] : undefined) ??
    (productName ? matchByName(productName) : null) ??
    categoryImages[category] ??
    defaultImage;

  if (productName) {
    return { ...base, alt: `${productName} — ${base.alt}` };
  }

  return base;
}
