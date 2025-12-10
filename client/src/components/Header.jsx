import { Activity, BarChart3, FileClock } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { brand } from "../assets/brand.js";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileClock }
];

export const Header = () => (
  <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
          <Activity className="h-5 w-5 text-signal" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-base font-semibold text-ink">{brand.name}</span>
          <span className="block text-sm text-zinc-500">{brand.product}</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "focus-ring inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition",
                  isActive
                    ? "bg-signal text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-ink"
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  </header>
);

