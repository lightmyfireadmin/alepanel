import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const DarkModeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          theme === "dark" ? "bg-primary" : "bg-muted"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setTheme === "function") {
              setTheme(theme === "dark" ? "light" : "dark");
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-background shadow-sm duration-75 ease-linear ${
            theme === "dark" && "!right-[3px] !translate-x-full"
          }`}
        >
          <span className="dark:hidden">
            <Sun className="w-4 h-4 text-yellow-500" />
          </span>
          <span className="hidden dark:inline-block">
             <Moon className="w-4 h-4 text-blue-400" />
          </span>
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
