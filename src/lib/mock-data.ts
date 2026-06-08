// Mock data for GymGenie — Six Pax India

export const gymProfile = {
  name: "Six Pax India",
  tagline: "Train Hard. Live Strong.",
  address: "Balewadi, Pune",
  phone: "+91 93717 04000",
  whatsapp: "+91 83780 40000",
  email: "sixpaxindia@gmail.com",
  gst: "",
  logo: "",
};

export type MemberStatus = "Active" | "Expired" | "Paused";
export type Goal = "Weight Loss" | "Muscle Gain" | "Fitness" | "Sports";

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  address: string;
  emergencyContact: string;
  goal: Goal;
  plan: string;
  joinDate: string;
  expiryDate: string;
  status: MemberStatus;
  photoUrl?: string;
}

export const members: Member[] = [
  { id: "M001", name: "Arjun Reddy", phone: "+91 98200 11111", email: "arjun@gmail.com", dob: "1995-04-12", address: "Indiranagar, Bengaluru", emergencyContact: "+91 98200 22222", goal: "Muscle Gain", plan: "Annual", joinDate: "2025-01-15", expiryDate: "2026-01-14", status: "Active" },
  { id: "M002", name: "Priya Sharma", phone: "+91 98201 33333", email: "priya.s@gmail.com", dob: "1998-09-23", address: "Koramangala, Bengaluru", emergencyContact: "+91 98201 44444", goal: "Weight Loss", plan: "Quarterly", joinDate: "2026-03-10", expiryDate: "2026-06-10", status: "Active" },
  { id: "M003", name: "Rohan Mehta", phone: "+91 98202 55555", email: "rohan.m@gmail.com", dob: "1992-11-05", address: "HSR Layout, Bengaluru", emergencyContact: "+91 98202 66666", goal: "Fitness", plan: "Half-yearly", joinDate: "2025-12-01", expiryDate: "2026-06-12", status: "Active" },
  { id: "M004", name: "Anita Verma", phone: "+91 98203 77777", email: "anita.v@gmail.com", dob: "1990-02-18", address: "Whitefield, Bengaluru", emergencyContact: "+91 98203 88888", goal: "Weight Loss", plan: "Monthly", joinDate: "2026-05-20", expiryDate: "2026-06-20", status: "Active" },
  { id: "M005", name: "Vikram Singh", phone: "+91 98204 99999", email: "vikram@gmail.com", dob: "1988-07-30", address: "JP Nagar, Bengaluru", emergencyContact: "+91 98204 11111", goal: "Sports", plan: "Annual", joinDate: "2024-06-08", expiryDate: "2025-06-08", status: "Expired" },
  { id: "M006", name: "Neha Kapoor", phone: "+91 98205 22222", email: "neha.k@gmail.com", dob: "2000-03-14", address: "BTM Layout, Bengaluru", emergencyContact: "+91 98205 33333", goal: "Fitness", plan: "Monthly", joinDate: "2026-05-15", expiryDate: "2026-06-15", status: "Active" },
  { id: "M007", name: "Karthik Iyer", phone: "+91 98206 44444", email: "karthik@gmail.com", dob: "1994-12-09", address: "Marathahalli, Bengaluru", emergencyContact: "+91 98206 55555", goal: "Muscle Gain", plan: "Quarterly", joinDate: "2026-04-02", expiryDate: "2026-07-02", status: "Active" },
  { id: "M008", name: "Sneha Patil", phone: "+91 98207 66666", email: "sneha.p@gmail.com", dob: "1997-08-21", address: "Jayanagar, Bengaluru", emergencyContact: "+91 98207 77777", goal: "Weight Loss", plan: "Half-yearly", joinDate: "2026-01-10", expiryDate: "2026-07-10", status: "Active" },
  { id: "M009", name: "Aditya Nair", phone: "+91 98208 88888", email: "aditya.n@gmail.com", dob: "1991-06-17", address: "Bellandur, Bengaluru", emergencyContact: "+91 98208 99999", goal: "Muscle Gain", plan: "Monthly", joinDate: "2026-03-01", expiryDate: "2026-04-01", status: "Paused" },
  { id: "M010", name: "Divya Rao", phone: "+91 98209 12121", email: "divya.r@gmail.com", dob: "1996-10-25", address: "Electronic City, Bengaluru", emergencyContact: "+91 98209 13131", goal: "Fitness", plan: "Annual", joinDate: "2025-11-20", expiryDate: "2026-11-20", status: "Active" },
  { id: "M011", name: "Rahul Joshi", phone: "+91 98210 14141", email: "rahul.j@gmail.com", dob: "1993-01-08", address: "Hebbal, Bengaluru", emergencyContact: "+91 98210 15151", goal: "Sports", plan: "Quarterly", joinDate: "2026-04-18", expiryDate: "2026-07-18", status: "Active" },
  { id: "M012", name: "Meera Pillai", phone: "+91 98211 16161", email: "meera.p@gmail.com", dob: "1999-05-30", address: "Yelahanka, Bengaluru", emergencyContact: "+91 98211 17171", goal: "Weight Loss", plan: "Monthly", joinDate: "2026-05-25", expiryDate: "2026-06-25", status: "Active" },
];

