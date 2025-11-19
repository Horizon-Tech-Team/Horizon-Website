import Sidebar from "@/components/one-time/Sidebar";
import { Metadata } from "next";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Horizon | Admin dashboard",
  description:
    "Admin dashboard for managing users, settings, events and many more.",
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-[50vh]">
      {/* Sidebar */}
      <aside className="w-10 md:w-14 lg:w-18 border-r dark:border-gray-800">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-background">
        {children}
      </main>
    </div>
  );
}
