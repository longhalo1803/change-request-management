/**
 * PermissionsPage Component
 * Main page container with tabs for Accounts and Permission Groups
 */

import { useState, useEffect } from "react";
import { Tabs, Spin } from "antd";
import { PermissionGroup } from "@/lib/types";
import { AccountsTab } from "./AccountsTab";
import { permissionsService } from "@/services/permissions.service";
import { useTranslation } from "react-i18next";

export const PermissionsPage = () => {
  const { t } = useTranslation("admin");
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissionGroups();
  }, []);

  const loadPermissionGroups = async () => {
    try {
      setLoading(true);
      const groups = await permissionsService.fetchPermissionGroups();
      setPermissionGroups(groups || []);
    } catch (error) {
      console.warn("Failed to load permission groups, using fallback data");
      setPermissionGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      key: "accounts",
      label: t("permissions.accounts_tab"),
      children: <AccountsTab permissionGroups={permissionGroups} />,
    },
    {
      key: "groups",
      label: t("permissions.groups_tab"),
      children: (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Permission Groups management coming soon
          </p>
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
      <Tabs
        items={tabs}
        defaultActiveKey="accounts"
        className="permissions-tabs"
      />
    </div>
  );
};