export interface Plan {
  id: string;
  name: string;
  durationDays: number;
  price: number;
}

export const plans: Plan[] = [
  { id: "P1", name: "Monthly", durationDays: 30, price: 1500 },
  { id: "P2", name: "Quarterly", durationDays: 90, price: 4000 },
  { id: "P3", name: "Half-yearly", durationDays: 180, price: 7500 },
  { id: "P4", name: "Annual", durationDays: 365, price: 13000 },
  { id: "P5", name: "Personal Training (1 mo)", durationDays: 30, price: 5000 },
];

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  mode: "Cash" | "UPI" | "Card";
  receiptNo: string;
  paidAt: string;
}

export const payments: Payment[] = [
  { id: "PAY001", memberId: "M001", memberName: "Arjun Reddy", amount: 13000, mode: "UPI", receiptNo: "RC-2025-0115", paidAt: "2025-01-15" },
  { id: "PAY002", memberId: "M002", memberName: "Priya Sharma", amount: 4000, mode: "Card", receiptNo: "RC-2026-0310", paidAt: "2026-03-10" },
  { id: "PAY003", memberId: "M004", memberName: "Anita Verma", amount: 1500, mode: "Cash", receiptNo: "RC-2026-0520", paidAt: "2026-05-20" },
  { id: "PAY004", memberId: "M006", memberName: "Neha Kapoor", amount: 1500, mode: "UPI", receiptNo: "RC-2026-0515", paidAt: "2026-05-15" },
  { id: "PAY005", memberId: "M007", memberName: "Karthik Iyer", amount: 4000, mode: "UPI", receiptNo: "RC-2026-0402", paidAt: "2026-04-02" },
  { id: "PAY006", memberId: "M008", memberName: "Sneha Patil", amount: 7500, mode: "Card", receiptNo: "RC-2026-0110", paidAt: "2026-01-10" },
  { id: "PAY007", memberId: "M012", memberName: "Meera Pillai", amount: 1500, mode: "Cash", receiptNo: "RC-2026-0525", paidAt: "2026-05-25" },
  { id: "PAY008", memberId: "M011", memberName: "Rahul Joshi", amount: 4000, mode: "UPI", receiptNo: "RC-2026-0418", paidAt: "2026-04-18" },
];

export const pendingDues = [
  { memberId: "M005", memberName: "Vikram Singh", amount: 13000, dueSince: "2025-06-08" },
  { memberId: "M009", memberName: "Aditya Nair", amount: 1500, dueSince: "2026-04-01" },
];

export type EnquiryStage = "New" | "Contacted" | "Demo Done" | "Converted" | "Lost";
export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  source: "Walk-in" | "Instagram" | "Facebook" | "Referral" | "Google";
  interest: string;
  notes: string;
  status: EnquiryStage;
  followUpDate: string;
}

