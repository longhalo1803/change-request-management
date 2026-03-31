/**
 * PermissionsPage Component
 * Main page container with tabs for Accounts and Permission Groups
 */

import { useState, useEffect } from 'react';
import { Tabs, Spin, message } from 'antd';
import { PermissionGroup } from '@/lib/types';
import { AccountsTab } from './AccountsTab';
import { fetchPermissionGroups } from '@/services/permissions.service.mock';

export const PermissionsPage = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissionGroups();
  }, []);

  const loadPermissionGroups = async () => {
    try {
      setLoading(true);
      const groups = await fetchPermissionGroups();
      setPermissionGroups(groups);
    } catch (error) {
      message.error('Failed to load permission groups');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      key: 'accounts',
      label: 'Tài khoản (Accounts)',
      children: <AccountsTab permissionGroups={permissionGroups} />,
    },
    {
      key: 'groups',
      label: 'Nhóm quyền (Permission Groups)',
      children: (
        <div className="text-center py-12">
          <p className="text-gray-500">Permission Groups management coming soon</p>
        </div>
      ),
      disabled: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý quyền</h1>
        <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
      </div>

      <Tabs
        items={tabs}
        defaultActiveKey="accounts"
        className="permissions-tabs"
      />
    </div>
  );
};
