// SOLID PRINCIPLES APPLIED:
// - Single Responsibility (SRP): Separated form, preview card, info card, and stat widgets into independent components.
// - Open/Closed (OCP): Components accept props to flexibly render any data without changing internal struct.
// - Dependency Inversion (DIP): The main page orchestrates state relying on interfaces.

import React, { useState } from 'react';
import { 
  SafetyCertificateOutlined, 
  UserOutlined, 
  DownOutlined,
  KeyOutlined,
  UnlockOutlined
} from '@ant-design/icons';

// --- INTERFACES (Data Contracts) ---
interface UserFormData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

interface StatWidgetData {
  label: string;
  value: string;
  suffix?: React.ReactNode;
}

// --- SUBCOMPONENTS (SRP) ---

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  isSelect = false,
  options = []
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  isSelect?: boolean;
  options?: string[];
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
      {label}
    </label>
    {isSelect ? (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#131417] border border-[#2A2B35] rounded-md px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#9D72FF] transition placeholder-gray-600 appearance-none h-[46px] cursor-pointer"
        >
          <option value="" disabled className="text-gray-500">{placeholder}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-[12px] pointer-events-none" />
      </div>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#131417] border border-[#2A2B35] rounded-md px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#9D72FF] transition placeholder-gray-600 h-[46px]"
      />
    )}
  </div>
);

