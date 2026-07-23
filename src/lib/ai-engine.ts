import type { ProspectInput, ProspectReport, TranscriptAnalysis } from "./types";

function splitList(value: string) {
  return value
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function pickWin(seed: number, stage: string) {
  const base =
    stage === "Negotiation" ? 68 :
    stage === "Proposal" ? 62 :
    stage === "Demo" ? 55 :
    stage === "Qualification" ? 48 :
    42;
  return Math.min(88, Math.max(28, base + (seed % 17) - 4));
}

function riskFromWin(win: number): "Low" | "Medium" | "High" {
  if (win >= 65) return "Low";
  if (win >= 48) return "Medium";
  return "High";
}

export function generateProspectIntelligence(input: ProspectInput): ProspectReport {
  const pains = splitList(input.painPoints);
  const competitors = splitList(input.competitors);
  const dealSize = Number(String(input.dealSize).replace(/[^0-9.]/g, "")) || 75000;
  const seed = hashSeed(`${input.companyName}|${input.industry}|${input.stage}`);
  const winProbability = pickWin(seed, input.stage);
  const riskLevel = riskFromWin(winProbability);
  const primaryPain = pains[0] || "inconsistent sales execution";
  const competitor = competitors[0] || "incumbent tools";

  const objections = [
    pains.includes("Budget") || /budget|cost|roi/i.test(input.opportunityNotes + input.painPoints)
      ? "Budget timing and need for quantified ROI"
      : "Budget scrutiny from finance before expansion",
    /implement|adopt|training|onboard/i.test(input.painPoints + input.additionalNotes + input.opportunityNotes)
      ? "Implementation timeline and team adoption risk"
      : "Change management and training overhead",
    competitors.length
      ? `Preference for ${competitor} due to familiarity`
      : "Status quo bias with current sales stack",
    "Integration complexity with CRM and existing workflows",
  ];

  return {
    id: `live-pr-${Date.now()}`,
    companyId: "live",
    company: input.companyName || "Prospect",
    contact: input.contactName || "Primary Contact",
    industry: input.industry || "Software",
    dealSize,
    stage: (input.stage as ProspectReport["stage"]) || "Discovery",
    createdAt: new Date().toISOString().slice(0, 10),
    executiveSummary: `${input.companyName || "This prospect"} (${input.industry || "their industry"}) is a ${formatMoney(dealSize)} opportunity currently in ${input.stage || "Discovery"}. ${input.contactName || "The champion"} is exploring how to address ${primaryPain}. Context from notes suggests ${summarizeNotes(input)}. Primary competitive pressure comes from ${competitor}. Recommended approach: lead with a measurable pilot, prove time-to-value, and neutralize ${competitor} on coaching actionability rather than call volume.`,
    challenges: pains.length
      ? pains
      : [
          "Inconsistent discovery quality across the team",
          "Managers lack scalable coaching leverage",
          "Follow-up quality varies by rep",
        ],
    stakeholders: [
      input.contactName || "Champion / AE Manager",
      "Economic Buyer (CRO / VP Sales / CFO)",
      "RevOps or Sales Enablement",
      "Security / IT (for CRM + data integrations)",
    ],
    objections,
    discoveryQuestions: [
      `How are you currently measuring success around ${primaryPain.toLowerCase()}?`,
      "What stalled previous sales tooling or enablement investments?",
      "Who else will influence or approve this decision?",
      "What does a successful 45-day pilot need to prove?",
      "When does your current vendor contract renew, and what would make switching easy?",
      competitors[1]
        ? `Where does ${competitors[0]} fall short today versus ${competitors[1]} or status quo?`
        : `If you stick with ${competitor}, what outcomes remain unsolved in the next two quarters?`,
    ],
    competitiveRisks: competitors.length
      ? competitors.map(
          (c) =>
            `${c}: buyers may default to brand familiarity unless SalesPilot shows faster insight-to-action and clearer manager workflows.`
        )
      : [
          "Incumbent stack inertia may delay evaluation unless a pilot is low-friction.",
          "Internal build-vs-buy debates can stall if ROI is not explicit.",
        ],
    positioning: [
      "Position as an AI sales copilot that turns notes and transcripts into decisions — not another call recorder",
      "Anchor value on objection detection, discovery coverage, and next-best-actions",
      "Offer a phased pilot with 2–3 KPIs to de-risk budget and adoption concerns",
      `For ${input.industry || "this market"}, emphasize ${industryAngle(input.industry)}`,
    ],
    valueProposition: `Help ${input.companyName || "the team"} increase win rates by preparing reps with prospect-specific intelligence, catching objections and buying signals in conversations, and generating precise follow-ups managers can inspect.`,
    upsell: [
      "Live coaching panel for high-stakes calls",
      "Manager analytics + team objection trends",
      `Industry objection library for ${input.industry || "your vertical"}`,
    ],
    winProbability,
    riskLevel,
  };
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function summarizeNotes(input: ProspectInput) {
  const blob = `${input.opportunityNotes} ${input.additionalNotes}`.trim();
  if (!blob) return "early-stage discovery with incomplete stakeholder mapping";
  if (/pilot/i.test(blob)) return "openness to a structured pilot if ROI and timeline are clear";
  if (/security|legal|dpa|soc/i.test(blob)) return "security/legal review will gate commercial progress";
  if (/renewal|contract|vendor/i.test(blob)) return "timing around an existing vendor renewal is material";
  return "active evaluation with clear operational pain and moderate process risk";
}

function industryAngle(industry: string) {
  const i = (industry || "").toLowerCase();
  if (i.includes("financ") || i.includes("fintech")) return "compliance-aware workflows and forecast hygiene";
  if (i.includes("industrial") || i.includes("manufact")) return "implementation speed, operator adoption, and ROI proof";
  if (i.includes("crm") || i.includes("enterprise")) return "native CRM writeback and differentiation vs incumbent AI";
  if (i.includes("design") || i.includes("collab")) return "fast AE ramp and consistent messaging";
  return "coaching scale and pipeline quality";
}

export function analyzeTranscript(transcript: string, company = "Prospect", contact = "Customer"): TranscriptAnalysis {
  const text = transcript || "";
  const lower = text.toLowerCase();
  const seed = hashSeed(text.slice(0, 400) || company);

  const objections: string[] = [];
  if (/budget|cost|price|roi/.test(lower)) objections.push("Budget");
  if (/implement|onboard|timeline|rollout/.test(lower)) objections.push("Implementation");
  if (/train|adopt|unused|change/.test(lower)) objections.push("Training / Adoption");
  if (/integrat|crm|salesforce|stack/.test(lower)) objections.push("Integration");
  if (/security|legal|compliance|dpa|soc/.test(lower)) objections.push("Security / Legal");
  if (/vendor|locked|renewal|contract/.test(lower)) objections.push("Vendor lock-in / Timing");
  if (!objections.length) objections.push("Status quo", "Timeline", "Internal alignment");

  const buyingSignals: string[] = [];
  if (/roi|kpi|metric|measure/.test(lower)) buyingSignals.push("Interested in ROI / KPIs");
  if (/pilot|proof|45-day|trial/.test(lower)) buyingSignals.push("Open to pilot");
  if (/case study|reference|customer/.test(lower)) buyingSignals.push("Requested social proof");
  if (/next (week|call)|demo|involve|plant manager|stakeholder/.test(lower))
    buyingSignals.push("Willing to expand buying committee");
  if (/promising|great|like to see|sounds/.test(lower)) buyingSignals.push("Positive engagement language");
  if (/timeline|q3|december|renewal/.test(lower)) buyingSignals.push("Concerned about / aligned on timeline");
  if (!buyingSignals.length) {
    buyingSignals.push("Continued meeting engagement", "Asked clarifying questions", "Open to next step discussion");
  }

  const positiveSentiment = [
    buyingSignals.includes("Open to pilot")
      ? "Expressed openness to a structured pilot"
      : "Maintained collaborative tone throughout",
    /promising|great|absolutely|thanks/.test(lower)
      ? "Used affirmative language when discussing next steps"
      : "Stayed engaged when discussing outcomes",
    "Asked for concrete artifacts (timeline, case study, or demo)",
  ].filter(Boolean);

  const negativeSentiment = [
    objections.includes("Budget") ? "Raised budget / ROI pressure from leadership" : "Showed caution on expanding commitment",
    objections.includes("Training / Adoption") || objections.includes("Implementation")
      ? "Worried about team adoption and prior tool failure"
      : "Indicated process friction that could slow decisioning",
  ];

  const missed: string[] = [];
  if (!/success metric|kpi|measure/.test(lower)) missed.push("Did not lock quantified success metrics");
  if (!/decision|approver|who else|committee|cfo|cro/.test(lower))
    missed.push("Did not fully map decision makers / approvers");
  if (!/contract|renewal|december|vendor until/.test(lower))
    missed.push("Did not confirm current vendor contract end date");
  if (!/security|legal|it/.test(lower)) missed.push("Did not probe security / IT requirements early");
  if (!missed.length) missed.push("Could have asked for explicit next-meeting ownership");

  const firstName = contact.split(" ")[0] || "there";
  const confidenceScore = Math.min(92, Math.max(58, 64 + (seed % 24) + buyingSignals.length * 2 - objections.length));
  const decisionMakerConfidence = Math.min(90, Math.max(40, 50 + (seed % 30) + (/involve|manager|leadership/.test(lower) ? 10 : 0)));
  const sentiment = Math.min(90, Math.max(45, 55 + buyingSignals.length * 5 - Math.max(0, objections.length - 2) * 4));
  const repShare = 38 + (seed % 20);

  return {
    id: `live-ta-${Date.now()}`,
    company,
    contact,
    date: new Date().toISOString().slice(0, 10),
    duration: `${24 + (seed % 20)} min`,
    objections,
    buyingSignals,
    positiveSentiment,
    negativeSentiment,
    decisionMakerConfidence,
    missedOpportunities: missed,
    recommendedFollowUp: [
      "Send relevant case study matched to industry / use case",
      "Propose technical demo with additional stakeholder",
      "Share implementation timeline and 45-day pilot plan",
      objections.includes("Budget") ? "Include ROI model with assumed baseline metrics" : "Confirm success metrics in writing",
    ],
    recommendedEmail: `Hi ${firstName},\n\nThanks for the conversation today. I heard clear priorities around ${objections.slice(0, 2).join(" and ").toLowerCase()}, and interest in ${buyingSignals[0]?.toLowerCase() || "a practical next step"}.\n\nI'll send a concise pilot outline, implementation timeline, and a relevant case study. If useful, let's schedule a technical demo with your broader team next week.\n\nBest,\nAlex Rivera\nSalesPilot AI`,
    nextMeetingAgenda: [
      "Recap pain and agree on pilot success metrics",
      "Walk through implementation / onboarding timeline",
      "Address top objections with proof points",
      "Align stakeholders and commercial next steps",
    ],
    confidenceScore,
    talkRatio: { rep: repShare, customer: 100 - repShare },
    sentiment,
    nextActions: {
      high: [
        "Schedule technical demo",
        "Send implementation timeline",
        "Share customer case study",
      ],
      medium: [
        "Send ROI calculator",
        "Provide security documentation",
        "Share CRM integration overview",
      ],
      low: ["Pricing comparison one-pager", "Optional Loom product walkthrough"],
    },
  };
}

export function generateFollowUpPack(analysis: TranscriptAnalysis) {
  const first = analysis.contact.split(" ")[0] || "there";
  return {
    email: {
      subject: `${analysis.company}: pilot plan + next steps`,
      body: analysis.recommendedEmail,
    },
    linkedin: {
      subject: "LinkedIn message",
      body: `Hi ${first} — enjoyed our discussion on ${analysis.objections[0]?.toLowerCase() || "improving sales execution"}. Happy to share a short pilot outline and case study if useful for your team.`,
    },
    executiveSummary: `${analysis.company} call analyzed on ${analysis.date}. Objections centered on ${analysis.objections.join(", ")}. Buying signals: ${analysis.buyingSignals.join("; ")}. Confidence ${analysis.confidenceScore}%. Recommended path: technical demo + pilot plan within 7 days.`,
    crmNotes: `Contact: ${analysis.contact}\nObjections: ${analysis.objections.join(", ")}\nSignals: ${analysis.buyingSignals.join(", ")}\nMissed: ${analysis.missedOpportunities.join("; ")}\nWin/confidence: ${analysis.confidenceScore}%\nNext: ${analysis.recommendedFollowUp[0]}`,
    actionItems: analysis.recommendedFollowUp,
    meetingRecap: `Discussed priorities and concerns for ${analysis.company}. Customer emphasized ${analysis.objections.slice(0, 2).join(" and ")}. Positive indicators included ${analysis.buyingSignals.slice(0, 2).join(" and ")}. Agreed direction: follow up with proof points and schedule broader demo.`,
  };
}

export function simulateLiveCoaching(step: number) {
  const frames = [
    {
      confidence: 62,
      sentiment: 54,
      talkRep: 48,
      questionQuality: 61,
      objection: null as string | null,
      buying: null as string | null,
      suggested: "Ask what success looks like in 45 days.",
      tip: "Keep questions open-ended; avoid pitching too early.",
    },
    {
      confidence: 58,
      sentiment: 49,
      talkRep: 55,
      questionQuality: 64,
      objection: "Implementation / adoption concern detected",
      buying: null,
      suggested: "Acknowledge prior tool failure, then offer a phased onboarding plan with week-by-week milestones.",
      tip: "Label the objection before responding — builds trust.",
    },
    {
      confidence: 66,
      sentiment: 57,
      talkRep: 44,
      questionQuality: 72,
      objection: "Budget / ROI concern detected",
      buying: "Interest in measurable KPIs",
      suggested: "Propose two pilot KPIs: time-to-first-value and opportunity hygiene improvement.",
      tip: "Trade: offer pilot scope in exchange for a clear economic buyer intro.",
    },
    {
      confidence: 74,
      sentiment: 68,
      talkRep: 41,
      questionQuality: 78,
      objection: null,
      buying: "Open to Q3 pilot + stakeholder expansion",
      suggested: "Confirm next meeting with plant manager and send case study today.",
      tip: "Secure time on calendar before ending the call.",
    },
  ];
  return frames[Math.min(step, frames.length - 1)];
}
