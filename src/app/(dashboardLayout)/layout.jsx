import Logo from "@/components/Logo";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#080c16]">
        <aside className="w-64 h-screen border-r border-white/5">
            <div className="px-6 py-5 border-b border-white/5" >
<Logo/>
            </div>
        </aside>
      <div>
        {children}
        </div>
    </div>
  );
};

export default DashBoardLayout;
