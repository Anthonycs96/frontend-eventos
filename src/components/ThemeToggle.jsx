import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-[rgb(var(--card-background))]
                border border-[rgb(var(--card-border))]
                hover:bg-[rgb(var(--card-background))/80]
                transition-colors duration-200"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[rgb(var(--foreground))]" />
      ) : (
        <Moon className="h-5 w-5 text-[rgb(var(--foreground))]" />
      )}
    </button>
  );
}
