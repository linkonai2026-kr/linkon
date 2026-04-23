import { Metadata } from "next";
import { PlanTier, ServiceName } from "@/lib/linkon/types";

export interface FeatureItem {
  title: string;
  description: string;
  icon: "spark" | "shield" | "pulse" | "document" | "chart" | "people";
}

export interface ServicePageContent {
  slug: ServiceName;
  name: string;
  title: string;
  description: string;
  tagline: string;
  status: "live" | "soon";
  heroDescription: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  heroPrimaryHref: string;
  navLabel: string;
  accentClass: "vion" | "rion" | "taxon";
  overlayColor: string;
  backgroundImage: string;
  logo: string;
  logoMark: string;
  introLabel: string;
  introTitle: string;
  introBody: string[];
  featuresLabel: string;
  featuresTitle: string;
  features: FeatureItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
}

export const servicePageContent: Record<ServiceName, ServicePageContent> = {
  vion: {
    slug: "vion",
    name: "Vion",
    title: "Vion | Mental wellness and silver care",
    description:
      "AI-assisted emotional support and guided care workflows for daily mental wellness and aging households.",
    tagline: "Compassionate mental wellness and silver care",
    status: "live",
    heroDescription:
      "Vion helps people and families stay supported with guided AI care experiences, structured check-ins, and safer daily routines.",
    heroPrimaryLabel: "Launch Vion",
    heroSecondaryLabel: "See overview",
    heroPrimaryHref: "/api/auth/token?service=vion",
    navLabel: "Launch Vion",
    accentClass: "vion",
    overlayColor: "rgba(0, 40, 35, 0.88)",
    backgroundImage: "/assets/vion-mockup.png",
    logo: "/assets/vion-no.png",
    logoMark: "/assets/vion-noback.png",
    introLabel: "Overview",
    introTitle: "A calmer, more structured care experience",
    introBody: [
      "Vion is designed for emotionally aware support. It combines guided conversation, check-in flows, and care continuity into a single experience.",
      "For older adults and their families, Vion also supports daily reassurance, routine prompts, and shared care visibility without creating operational friction.",
    ],
    featuresLabel: "Core features",
    featuresTitle: "What Vion delivers in the MVP",
    features: [
      {
        title: "Emotion-aware check-ins",
        description:
          "Recognizes the tone of a conversation and helps users move into the next safe, useful step.",
        icon: "pulse",
      },
      {
        title: "Always-available support",
        description:
          "Users can re-enter the product at any time instead of waiting for office hours or manual follow-up.",
        icon: "spark",
      },
      {
        title: "Family-friendly care flow",
        description:
          "Built to support care routines, shared context, and more confident decision making in aging households.",
        icon: "people",
      },
      {
        title: "Readable progress summaries",
        description:
          "Presents a cleaner view of recent care interactions and notable changes over time.",
        icon: "chart",
      },
      {
        title: "Controlled data handling",
        description:
          "Sensitive identity and access states are managed centrally in Linkon for safer operations.",
        icon: "shield",
      },
      {
        title: "Unified account access",
        description:
          "Launches directly from the Linkon account and respects the same plan and permission state.",
        icon: "document",
      },
    ],
    ctaTitle: "Vion is available now",
    ctaDescription:
      "Create a Linkon account once, then launch Vion with unified identity and admin-managed permissions.",
    ctaPrimaryLabel: "Open Vion",
    ctaPrimaryHref: "/api/auth/token?service=vion",
    ctaSecondaryLabel: "Back to Linkon",
  },
  rion: {
    slug: "rion",
    name: "Rion",
    title: "Rion | Legal co-pilot",
    description:
      "A legal guidance experience that turns difficult documents and next steps into clear, actionable support.",
    tagline: "A clearer path through legal work",
    status: "soon",
    heroDescription:
      "Rion is being prepared as the legal co-pilot for contract review, legal process guidance, and document-centered workflows.",
    heroPrimaryLabel: "Join the launch list",
    heroSecondaryLabel: "See overview",
    heroPrimaryHref: "#notify",
    navLabel: "Get notified",
    accentClass: "rion",
    overlayColor: "rgba(0, 20, 50, 0.9)",
    backgroundImage: "/assets/rion-mockup.png",
    logo: "/assets/rion-no.png",
    logoMark: "/assets/rion-noback.png",
    introLabel: "Overview",
    introTitle: "Legal guidance that feels easier to act on",
    introBody: [
      "Rion is focused on making legal documents, risk signals, and next steps easier to understand for everyday users and operating teams.",
      "The launch MVP centers on practical review flows, plain-language explanations, and a stronger handoff into formal service operations.",
    ],
    featuresLabel: "Planned MVP features",
    featuresTitle: "What Rion will prioritize first",
    features: [
      {
        title: "Contract risk summary",
        description:
          "Highlights clauses and signals that deserve attention before a user makes a decision.",
        icon: "document",
      },
      {
        title: "Step-by-step guidance",
        description:
          "Explains what to do next, what to prepare, and what to review before escalating.",
        icon: "shield",
      },
      {
        title: "Plain-language interpretation",
        description:
          "Translates dense legal language into something more practical and easier to scan.",
        icon: "spark",
      },
      {
        title: "Operational handoff path",
        description:
          "Prepares the flow for formal legal review, issuance, or supervised escalation.",
        icon: "people",
      },
      {
        title: "Connected case history",
        description:
          "Reuses Linkon identity and keeps service-side account state aligned from day one.",
        icon: "chart",
      },
      {
        title: "Permission-aware access",
        description:
          "Roles, suspensions, deletions, and plan changes in Linkon cascade into Rion access rules.",
        icon: "pulse",
      },
    ],
    ctaTitle: "Prepare your account before launch",
    ctaDescription:
      "Users who create a Linkon account now can be onboarded faster when Rion opens.",
    ctaPrimaryLabel: "Create account and get updates",
    ctaPrimaryHref: "/register",
    ctaSecondaryLabel: "Explore other services",
  },
  taxon: {
    slug: "taxon",
    name: "Taxon",
    title: "Taxon | Business finance operations",
    description:
      "An AI layer for understanding financial position, recurring reporting work, and tax readiness.",
    tagline: "Clearer finance operations for real businesses",
    status: "soon",
    heroDescription:
      "Taxon is being prepared to turn complex numbers, reporting tasks, and tax readiness into a more readable operating flow.",
    heroPrimaryLabel: "Join the launch list",
    heroSecondaryLabel: "See overview",
    heroPrimaryHref: "#notify",
    navLabel: "Get notified",
    accentClass: "taxon",
    overlayColor: "rgba(40, 0, 8, 0.9)",
    backgroundImage: "/assets/taxon-mockup.png",
    logo: "/assets/taxon-no.png",
    logoMark: "/assets/taxon-noback.png",
    introLabel: "Overview",
    introTitle: "Finance visibility without the usual operational drag",
    introBody: [
      "Taxon is aimed at founders and operators who need a faster read on financial condition, recurring reporting work, and tax-sensitive decisions.",
      "The MVP will focus on summary visibility, document readiness, and cleaner workflows across routine finance tasks.",
    ],
    featuresLabel: "Planned MVP features",
    featuresTitle: "What Taxon will ship first",
    features: [
      {
        title: "Business health summary",
        description:
          "Surfaces the most important signals quickly instead of forcing users through fragmented records.",
        icon: "chart",
      },
      {
        title: "Tax readiness prompts",
        description:
          "Calls out what should be reviewed before deadlines or before filings become operationally urgent.",
        icon: "spark",
      },
      {
        title: "Document workflow support",
        description:
          "Prepares recurring document flows so downstream experts and admins can work faster.",
        icon: "document",
      },
      {
        title: "Recurring task structure",
        description:
          "Supports repeatable reporting and finance operations without rebuilding the process each time.",
        icon: "pulse",
      },
      {
        title: "Centralized access control",
        description:
          "Linkon remains the source of truth for entitlement, account status, and service access.",
        icon: "shield",
      },
      {
        title: "Shared operational identity",
        description:
          "Users move between Linkon and Taxon without duplicated account management logic.",
        icon: "people",
      },
    ],
    ctaTitle: "Get Taxon-ready before launch",
    ctaDescription:
      "Create one Linkon account now so onboarding, plan updates, and access control are already in place when Taxon opens.",
    ctaPrimaryLabel: "Create account and get updates",
    ctaPrimaryHref: "/register",
    ctaSecondaryLabel: "Explore other services",
  },
};

