export function unsplashImage(path: string, width = 1200) {
  return `https://images.unsplash.com/${path}?auto=format&fit=crop&w=${width}&q=80`;
}

export const siteImages = {
  heroCommerce: {
    src: unsplashImage("photo-1441986300917-64674bd600d8", 1600),
    alt: "Modern retail store with clothing displays",
  },
  personalizedShopping: {
    src: unsplashImage("photo-1483985988355-763728e1935b", 1200),
    alt: "Shopper carrying bags on a city street",
  },
  platformCommerce: {
    src: unsplashImage("photo-1556740758-90de374c12ad", 1200),
    alt: "Customer completing an online purchase on a laptop",
  },
  missionLifestyle: {
    src: unsplashImage("photo-1523275335684-37898b6baf30", 900),
    alt: "Curated lifestyle products on a clean surface",
  },
  catalogVariety: {
    src: unsplashImage("photo-1556742049-0cfed4f6a45d", 900),
    alt: "Diverse product catalog at a point of sale",
  },
  dataAnalytics: {
    src: unsplashImage("photo-1551288049-bebda4e38f71", 1200),
    alt: "Analytics dashboard representing inventory insights",
  },
  contactSupport: {
    src: unsplashImage("photo-1556761175-5973dc0f32e7", 1000),
    alt: "Support conversation in a bright workspace",
  },
  shopCollection: {
    src: unsplashImage("photo-1472851294608-062f824d29cc", 1400),
    alt: "Colorful shopping district storefronts",
  },
  ctaShopping: {
    src: unsplashImage("photo-1607082348824-0a96f2a4b9da", 1400),
    alt: "Shopping bags and gifts on a warm background",
  },
} as const;

export const featuredProductImages = {
  "RS-001": {
    src: unsplashImage("photo-1542291026-7eec264c27ff", 900),
    alt: "Red running shoes for daily training",
  },
  "SD-004": {
    src: unsplashImage("photo-1593640408182-31c70c8268f5", 900),
    alt: "Minimal standing desk in a home office",
  },
  "WE-023": {
    src: unsplashImage("photo-1590658268037-6bf12165a8df", 900),
    alt: "Wireless earbuds on a neutral background",
  },
} as const;

export const featureImages = {
  "Smart Search": {
    src: unsplashImage("photo-1486312338219-ce68d2c6f44d", 700),
    alt: "Person searching products on a laptop",
  },
  "Inventory Sync": {
    src: unsplashImage("photo-1600880292203-757bb62b4baf", 700),
    alt: "Organized warehouse shelves with inventory boxes",
  },
  "Secure Import": {
    src: unsplashImage("photo-1454165804606-c3d57bc86b40", 700),
    alt: "Spreadsheet and documents for data import",
  },
  "Mock Checkout": {
    src: unsplashImage("photo-1556742111-a301076d9d18", 700),
    alt: "Contactless payment at checkout",
  },
} as const;
