import { AdminUser, PermissionGroup, UserRole, UserStatus } from "@/lib/types";

const vietnameseFirstNames = [
  "Nguyễn",
  "Trần",
  "Phạm",
  "Hoàng",
  "Phan",
  "Vũ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Tạ",
  "Tô",
  "Dương",
  "Lê",
  "Nông",
];

const vietnameseLastNames = [
  "Minh",
  "Hùng",
  "Linh",
  "Hoa",
  "Tuấn",
  "Hạnh",
  "Dung",
  "Tâm",
  "Khánh",
  "Long",
  "Anh",
  "Bình",
  "Chi",
  "Duy",
  "Gia",
  "Hải",
  "Kiệt",
  "Lâm",
  "Nhân",
  "Phong",
];

const generateUserInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const generateRandomDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

const generateMockUsers = (): AdminUser[] => {
  const users: AdminUser[] = [];

  // Admin users (2)
  for (let i = 0; i < 2; i++) {
    const firstName =
      vietnameseFirstNames[
        Math.floor(Math.random() * vietnameseFirstNames.length)
      ];
    const lastName =
      vietnameseLastNames[
        Math.floor(Math.random() * vietnameseLastNames.length)
      ];
    users.push({
      id: `admin-${i + 1}`,
      firstName,
      lastName,
      email: `admin${i + 1}@solashi.com`,
      phone: `091${Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0")}`,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      createdDate: generateRandomDate(180),
      avatar: generateUserInitials(firstName, lastName),
    });
  }

  // PM users (4)
  for (let i = 0; i < 4; i++) {
    const firstName =
      vietnameseFirstNames[
        Math.floor(Math.random() * vietnameseFirstNames.length)
      ];
    const lastName =
      vietnameseLastNames[
        Math.floor(Math.random() * vietnameseLastNames.length)
      ];
    users.push({
      id: `pm-${i + 1}`,
      firstName,
      lastName,
      email: `pm${i + 1}@solashi.com`,
      phone: `091${Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0")}`,
      role: UserRole.PM,
      status: Math.random() > 0.3 ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      createdDate: generateRandomDate(180),
      avatar: generateUserInitials(firstName, lastName),
    });
  }

  // Customer users (7)
  for (let i = 0; i < 7; i++) {
    const firstName =
      vietnameseFirstNames[
        Math.floor(Math.random() * vietnameseFirstNames.length)
      ];
    const lastName =
      vietnameseLastNames[
        Math.floor(Math.random() * vietnameseLastNames.length)
      ];
    users.push({
      id: `customer-${i + 1}`,
      firstName,
      lastName,
      email: `customer${i + 1}@client.com`,
      phone: `091${Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0")}`,
      role: UserRole.CUSTOMER,
      status: Math.random() > 0.2 ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      createdDate: generateRandomDate(180),
      avatar: generateUserInitials(firstName, lastName),
    });
  }

  return users;
};

export const MOCK_USERS: AdminUser[] = generateMockUsers();

export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "admin-group",
    name: "Administrator",
    description: "Full access to all modules and features",
    roleType: UserRole.ADMIN,
  },
  {
    id: "pm-group",
    name: "Project Manager",
    description: "Can manage change requests, view reports, and manage team",
    roleType: UserRole.PM,
  },
  {
    id: "customer-group",
    name: "Customer",
    description: "Can view and submit change requests",
    roleType: UserRole.CUSTOMER,
  },
];
