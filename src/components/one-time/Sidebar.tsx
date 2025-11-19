// "use client";

// import { useTheme } from "next-themes";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";
// import { Separator } from "../ui/separator";
// import {
//   Home,
//   Logs,
//   PowerIcon,
//   Settings,
//   Workflow,
// } from "lucide-react";

// export const menuOptions = [
//   { name: "Dashboard", Component: Home, href: "/admin" },
//   { name: "Tasks", Component: Workflow, href: "/tasks" },
//   { name: "Settings", Component: Settings, href: "/admin/settings" },
//   { name: "PR", Component: PowerIcon, href: "/admin/pr" },
// ];

// options: {
//   admin: ['home', 'settings', 'pr'],
//   pr: ['','award pr','dashboard','cl users']
// }

// const Sidebar = () => {
//   const pathName = usePathname();
//   const { theme } = useTheme();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const isDark = theme === "dark";

//   return (
//     <nav className="h-screen overflow-x-hidden justify-between flex items-center flex-col gap-10 py-4">
//       <div className="flex items-center justify-center flex-col gap-8">
//         {/* Menu */}
//         <ul className="flex flex-col gap-4 items-center">
//           {menuOptions.map(({ name, Component, href }) => {
//             const isActive = pathName === href;
//             return (
//               <li key={name}>
//                 <Link
//                   href={href}
//                   aria-current={isActive ? "page" : undefined}
//                   className={clsx(
//                     "group h-8 w-8 flex items-center justify-center scale-[1.5] rounded-lg p-[3px] cursor-pointer",
//                     {
//                       "dark:bg-[#2F006B] bg-[#EEE0FF]": isActive,
//                     }
//                   )}
//                 >
//                   <Component
//                     className={clsx("h-4 w-4", {
//                       "text-primary": isActive,
//                       "text-muted-foreground": !isActive,
//                     })}
//                   />
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>

//         <Separator />
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Separator } from "../ui/separator";
import {
  Home,
  Settings,
  PowerIcon,
  Users,
  Award,
  LayoutDashboard,
  CalendarCheck,
  BookmarkCheckIcon,
  TrophyIcon,
} from "lucide-react";
import { useAuth } from "@/app/AuthProvider"; // ✅ adjust import if path differs

// Define menu config based on role
const roleMenus: Record<
  string,
  { name: string; href: string; icon: React.ElementType }[]
> = {
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "PR Panel", href: "/admin/pr", icon: PowerIcon },
  ],
  superadmin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Manage Registrations",
      href: "/admin/registrations",
      icon: BookmarkCheckIcon,
    },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Manage Events", href: "/admin/events", icon: CalendarCheck },
    { name: "PR Panel", href: "/admin/pr/dashboard", icon: TrophyIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  public_relation: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Award PR", href: "/admin/pr/award", icon: Award },
  ],
};

const Sidebar = () => {
  const pathName = usePathname();
  const { user } = useAuth();

  const role = user?.role ?? "superadmin"; // fallback
  const menuOptions = roleMenus[role] || [];

  return (
    <nav className="h-screen overflow-x-hidden justify-between flex items-center flex-col py-6 border-r dark:border-gray-800">
      <div className="flex flex-col gap-6 items-center">
        {/* Menu */}
        <ul className="flex flex-col gap-4 items-center">
          {menuOptions.map(({ name, href, icon: Icon }) => {
            const isActive = pathName === href;
            return (
              <li key={name}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "group h-9 w-9 flex items-center justify-center rounded-lg transition-colors",
                    {
                      "bg-[#EEE0FF] dark:bg-[#2F006B] text-primary": isActive,
                      "text-muted-foreground hover:text-primary": !isActive,
                    }
                  )}
                  title={name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="w-8" />
      </div>
    </nav>
  );
};

export default Sidebar;
