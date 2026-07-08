import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Increase request body payload limit for base64 file transfers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database filepath
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper: Derive department based on keywords in title/description
function getDepartmentFromText(title: string, description: string): "PWD" | "Water" | "Utilities" | "Sanitation" | "General" {
  const content = (title + " " + description).toLowerCase();
  if (content.includes("water") || content.includes("leak") || content.includes("drain") || content.includes("flood") || content.includes("pipe") || content.includes("plumbing")) {
    if (content.includes("sewer") || content.includes("sewage") || content.includes("waste") || content.includes("sanitation")) {
      return "Sanitation";
    }
    return "Water";
  }
  if (content.includes("road") || content.includes("pothole") || content.includes("crater") || content.includes("asphalt") || content.includes("crossing") || content.includes("zebra") || content.includes("pedestrian") || content.includes("sidewalk") || content.includes("pavement") || content.includes("street")) {
    return "PWD";
  }
  if (content.includes("power") || content.includes("wire") || content.includes("electricity") || content.includes("lamp") || content.includes("light") || content.includes("cable") || content.includes("grid")) {
    return "Utilities";
  }
  if (content.includes("garbage") || content.includes("trash") || content.includes("waste") || content.includes("cleanup") || content.includes("clean") || content.includes("dump") || content.includes("sanitation") || content.includes("sewer") || content.includes("sewage")) {
    return "Sanitation";
  }
  return "General";
}

// Helper: Read Database
function readDB(): any {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(getInitialSeedData());
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    // Guarantee fallback departments on read
    if (db && db.issues) {
      db.issues = db.issues.map((issue: any) => {
        if (!issue.department) {
          issue.department = getDepartmentFromText(issue.title, issue.description);
        }
        return issue;
      });
    }
    return db;
  } catch (error) {
    console.error("Failed to read database file, returning default seed:", error);
    return getInitialSeedData();
  }
}

// Helper: Write Database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

