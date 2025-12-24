"use client";
import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import { Search, Menu, Command } from "lucide-react";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg: boolean) => void;
}) => {

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none border-b border-stroke dark:border-strokedark">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden text-black dark:text-white"
          >
             <Menu className="w-6 h-6" />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/admin">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">A</div>
          </Link>
        </div>

        <div className="hidden sm:block">
            <button 
                onClick={triggerCommandPalette}
                className="relative flex items-center w-full min-w-[350px] cursor-pointer text-left bg-gray-50 dark:bg-meta-4/10 border border-stroke dark:border-strokedark rounded-md py-2.5 pl-4 pr-10 text-sm text-bodydark2 hover:border-primary transition-all focus:outline-none"
            >
                <Search className="w-4 h-4 mr-2 text-primary" />
                <span className="flex-1 text-slate-600 dark:text-slate-300">Rechercher ou lancer une commande...</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-boxdark border border-stroke dark:border-strokedark text-[10px] font-bold text-slate-500">
                    <Command className="w-3 h-3" /> K
                </span>
            </button>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
