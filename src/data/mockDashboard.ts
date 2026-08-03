/*
|--------------------------------------------------------------------------
| Dashboard Mock Data
|--------------------------------------------------------------------------
| This file simulates data before connecting to Firebase.
| Later we'll fetch this information from Firestore.
|--------------------------------------------------------------------------
*/

import {
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

export const quickActions = [

  {
    title: "Products",
    description: "Manage products",
    route: "/products",
    icon: FaBoxOpen,
  },

  {
    title: "Categories",
    description: "Manage categories",
    route: "/categories",
    icon: FaTags,
  },

  {
    title: "Orders",
    description: "View customer orders",
    route: "/orders",
    icon: FaShoppingCart,
  },

  {
    title: "Users",
    description: "Manage users",
    route: "/users",
    icon: FaUsers,
  },

];


export const recentOrders = [
  {
    id: "#1001",
    customer: "John Smith",
    total: "R1 250",
    status: "Completed",
  },
  {
    id: "#1002",
    customer: "Sarah Jones",
    total: "R780",
    status: "Pending",
  },
  {
    id: "#1003",
    customer: "Michael Brown",
    total: "R2 100",
    status: "Completed",
  },
];

export const recentActivity = [
  {
    title: "Drone X200 added",
    time: "5 minutes ago",
  },
  {
    title: "Order #1002 created",
    time: "20 minutes ago",
  },
  {
    title: "New customer registered",
    time: "1 hour ago",
  },
  {
    title: "Analytics report generated",
    time: "Today",
  },
];