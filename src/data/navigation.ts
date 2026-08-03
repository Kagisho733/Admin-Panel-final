import {
  FaChartPie,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaWarehouse,
  FaTruck,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaFileAlt,
  FaBell,
  FaClipboardList,
  FaBuilding,

} from "react-icons/fa";

export const navigation = [
  {
    name: "Dashboard",
    icon: FaChartPie,
    allowedRoles: ["admin", "manager", "seller"],
  },
  {
    name: "Products",
    icon: FaBoxOpen,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Categories",
    icon: FaTags,
    allowedRoles: ["admin"],
  },
  {
    name: "Orders",
    icon: FaShoppingCart,
    allowedRoles: ["admin", "manager", "seller"],
  },

  {
  name: "Customers",
  icon: FaUsers,
  allowedRoles: ["admin"],
},

  {
    name: "Users",
    icon: FaUsers,
    allowedRoles: ["admin"],
  },
  {
    name: "Inventory",
    icon: FaWarehouse,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Suppliers",
    icon: FaTruck,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Purchasing",
    icon: FaFileInvoiceDollar,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Finance",
    icon: FaMoneyBillWave,
    allowedRoles: ["admin"],
  },
  {
    name: "Analytics",
    icon: FaChartLine,
    allowedRoles: ["admin"],
  },
  {
    name: "Reports",
    icon: FaFileAlt,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Notifications",
    icon: FaBell,
    allowedRoles: ["admin", "manager"],
  },
  {
    name: "Audit Logs",
    icon: FaClipboardList,
    allowedRoles: ["admin"],
  },
  {
    name: "Company",
    icon: FaBuilding,
    allowedRoles: ["admin"],
  },
  {
    name: "Settings",
    icon: FaCog,
    allowedRoles: ["admin"],
  },
  {
    name: "Logout",
    icon: FaSignOutAlt,
    allowedRoles: [
      "admin",
      "manager",
      "seller",
      "supplier",
      "driver",
      "support",
    ],
  },
];