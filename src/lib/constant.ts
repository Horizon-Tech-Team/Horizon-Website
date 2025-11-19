// lib/constants.ts

export const BRANCHES = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Other",
] as const;

export const COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "NIT Trichy",
  "BITS Pilani",
  "VIT Vellore",
  "Other",
] as const;

export const YEARS_OF_STUDY = [1, 2, 3, 4, 5] as const;

// Types
export type Branch = (typeof BRANCHES)[number];
export type College = (typeof COLLEGES)[number];
export type YearOfStudy = (typeof YEARS_OF_STUDY)[number];

// Define hardcore rule types
export const RULE_TYPES = [
  // =======================
  // Qualification Rules - Round 1
  // =======================
  {
    value: "gold_qualified_round1",
    label: "Gold Qualified - Round 1",
    description: "Qualify Round 1 with Gold level",
    points: [300, 150],
    category: "qualification",
  },
  {
    value: "silver_qualified_round1",
    label: "Silver Qualified - Round 1",
    description: "Qualify Round 1 with Silver level",
    points: [200, 100],
    category: "qualification",
  },
  {
    value: "bronze_qualified_round1",
    label: "Bronze Qualified - Round 1",
    description: "Qualify Round 1 with Bronze level",
    points: [100, 50],
    category: "qualification",
  },

  // =======================
  // Qualification Rules - Round 2
  // =======================
  {
    value: "gold_qualified_round2",
    label: "Gold Qualified - Round 2",
    description: "Qualify Round 2 with Gold level",
    points: [300, 150],
    category: "qualification",
  },
  {
    value: "silver_qualified_round2",
    label: "Silver Qualified - Round 2",
    description: "Qualify Round 2 with Silver level",
    points: [200, 100],
    category: "qualification",
  },
  {
    value: "bronze_qualified_round2",
    label: "Bronze Qualified - Round 2",
    description: "Qualify Round 2 with Bronze level",
    points: [100, 50],
    category: "qualification",
  },

  // =======================
  // Winner Rules - Gold
  // =======================
  {
    value: "gold_winner_1st",
    label: "Gold Winner - 1st Place",
    description: "Winner 1st place at Gold level",
    points: [800, 400],
    category: "winner",
  },
  {
    value: "gold_winner_2nd",
    label: "Gold Winner - 2nd Place",
    description: "Winner 2nd place at Gold level",
    points: [700, 350],
    category: "winner",
  },
  {
    value: "gold_winner_3rd",
    label: "Gold Winner - 3rd Place",
    description: "Winner 3rd place at Gold level",
    points: [600, 300],
    category: "winner",
  },

  // =======================
  // Winner Rules - Silver
  // =======================
  {
    value: "silver_winner_1st",
    label: "Silver Winner - 1st Place",
    description: "Winner 1st place at Silver level",
    points: [600, 300],
    category: "winner",
  },
  {
    value: "silver_winner_2nd",
    label: "Silver Winner - 2nd Place",
    description: "Winner 2nd place at Silver level",
    points: [500, 250],
    category: "winner",
  },
  {
    value: "silver_winner_3rd",
    label: "Silver Winner - 3rd Place",
    description: "Winner 3rd place at Silver level",
    points: [400, 200],
    category: "winner",
  },

  // =======================
  // Winner Rules - Bronze
  // =======================
  {
    value: "bronze_winner_1st",
    label: "Bronze Winner - 1st Place",
    description: "Winner 1st place at Bronze level",
    points: [400, 200],
    category: "winner",
  },
  {
    value: "bronze_winner_2nd",
    label: "Bronze Winner - 2nd Place",
    description: "Winner 2nd place at Bronze level",
    points: [300, 150],
    category: "winner",
  },
  {
    value: "bronze_winner_3rd",
    label: "Bronze Winner - 3rd Place",
    description: "Winner 3rd place at Bronze level",
    points: [200, 100],
    category: "winner",
  },

  // =======================
  // Extra / Negative
  // =======================
  {
    value: "extra_activity",
    label: "Extra Activity",
    description: "Points for additional activities outside events",
    points: [],
    category: "other",
  },
  {
    value: "negative_activity",
    label: "Negative Activity",
    description: "Penalty points for misconduct or rule violations",
    points: [],
    category: "other",
  },
] as const;

export type RuleType = (typeof RULE_TYPES)[number]["value"];
