export type TriageStatus = "Genuine_Urgent" | "Genuine_Standard" | "Fun" | "Spam" | "Uncertain";

export type FunnelState = "Recently Raised" | "Under Consideration" | "Dispatched/In Progress" | "Resolved" | "Rejected";

export interface SupportingFile {
  name: string;
  type: string; // e.g. "image/png", "application/pdf", "video/mp4"
  data: string; // base64 encoded string or mock/simulation link
  size?: number;
}

export interface IssueComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  constituency: string;
  isAnonymous: boolean;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  
  // Media Attachment
  attachment?: SupportingFile | null;

  // Funnel & Votes
  votes: number;
  votedUserEmails: string[]; // Track who voted to prevent multiple votes
  funnelState: FunnelState;

  // Department Assignment (PWD, Water, Utilities, Sanitation, General)
  department?: "PWD" | "Water" | "Utilities" | "Sanitation" | "General";

  // AI Triage (Gemini)
  aiTriage?: {
    triage_status: TriageStatus;
    english_summary: string;
    tags: string[];
    analyzedAt: string;
  };

  // Administration response and tracking logs
  adminReply?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  dispatchedAt?: string;
  dispatchedBy?: string;
  dispatchLog?: string;
  validationPhotoUrl?: string;

  // Comments
  comments?: IssueComment[];

  createdAt: string;
}

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  constituency: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  constituency: string;
  badgeId: string;
}

export const STATE_CONSTITUENCIES: Record<string, string[]> = {
  "Delhi": [
    "New Delhi",
    "Chandni Chowk",
    "East Delhi",
    "North East Delhi",
    "North West Delhi",
    "South Delhi",
    "West Delhi"
  ],
  "Maharashtra": [
    "Mumbai South",
    "Mumbai North-West",
    "Pune",
    "Nagpur"
  ],
  "Karnataka": [
    "Bengaluru South",
    "Bengaluru Central",
    "Bengaluru North",
    "Mysuru"
  ],
  "Tamil Nadu": [
    "Chennai Central",
    "Chennai South",
    "Coimbatore"
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Varanasi",
    "Noida",
    "Kanpur"
  ]
};

export const STATES = Object.keys(STATE_CONSTITUENCIES);

export const CONSTITUENCIES = Object.values(STATE_CONSTITUENCIES).flat();

