import RegistredEvent from "./RegistredEvent";
import { getAllRegistredEventsOfUser } from "../actions/actions";
import Sidebar from "./Sidebar";
import HeadlineClient from "./HeadlineClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Horizon Tect Fest 2025",
  description:
    "Access your personalized dashboard to track sessions, tickets, and participation stats.",
};

const Dashboard = async () => {
  const { data } = await getAllRegistredEventsOfUser();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <HeadlineClient />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <RegistredEvent registeredEvents={data} />

        {/* Sidebar */}
        <Sidebar registeredEvents={data} />
      </div>
    </div>
  );
};

export default Dashboard;
