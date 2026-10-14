export const metrics = [
  { value: "+1050%", label: "loan application completion", context: "NeoCash Redesign" },
  { value: "2.5×", label: "feature adoption improvement", context: "NeoCash Redesign" },
  { value: "640%", label: "increase in average order value", context: "Volta Charger" },
  { value: "+150%", label: "revenue beyond Kickstarter target", context: "Volta Charger" },
  { value: "130s", label: "time to first value", context: "Workergen" },
  { value: "-50%", label: "churn rate reduction", context: "Workergen" },
  { value: "+30%", label: "conversion across landing pages", context: "Workergen" },
  { value: "19%", label: "more leads closed", context: "Estility" },
  { value: "-17%", label: "reduction in project timelines", context: "Estility" },
  { value: "5.1%→18%", label: "user retention in 8 weeks", context: "Quiver Finance" },
];

export const testimonials = [
  {
    quote:
      "Working with Laja was seamless and inspiring. His work elevated our brand. Gave him a tip and will definitely come back for more projects.",
    name: "Blessing Edet",
    role: "Manager",
    company: "Neo Cash",
    rating: 5,
  },
  {
    quote:
      "Muiz (Laja) is our design architect and for real, he's a guru at it.",
    name: "Mac Nwachukwu",
    role: "CEO",
    company: "Estility Ltd",
    rating: 5,
  },
  {
    quote:
      "Muiz is highly talented and I'm super proud I get to work with him.",
    name: "Adedayo Charis",
    role: "CEO",
    company: "Volta Charger",
    rating: 5,
  },
  {
    quote:
      "Professional, creative, and reliable. He delivered a product that made a huge impact.",
    name: "Abel Tayo",
    role: "COO",
    company: "Proven",
    rating: 5,
  },
  {
    quote:
      "Laja speaks loads of experience and detail in his work as a designer and product specialist. Love this guy!",
    name: "Bola",
    role: "Co-Founder",
    company: "Duka Cards",
    rating: 5,
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  industry: string;
  role: string;
  year: string;
  duration: string;
  type: "deep" | "mini";
  tagline: string;
  problem: string;
  problemDetail: string;
  process: { heading: string; body: string }[];
  results: { value: string; label: string }[];
  testimonial?: { quote: string; name: string; role: string; company: string };
  nextSlug: string;
  nextTitle: string;
  accentIndex: number;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "neocash",
    title: "NeoCash App Redesign",
    subtitle: "Reframing the loan as a conversation.",
    client: "Sheperd Trust MFB (Neo Cash)",
    industry: "FinTech",
    role: "Senior Product Designer",
    year: "2025",
    duration: "4 months",
    type: "deep",
    tagline: "A business loan platform for MSMEs, rebuilt from broken to frictionless.",
    problem:
      "Most users abandoned the loan application before completing it.",
    problemDetail:
      "NeoCash is a business loan solution for MSMEs in Nigeria. Their existing platform was visually outdated, relied on dense multi-step forms, and gave users no sense of progress or warmth. The loan application flow was broken; completion rates were catastrophically low. The brief was direct: reframe the digital loan platform with modern UX.",
    process: [
      {
        heading: "Audit: what was actually broken",
        body:
          "Started with a forensic audit of the existing flows. The form architecture required users to make complex financial decisions without context. No microcopy, no feedback states, no sense that the system cared. Every field was a cliff.",
      },
      {
        heading: "Conversational UX: the reframe",
        body:
          "Replaced the traditional form model with a dialogue-style application: one question at a time, warm tone, clear progress. Users weren't filling out a form; they were having a conversation with the platform. This single structural change is responsible for most of the outcome.",
      },
      {
        heading: "Illustration system + personality",
        body:
          "Designed a set of custom illustrations to give NeoCash a recognisable personality, not stock, not generic fintech. The visual identity now reads as approachable and modern without sacrificing credibility.",
      },
      {
        heading: "Micro-interactions + UX copy",
        body:
          "Wrote all UX copy throughout the flow: conversational, warm, clear. Designed micro-interactions and fluid transitions at every state change to reduce perceived friction and reward progress.",
      },
    ],
    results: [
      { value: "+1050%", label: "increase in loan application completion" },
      { value: "2.5×", label: "feature adoption improvement" },
    ],
    testimonial: {
      quote:
        "Working with Laja was seamless and inspiring. His work elevated our brand. Gave him a tip and will definitely come back for more projects.",
      name: "Blessing Edet",
      role: "Manager",
      company: "Neo Cash",
    },
    nextSlug: "estility",
    nextTitle: "Estility Ecosystem",
    accentIndex: 0,
  },
  {
    slug: "estility",
    title: "Estility Ecosystem",
    subtitle: "Two years. One design language. Ten products.",
    client: "Estility Ltd",
    industry: "Real Estate / PropTech",
    role: "Product Designer, Design Team Lead",
    year: "2023–2025",
    duration: "2 years",
    type: "deep",
    tagline: "A gated-community management platform — designed system-first, shipped product-second.",
    problem:
      "Their website had a 90%+ bounce rate. Visitors left within 4 seconds.",
    problemDetail:
      "Estility brings tech-first convenience to residents in gated communities across Nigeria. When I joined, the website had over 90% bounce rate; visitors left without any desired action. The primary CTA was 'Book a Demo', a cold, high-friction ask for first-time visitors. There was no design system, no visual consistency, and the product suite was growing faster than the design infrastructure could support.",
    process: [
      {
        heading: "Design system: the foundation everything else stood on",
        body:
          "Before touching any screens, I built the design system from scratch. Tokens, components, patterns, documentation. This cut project timelines by 17% and let the team scale without inconsistency.",
      },
      {
        heading: "Website strategy: CTA surgery",
        body:
          "Shifted the primary CTA from 'Book a Demo' (cold, high-commitment) to 'Download the App' (immediate, low-friction). This one decision directly improved activation. Also booked a custom photography session, a strategic move that replaced the stock imagery pulling down the brand.",
      },
      {
        heading: "Stakeholder facilitation",
        body:
          "Led multi-phased stakeholder meetings, set KPIs per team member, and presented two distinct design directions for decision. The design process became a business process.",
      },
      {
        heading: "10+ products across 12 months",
        body:
          "Designed and shipped mobile app, web platform, resident portals, and operational dashboards. Mentored the design team. Cross-collaborated with product managers and engineers. This was product leadership as much as product design.",
      },
    ],
    results: [
      { value: "19%", label: "more leads closed via simplified onboarding" },
      { value: "-17%", label: "reduction in project timelines" },
      { value: "10+", label: "user-centric products shipped in 12 months" },
    ],
    testimonial: {
      quote:
        "Muiz (Laja) is our design architect and for real, he's a guru at it.",
      name: "Mac Nwachukwu",
      role: "CEO",
      company: "Estility Ltd",
    },
    nextSlug: "profootball",
    nextTitle: "ProFootball Webapp",
    accentIndex: 1,
  },
  {
    slug: "profootball",
    title: "ProFootball Webapp",
    subtitle: "Turning passive fans into active participants.",
    client: "ProFootball",
    industry: "Sports / Entertainment Tech",
    role: "Design Team Lead",
    year: "2024",
    duration: "Not disclosed",
    type: "deep",
    tagline: "A gamified football platform where trivia is proof-of-knowledge, not just entertainment.",
    problem:
      "Football fans engage passionately offline. The platform had no mechanism to capture that energy digitally.",
    problemDetail:
      "ProFootball needed to solve two problems simultaneously: gamify football engagement to bring passive fans into an active digital experience, and build a credible trivia system where football knowledge could be demonstrated, competed, and potentially rewarded. The challenge was designing motivation loops that worked for both the casual supporter and the deep knowledge-holder.",
    process: [
      {
        heading: "Gamification architecture",
        body:
          "Designed the points, badges, and leaderboard system, the scaffolding that makes returning to the platform feel rewarding. The architecture is tiered: casual engagement has visible progress, competitive engagement has ranked status.",
      },
      {
        heading: "Trivia system design",
        body:
          "Built the trivia UX from the question surface outward: how questions are timed, revealed, scored, and fed back to the user. The pacing is deliberate: fast enough to create tension, slow enough to feel fair.",
      },
      {
        heading: "Motivation loops",
        body:
          "Mapped what brings a football fan back daily and weekly. Designed streak mechanics, challenge invitations, and social proof surfaces (who in your network just answered this correctly?), engineered for habit, not novelty.",
      },
      {
        heading: "Webapp UI: sports energy, not gaming garish",
        body:
          "The visual direction had to read as premium sports media, not a mobile game. Energy without loudness. Confident type, restrained colour, high contrast where the action is.",
      },
    ],
    results: [
      { value: "2",   label: "gamification systems designed: points engine + trivia" },
      { value: "1",   label: "design system built from scratch for the platform" },
    ],
    nextSlug: "workergen",
    nextTitle: "Workergen AI Marketplace",
    accentIndex: 2,
  },
  {
    slug: "workergen",
    title: "Workergen AI Marketplace",
    subtitle: "Hiring AI agents shouldn't feel like reading a manual.",
    client: "Workergen Inc",
    industry: "AI / SaaS",
    role: "Product Designer",
    year: "2025",
    duration: "5 months",
    type: "mini",
    tagline: "An agentic AI marketplace, where business owners hire AI workers tailored to their needs.",
    problem:
      "The platform's onboarding was losing users before they reached their first value moment.",
    problemDetail:
      "Workergen is a marketplace where businesses hire AI agents as they would human contractors; each listing is an AI agent or automated workflow. The design challenge was speed-to-value: getting users from signup to their first productive moment before they bounced. I also built the design system from scratch and shipped 15+ AI tools to production.",
    process: [
      {
        heading: "Design system foundation",
        body:
          "Built the design system before shipping product screens. Tokens, component library, pattern documentation. This was what made shipping 15+ agents at pace possible.",
      },
      {
        heading: "Speed-to-value: redesigning onboarding",
        body:
          "Ran split-testing sessions on landing pages, conducted user interviews, and identified the exact moment users dropped off. Redesigned onboarding around getting users to their first productive moment in under 130 seconds.",
      },
      {
        heading: "AI tool suite: Email Automation, AutoBlog AI, Logo Studio",
        body:
          "Designed the UX of individual AI tools — how users configure an agent, what feedback they receive, how outputs are presented. Each tool required its own mental model, so the design system did the heavy lifting of consistency.",
      },
    ],
    results: [
      { value: "130s", label: "time to first value, down from much higher" },
      { value: "-50%", label: "churn rate reduction" },
      { value: "+30%", label: "conversion across landing pages" },
      { value: "15+", label: "AI agents shipped to production" },
    ],
    nextSlug: "neocash",
    nextTitle: "NeoCash App Redesign",
    accentIndex: 3,
  },
];

