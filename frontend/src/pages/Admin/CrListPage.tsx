// SOLID PRINCIPLES APPLIED:
// - Single Responsibility (SRP): Subcomponents (StatCard, UserTable) are defined separately from their data and layout coordination logic. Layout wrapper handles page-level scaffolding.
// - Open/Closed (OCP): StatCard and UserTable can accept different data sources or configurations without modifying their core.
// - Dependency Inversion (DIP): The actual state or data loading could be handled via hooks; Data interfaces decouple implementation.

import { TeamOutlined, SafetyOutlined, LineChartOutlined, FilterOutlined, UserAddOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- INTERFACES: Single Source of Truth for Data Shapes ---
interface StatData {
  title: string;
  value: string;
  subtext: React.ReactNode;
  icon: React.ReactNode;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'Active' | 'Suspended';
  avatarInitials: string;
}

// --- SUBCOMPONENTS (SRP) ---

const StatCard = ({ title, value, subtext, icon }: StatData) => (
  <div className="bg-[#1C1D24] p-6 rounded border border-[#2A2B35] flex flex-col justify-between shadow-sm">
    <div className="flex justify-between items-start mb-6 text-gray-400 font-bold text-[11px]">
      <span className="uppercase tracking-widest">{title}</span>
      <span className="text-lg">{icon}</span>
    </div>
    <div>
      <h2 className="text-4xl font-extrabold text-white mb-2">{value}</h2>
      <div className="text-[13px] font-medium text-gray-500">{subtext}</div>
    </div>
  </div>
);

const UserTable = ({ users }: { users: UserData[] }) => {
  const navigate = useNavigate();

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SECURITY_LEAD':
        return 'bg-[#4B22A8] text-white border-transparent';
      case 'AUDITOR':
        return 'bg-[#3A3B45] text-white border-transparent';
      case 'DEV_OPS':
        return 'bg-[#4B22A8]/40 text-[#A78BFA] border-[#A78BFA]/30';
      default:
        return 'bg-[#2A2B35] text-gray-300';
    }
  };

  return (
    <div className="bg-[#1C1D24] rounded-lg border border-[#2A2B35] shadow-sm overflow-hidden mt-8">
      {/* Table Header Section */}
      <div className="flex justify-between items-center p-6 border-b border-[#2A2B35]">
        <h3 className="text-[17px] font-semibold text-white">Identity Registry</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#262731] text-gray-300 rounded font-medium text-sm hover:bg-[#34353F] transition border border-[#34353F]">
            <FilterOutlined /> Filters
          </button>
          <button
            onClick={() => navigate('/change-requests/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[#9D72FF] text-white rounded font-medium text-sm hover:bg-[#8B5CF6] transition flex-shrink-0"
          >
            <UserAddOutlined /> Provision User
          </button>
        </div>
      </div>

      {/* Table Data Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-[#2A2B35]">
              <th className="px-6 py-4 font-bold">Full Name</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Username</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2B35]">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-[#21222A] transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded bg-[#3A3B45] flex items-center justify-center text-[13px] font-bold text-white shadow-inner">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <span className="text-white font-medium text-[15px]">{user.name.split(' ')[0]}</span><br />
                      <span className="text-white font-medium text-[15px]">{user.name.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-gray-400 text-sm">{user.email}</span></td>
                <td className="px-6 py-4"><span className="text-gray-400 text-sm">{user.username}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold tracking-widest rounded border uppercase ${getRoleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#C084FC] shadow-[0_0_8px_#C084FC]' : 'bg-red-400 shadow-[0_0_8px_#f87171] opacity-60'}`} />
                    {user.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-600 group-hover:text-white transition-colors cursor-pointer text-xl font-bold">
                    ...
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center p-5 px-6 bg-[#16171B] border-t border-[#2A2B35] text-[13px] text-gray-500 font-medium">
        <span>Showing 1-10 of 12,482 entries</span>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded hover:bg-[#2A2B35] flex items-center justify-center font-bold">&lt;</button>
          <button className="w-8 h-8 rounded bg-[#B794F4] text-white flex items-center justify-center font-bold">1</button>
          <button className="w-8 h-8 rounded hover:bg-[#2A2B35] text-white flex items-center justify-center font-bold">2</button>
          <button className="w-8 h-8 rounded hover:bg-[#2A2B35] text-white flex items-center justify-center font-bold">3</button>
          <button className="w-8 h-8 rounded flex items-center justify-center">...</button>
          <button className="w-8 h-8 rounded hover:bg-[#2A2B35] text-white flex items-center justify-center font-bold">&gt;</button>
        </div>
      </div>
    </div>
  );
};

// --- DATA INJECTION & PAGE ASSEMBLY ---

const CrListPage = () => {
  const stats: StatData[] = [
    {
      title: 'Total Users',
      value: '12,482',
      subtext: <span className="text-[#9D72FF] flex items-center gap-1.5"><span className="text-lg leading-none">↗</span> +12% from last month</span>,
      icon: <TeamOutlined />
    },
    {
      title: 'Active Identities',
      value: '9,102',
      subtext: 'Current concurrent sessions',
      icon: <SafetyOutlined className="text-gray-300" />
    },
    {
      title: 'System Health',
      value: '99.98%',
      subtext: <span className="text-[#FBBF24] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24] inline-block" /> Operational Nominal</span>,
      icon: <LineChartOutlined className="text-[#FBBF24]" />
    }
  ];

  const mockUsers: UserData[] = [
    { id: '1', name: 'Adrian Vance', email: 'a.vance@midnight.io', username: '@vance_prime', role: 'SUPER_ADMIN', status: 'Active', avatarInitials: 'AV' },
    { id: '2', name: 'Elena Rodriguez', email: 'e.rod@enterprise.com', username: '@elena_cyber', role: 'AUDITOR', status: 'Active', avatarInitials: 'ER' },
    { id: '3', name: 'Marcus Chen', email: 'm.chen@security.net', username: '@mchen_dev', role: 'DEV_OPS', status: 'Suspended', avatarInitials: 'MC' },
    { id: '4', name: 'Sarah oenkins', email: 's.jenkins@onyx.io', username: '@jenkins_sec', role: 'SECURITY_LEAD', status: 'Active', avatarInitials: 'SJ' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-10 mt-2">
        <h1 className="text-[32px] font-bold text-white mb-3 tracking-tight">User Directory</h1>
        <p className="text-[15px] font-medium text-gray-400">Manage global identity registry and access control policies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <UserTable users={mockUsers} />
    </div>
  );
};

export default CrListPage;
