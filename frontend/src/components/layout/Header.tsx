import { SearchOutlined, BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';

export const Header = () => {
  return (
    <header className="h-[72px] flex items-center justify-between px-8 bg-[#131417] text-gray-400 border-b border-[#2A2B35]">
      <div className="flex items-center gap-3 no-bg py-2 w-[400px]">
        <SearchOutlined className="text-gray-500" />
        <input 
          type="text" 
          placeholder="Search identities..." 
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="hover:text-white transition-colors relative">
          <BellOutlined className="text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border-2 border-[#131417]"></span>
        </button>
        <button className="hover:text-white transition-colors"><QuestionCircleOutlined className="text-[22px]" /></button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-gray-800">
          <div className="text-right">
            <p className="text-[13px] font-bold text-gray-200">Admin Terminal</p>
            <p className="text-[11px] text-gray-500">System Overlord</p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-700">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover bg-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};