const UserPreviewCard = ({ data }: { data: UserFormData }) => {
  return (
    <div className="bg-[#1C1D24] rounded-lg border border-[#2A2B35] p-6 shadow-sm w-[340px] flex-shrink-0 flex flex-col h-[340px] relative">
      <div className="flex justify-between items-center mb-8">
        <span className="bg-[#2A2B35] text-gray-300 text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full">
          Entity Preview
        </span>
        <SafetyCertificateOutlined className="text-gray-400 text-lg" />
      </div>

      <div className="flex items-center gap-5 mb-10">
        <div className="w-[72px] h-[72px] rounded-md bg-[#4B3F72] flex items-center justify-center text-white text-3xl relative shadow-inner">
          <UserOutlined />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#9D72FF] rounded-full border-2 border-[#1C1D24]"></div>
        </div>
        <div>
          <h3 className="text-[19px] font-bold text-white leading-tight">
            {data.fullName || 'Full Name'}
          </h3>
          <p className="text-gray-400 text-[14px] mt-1">
            {data.username ? `@${data.username}` : '@username'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-gray-500">Access Tier</span>
          <span className="text-gray-300 font-bold uppercase tracking-wider text-[11px]">
            {data.role || 'UNASSIGNED'}
          </span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-gray-500">Security Status</span>
          <div className="flex items-center gap-2 text-gray-300 font-bold text-[11px]">
            <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'Suspended' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#9D72FF] shadow-[0_0_8px_#9D72FF]'}`}></div>
            LIVE MONITORING
          </div>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-gray-500">Last Provisioned</span>
          <span className="text-gray-500 font-medium">Never</span>
        </div>
      </div>
    </div>
  );
};

const SecurityProtocolInfo = () => (
  <div className="bg-[#131417] rounded-lg border border-l-4 border-l-[#9D72FF] border-y-[#2A2B35] border-r-[#2A2B35] p-6 shadow-sm w-[340px] mt-6">
    <h4 className="text-white font-bold text-[15px] mb-3">Security Protocol Alpha</h4>
    <p className="text-gray-400 text-[12px] leading-relaxed mb-6">
      All new users are subjected to 256-bit encryption during data transit. Account activation requires multi-factor authentication setup upon first entry into the Midnight Onyx command center.
    </p>
    <div className="flex gap-6 mt-auto text-[11px] font-bold text-gray-500">
      <div className="flex items-center gap-2"><KeyOutlined /> ENCRYPTED VAULT</div>
      <div className="flex items-center gap-2"><UnlockOutlined /> AUTH SUPPORT</div>
    </div>
  </div>
);

const StatWidget = ({ label, value, suffix }: StatWidgetData) => (
  <div className="bg-[#1C1D24] px-6 py-5 rounded border border-[#2A2B35] flex flex-col justify-center">
    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
      {label}
    </span>
    <div className="text-[22px] font-bold text-white flex items-center gap-2">
      {value} {suffix}
    </div>
  </div>
);

// --- MAIN PAGE (Orchestrator) ---

const CrCreatePage = () => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    username: '',
    email: '',
    role: '',
    status: 'Active (Immediate)'
  });

  const updateField = (field: keyof UserFormData, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1100px] flex flex-col">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              USER MANAGEMENT
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#2A2B35] to-transparent"></div>
          </div>
          <h1 className="text-[42px] font-extrabold text-white tracking-tight mb-3">
            Create New User
          </h1>
          <p className="text-[15px] text-gray-400 max-w-2xl leading-relaxed">
            Initialize a new secure profile within the Midnight Onyx ecosystem. Define roles and operational status for immediate system provisioning.
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 mb-8">
          {/* Form Container */}
          <div className="flex-1 bg-[#1C1D24] rounded-lg border border-[#2A2B35] p-8 shadow-sm flex flex-col">
            <div className="flex gap-6 mb-6">
              <InputField
                label="FULL NAME"
                placeholder="e.g. Alexander Vance"
                value={formData.fullName}
                onChange={(v) => updateField('fullName', v)}
              />
              <InputField
                label="USERNAME"
                placeholder="a.vance"
                value={formData.username}
                onChange={(v) => updateField('username', v)}
              />
            </div>

            <div className="mb-6">
              <InputField
                label="EMAIL ADDRESS"
                placeholder="vance@midnight-onyx.ai"
                type="email"
                value={formData.email}
                onChange={(v) => updateField('email', v)}
              />
            </div>

            <div className="flex gap-6 mb-10">
              <InputField
                label="SYSTEM ROLE"
                placeholder="Select privilege level..."
                isSelect
                options={['Customer', 'BrSE', 'Developer', 'QA', 'Admin']}
                value={formData.role}
                onChange={(v) => updateField('role', v)}
              />
              <InputField
                label="INITIAL STATUS"
                isSelect
                options={['Active (Immediate)', 'Suspended', 'Draft']}
                value={formData.status}
                onChange={(v) => updateField('status', v)}
              />
            </div>

            {/* Form Actions */}
            <div className="mt-auto flex justify-between items-center border-t border-[#2A2B35] pt-8">
              <button
                type="button"
                onClick={() => setFormData({ fullName: '', username: '', email: '', role: '', status: 'Active (Immediate)' })}
                className="text-gray-300 font-bold text-[14px] hover:text-white transition-colors"
                title="Discard current inputs"
              >
                Discard Draft
              </button>
              <button className="bg-[#9D72FF] hover:bg-[#8B5CF6] text-white px-8 py-3.5 rounded font-bold text-[13px] tracking-wide transition-colors shadow-sm uppercase">
                PROVISION USER
              </button>
            </div>
          </div>

          {/* Right Sidebar Columns */}
          <div className="flex flex-col">
            <UserPreviewCard data={formData} />
            <SecurityProtocolInfo />
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-4 gap-6 pb-4">
          <StatWidget label="ACTIVE SLOTS" value="842 / 1000" />
          <StatWidget label="NEW TODAY" value="+14" suffix={<span className="text-[#9D72FF] text-[22px]"></span>} />
          <StatWidget label="SECURITY SCORE" value="98%" />
          <StatWidget label="NODE STATUS" value="Stable" suffix={<div className="w-2 h-2 rounded-full bg-[#9D72FF] shadow-[0_0_8px_#9D72FF] ml-2"></div>} />
        </div>
      </div>
    </div>
  );
};

export default CrCreatePage;
