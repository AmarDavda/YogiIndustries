/** Shapes of the JSON files in /public/data (site.json, catalog.json, i18n/<lang>.json). */

export type Dict = Record<string, string>;

export interface LanguageInfo {
  code: string;
  /** language name written in its own script */
  native: string;
  /** short label for small screens */
  short: string;
}

export interface NavLink {
  /** translation key of the label */
  key: string;
  link: string;
  exact?: boolean;
}

export interface SocialLink {
  name: string;
  /** icon name: facebook | instagram | youtube */
  icon: string;
  url: string;
}

export interface IconItem {
  key: string;
  icon: string;
}

export interface Stat {
  label: string;
  /** show the number of years since `since` */
  years?: boolean;
  /** translation key of the value */
  valueKey?: string;
}

export interface PolicySection {
  n: number;
  icon: string;
}

export interface QuickMessage {
  key: string;
  icon: string;
  message: string;
}

export interface Messages {
  general: string;
  productOrder: string;
  cartOrder: string;
  cartLine: string;
  cartMailSubject: string;
  contactForm: string;
  contactMailSubject: string;
  generalProduct: string;
}

export interface SiteConfig {
  name: string;
  since: number;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  address: string;
  mapQuery: string;
  logo: string;
  mark: string;
  aboutBriefImage: string;
  aboutGallery: string[];
  currency: { symbol: string; locale: string };
  heroIntervalMs: number;
  defaultLanguage: string;
  languages: LanguageInfo[];
  nav: NavLink[];
  footerLinks: NavLink[];
  social: SocialLink[];
  commitments: IconItem[];
  stats: Stat[];
  aboutPoints: string[];
  productBadges: IconItem[];
  faqCount: number;
  policySections: PolicySection[];
  contactQuick: QuickMessage[];
  messages: Messages;
}

export interface Category {
  /** used in the URL (#/category/<id>) and in translation keys (cat.<id>.name / cat.<id>.desc) */
  id: string;
  image: string;
}

export interface Spec {
  /** translation key of the label */
  label: string;
  /** plain value or, when `valueIsKey` is true, a translation key */
  value: string;
  valueIsKey?: boolean;
  /** optional translation key of the unit */
  unit?: string;
}

export interface Product {
  id: number;
  category: string;
  price: number;
  /** original price - when higher than `price` the product shows a sale badge */
  mrp?: number;
  /** show in the home page hero slider */
  hero?: boolean;
  images: string[];
  specs: Spec[];
  /** translation keys of the key-feature bullets */
  features: string[];
}

export interface CatalogFile {
  categories: Category[];
  products: Product[];
}

export interface CartLine {
  id: number;
  qty: number;
}