export function getServiceMetadata(service: ServiceName): Metadata {
  const content = servicePageContent[service];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      images: [{ url: content.logo }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [content.logo],
    },
  };
}

export const legalContent = {
  privacy: {
    title: "Privacy Policy",
    description:
      "This policy explains how Linkon handles account identity, service access data, and operational records across the Linkon ecosystem.",
    updatedAt: "April 22, 2026",
    sections: [
      {
        heading: "1. What we collect",
        body: [
          "We collect account identity data, profile fields, service access mappings, and operational audit records needed to deliver Linkon and connected services.",
          "We may also store consent records, plan state, and support-related communication needed to run the platform safely.",
        ],
      },
      {
        heading: "2. Why we use the data",
        body: [
          "We use data to authenticate users, launch connected services, manage permissions, investigate issues, and improve operational reliability.",
          "Administrative actions such as suspension, deletion, and plan changes are recorded to preserve accountability and service continuity.",
        ],
      },
      {
        heading: "3. Sharing and downstream services",
        body: [
          "Linkon can synchronize account state with Vion, Rion, and Taxon when a connected service requires identity, access, or entitlement updates.",
          "We only propagate the fields necessary to operate the target service and keep audit visibility within the Linkon control plane.",
        ],
      },
      {
        heading: "4. Retention and security",
        body: [
          "We retain operational records for as long as needed to run the service, satisfy legal obligations, or investigate misuse and support requests.",
          "We use role-based access controls and service-side restrictions to reduce unauthorized access to account and admin records.",
        ],
      },
      {
        heading: "5. Contact",
        body: [
          "For privacy questions or account support, contact linkon.ai2026@gmail.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description:
      "These terms govern use of the Linkon platform, connected service access, and administrator-controlled account operations.",
    updatedAt: "April 22, 2026",
    sections: [
      {
        heading: "1. Service scope",
        body: [
          "Linkon provides unified identity, access control, and service launch experiences for Vion, Rion, and Taxon.",
          "Connected services may have their own feature availability, onboarding requirements, or launch status.",
        ],
      },
      {
        heading: "2. Account responsibility",
        body: [
          "Users are responsible for the security of their credentials and for keeping account information reasonably accurate.",
          "Linkon may limit or revoke access when misuse, fraud risk, or policy violations are detected.",
        ],
      },
      {
        heading: "3. Plans and admin actions",
        body: [
          "Plan changes, suspensions, deletions, and service access rules may be managed through the Linkon admin control plane.",
          "Administrative actions can propagate to downstream services to maintain consistent access and operational integrity.",
        ],
      },
      {
        heading: "4. Availability and changes",
        body: [
          "We may update features, service integrations, or access rules as the platform evolves.",
          "Some services may remain in limited release or launch-preview mode during the MVP period.",
        ],
      },
      {
        heading: "5. Contact",
        body: [
          "For support, operational concerns, or legal notices, contact linkon.ai2026@gmail.com.",
        ],
      },
    ],
  },
} as const;

export const planLabels: Record<PlanTier, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
  enterprise: "Enterprise",
};
