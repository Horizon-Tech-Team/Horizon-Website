import { RuleType } from "./constant";

export interface TeamMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
}

export interface EventDetails {
  name: string;
  category: string;
}

export interface RegisteredEvent {
  uid: string;
  event_id: string;
  user_id: string;
  is_team_event: boolean;
  team_name: string | null;
  status: "registered" | "completed" | "cancelled" | "submitted"; // add other statuses if needed
  mode: "online" | "offline"
  attendance_status: "present" | "absent" | null
  created_at: string;
  team_members: TeamMember[];
  event: EventDetails;
}

// types/index.ts or types/cl.ts

export type CLLeader = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CLInfo = {
  uid: string;
  cl_code: string;
  college_name: string;
  created_at: string;
  contingent_leader: CLLeader;
};

export type PRPointRecord = {
  uid: string;
  cl_id: string;
  awarded_by: string;
  points: number;
  rule_type: RuleType;
  description: string;
  created_at: string;
  event: {
    uid: string;
    name: string;
    category: string;
  } | null;
  pr_user: {
    uid: string;
    firstName: string;
    lastName: string;
  };
  member: {
    uid: string;
    firstName: string;
    lastName: string;
  };
};

export type PR_History = {
  uid: string;
  cl_id: string;
  awarded_by: string;
  points: number;
  rule_type: RuleType;
  description: string;
  created_at: string;
  event: {
    uid: string;
    name: string;
    category: string;
  } | null;
  cl: {
    uid: string;
    firstName: string;
    lastName: string;
    college_name: string;
  };
  member: {
    uid: string;
    firstName: string;
    lastName: string;
  };
};

export type EventResult = {
  event_name: string;
  participation_count: number;
  participation_score: number;
  on_spot_participation_count: number;
  on_spot_bonus: number;
  ranks_achieved: string[];
  ranking_bonus: number;
  total_event_score: number;
};

export type Categories = Record<string, EventResult[]>;

export type Summary = {
  category_totals: Record<string, number>;
  extra_activities_score: number;
  final_score: number;
};

export type FinalScoringResponse = {
  categories: Categories;
  summary: Summary;
};

// types.ts
export interface CLStudent {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  avatar?: string;
  branch: string;
  year_of_study: number;
  registrations: Registration[];
}

export interface Registration {
  uid: string;
  event_id: string;
  user_id: string;
  is_team_event: boolean;
  team_name: string | null;
  status: string;
  created_at: string; // ISO date string
  team_members: TeamMember[];
  event: EventDetails;
}

// This is your whole API response type
export type CLStudentsResponse = CLStudent[];
