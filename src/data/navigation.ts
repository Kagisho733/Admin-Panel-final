import { FaBell, FaBoxOpen, FaChartPie, FaCommentDots, FaCreditCard, FaHeart, FaShoppingCart, FaStar, FaTags, FaUsers, FaBullhorn, FaUndoAlt } from "react-icons/fa";

export const adminNavigation = [
  {label: "Dashboard", path: "/dashboard", icon: FaChartPie, section: "Store", keywords: "home overview revenue statistics"},
  {label: "Products", path: "/products", icon: FaBoxOpen, section: "Store", keywords: "catalogue inventory stock"},
  {label: "Categories", path: "/categories", icon: FaTags, section: "Store", keywords: "departments books bots drones"},
  {label: "Orders", path: "/orders", icon: FaShoppingCart, section: "Store", keywords: "sales fulfilment delivery"},
  {label: "Promotions", path: "/promotions", icon: FaBullhorn, section: "Store", keywords: "discount coupons campaign codes"},
  {label: "Returns & Refunds", path: "/returns", icon: FaUndoAlt, section: "Store", keywords: "returns refunds approval received"},
  {label: "Users", path: "/users", icon: FaUsers, section: "Store", keywords: "customers administrators roles"},
  {label: "Contact Messages", path: "/contact-messages", icon: FaCommentDots, section: "Content & support", keywords: "support enquiries"},
  {label: "Reviews", path: "/reviews", icon: FaStar, section: "Content & support", keywords: "ratings comments moderation"},
  {label: "Notifications", path: "/notifications", icon: FaBell, section: "Content & support", keywords: "alerts messages"},
  {label: "Payments", path: "/payments", icon: FaCreditCard, section: "Customer activity", keywords: "transactions paystack"},
  {label: "Carts", path: "/carts", icon: FaShoppingCart, section: "Customer activity", keywords: "shopping baskets"},
  {label: "Wishlists", path: "/wishlists", icon: FaHeart, section: "Customer activity", keywords: "saved products"},
] as const;

export const adminSections = ["Store", "Content & support", "Customer activity"] as const;
export const adminPageTitles = Object.fromEntries(adminNavigation.map(({path, label}) => [path, label]));