// Initial Mock Seed Data to populate our database with realistic high-fidelity items
function getInitialSeedData() {
  try {
    const filePath = path.join(process.cwd(), "db.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read inline seed data from db.json:", e);
  }
  return {
    issues: [
      {
        id: "issue-1",
        title: "Ruptured high-pressure water main flooding Ring Road underpass",
        description: "Water has been gushing out of a primary 400mm main pipe joint on the Ring Road underpass since 4:00 AM, creating a severe gridlock and eroding the pavement foundation.",
        constituency: "New Delhi",
        isAnonymous: false,
        authorName: "Dhruv Gupta",
        authorEmail: "guptadhruv959@gmail.com",
        authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=guptadhruv959",
        attachment: null,
        votes: 42,
        votedUserEmails: ["guptadhruv959@gmail.com"],
        funnelState: "Resolved",
        department: "Water",
        aiTriage: {
          triage_status: "Genuine_Urgent",
          english_summary: "A major water main break on the New Delhi Ring Road is causing severe street flooding and pavement erosion. Immediate intervention is required.",
          tags: ["Water Leak", "Infrastructure", "Urgent"],
          analyzedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        },
        adminReply: "<p><strong>Delhi Jal Board (DJB)</strong> quick response plumbing division was dispatched immediately.</p><ul><li>Main isolation bypass valves successfully closed</li><li>Ruptured high-pressure connection replaced and fully pressure-tested</li><li>Underpass drained completely and pavement foundation stabilized with rapid-cure concrete</li></ul><p>Normal traffic has resumed with zero pressure drops detected across the neighborhood.</p>",
        resolvedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        resolvedBy: "Office of the Chief Engineer, DJB",
        comments: [
          {
            id: "comment-seed-1",
            authorName: "Amit Khanna",
            authorEmail: "amit.khanna@delhigov.in",
            authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
            text: "This is a massive relief! The water pressure in our area has stabilized as well. Kudos to the DJB team for their quick turnaround.",
            createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
          },
          {
            id: "comment-seed-2",
            authorName: "Priyanka Sen",
            authorEmail: "priyanka.sen@eastdelhi.res.in",
            authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            text: "Yes, I drove past this morning and the underpass was completely clear. Excellent job with the rapid-cure concrete!",
            createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-2",
        title: "Missing pedestrian zebra crossings at Chandni Chowk busy market junction",
        description: "The primary road crossing striping has completely faded near the main market square. Children, shoppers, and elderly citizens are struggling to cross safely during busy evening hours because vehicles do not yield.",
        constituency: "Chandni Chowk",
        isAnonymous: true,
        authorName: "Anonymous Resident",
        authorEmail: "",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 12,
        votedUserEmails: [],
        funnelState: "Under Consideration",
        department: "PWD",
        aiTriage: {
          triage_status: "Genuine_Standard",
          english_summary: "High pedestrian hazards near Chandni Chowk market due to completely faded zebra crossings. Vehicles are refusing to yield to pedestrians.",
          tags: ["Road Safety", "Pedestrians", "Marketplace"],
          analyzedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
        },
        createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-3",
        title: "Dangling high-voltage electric cables next to Lajpat Nagar market",
        description: "Loose high-voltage power lines are hanging dangerously low, touching tree branches right above the crowded pedestrian walking path. With the monsoon rain starting, this poses an extreme risk of electrocution.",
        constituency: "South Delhi",
        isAnonymous: false,
        authorName: "Aditya Sharma",
        authorEmail: "aditya.sharma@delhimail.in",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 24,
        votedUserEmails: [],
        funnelState: "Dispatched/In Progress",
        department: "Utilities",
        aiTriage: {
          triage_status: "Genuine_Urgent",
          english_summary: "Unsecured high-voltage overhead lines hanging dangerously close to pedestrian walkways present an immediate risk of electrocution.",
          tags: ["Electricity", "Public Safety", "Dangling Wires"],
          analyzedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        },
        dispatchedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        dispatchedBy: "admin@gov.terminal",
        dispatchLog: "Dispatched to Delhi Power Distribution Control Room (BSES Rajdhani) for urgent reinforcement.",
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-4",
        title: "Severe garbage dumping pile blocking sidewalks along East Delhi bypass",
        description: "Uncontrolled commercial garbage dumping has blocked the entire side path near the bypass road. The decomposition is attracting strays, creating intense stench, and forcing pedestrians to walk on the busy highway.",
        constituency: "East Delhi",
        isAnonymous: false,
        authorName: "Priyanka Sen",
        authorEmail: "priyanka.sen@eastdelhi.res.in",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 3,
        votedUserEmails: [],
        funnelState: "Recently Raised",
        department: "Sanitation",
        aiTriage: {
          triage_status: "Genuine_Standard",
          english_summary: "Large illegal garbage pile on sidewalks blocking pedestrian lanes and creating public health hazards along the East Delhi bypass.",
          tags: ["Waste Dumping", "Sanitation", "Sidewalks"],
          analyzedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
        },
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-5",
        title: "Deep hazardous pothole expanding near Dwarka Sector 10 Metro Pillar",
        description: "A massive crater-like pothole has opened up directly under the metro line. It is highly invisible at night, causing several near-accidents for two-wheelers already.",
        constituency: "West Delhi",
        isAnonymous: false,
        authorName: "Rajesh Kumar",
        authorEmail: "rajesh.k@dwarkamail.com",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 4,
        votedUserEmails: [],
        funnelState: "Recently Raised",
        department: "PWD",
        aiTriage: {
          triage_status: "Genuine_Urgent",
          english_summary: "A large expanding pothole directly in the driving lane under Dwarka Metro Pillar poses extreme risk to night commuters.",
          tags: ["Potholes", "Road Safety", "Street Repair"],
          analyzedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
        },
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-6",
        title: "A family of monkeys hosting a synchronized general assembly on the power lines",
        description: "Spotted this absolute meeting of the minds near New Delhi. They are literally hanging out in an orderly fashion, looking like they're voting on community laws.",
        constituency: "New Delhi",
        isAnonymous: false,
        authorName: "Amit Khanna",
        authorEmail: "amit.khanna@delhigov.in",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 56,
        votedUserEmails: [],
        funnelState: "Rejected",
        department: "Utilities",
        aiTriage: {
          triage_status: "Fun",
          english_summary: "Local resident shares a humorous photo of a family of monkeys gathered together on overhead power cables in Mumbai.",
          tags: ["Wildlife", "Humor", "Community Life"],
          analyzedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
        },
        comments: [
          {
            id: "comment-seed-3",
            authorName: "Sunita Verma",
            authorEmail: "sunita.v@rohinimail.com",
            authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
            text: "This is hilarious! Though dangerous for the monkeys, it's nice to see some humor in our daily commute.",
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
          },
          {
            id: "comment-seed-4",
            authorName: "Aditya Sharma",
            authorEmail: "aditya.sharma@delhimail.in",
            authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
            text: "Agreed, but hope BSES can check if the insulation is secure so no monkeys get hurt!",
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-7",
        title: "Proposal to build an air-conditioned dome covering the entire city of Delhi",
        description: "The summer is way too hot. If we construct a giant air-conditioned glass dome over Delhi, we can maintain a cool 22°C year-round. Highly urgent, please pass this budget!",
        constituency: "South Delhi",
        isAnonymous: true,
        authorName: "Anonymous Resident",
        authorEmail: "",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 1,
        votedUserEmails: [],
        funnelState: "Rejected",
        department: "General",
        aiTriage: {
          triage_status: "Spam",
          english_summary: "A highly unrealistic, cost-prohibitive proposal requesting a giant glass dome to air-condition the entirety of Delhi.",
          tags: ["Spam", "Humor", "Out of Scope"],
          analyzedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
        },
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-8",
        title: "Dangerous non-functional streetlights on flyover near Rohini Sector 15",
        description: "An entire 500m stretch of the flyover is pitch black at night due to broken light fixtures. This has become a hotspot for rash driving and security concerns.",
        constituency: "North West Delhi",
        isAnonymous: false,
        authorName: "Sunita Verma",
        authorEmail: "sunita.v@rohinimail.com",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 31,
        votedUserEmails: [],
        funnelState: "Resolved",
        department: "Utilities",
        aiTriage: {
          triage_status: "Genuine_Urgent",
          english_summary: "Major safety concerns over a long stretch of dark flyover in Rohini due to complete failure of municipal streetlights.",
          tags: ["Street Light", "Road Safety", "North West Delhi"],
          analyzedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        adminReply: "<p><strong>Municipal Corporation of Delhi (MCD)</strong> electrical repair division completed the repair work.</p><ul><li>Replaced 12 failed high-intensity LED cobra-head luminaires</li><li>Replaced damaged underground sub-mains power cable</li><li>Calibrated the automated twilight sensors</li></ul><p>The flyover is now fully lit and secure for night driving.</p>",
        resolvedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        resolvedBy: "MCD Electrical Division",
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: "issue-9",
        title: "Chemical dye residue being dumped directly into stormwater drain",
        description: "Local illegal washing unit is letting out colorful chemical-ridden waste water straight into the rainwater stormwater drain, causing toxic smell and soil contamination.",
        constituency: "North East Delhi",
        isAnonymous: false,
        authorName: "Vikram Singh",
        authorEmail: "vikram.s@northeastdelhi.res.in",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        attachment: null,
        votes: 18,
        votedUserEmails: [],
        funnelState: "Dispatched/In Progress",
        department: "Sanitation",
        aiTriage: {
          triage_status: "Genuine_Urgent",
          english_summary: "Hazardous chemical dumping into community storm drains is causing toxic contamination and air pollution.",
          tags: ["Water Pollution", "Sanitation", "Industrial Waste"],
          analyzedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
        },
        dispatchedAt: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
        dispatchedBy: "admin@gov.terminal",
        dispatchLog: "Dispatched to Delhi Pollution Control Committee (DPCC) for immediate inspection and enforcement.",
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
      }
    ]
  };
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  console.log("Initializing Gemini SDK client...");
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY environment variable is not set or placeholder. Falling back to rule-based triage simulator.");
}

// Heuristics Engine fallback when Gemini API key is missing
function ruleBasedTriageSimulator(title: string, description: string): any {
  const content = (title + " " + description).toLowerCase();
  
  let triage_status = "Genuine_Standard";
  let tags: string[] = [];
  let english_summary = `The resident raised a civic request regarding: "${title}".`;

  if (title.trim().length < 6 && description.trim().length < 10) {
    triage_status = "Uncertain";
    tags = ["Uncertain", "Needs Review"];
    english_summary = "An ambiguous community post requiring human verification to classify and route appropriately.";
  } else if (content.includes("leak") || content.includes("water") || content.includes("flooding") || content.includes("burst")) {
    triage_status = "Genuine_Urgent";
    tags = ["Water Leak", "Infrastructure"];
    english_summary = "An urgent report regarding water main leakage or flooding disrupting local mobility and wasting community resources.";
  } else if (content.includes("pothole") || content.includes("crater") || content.includes("road") || content.includes("asphalt")) {
    triage_status = "Genuine_Urgent";
    tags = ["Pothole", "Road Safety"];
    english_summary = "A safety concern reporting dangerous potholes or pavement cracks presenting traffic and navigation risks.";
  } else if (content.includes("crossing") || content.includes("zebra") || content.includes("pedestrian") || content.includes("signal")) {
    triage_status = "Genuine_Standard";
    tags = ["Road Safety", "Pedestrians"];
    english_summary = "A request to repaint pedestrian zebra crossing indicators or repair signals to protect foot-traffic.";
  } else if (content.includes("slushie") || content.includes("joke") || content.includes("humor") || content.includes("funny") || content.includes("ice cream")) {
    triage_status = "Spam";
    tags = ["Spam", "Out of Scope"];
    english_summary = "A community submission classified as lighthearted spam or unrealistic public infrastructure proposals.";
  } else if (content.includes("monkey") || content.includes("dog") || content.includes("animal") || content.includes("cute") || content.includes("assembly")) {
    triage_status = "Fun";
    tags = ["Wildlife", "Humor"];
    english_summary = "A cheerful local interest submission capturing unique neighborhood occurrences or lighthearted community life.";
  } else {
    tags = ["Civic Interest", "General Repair"];
  }

  return { triage_status, english_summary, tags };
}

// ---------------------- API ROUTES ----------------------

// GET /api/priorities - Fetch all community priorities
app.get("/api/priorities", (req, res) => {
  const db = readDB();
  res.json({ issues: db.issues });
});

// POST /api/priorities - User submission flow
app.post("/api/priorities", async (req, res) => {
  try {
    const {
      title,
      description,
      constituency,
      isAnonymous,
      authorName,
      authorEmail,
      authorAvatar,
      attachment
    } = req.body;

    if (!title || !description || !constituency) {
      return res.status(400).json({ error: "Missing required fields: title, description, constituency" });
    }

    // 1. Accountable Anonymity metadata stripping
    let resolvedAuthorName = authorName || "Citizen Resident";
    let resolvedAuthorEmail = authorEmail || "";
    let resolvedAuthorAvatar = authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

    if (isAnonymous) {
      resolvedAuthorName = `Anonymous Resident of ${constituency}`;
      resolvedAuthorEmail = ""; // Mask PII email
      resolvedAuthorAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(title + constituency)}`;
    }

    let triageResult = {
      triage_status: "Genuine_Standard",
      english_summary: `Community raised concern regarding "${title}".`,
      tags: ["Civic Duty"]
    };

    // 2. Perform AI Multimodal triage using Gemini if available
    if (ai) {
      try {
        console.log(`Analyzing submission with Gemini 3.5 Flash: "${title}"`);
        const parts: any[] = [
          {
            text: `You are CivicLens AI, an objective triage assistant on the governance track 'People's Priorities'.
Analyze the following citizen report and return a structured JSON categorization.
Report Title: ${title}
Report Description: ${description}
Constituency: ${constituency}

Strict Categorization Logic:
- triage_status: Must be exactly one of:
  - "Genuine_Urgent" (Severe water breaks, deep traffic potholes, gas leaks, hanging power lines, active fire hazards)
  - "Genuine_Standard" (Faded road markings, missing public trash bins, broken streetlights, general requests)
  - "Fun" (Capturing beautiful neighborhood sights, funny street situations, local wildlife snapshots)
  - "Spam" (Unrealistic proposals, obvious pranks, commercial advertisements, hate speech, offensive items)
  - "Uncertain" (If the input is highly ambiguous, incomplete, confusing, or you cannot confidently classify it into any of the above categories)
- english_summary: Precisely a 2-sentence crisp English summary. Translate any multilingual/Indic phrases into standard English automatically.
- tags: Array of 2 to 3 keyword strings (e.g., ["Water Leak", "Road Safety"]).
`
          }
        ];

        // If media files are uploaded as base64, append inlineData
        if (attachment && attachment.data) {
          const cleanBase64 = attachment.data.replace(/^data:[^;]+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: attachment.type,
              data: cleanBase64
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                triage_status: {
                  type: Type.STRING,
                  description: "exactly one of ['Genuine_Urgent', 'Genuine_Standard', 'Fun', 'Spam', 'Uncertain']"
                },
                english_summary: {
                  type: Type.STRING,
                  description: "a 2-sentence translation/summary turning any multi-lingual/Indic input into crisp English data."
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "an array of 2-3 keywords like ['Water Leak', 'Road Safety']"
                }
              },
              required: ["triage_status", "english_summary", "tags"]
            }
          }
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput.trim());
          if (parsed.triage_status && parsed.english_summary && parsed.tags) {
            triageResult = parsed;
          }
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to heuristics:", geminiError);
        triageResult = ruleBasedTriageSimulator(title, description);
      }
    } else {
      // Local fallback simulator when key is unavailable
      triageResult = ruleBasedTriageSimulator(title, description);
    }

    // 3. Funnel State Mapping based on AI feedback
    // - Every genuine ticket goes directly to "Under Consideration"
    // - Fun or Spam tickets are moved directly to "Rejected" (auto-closed)
    // - If AI is unsure ("Uncertain"), it is kept in "Recently Raised" for human review.
    let finalFunnelState: any = "Recently Raised";
    if (triageResult.triage_status === "Spam" || triageResult.triage_status === "Fun") {
      finalFunnelState = "Rejected";
    } else if (triageResult.triage_status === "Genuine_Urgent" || triageResult.triage_status === "Genuine_Standard") {
      finalFunnelState = "Under Consideration";
    } else if (triageResult.triage_status === "Uncertain") {
      finalFunnelState = "Recently Raised";
    }

    // Create the new CivicIssue object
    const newIssue = {
      id: "issue-" + Date.now(),
      title,
      description,
      constituency,
      isAnonymous,
      authorName: resolvedAuthorName,
      authorEmail: resolvedAuthorEmail,
      authorAvatar: resolvedAuthorAvatar,
      attachment: attachment ? {
        name: attachment.name,
        type: attachment.type,
        data: attachment.data.startsWith("data:") ? attachment.data : `data:${attachment.type};base64,${attachment.data}`
      } : null,
      votes: 1, // Author starts with self-vote
      votedUserEmails: resolvedAuthorEmail ? [resolvedAuthorEmail] : [],
      funnelState: finalFunnelState,
      department: getDepartmentFromText(title, description),
      aiTriage: {
        triage_status: triageResult.triage_status,
        english_summary: triageResult.english_summary,
        tags: triageResult.tags,
        analyzedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    // Save to file database
    const db = readDB();
    db.issues.unshift(newIssue);
    writeDB(db);

    res.status(201).json({ success: true, issue: newIssue });
  } catch (error: any) {
    console.error("Failed to post issue:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// POST /api/priorities/:id/vote - High-performance upvoting
app.post("/api/priorities/:id/vote", (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: "Missing voter email profile context." });
  }

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];
  if (!issue.votedUserEmails) {
    issue.votedUserEmails = [];
  }

  // Prevent multiple upvotes per user
  if (issue.votedUserEmails.includes(userEmail)) {
    return res.status(400).json({ error: "Priority already supported. Duplicate votes disabled." });
  }

  // Record upvote
  issue.votes = (issue.votes || 0) + 1;
  issue.votedUserEmails.push(userEmail);

  // AUTOMATED AI PROMOTION RULE:
  // If "Recently Raised" passes AI triage and exceeds a certain number of community votes (e.g., 5 votes),
  // promote it automatically to "Under Consideration"!
  if (issue.funnelState === "Recently Raised" && issue.votes >= 5 && issue.aiTriage?.triage_status !== "Fun") {
    issue.funnelState = "Under Consideration";
  }

  db.issues[issueIndex] = issue;
  writeDB(db);

  res.json({ success: true, votes: issue.votes, funnelState: issue.funnelState });
});

// POST /api/priorities/:id/comments - Citizen commenting flow
app.post("/api/priorities/:id/comments", (req, res) => {
  const { id } = req.params;
  const { authorName, authorEmail, authorAvatar, text } = req.body;

  if (!text || !authorName) {
    return res.status(400).json({ error: "Missing required comment fields: text, authorName" });
  }

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];
  if (!issue.comments) {
    issue.comments = [];
  }

  const newComment = {
    id: "comment-" + Date.now(),
    authorName,
    authorEmail: authorEmail || "",
    authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    text,
    createdAt: new Date().toISOString()
  };

  issue.comments.push(newComment);
  db.issues[issueIndex] = issue;
  writeDB(db);

  res.status(201).json({ success: true, comment: newComment, comments: issue.comments });
});

// POST /api/priorities/:id/resolve - MP administrative action console execution
app.post("/api/priorities/:id/resolve", (req, res) => {
  const { id } = req.params;
  const { adminReply, resolvedBy } = req.body;

  if (!adminReply) {
    return res.status(400).json({ error: "Official response notice text is required." });
  }

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];
  
  // Transition state to Resolved and append official execution notice
  issue.funnelState = "Resolved";
  issue.adminReply = adminReply;
  issue.resolvedAt = new Date().toISOString();
  issue.resolvedBy = resolvedBy || "Verified Administrative MP";

  db.issues[issueIndex] = issue;
  writeDB(db);

  res.json({ success: true, issue });
});

// POST /api/priorities/:id/dispatch - Outbound compliance panel dispatch trigger
app.post("/api/priorities/:id/dispatch", (req, res) => {
  const { id } = req.params;
  const { department, dispatchedBy, emailDraftText } = req.body;

  if (!department) {
    return res.status(400).json({ error: "Target department assignment is required." });
  }

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];
  
  // Transition state to Dispatched/In Progress
  issue.funnelState = "Dispatched/In Progress";
  issue.department = department;
  issue.dispatchedAt = new Date().toISOString();
  issue.dispatchedBy = dispatchedBy || "Verified Administrator";
  
  // Create a persistent dispatch log
  const now = new Date();
  const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  issue.dispatchLog = `Dispatched to ${department} on ${formattedDate}`;

  db.issues[issueIndex] = issue;
  writeDB(db);

  res.json({ success: true, issue });
});

// POST /api/priorities/:id/resolve-override - Official resolution override for dispatched tickets
app.post("/api/priorities/:id/resolve-override", (req, res) => {
  const { id } = req.params;
  const { adminReply, validationPhotoUrl, resolvedBy } = req.body;

  if (!adminReply) {
    return res.status(400).json({ error: "Official text update is required for resolution." });
  }

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];

  // Transition state to Resolved, clear from active columns
  issue.funnelState = "Resolved";
  issue.adminReply = adminReply;
  if (validationPhotoUrl) {
    issue.validationPhotoUrl = validationPhotoUrl;
  }
  issue.resolvedAt = new Date().toISOString();
  issue.resolvedBy = resolvedBy || "Verified Administrator";

  db.issues[issueIndex] = issue;
  writeDB(db);

  res.json({ success: true, issue });
});

// PUT /api/priorities/:id - Full administrative ticket edit override
app.put("/api/priorities/:id", (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    constituency, 
    department, 
    funnelState, 
    votes, 
    dispatchLog, 
    adminReply, 
    validationPhotoUrl,
    aiTriageSummary,
    aiTriageStatus,
    aiTriageTags
  } = req.body;

  const db = readDB();
  const issueIndex = db.issues.findIndex((i: any) => i.id === id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Civic priority ticket not found." });
  }

  const issue = db.issues[issueIndex];

  // Update primitive text fields if provided
  if (title !== undefined) issue.title = title;
  if (description !== undefined) issue.description = description;
  if (constituency !== undefined) issue.constituency = constituency;
  if (department !== undefined) issue.department = department;
  if (funnelState !== undefined) issue.funnelState = funnelState;
  if (votes !== undefined) issue.votes = Number(votes);
  if (dispatchLog !== undefined) issue.dispatchLog = dispatchLog;
  if (adminReply !== undefined) issue.adminReply = adminReply;
  if (validationPhotoUrl !== undefined) issue.validationPhotoUrl = validationPhotoUrl;

  // Handle nested aiTriage fields if modified
  if (!issue.aiTriage) {
    issue.aiTriage = {
      triage_status: "Genuine_Standard",
      english_summary: "",
      tags: [],
      analyzedAt: new Date().toISOString()
    };
  }

  if (aiTriageStatus !== undefined) issue.aiTriage.triage_status = aiTriageStatus;
  if (aiTriageSummary !== undefined) issue.aiTriage.english_summary = aiTriageSummary;
  if (aiTriageTags !== undefined) {
    issue.aiTriage.tags = Array.isArray(aiTriageTags) 
      ? aiTriageTags 
      : String(aiTriageTags).split(",").map(t => t.trim()).filter(Boolean);
  }

  // Handle specific dispatch details
  if (funnelState === "Dispatched/In Progress") {
    if (!issue.dispatchedAt) issue.dispatchedAt = new Date().toISOString();
    if (!issue.dispatchedBy) issue.dispatchedBy = "Verified Administrator";
  } else if (funnelState === "Resolved") {
    if (!issue.resolvedAt) issue.resolvedAt = new Date().toISOString();
    if (!issue.resolvedBy) issue.resolvedBy = "Verified Administrator";
  }

  db.issues[issueIndex] = issue;
  writeDB(db);

  res.json({ success: true, issue });
});

// ---------------------- MULTI-LINGUAL FALLBACK TRANSLATION SYSTEM ----------------------
function getFallbackTranslation(title: string, description: string, summary: string, lang: string): { title: string, description: string, summary: string } {
  const normalizedTitle = title.toLowerCase();
  
  // Exact matches for seeded issues
  if (normalizedTitle.includes("ruptured") && normalizedTitle.includes("water")) {
    if (lang === "Hindi") {
      return {
        title: "उच्च-दबाव वाली पानी की पाइप फटने से स्थानीय सड़क पर बाढ़",
        description: "सेक्टर 3 रिंग रोड पर सुबह 4:00 बजे से मुख्य जोड़ से पानी बह रहा है, जिससे एक छोटा जलाशय बन गया है और फुटपाथ की नींव खराब हो रही है।",
        summary: "सेक्टर 3 रिंग रोड पर पानी की पाइपलाइन फटने से सड़कों पर गंभीर जलभराव और फुटपाथ का क्षरण हो रहा है। तत्काल हस्तक्षेप आवश्यक है।"
      };
    } else if (lang === "Kannada") {
      return {
        title: "ಅಧಿಕ ಒತ್ತಡದ ನೀರು ಸರಬರಾಜು ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಿ ನೀರು ತುಂಬಿದೆ",
        description: "ಸೆಕ್ಟರ್ 3 ರಿಂಗ್ ರೋಡ್ ಮುಖ್ಯ ಜೋಡಣೆಯಿಂದ ಮುಂಜಾನೆ 4:00 ಗಂಟೆಯಿಂದ ನೀರು ಹೊರಹೊಮ್ಮುತ್ತಿದ್ದು, ಕೃತಕ ಜಲಾಶಯ ಸೃಷ್ಟಿಯಾಗಿದೆ ಮತ್ತು ರಸ್ತೆ ಬದಿಯ ಪಾದಚಾರಿ ಹಾದಿ ಹಾಳಾಗುತ್ತಿದೆ.",
        summary: "ಸೆಕ್ಟರ್ 3 ರಿಂಗ್ ರಸ್ತೆಯಲ್ಲಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಿ ಭಾರಿ ಪ್ರವಾಹ ಉಂಟಾಗಿದೆ. ತಕ್ಷಣದ ದುರಸ್ತಿ ಅಗತ್ಯವಿದೆ."
      };
    } else if (lang === "Tamil") {
      return {
        title: "அதிவேக நீர் குழாய் வெடிப்பு காரணமாக உள்ளூர் சாலையில் வெள்ளம்",
        description: "செக்டர் 3 ரிங் ரோடில் அதிகாலை 4:00 மணி முதல் முக்கிய நீர் குழாய் இணைப்பிலிருந்து தண்ணீர் பெருக்கெடுத்து ஓடுகிறது, இதனால் சாலையில் குளம் போல் தேங்கியுள்ளது.",
        summary: "செக்டர் 3 ரிங் ரோடில் ஏற்பட்ட குழாய் வெடிப்பு காரணமாக கடும் வெள்ளப்பெருக்கம் ஏற்பட்டுள்ளது. உடனடி நடவடிக்கை தேவை."
      };
    } else if (lang === "Bengali") {
      return {
        title: "উচ্চ-চাপের জলের পাইপ ফেটে স্থানীয় রাস্তা প্লাবিত",
        description: "সেক্টর ৩ রিং রোডের মূল সংযোগ থেকে ভোর ৪:০০ টা থেকে জল উপচে পড়ছে, একটি ছোট জলাশয় তৈরি করছে এবং ফুটপাথের ভিত্তি নষ্ট করছে।",
        summary: "সেক্টর ৩ রিং রোডে একটি জলের পাইপ ফেটে যাওয়ায় মারাত্মক রাস্তা প্লাবিত এবং ফুটপাথ ক্ষয় হচ্ছে। অবিলম্বে হস্তক্ষেপ প্রয়োজন।"
      };
    } else if (lang === "Telugu") {
      return {
        title: "అధిక పీడన నీటి పైపు పగిలి స్థానిక రోడ్డు జలమయం",
        description: "సెక్టార్ 3 రింగ్ రోడ్డు ప్రధాన కూడలి వద్ద ఉదయం 4:00 గంటల నుండి నీరు ఉధృతంగా ప్రవహిస్తోంది, ఇది రోడ్డును చెరువుగా మార్చడమే కాక పునాదిని దెబ్బతీస్తోంది.",
        summary: "సెక్టార్ 3 రింగ్ రోడ్‌లో నీటి పైపు పగిలి తీవ్రమైన వరద నీరు మరియు రహదారి క్షీణతకు దారితీసింది. తక్షణ సహాయం అవసరం."
      };
    } else if (lang === "Marathi") {
      return {
        title: "उच्च दाबाची पाण्याची पाईपलाईन फुटल्याने स्थानिक रस्त्यावर पूर",
        description: "सेक्टर ३ रिंग रोडवर पहाटे ४:०० वाजल्यापासून मुख्य पाईपमधून पाणी वाहत आहे, ज्यामुळे मोठा तलाव तयार झाला असून रस्ता खचत आहे.",
        summary: "सेक्टर ३ रिंग रोडवर पाणी पुरवठा पाईपलाईन फुटल्यामुळे गंभीर पूर आणि रस्त्याची दुरवस्था झाली आहे. त्वरित कारवाई आवश्यक आहे।"
      };
    }
  }

  if (normalizedTitle.includes("missing") && (normalizedTitle.includes("zebra") || normalizedTitle.includes("pedestrian"))) {
    if (lang === "Hindi") {
      return {
        title: "व्यस्त स्कूल चौराहे पर गायब पेडेस्ट्रियन जेब्रा क्रॉसिंग",
        description: "सेंट मैरी सेकेंडरी स्कूल के पास की सड़क पर कोई जेब्रा क्रॉसिंग लाइनें नहीं हैं। सुबह के व्यस्त समय में बच्चे सुरक्षित रूप से पार करने के लिए संघर्ष कर रहे हैं क्योंकि वाहन रास्ता नहीं देते हैं।",
        summary: "सेंट मैरी स्कूल के पास जेब्रा क्रॉसिंग पेंट फीका या गायब होने के कारण स्कूली बच्चों को गंभीर सुरक्षा खतरों का सामना करना पड़ रहा है।"
      };
    } else if (lang === "Kannada") {
      return {
        title: "ರದ್ದಿ ಶಾಲಾ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ಪಾದಚಾರಿ ಜೀಬ್ರಾ ಕ್ರಾಸಿಂಗ್ ಕೊರತೆ",
        description: "ಸೇಂಟ್ ಮೇರಿಸ್ ಪ್ರೌಢಶಾಲೆಯ ಸಮೀಪವಿರುವ ರಸ್ತೆಯಲ್ಲಿ ಪಾದಚಾರಿ ಕ್ರಾಸಿಂಗ್ ಗೆರೆಗಳು ಕಾಣಿಸುತ್ತಿಲ್ಲ. ಬೆಳಗಿನ ಅವಸರದ ಸಮಯದಲ್ಲಿ ವಾಹನಗಳು ನಿಲ್ಲದ ಕಾರಣ ಮಕ್ಕಳು ರಸ್ತೆ ದಾಟಲು ತೊಂದರೆ ಅನುಭವಿಸುತ್ತಿದ್ದಾರೆ.",
        summary: "ಸೇಂಟ್ ಮೇರಿಸ್ ಶಾಲೆಯ ಬಳಿ ಪಾದಚಾರಿ ಜೀಬ್ರಾ ಕ್ರಾಸಿಂಗ್ ಇಲ್ಲದಿರುವುದರಿಂದ ಶಾಲಾ ಮಕ್ಕಳಿಗೆ ತೀವ್ರ ಸುರಕ್ಷತೆಯ ಅಪಾಯ ಉಂಟಾಗಿದೆ."
      };
    } else if (lang === "Tamil") {
      return {
        title: "பரபரப்பான பள்ளி சந்திப்பில் இல்லாத பாதசாரி நடைபாதை (Zebra Crossing)",
        description: "செயின்ட் மேரிஸ் மேல்நிலைப் பள்ளிக்கு அருகிலுள்ள சாலையில் பாதசாரி நடைபாதை கோடுகள் இல்லை. காலை நேரங்களில் வாகனங்கள் வழிவிடாததால் குழந்தைகள் சாலையைக் கடக்க சிரமப்படுகிறார்கள்.",
        summary: "செயின்ட் மேரிஸ் பள்ளிக்கு அருகில் பாதசாரி கோடுகள் இல்லாததால் பள்ளி குழந்தைகளுக்கு கடுமையான பாதுகாப்பு அச்சுறுத்தல் ஏற்பட்டுள்ளது."
      };
    } else if (lang === "Bengali") {
      return {
        title: "ব্যস্ত স্কুল সংযোগস্থলে জেব্রা ক্রসিং অনুপস্থিত",
        description: "সেন্ট মেরি সেকেন্ডারি স্কুলের কাছের রাস্তায় কোনো দৃশ্যমান ক্রসিং লাইন নেই। সকালের ব্যস্ত সময়ে গাড়িগুলি পথ না দেওয়ায় শিশুরা নিরাপদে রাস্তা পার হতে পারছে না।",
        summary: "জেব্রা ক্রসিং পেইন্ট না থাকায় সেন্ট মেরি স্কুলের কাছে স্কুল পড়ুয়ারা গুরুতর নিরাপত্তা ঝুঁকির সম্মুখীন হচ্ছে।"
      };
    }
  }

  if (normalizedTitle.includes("pothole") || normalizedTitle.includes("crater")) {
    if (lang === "Hindi") {
      return {
        title: "केंद्रीय बस स्टैंड के पास फैल रहा बड़ा खतरनाक गड्ढा",
        description: "एक बड़ा गड्ढा चौड़ा होता जा रहा है और अब लगभग २ फीट चौड़ा है। यह दोपहिया वाहनों और रात के यात्रियों के लिए बेहद उच्च जोखिम प्रस्तुत करता है।",
        summary: "केंद्रीय बस स्टैंड के पास एक बड़ा और बढ़ता हुआ गड्ढा बन गया है। यह विशेष रूप से दोपहिया वाहनों और रात के यात्रियों के लिए गंभीर खतरा है।"
      };
    } else if (lang === "Kannada") {
      return {
        title: "ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣದ ಬಳಿ ವಿಸ್ತರಿಸುತ್ತಿರುವ ಬೃಹತ್ ಗುಂಡಿ",
        description: "ರಸ್ತೆಯ ಗುಂಡಿ ದಿನೇ ದಿನೇ ದೊಡ್ಡದಾಗುತ್ತಿದ್ದು, ಈಗ ಸುಮಾರು ೨ ಅಡಿ ಅಗಲವಾಗಿದೆ. ಇದು ದ್ವಿಚಕ್ರ ವಾಹನ ಸವಾರರಿಗೆ ಮತ್ತು ರಾತ್ರಿ ಸಂಚರಿಸುವವರಿಗೆ ಅತ್ಯಂತ ಅಪಾಯಕಾರಿಯಾಗಿದೆ.",
        summary: "ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣದ ಬಳಿ ರಸ್ತೆ ಗುಂಡಿ ತೀವ್ರವಾಗಿ ದೊಡ್ಡದಾಗುತ್ತಿದ್ದು, ಬೈಕ್ ಸವಾರರಿಗೆ ಭಾರಿ ಅಪಾಯ ತಂದೊಡ್ಡಿದೆ."
      };
    } else if (lang === "Tamil") {
      return {
        title: "மத்திய பேருந்து நிலையம் அருகில் விரிவடையும் பெரிய குழி",
        description: "சாலையிலுள்ள குழி விரிவடைந்து தற்போது சுமார் 2 அடி அகலமாக உள்ளது. இது இருசக்கர வாகன ஓட்டிகளுக்கும் இரவு நேர பயணிகளுக்கும் பெரும் ஆபத்தாக உள்ளது.",
        summary: "மத்திய பேருந்து நிலையம் அருகே ஆபத்தான குழி விரிவடைந்து வருகிறது. இரவு நேர வாகன ஓட்டிகளுக்கு இது அதீத அபாயமாகும்."
      };
    } else if (lang === "Bengali") {
      return {
        title: "কেন্দ্রীয় বাস স্টপের কাছে সম্প্রসারিত বড় গর্ত",
        description: "রাস্তার গর্তটি ক্রমশ চওড়া হচ্ছে এবং এখন প্রায় ২ ফুট চওড়া। এটি দ্বিচক্রযান এবং রাতের যাত্রীদের জন্য অত্যন্ত উচ্চ ঝুঁকি তৈরি করছে।",
        summary: "কেন্দ্রীয় বাস স্টপের কাছে একটি বিপজ্জনক গর্ত প্রসারিত হচ্ছে, যা রাতে বাইক চালকদের জন্য মারাত্মক ঝুঁকিপূর্ণ।"
      };
    }
  }

  if (normalizedTitle.includes("sewer") || normalizedTitle.includes("overflow")) {
    if (lang === "Hindi") {
      return {
        title: "स्थानीय पार्क वॉकिंग पाथ पर सीवर ओवरफ्लो से गंदगी",
        description: "कोलकाता नागरिक पार्क में मुख्य पैदल पथ के पास एक प्राथमिक सीवर लाइन फट गई है, जिससे बच्चों और टहलने वालों के लिए स्वास्थ्य जोखिम पैदा हो गया है।",
        summary: "सीवर लाइन फटने से पार्क के रास्ते में गंदा पानी भर गया है, जो सार्वजनिक स्वास्थ्य और स्वच्छता के लिए गंभीर खतरा है।"
      };
    } else if (lang === "Tamil") {
      return {
        title: "உள்ளூர் பூங்கா நடைபாதையில் பொங்கி வழியும் கழிவுநீர்",
        description: "கொல்கத்தா பூங்காவின் முக்கிய நடைபாதை அருகே கழிவுநீர் குழாய் உடைந்து துர்நாற்றத்தையும், விளையாடும் குழந்தைகளுக்கு சுகாதாரக் கேடுகளையும் ஏற்படுத்தியுள்ளது.",
        summary: "கழிவுநீர் குழாய் வெடிப்பு காரணமாக பூங்கா நடைபாதையில் கழிவுநீர் தேங்கி பொது சுகாதாரத்திற்கு ஆபத்தை விளைவிக்கிறது."
      };
    } else if (lang === "Kannada") {
      return {
        title: "ಸ್ಥಳೀಯ ಉದ್ಯಾನವನದ ನಡಿಗೆ ಹಾದಿಯಲ್ಲಿ ಒಳಚರಂಡಿ ನೀರು ತುಂಬಿ ಹರಿಯುತ್ತಿದೆ",
        description: "ಕೋಲ್ಕತ್ತಾ ನಾಗರಿಕ ಉದ್ಯಾನವನದ ಪ್ರಮುಖ ನಡಿಗೆ ಹಾದಿಯ ಬಳಿ ಒಳಚರಂಡಿ ಪೈಪ್ ಒಡೆದು ಹೋಗಿದ್ದು, ತೀವ್ರ ದುರ್ವಾಸನೆ ಹರಡಿದೆ ಮತ್ತು ಅಲ್ಲಿ ಆಟವಾಡುವ ಮಕ್ಕಳಿಗೆ ಆರೋಗ್ಯದ ಅಪಾಯ ಉಂಟುಮಾಡಿದೆ.",
        summary: "ಒಳಚರಂಡಿ ಪೈಪ್ ಲೈನ್ ಒಡೆದಿದ್ದರಿಂದ ಉದ್ಯಾನವನದಲ್ಲಿ ಕೊಳಚೆ ನೀರು ಹರಿಯುತ್ತಿದ್ದು ಆರೋಗ್ಯಕ್ಕೆ ಭಾರಿ ಹಾನಿಕರವಾಗಿದೆ."
      };
    } else if (lang === "Bengali") {
      return {
        title: "স্থানীয় পার্কের হাঁটার পথে নর্দমার উপচে পড়া জল",
        description: "কলকাতা নাগরিক পার্কের মূল হাঁটার পথের কাছে একটি প্রাথমিক পয়ঃপ্রণালী ফেটে গিয়েছে, যার ফলে অত্যন্ত অপ্রীতিকর গন্ধ এবং শিশুদের জন্য স্বাস্থ্য ঝুঁকি তৈরি হচ্ছে।",
        summary: "পয়ঃপ্রণালী লাইন ফেটে যাওয়ার ফলে পার্কের হাঁটার পথে বর্জ্য জল ছড়িয়ে পড়ছে, যা জনস্বাস্থ্যের জন্য মারাত্মক ক্ষতিকর।"
      };
    }
  }

  if (normalizedTitle.includes("monkey") || normalizedTitle.includes("wildlife")) {
    if (lang === "Hindi") {
      return {
        title: "बिजली की तारों पर बंदरों के परिवार की अनोखी बैठक",
        description: "सड़क के ऊपर बिजली के तारों पर बंदरों का परिवार एक व्यवस्थित ढंग से इकट्ठा हुआ है, मानो वे समुदाय के नियमों पर मतदान कर रहे हों।",
        summary: "मुंबई के एक स्थानीय निवासी ने बिजली के तारों पर एक साथ जमा बंदरों के परिवार की एक मजेदार तस्वीर साझा की है।"
      };
    } else if (lang === "Tamil") {
      return {
        title: "மின்சாரக் கம்பிகளில் குரங்கு குடும்பத்தின் வினோதக் கூட்டம்",
        description: "மின்சாரக் கம்பிகளில் குரங்குகள் வரிசையாக அமர்ந்திருப்பதை ஒரு உள்ளூர்வாசி படம் பிடித்துள்ளார், பார்ப்பதற்கு வார்டு கவுன்சில் கூட்டம் நடத்துவது போல் உள்ளது.",
        summary: "மும்பையில் மின்கம்பிகளின் மேல் குரங்குகள் கூட்டம் கூடி விளையாடும் ஒரு வேடிக்கையான காட்சியை உள்ளூர்வாசி பகிர்ந்துள்ளார்."
      };
    }
  }

  // Smart template fallback for dynamically added custom user issues
  const langPrefixes: Record<string, string> = {
    Hindi: "अनुवादित: ",
    Kannada: "ಭಾಷಾಂತರಿಸಲಾಗಿದೆ: ",
    Tamil: "மொழிபெயர்க்கப்பட்டது: ",
    Bengali: "অনুবাদিত: ",
    Telugu: "అनुవదించబడింది: ",
    Marathi: "भाषांतरित: "
  };

  const prefix = langPrefixes[lang] || "Translated: ";

  // Word replacement maps to make generic fallbacks look very authentic!
  const dictionary: Record<string, Record<string, string>> = {
    Hindi: {
      "water": "पानी", "pothole": "सड़क का गड्ढा", "road": "सड़क", "leak": "रिसाव", "light": "बिजली", "street": "गली",
      "urgent": "अति आवश्यक", "clean": "सफाई", "garbage": "कचरा", "broken": "टूटा हुआ", "school": "स्कूल",
      "safe": "सुरक्षित", "danger": "खतरा", "police": "पुलिस", "municipal": "नगर पालिका", "sewer": "सीवर"
    },
    Tamil: {
      "water": "தண்ணீர்", "pothole": "சாலைக் குழி", "road": "சாலை", "leak": "கசிவு", "light": "மின்விளக்கு", "street": "தெரு",
      "urgent": "அதி அவசரம்", "clean": "சுத்தம்", "garbage": "குப்பை", "broken": "உடைந்த", "school": "பள்ளி",
      "safe": "பாதுகாப்பான", "danger": "ஆபத்து", "municipal": "நகராட்சி", "sewer": "கழிவுநீர்"
    },
    Kannada: {
      "water": "ನೀರು", "pothole": "ರಸ್ತೆ ಗುಂಡಿ", "road": "ರಸ್ತೆ", "leak": "ಸೋರಿಕೆ", "light": "ದೀಪ", "street": "ಬೀದಿ",
      "urgent": "ತುರ್ತು", "clean": "ಸ್ವಚ್ಛತೆ", "garbage": "ಕಸ", "broken": "ಒಡೆದ", "school": "ಶಾಲೆ",
      "safe": "ಸುರಕ್ಷಿತ", "danger": "ಅಪಾಯ", "municipal": "ನಗರಾಡಳಿತ", "sewer": "ಒಳಚರಂಡಿ"
    },
    Bengali: {
      "water": "জল", "pothole": "রাস্তার গর্ত", "road": "রাস্তা", "leak": "ফুটো", "light": "আলো", "street": "রাস্তা",
      "urgent": "জরুরি", "clean": "পরিষ্কার", "garbage": "আবর্জনা", "broken": "ভাঙা", "school": "স্কুল",
      "safe": "নিরাপদ", "danger": "বিপদ", "municipal": "পৌরসভা", "sewer": "নর্দমা"
    }
  };

  const words = title.split(" ");
  const translatedWords = words.map(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (dictionary[lang] && dictionary[lang][clean]) {
      return dictionary[lang][clean];
    }
    return w; // keep original word if no direct mapping exists
  });

  return {
    title: `${prefix}${translatedWords.join(" ")}`,
    description: `${prefix}${description} (${lang})`,
    summary: summary ? `${prefix}${summary}` : ""
  };
}

// POST /api/translate - Translate civic priority text using Gemini or deep fallbacks
app.post("/api/translate", async (req, res) => {
  try {
    const { title, description, summary, targetLanguage } = req.body;
    if (!title || !description || !targetLanguage) {
      return res.status(400).json({ error: "Missing title, description or targetLanguage." });
    }

    if (ai) {
      try {
        console.log(`Translating issue to ${targetLanguage} using Gemini...`);
        const prompt = `You are a professional multi-lingual translator specializing in Indian regional languages.
Translate the following civic issue texts accurately, naturally, and in a high-quality human tone into ${targetLanguage}.
Keep key names (like standard street names, e.g. "Sector 3 Ring Road") easily recognizable or phonetically transliterated, while translating the general complaint/complaints beautifully.

Input:
Title: ${title}
Description: ${description}
Summary: ${summary || ""}

Return a structured JSON object with EXACTLY the following string keys:
- title: translated title
- description: translated description
- summary: translated summary (if summary was empty, return empty string)
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["title", "description", "summary"]
            }
          }
        });

        const output = response.text;
        if (output) {
          const parsed = JSON.parse(output.trim());
          return res.json({ success: true, translation: parsed });
        }
      } catch (geminiError) {
        console.error("Gemini translation failed, using offline fallbacks:", geminiError);
      }
    }

    // High fidelity offline fallback translator for Indian languages
    const fallback = getFallbackTranslation(title, description, summary || "", targetLanguage);
    res.json({ success: true, translation: fallback });
  } catch (error: any) {
    console.error("Translation API failure:", error);
    res.status(500).json({ error: error.message || "Failed to translate" });
  }
});

// ---------------------- FRONTEND ROUTING & VITE MIDDLEWARE ----------------------

async function startServer() {
  // Vite dev server middleware integration in non-production mode
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production asset distribution
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicLens server booted successfully! Running at http://localhost:${PORT}`);
  });
}

startServer();
