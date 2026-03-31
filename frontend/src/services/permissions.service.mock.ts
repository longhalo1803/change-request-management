import { AdminUser, PermissionGroup, UserFormData, UserStatus, SearchFilters } from '@/lib/types';
import { MOCK_USERS, MOCK_PERMISSION_GROUPS } from '@/mock-data/permissions.mock';

// Simulate local data store
let usersStore = [...MOCK_USERS];

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsers = async (filters?: SearchFilters): Promise<AdminUser[]> => {
  await delay();

  let results = [...usersStore];

  // Apply search filter
  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    results = results.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filters?.status) {
    results = results.filter(user => user.status === filters.status);
  }

  // Apply role filter
  if (filters?.role) {
    results = results.filter(user => user.role === filters.role);
  }

  return results;
};

export const fetchPermissionGroups = async (): Promise<PermissionGroup[]> => {
  await delay();
  return [...MOCK_PERMISSION_GROUPS];
};

export const createUser = async (data: UserFormData): Promise<AdminUser> => {
  await delay();

  const newId = `user-${Date.now()}`;
  const newUser: AdminUser = {
    id: newId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    role: data.role,
    status: UserStatus.ACTIVE,
    createdDate: new Date(),
    avatar: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
  };

  usersStore.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, data: UserFormData): Promise<AdminUser> => {
  await delay();

  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error(`User with id ${id} not found`);
  }

  const updatedUser: AdminUser = {
    ...usersStore[userIndex],
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    role: data.role,
    avatar: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
  };

  usersStore[userIndex] = updatedUser;
  return updatedUser;
};

export const updateUserStatus = async (id: string, status: UserStatus): Promise<AdminUser> => {
  await delay();

  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error(`User with id ${id} not found`);
  }

  const updatedUser: AdminUser = {
    ...usersStore[userIndex],
    status,
  };

  usersStore[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  await delay();

  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error(`User with id ${id} not found`);
  }

  usersStore.splice(userIndex, 1);
};
