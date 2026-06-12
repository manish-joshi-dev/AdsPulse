import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)"
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" style={{ color: "var(--color-accent-warning)" }} />
      ) : (
        <Moon className="w-4 h-4" style={{ color: "var(--color-accent-primary)" }} />
      )}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
};
