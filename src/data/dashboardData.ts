import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

export const dashboardStats = [
  {
    id: 1,
    title: "Products",
    value: "248",
    change: "+8%",
    color: "bg-blue-600",
    icon: FaBoxOpen,
  },
  {
    id: 2,
    title: "Orders",
    value: "342",
    change: "+8%",
    color: "bg-green-600",
    icon: FaShoppingCart,
  },
  {
    id: 3,
    title: "Customers",
    value: "987",
    change: "+21%",
    color: "bg-purple-600",
    icon: FaUsers,
  },
  {
    id: 4,
    title: "Revenue",
    value: "R45 000",
    change: "+16%",
    color: "bg-orange-600",
    icon: FaMoneyBillWave,
  },
];