// SOLID PRINCIPLES APPLIED:
// - Single Responsibility (SRP): Separated components for User Profile, Role Options, Advanced Scope, and Permission Preview.
// - Open/Closed (OCP): RoleSelectCard takes props and can render any role configuration without changing its internal structure.
// - Dependency Inversion (DIP): Defined interfaces to keep the view separated from actual data structure implementation.

import React, { useState } from 'react';
import {
  SafetyCertificateOutlined,
  CodeOutlined,
  BugOutlined,
  UserOutlined,
  InfoCircleOutlined,
  LockOutlined,
  DownOutlined,
  CheckOutlined
} from '@ant-design/icons';

// --- INTERFACES ---
interface UserProfile {
  name: string;
  id: string;
  email: string;
  status: 'Active' | 'Suspended';
  lastLogin: string;
  avatarUrl?: string; // We'll use a placeholder
}

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

// --- SUBCOMPONENTS ---

const UserProfileCard = ({ user }: { user: UserProfile }) => (
  <div className="bg-[#1C1D24] p-8 rounded-lg border border-[#2A2B35] flex flex-col shadow-sm">
    <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden mb-6 border border-[#2A2B35]">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Avatar" className="w-full h-full object-cover bg-[#4B3F72]" />
    </div>

    <h2 className="text-2xl font-bold text-white leading-tight">{user.name}</h2>
    <p className="text-[12px] text-gray-400 font-mono mt-1 uppercase tracking-wider mb-8">ID: {user.id}</p>

    <div className="flex flex-col gap-5 text-[13px]">
      <div className="flex justify-between items-center border-b border-[#2A2B35] pb-4">
        <span className="text-gray-500">Email Address</span>
        <span className="text-gray-300 font-medium">{user.email}</span>
      </div>
      <div className="flex justify-between items-center border-b border-[#2A2B35] pb-4">
        <span className="text-gray-500">Status</span>
        <div className="flex items-center gap-2 bg-[#21222A] px-3 py-1 rounded-full border border-[#2A2B35]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#9D72FF] shadow-[0_0_8px_#9D72FF]"></div>
          <span className="text-gray-300 font-medium">{user.status}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Last Login</span>
        <span className="text-gray-400 font-medium">{user.lastLogin}</span>
      </div>
    </div>
  </div>
);

const SecurityProtocolBox = () => (
  <div className="bg-[#131417] border-l-4 border-l-[#9D72FF] p-6 rounded-r-lg shadow-sm border-y border-r border-[#2A2B35]">
    <div className="flex items-center gap-2 text-white font-bold text-[14px] mb-3">
      <InfoCircleOutlined className="text-[#9D72FF]" />
      Security Protocol
    </div>
    <p className="text-[13px] text-gray-400 leading-relaxed">
      Role changes are audited. Updating permissions will force a session re-authentication for this user upon their next action.
    </p>
  </div>
);

const RoleSelectCard = ({
  role,
  isSelected,
  onSelect
}: {
  role: RoleOption;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all duration-300 rounded-lg p-6 border ${isSelected
          ? 'bg-[#9D72FF] border-[#B794F4] shadow-[0_0_20px_rgba(157,114,255,0.15)] transform scale-[1.02]'
          : 'bg-[#22232B] border-[#2A2B35] hover:border-gray-500'
        } flex flex-col h-[280px]`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg ${isSelected ? 'bg-[#8B5CF6] text-white shadow-inner' : 'bg-[#1C1D24] text-gray-400'}`}>
          {role.icon}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white' : 'border-gray-600'}`}>
          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
        </div>
      </div>

      <h3 className={`text-xl font-bold mb-3 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
        {role.title}
      </h3>

      <p className={`text-[13px] leading-relaxed mb-auto ${isSelected ? 'text-purple-100' : 'text-gray-400'}`}>
        {role.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {role.tags.map(tag => (
          <span
            key={tag}
            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${isSelected
                ? 'bg-[#8B5CF6] text-white border-[#A78BFA]'
                : 'bg-[#1C1D24] text-gray-500 border-[#2A2B35]'
              }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const PermissionPreview = () => (
  <div className="bg-[#1C1D24] border border-[#2A2B35] rounded-lg p-8 flex justify-between items-center relative mt-6">
    <div className="flex flex-col gap-6 flex-1 pr-12">
      <h3 className="text-xl font-bold text-white mb-2">Permission Preview</h3>

      <div className="grid grid-cols-4 gap-8">
        <div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#9D72FF] mb-2">
            <span>DATA EXFIL</span>
          </div>
          <div className="h-1 bg-[#2A2B35] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white w-[85%]"></div>
          </div>
          <p className="text-sm font-semibold text-white">85% High Sensitivity</p>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-orange-400 mb-2">
            <span>SYSTEM IMPACT</span>
          </div>
          <div className="h-1 bg-[#2A2B35] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-orange-400 w-[60%]"></div>
          </div>
          <p className="text-sm font-semibold text-white">Moderate</p>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-2">
            <span>RISK SCORE</span>
          </div>
          <div className="h-1 bg-[#2A2B35] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-400 w-[30%]"></div>
          </div>
          <p className="text-sm font-semibold text-white">Low Risk</p>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#9D72FF] mb-2">
            <span>AUDIT LEVEL</span>
          </div>
          <div className="h-1 bg-[#2A2B35] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#9D72FF] w-[100%] shadow-[0_0_8px_#9D72FF]"></div>
          </div>
          <p className="text-sm font-semibold text-white">Full Traceability</p>
        </div>
      </div>
    </div>

    <div className="w-[300px] border-l border-[#2A2B35] pl-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-[#2A2B35] flex items-center justify-center text-gray-400">
          <LockOutlined />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">ENCRYPTION</p>
          <p className="text-[14px] font-bold text-white">AES-256 Enabled</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-[#2A2B35] flex items-center justify-center text-gray-400">
          <SafetyCertificateOutlined />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">MFA STATUS</p>
          <p className="text-[14px] font-bold text-white">Mandatory</p>
        </div>
      </div>
    </div>

    {/* Floating Verify Button from original UI */}
    <button className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#E0D4FF] hover:bg-white text-[#4B22A8] text-xl rounded shadow-[0_0_20px_rgba(157,114,255,0.3)] flex items-center justify-center transition-all hover:scale-105">
      <CheckOutlined />
    </button>
  </div>
);

// --- MAIN PAGE ---

const CrDetailPage = () => {
  const [selectedRole, setSelectedRole] = useState<string>('developer');

  const mockUser: UserProfile = {
    name: 'Alexander Vance',
    id: 'MO-8821-X98',
    email: 'a.vance@onyx.tech',
    status: 'Active',
    lastLogin: '14m ago from 192.168.1.1'
  };

  const roleOptions: RoleOption[] = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Full access to system configurations, billing, and all user management features.',
      icon: <SafetyCertificateOutlined />,
      tags: ['FULL ACCESS', 'BILLING']
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'Access to API keys, source control integration, and technical log monitoring.',
      icon: <CodeOutlined />,
      tags: ['API READ/WRITE', 'CI/CD MGR']
    },
    {
      id: 'qa',
      title: 'QA',
      description: 'Permission to manage test environments, bug tracking, and automated deployment logs.',
      icon: <BugOutlined />,
      tags: ['STAGING ONLY']
    },
    {
      id: 'customer',
      title: 'Customer',
      description: 'Standard interface access for end-users. View-only access to organizational analytics.',
      icon: <UserOutlined />,
      tags: ['READ-ONLY ANLY']
    }
  ];

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-10 w-full overflow-x-hidden">
      <div className="w-full max-w-[1240px] flex flex-col mx-auto px-4">

        {/* Main Top Header block including breadcrumb and action buttons */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <span>IDENTITY</span>
              <span className="text-gray-600">›</span>
              <span>USER MANAGEMENT</span>
              <span className="text-gray-600">›</span>
              <span className="text-gray-300">ASSIGN ROLE</span>
            </div>
            <h1 className="text-[44px] font-extrabold text-white tracking-tight mb-2 leading-none">
              Assign User Role
            </h1>
            <p className="text-[15px] text-gray-400">
              Modify system-wide permissions and access levels for secure enterprise operations.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-[#1C1D24] text-gray-300 border border-[#2A2B35] px-6 py-3 rounded font-bold text-[13px] hover:bg-[#2A2B35] transition-colors">
              Discard Changes
            </button>
            <button className="bg-[#9D72FF] text-[#131417] px-6 py-3 rounded font-bold text-[13px] hover:bg-[#8B5CF6] transition-colors shadow-sm">
              Save Permissions
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Column (User Profile) */}
          <div className="w-[340px] flex-shrink-0 flex flex-col gap-6">
            <UserProfileCard user={mockUser} />
            <SecurityProtocolBox />
          </div>

          {/* Right Column (Role Selection & Scope) */}
          <div className="flex-1 bg-[#1C1D24] rounded-lg border border-[#2A2B35] p-10 shadow-sm flex flex-col">

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[19px] font-bold text-white">Select Security Role</h3>
              <span className="bg-[#2A2B35] text-gray-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded font-bold">
                STEP 1 OF 2
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              {roleOptions.map(role => (
                <RoleSelectCard
                  key={role.id}
                  role={role}
                  isSelected={selectedRole === role.id}
                  onSelect={() => setSelectedRole(role.id)}
                />
              ))}
            </div>

            <div className="mt-auto">
              <h3 className="text-[17px] font-bold text-white mb-6">Advanced Scope (Optional)</h3>
              <div className="flex gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                    ACCESS EXPIRATION
                  </label>
                  <div className="relative">
                    <select className="w-full bg-[#131417] border border-[#2A2B35] rounded px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-[#9D72FF] appearance-none cursor-pointer font-medium">
                      <option>Never</option>
                      <option>30 Days</option>
                      <option>90 Days</option>
                    </select>
                    <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-[12px] pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-end justify-center px-4 pt-8 text-gray-600">
                  — OR —
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                    DEPARTMENT TAG
                  </label>
                  <input
                    type="text"
                    defaultValue="Engineering-Delta"
                    className="w-full bg-[#131417] border border-[#2A2B35] rounded px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-[#9D72FF] font-medium placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Permission Preview */}
        <PermissionPreview />

      </div>
    </div>
  );
};

export default CrDetailPage;
