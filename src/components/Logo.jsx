import Link from "next/link";
import { FaTicketAlt } from "react-icons/fa";

const Logo = () => {
  return (
    <Link href="/" className="group flex items-center gap-3">
      {/* Logo Icon */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#7C3AED] via-[#A855F7] to-[#F43F5E] text-white shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-rose-500/30">
        <div className="absolute inset-px rounded-2xl bg-white/10" />

        <FaTicketAlt className="relative z-10 text-lg -rotate-12 transition-transform duration-300 group-hover:rotate-0" />

        {/* Small glow dot */}
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#080C16] bg-[#22D3EE]" />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-white">
          Tiq
          <span className="bg-linear-to-r from-[#22D3EE] via-[#A855F7] to-[#F43F5E] bg-clip-text text-transparent">
            nora
          </span>
        </span>

        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500 sm:block">
          Event Platform
        </span>
      </div>
    </Link>
  );
};

export default Logo;