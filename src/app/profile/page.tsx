/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Metadata } from "next";
import UpdateForm from "./UpdateProfile";
import {
  getAllRegistredEventsOfUser,
  getCLInfo,
  getDashboardOfCL,
  getPRHistoryOfCl,
  getPRHistoryOfPR,
} from "../actions/actions";
import Sidebar from "@/app/profile/Sidebar";

export const metadata: Metadata = {
  title: "Your Profile | Horizon Tect Fest 2025",
  description:
    "Manage your personal information, registration, and preferences for Horizon Tect Fest 2025.",
};

const page = async () => {
  const { data } = await getAllRegistredEventsOfUser();
  const clInfo = await getCLInfo();
  const clPRHistory = await getPRHistoryOfCl();
  const prPRHistory = await getPRHistoryOfPR();
  const clStats = await getDashboardOfCL();

  return (
    <div className="w-full px-2 md:px-4 py-4 md:py-8">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">
        Manage your personal information and account settings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Sidebar clStat={clStats.data} registeredEvents={data} />
        <div className="md:col-span-2">
          {/* @ts-expect-error */}
          <UpdateForm clInfo={clInfo} clPRHistory={clPRHistory} prPRHistory={prPRHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