export const snapshotProjects = [
  {
    title: "DukaCards",
    category: "App Design",
    year: "2025",
    image: "/images/snapshots/dukacards.png",
  },
  {
    title: "Quiver Finance",
    category: "Product Design · Gamification",
    year: "2024",
    note: "5.1% → 18% retention in 8 weeks",
    image: "/images/snapshots/quiver.png",
  },
  {
    title: "Vescrow",
    category: "Brand Identity",
    year: "2024",
    image: "https://cdn.prod.website-files.com/6378c5ec8c7bd812dfcbaaab/6382b8ee38bb0d0616dd3913_smartmockups_layyml7w.jpg",
  },
  {
    title: "E-Rider",
    category: "App Design + Integration",
    year: "2023",
    image: "https://cdn.prod.website-files.com/6378c5ec8c7bd812dfcbaaab/65db8e8e09d579631b714b94_7%20UI%20Screens.png",
  },
  {
    title: "BruttForce Gallery",
    category: "Website Redesign + Development",
    year: "2023",
    image: "https://cdn.prod.website-files.com/6378c5ec8c7bd812dfcbaaab/65dc341db768e5a874f62754_Brutt%20force%20Gallery%20Website%20design%204.png",
  },
  {
    title: "Classbox",
    category: "E-Learning Platform",
    year: "2025",
    note: "Lagos State Government · NDA cleared",
    image: "/images/snapshots/classbox.png",
  },
];

