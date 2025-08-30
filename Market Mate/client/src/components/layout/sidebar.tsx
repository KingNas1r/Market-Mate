import { BarChart3, Package, ShoppingCart, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                      isActive
                        ? "bg-primary-blue text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
