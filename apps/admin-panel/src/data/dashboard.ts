import { dummyBookings } from "./bookings";
import { dummyReviews } from "./reviews";

export const dashboardStats = {
  revenueChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [32500, 38200, 42100, 39800, 45600, 48300, 52400, 49100, 51200, 55800, 58900, 62300],
  },
  bookingsChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    completed: [320, 385, 412, 398, 445, 478, 510, 489, 502, 534, 567, 598],
    cancelled: [28, 35, 22, 41, 30, 25, 38, 32, 27, 33, 29, 26],
  },
  usersChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    newUsers: [420, 380, 510, 490, 560, 620, 680, 590, 640, 710, 750, 820],
    activeUsers: [1800, 1950, 2100, 2280, 2400, 2580, 2750, 2900, 3050, 3200, 3380, 3520],
  },
  topCategories: [
    { name: "Cleaning", count: 120, revenue: 89500 },
    { name: "Plumbing", count: 85, revenue: 72300 },
    { name: "Electrical", count: 72, revenue: 65400 },
    { name: "AC Repair", count: 63, revenue: 54200 },
    { name: "Appliance Repair", count: 67, revenue: 48900 },
    { name: "Painting", count: 58, revenue: 42100 },
  ],
  topProviders: [
    { name: "SparkleClean Services", rating: 4.9, bookings: 2100, earnings: 42300 },
    { name: "Plumbing Plus NYC", rating: 4.8, bookings: 1280, earnings: 48500 },
    { name: "GreenScrub Cleaning", rating: 4.8, bookings: 920, earnings: 29600 },
    { name: "WoodCraft Carpentry", rating: 4.7, bookings: 710, earnings: 39800 },
    { name: "Bright Spark Electric", rating: 4.6, bookings: 890, earnings: 35200 },
    { name: "ApplianceFix Pro", rating: 4.6, bookings: 680, earnings: 31500 },
  ],
  recentBookings: dummyBookings.slice(0, 5),
  recentReviews: dummyReviews.slice(0, 5),
  liveActivities: [
    {
      id: "act_001",
      type: "booking",
      message: "Alice Morgan booked Emergency Pipe Repair",
      time: "2 minutes ago",
    },
    {
      id: "act_002",
      type: "payment",
      message: "Payment of $380 received from Brian Chen",
      time: "15 minutes ago",
    },
    {
      id: "act_003",
      type: "review",
      message: "Carol Williams left a 5-star review for SparkleClean",
      time: "32 minutes ago",
    },
    {
      id: "act_004",
      type: "signup",
      message: "New provider HomeSafe Security registered",
      time: "1 hour ago",
    },
    {
      id: "act_005",
      type: "booking",
      message: "David Park confirmed Interior Room Painting",
      time: "1 hour ago",
    },
    {
      id: "act_006",
      type: "refund",
      message: "Refund of $175 processed for Grace Kim",
      time: "2 hours ago",
    },
    {
      id: "act_007",
      type: "booking",
      message: "Emma Rodriguez upgraded to Premium Kitchen Cabinets",
      time: "3 hours ago",
    },
    {
      id: "act_008",
      type: "support",
      message: "New support ticket opened by Jack Thompson",
      time: "3 hours ago",
    },
    {
      id: "act_009",
      type: "payment",
      message: "Payment of $450 received from Frank Nguyen",
      time: "4 hours ago",
    },
    {
      id: "act_010",
      type: "booking",
      message: "Irene Lopez scheduled Refrigerator Repair",
      time: "5 hours ago",
    },
  ],
  stats: {
    totalRevenue: 576200,
    totalBookings: 5128,
    totalUsers: 12840,
    totalProviders: 1842,
    activeServices: 673,
    pendingBookings: 47,
    todayRevenue: 4250,
    todayBookings: 18,
  },
};