export const enquiries: Enquiry[] = [
  { id: "E001", name: "Sandeep Kumar", phone: "+91 91111 11111", source: "Instagram", interest: "Weight Loss", notes: "Looking for 3-month plan", status: "New", followUpDate: "2026-06-10" },
  { id: "E002", name: "Pooja Iyer", phone: "+91 91111 22222", source: "Walk-in", interest: "Personal Training", notes: "Wants female trainer", status: "Contacted", followUpDate: "2026-06-09" },
  { id: "E003", name: "Manish Gupta", phone: "+91 91111 33333", source: "Referral", interest: "Muscle Gain", notes: "Referred by Arjun Reddy", status: "Demo Done", followUpDate: "2026-06-11" },
  { id: "E004", name: "Riya Shah", phone: "+91 91111 44444", source: "Google", interest: "General Fitness", notes: "Visited 2 days ago", status: "Contacted", followUpDate: "2026-06-08" },
  { id: "E005", name: "Arvind Bose", phone: "+91 91111 55555", source: "Facebook", interest: "Cardio", notes: "Comparing prices", status: "New", followUpDate: "2026-06-12" },
  { id: "E006", name: "Tanvi Desai", phone: "+91 91111 66666", source: "Instagram", interest: "Zumba", notes: "Will join next month", status: "Demo Done", followUpDate: "2026-06-15" },
  { id: "E007", name: "Suresh Babu", phone: "+91 91111 77777", source: "Walk-in", interest: "Annual Plan", notes: "Converted to annual member", status: "Converted", followUpDate: "2026-06-01" },
  { id: "E008", name: "Kavita Menon", phone: "+91 91111 88888", source: "Referral", interest: "Yoga", notes: "We don't offer yoga", status: "Lost", followUpDate: "2026-05-28" },
];

export const recentActivity = [
  { id: 1, type: "payment", text: "Meera Pillai paid ₹1,500 (Monthly)", time: "12 min ago" },
  { id: 2, type: "member", text: "New member: Anita Verma joined Monthly plan", time: "2 hr ago" },
  { id: 3, type: "attendance", text: "48 check-ins today", time: "Today" },
  { id: 4, type: "enquiry", text: "New enquiry from Instagram: Sandeep Kumar", time: "4 hr ago" },
  { id: 5, type: "renewal", text: "Karthik Iyer renewed Quarterly plan", time: "Yesterday" },
  { id: 6, type: "alert", text: "5 memberships expiring this week", time: "Yesterday" },
];

export const revenueByMonth = [
  { month: "Jan", revenue: 142000 },
  { month: "Feb", revenue: 156000 },
  { month: "Mar", revenue: 178000 },
  { month: "Apr", revenue: 165000 },
  { month: "May", revenue: 192000 },
  { month: "Jun", revenue: 208000 },
];

export const memberGrowth = [
  { month: "Jan", joins: 18, members: 78 },
  { month: "Feb", joins: 22, members: 92 },
  { month: "Mar", joins: 24, members: 108 },
  { month: "Apr", joins: 19, members: 121 },
  { month: "May", joins: 21, members: 134 },
  { month: "Jun", joins: 16, members: 142 },
];

export const attendanceTrend = [
  { day: "Mon", count: 52 }, { day: "Tue", count: 61 }, { day: "Wed", count: 48 },
  { day: "Thu", count: 67 }, { day: "Fri", count: 72 }, { day: "Sat", count: 84 }, { day: "Sun", count: 39 },
];

// Daily attendance % over last 30 days
export const attendance30d = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  const base = 65 + Math.sin(i / 3) * 10 + (i % 7 === 5 ? 12 : 0) + (i % 7 === 6 ? -18 : 0);
  return { date: `${d.getDate()}/${d.getMonth() + 1}`, pct: Math.max(35, Math.min(95, Math.round(base + (i % 4) * 2))) };
});

export const planDistribution = [
  { name: "Monthly", value: 38 },
  { name: "Quarterly", value: 42 },
  { name: "Half-yearly", value: 28 },
  { name: "Annual", value: 34 },
];

// Daily attendance per member (mock for today)
export const todayAttendance: Record<string, boolean> = {
  M001: true, M002: true, M003: false, M004: true, M005: false, M006: true,
  M007: true, M008: false, M009: false, M010: true, M011: true, M012: true,
};

export const attendancePct: Record<string, number> = {
  M001: 92, M002: 78, M003: 65, M004: 84, M005: 12, M006: 88,
  M007: 71, M008: 58, M009: 22, M010: 95, M011: 80, M012: 76,
};

export const staff = [
  { id: "S1", name: "Ravi Sharma", role: "Owner", email: "ravi@sixpaxindia.com" },
  { id: "S2", name: "Deepak Joshi", role: "Manager", email: "deepak@sixpaxindia.com" },
  { id: "S3", name: "Anjali Mehta", role: "Trainer", email: "anjali@sixpaxindia.com" },
  { id: "S4", name: "Suresh Kumar", role: "Trainer", email: "suresh@sixpaxindia.com" },
  { id: "S5", name: "Pooja Reddy", role: "Receptionist", email: "pooja@sixpaxindia.com" },
];
