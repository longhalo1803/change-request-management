/**
 * AccountsTab Component
 * Main tab component with search, table, and user management
 */

import { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  AdminUser,
  UserFormData,
  PermissionGroup,
  UserStatus,
} from "@/lib/types";
import { PermissionsTable } from "./PermissionsTable";
import { AccountModal } from "./AccountModal";
import { permissionsService } from "@/services/permissions.service";

interface AccountsTabProps {
  permissionGroups: PermissionGroup[];
}

export const AccountsTab = ({ permissionGroups }: AccountsTabProps) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await permissionsService.fetchUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.warn("Failed to load users, using fallback data");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await permissionsService.deleteUser(id);
      message.success("User deleted successfully");
      await loadUsers();
    } catch (error) {
      message.error("Failed to delete user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: UserStatus) => {
    try {
      setLoading(true);
      await permissionsService.updateUserStatus(id, status);
      message.success(
        `User ${status === UserStatus.ACTIVE ? "activated" : "deactivated"} successfully`
      );
      await loadUsers();
    } catch (error) {
      message.error("Failed to update user status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (data: UserFormData) => {
    try {
      setSubmitting(true);
      if (selectedUser) {
        await permissionsService.updateUser(selectedUser.id, data);
        message.success("User updated successfully");
      } else {
        await permissionsService.createUser(data);
        message.success("User created successfully");
      }
      setModalVisible(false);
      setSelectedUser(undefined);
      await loadUsers();
    } catch (error) {
      message.error(
        selectedUser ? "Failed to update user" : "Failed to create user"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedUser(undefined);
  };

  return (
    <div>
      {/* Search and Create Button */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New User
        </Button>
      </div>

      {/* Users Table */}
      <PermissionsTable
        data={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Account Modal */}
      <AccountModal
        visible={modalVisible}
        user={selectedUser}
        permissionGroups={permissionGroups}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        loading={submitting}
      />
    </div>
  );
};