export const clients = [
  { name: "Workergen", abbr: "WG" },
  { name: "Volta Charger", abbr: "VC" },
  { name: "Estility Ltd", abbr: "ES" },
  { name: "Neo Cash", abbr: "NC" },
  { name: "Àjọpaw", abbr: "AJ" },
];

export const careerTimeline = [
  {
    period: "Jul 2025–Present",
    company: "Volta Charger",
    role: "Lead Designer: Creatives, Products & UX",
    location: "Gold Coast, Australia",
    current: true,
  },
  {
    period: "Feb–Jul 2025",
    company: "Workergen",
    role: "Product Designer: AI Marketplace",
    location: "United States (Remote)",
    current: false,
  },
  {
    period: "Mar–Apr 2025",
    company: "Quiver Finance Inc",
    role: "Product Designer",
    location: "Lagos (Remote)",
    current: false,
  },
  {
    period: "Jun 2023–Apr 2025",
    company: "Estility",
    role: "Design Team Lead → Product Design Lead",
    location: "Lagos",
    current: false,
  },
  {
    period: "May–Jun 2024",
    company: "Quiver Finance Inc",
    role: "UI Designer",
    location: "Lagos",
    current: false,
  },
  {
    period: "Feb–Jun 2023",
    company: "Estility",
    role: "Product Designer",
    location: "Lagos",
    current: false,
  },
  {
    period: "May 2021–Dec 2022",
    company: "Mizark Global",
    role: "UX Designer",
    location: "Lagos",
    current: false,
  },
  {
    period: "Nov 2020–May 2021",
    company: "AMB Stores",
    role: "Web Designer (Internship)",
    location: "Ibadan",
    current: false,
  },
  {
    period: "May 2019–Nov 2020",
    company: "Deelomak Global",
    role: "Marketing Design Assistant (Internship)",
    location: "Lagos",
    current: false,
  },
];
