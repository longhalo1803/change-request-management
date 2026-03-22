import {
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: <AppstoreOutlined /> },
  { path: '/users', name: 'Users', icon: <UserOutlined /> },
  { path: '/roles', name: 'Roles', icon: <TeamOutlined /> },
  { path: '/security', name: 'Security', icon: <SafetyCertificateOutlined /> },
];

export const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-[#17181C] flex flex-col justify-between border-r border-[#2A2B35]">
      <div>
        <div className="p-6 pb-8">
          <h1 className="text-xl font-bold tracking-wider text-white uppercase mt-2">SOLASHI</h1>
          <p className="text-xs text-gray-400 mt-1">Enterprise Admin</p>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-medium rounded transition-colors relative ${
                  isActive
                    ? 'bg-[#212228] text-white'
                    : 'text-gray-400 hover:bg-[#1C1D24] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* If active, border left */}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r"></div>
                  )}
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[15px]">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <div className="bg-[#1C1D24] rounded-lg p-4 mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] uppercase font-bold text-gray-400">Current Usage</p>
          </div>
          <div className="h-1.5 w-full bg-[#2A2B35] rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-purple-500 w-[60%]"></div>
          </div>
          <button className="w-full bg-[#9D72FF] hover:bg-[#8B5CF6] text-white py-2 rounded text-sm font-semibold transition-colors">
            Upgrade Plan
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full text-left">
            <SettingOutlined />
            <span className="text-[15px]">Settings</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full text-left">
            <LogoutOutlined />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
