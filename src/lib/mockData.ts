import { ProjectType } from "@/store/usePortfolioStore";

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Websites", slug: "websites" },
  { id: "cat-2", name: "Logos", slug: "logos" },
  { id: "cat-3", name: "Social Posts", slug: "social-media" },
  { id: "cat-4", name: "AI Art", slug: "ai-art" },
  { id: "cat-5", name: "UGC Videos", slug: "ugc-videos" },
  { id: "cat-6", name: "Reels", slug: "reels" },
  { id: "cat-7", name: "Branding", slug: "branding" },
  { id: "cat-8", name: "Case Studies", slug: "case-studies" },
  { id: "cat-9", name: "Creative Assets", slug: "creative-assets" },
];

export const MOCK_PROJECTS: ProjectType[] = [
  {
    id: "proj-1",
    title: "NovaMind AI - Cognitive Design Platform",
    slug: "novamind-ai-platform",
    description: "A complete next-generation SaaS website interface designed for an AI design agent ecosystem. Built with modular custom canvas boards, a light high-contrast layout, fluid layout transitions, and interactive floating workspace nodes.\n\nIncludes fully functional prompt builders, canvas editor frames, real-time collaboration widgets, and an elegant pricing slider tier.",
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m1-1", url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-a-computer-40742-large.mp4", type: "VIDEO" },
      { id: "m1-2", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800", type: "IMAGE" },
      { id: "m1-3", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", type: "IMAGE" }
    ],
    projectType: "WEBSITE",
    websiteLink: "https://novamind.example.com",
    sourceCodeLink: "https://github.com/agency/novamind-ai",
    pricing: "From $12,500 USD",
    featured: true,
    published: true,
    tags: [
      { id: "t1-1", name: "NextJS 15" },
      { id: "t1-2", name: "AI UI/UX" },
      { id: "t1-3", name: "Framer Motion" }
    ],
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z"
  },
  {
    id: "proj-2",
    title: "Aetherial - Spatial Sound Logo & Branding",
    slug: "aetherial-branding-concept",
    description: "An elegant minimalist identity system built for Aetherial Sound Labs. This logo is constructed on a mathematically perfect logarithmic spiral, emphasizing depth, resonance, and spatial progression.\n\nWe designed secondary typographic treatments, business card templates, glassmorphic letterheads, and an animated vector signature for their software start sequences.",
    categoryId: "cat-2",
    category: MOCK_CATEGORIES[1],
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m2-1", url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800", type: "IMAGE" },
      { id: "m2-2", url: "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&q=80&w=800", type: "IMAGE" }
    ],
    projectType: "LOGO",
    websiteLink: null,
    sourceCodeLink: null,
    pricing: "$4,800 USD",
    featured: true,
    published: true,
    tags: [
      { id: "t2-1", name: "Identity" },
      { id: "t2-2", name: "Minimalist" },
      { id: "t2-3", name: "Vector Art" }
    ],
    createdAt: "2026-03-12T14:30:00.000Z",
    updatedAt: "2026-03-12T14:30:00.000Z"
  },
  {
    id: "proj-3",
    title: "Horizon Cloud - Brand Campaign Posts",
    slug: "horizon-cloud-socials",
    description: "A premium suite of social media campaign graphics launched for Horizon Cloud's Spring Release. Designed in a futuristic retro-gradient style using frosted-glass elements, glowing grid lines, and bold cybernetic typography.\n\nIncludes carousel structures, dynamic feature announcements, statistics layouts, and animated story templates that boosted conversion by 47%.",
    categoryId: "cat-3",
    category: MOCK_CATEGORIES[2],
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m3-1", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", type: "IMAGE" },
      { id: "m3-2", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", type: "IMAGE" }
    ],
    projectType: "SOCIAL",
    websiteLink: "https://dribbble.com/shots/horizon-cloud",
    sourceCodeLink: null,
    pricing: "Retainer Package",
    featured: false,
    published: true,
    tags: [
      { id: "t3-1", name: "Social Branding" },
      { id: "t3-2", name: "Mesh Gradients" },
      { id: "t3-3", name: "Figma" }
    ],
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-01T08:00:00.000Z"
  },
  {
    id: "proj-4",
    title: "Chroma Core - Generative AI Exhibition",
    slug: "chroma-core-generative-art",
    description: "High-resolution generative art pieces designed using custom Midjourney pipelines and post-processed in Photoshop. The collection explores the theme of synthetic consciousness breaking free from numerical frameworks.\n\nFeatures vibrant hyper-detailed colors, soft liquid glass flows, volumetric lighting effects, and surreal landscape compositions curated for a gallery projection exhibition.",
    categoryId: "cat-4",
    category: MOCK_CATEGORIES[3],
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m4-1", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", type: "IMAGE" },
      { id: "m4-2", url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800", type: "IMAGE" }
    ],
    projectType: "AI_ART",
    websiteLink: "https://opensea.io/collection/chromacore",
    sourceCodeLink: null,
    pricing: "$1,200 per print",
    featured: true,
    published: true,
    tags: [
      { id: "t4-1", name: "Midjourney v6" },
      { id: "t4-2", name: "Generative Art" },
      { id: "t4-3", name: "4K Resolution" }
    ],
    createdAt: "2026-04-10T12:00:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z"
  },
  {
    id: "proj-5",
    title: "Aura Smart Ring - UGC Unboxing & Review",
    slug: "aura-ring-ugc-unboxing",
    description: "A highly engaging User Generated Content (UGC) unboxing video produced for Aura Ring. This content is structured with an immediate visual hook, highlights key bio-sensor benefits, features premium closeups of the titanium finish, and ends with a high-converting CTA.\n\nDesigned for native TikTok and Instagram Reels placement, driving a 34% increase in click-through rates.",
    categoryId: "cat-5",
    category: MOCK_CATEGORIES[4],
    thumbnail: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m5-1", url: "https://assets.mixkit.co/videos/preview/mixkit-man-showing-a-smart-ring-on-his-finger-41725-large.mp4", type: "VIDEO" }
    ],
    projectType: "UGC",
    websiteLink: "https://tiktok.com/@auraring/video/123",
    sourceCodeLink: null,
    pricing: "$1,800 per video",
    featured: false,
    published: true,
    tags: [
      { id: "t5-1", name: "TikTok Ad" },
      { id: "t5-2", name: "UGC Video" },
      { id: "t5-3", name: "Review Hook" }
    ],
    createdAt: "2026-04-20T16:15:00.000Z",
    updatedAt: "2026-04-20T16:15:00.000Z"
  },
  {
    id: "proj-6",
    title: "Sora Studios - Cine-Teaser Showcase",
    slug: "sora-studios-reel",
    description: "A dynamic reels teaser showcasing our cinematic AI generations. The reel blends custom hyper-lapse landscapes, micro-macro nature closeups, and architectural drafts synced to a custom modular synthesizer soundtrack.\n\nFormatted vertically in 9:16, engineered to trigger viral algorithm hooks on Instagram Reels and YouTube Shorts.",
    categoryId: "cat-6",
    category: MOCK_CATEGORIES[5],
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m6-1", url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4", type: "VIDEO" }
    ],
    projectType: "REELS",
    websiteLink: "https://instagram.com/reel/C8_zabc123/",
    sourceCodeLink: null,
    pricing: " Retainer Campaign",
    featured: true,
    published: true,
    tags: [
      { id: "t6-1", name: "Instagram Reel" },
      { id: "t6-2", name: "AI Sora Video" },
      { id: "t6-3", name: "Viral Hook" }
    ],
    createdAt: "2026-05-02T19:40:00.000Z",
    updatedAt: "2026-05-02T19:40:00.000Z"
  },
  {
    id: "proj-7",
    title: "Metamorph - Liquid Identity Branding",
    slug: "metamorph-branding-case",
    description: "An extensive brand overhaul for Metamorph Digital, a studio focusing on cross-platform virtual world experiences. We created a dynamic liquid-mesh branding system that adapts to light, sound waves, and user cursor movements.\n\nIncludes premium logo drafts, spatial type guidelines, stationary design layouts, and a custom bento-grid presentation showcase.",
    categoryId: "cat-7",
    category: MOCK_CATEGORIES[6],
    thumbnail: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=800",
    media: [
      { id: "m7-1", url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800", type: "IMAGE" },
      { id: "m7-2", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", type: "IMAGE" }
    ],
    projectType: "BRANDING",
    websiteLink: "https://metamorph.concept",
    sourceCodeLink: null,
    pricing: "$18,000 USD",
    featured: false,
    published: true,
    tags: [
      { id: "t7-1", name: "Mesh Gradients" },
      { id: "t7-2", name: "Brand Identity" },
      { id: "t7-3", name: "Motion Kit" }
    ],
    createdAt: "2026-05-10T11:20:00.000Z",
    updatedAt: "2026-05-10T11:20:00.000Z"
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Elena Rostova",
    role: "VP of Product, NovaMind AI",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content: "The AetherAI team is outstanding. They delivered our product website ahead of schedule with premium interactive scroll animations that blew our investors away. Awwwards-level work!"
  },
  {
    id: "test-2",
    name: "Marcus Vance",
    role: "Creative Director, Sora Studios",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "Our engagement rates exploded on Instagram and TikTok after using their AI reels and UGC hooks. The video previews on the portfolio cards are exactly the kind of polish we needed."
  },
  {
    id: "test-3",
    name: "Akihiro Tanaka",
    role: "Founder, Aura Smart Ring",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    content: "Incredible attention to detail, premium aesthetics, and complete type-safety. Their custom CMS and admin dashboard makes updating our asset showcase effortless."
  }
];

export const MOCK_STATS = [
  { value: 45, suffix: "+", label: "Active Brands" },
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 99, suffix: ".9%", label: "Client Satisfaction" },
  { value: 12, suffix: "M+", label: "Reels Impressions" }
];

export const MOCK_PRICING = [
  {
    id: "price-1",
    name: "Single Creative Asset",
    price: "$4,500",
    period: "Per Project",
    description: "Perfect for standalone premium assets like a custom logo, reels package, or UGC video set.",
    features: [
      "Custom brand research & discovery",
      "Full Figma source templates",
      "3 high-fidelity concept reviews",
      "Include 4K rendering files",
      "Commercial usage license included",
      "30-day post-delivery updates"
    ],
    popular: false,
    cta: "Start Asset Project"
  },
  {
    id: "price-2",
    name: "AI Web Design & Setup",
    price: "$12,000",
    period: "Per Project",
    description: "A high-performance interactive website matching the highest modern Awwwards standards.",
    features: [
      "5 detailed interactive pages",
      "Tailwind, Framer Motion animations",
      "Prisma DB / Next.js Server actions backend",
      "Optimized for SEO & Core Web Vitals (90+)",
      "Dynamic Admin Showcase dashboard",
      "14 days of dedicated launch support"
    ],
    popular: true,
    cta: "Build My Website"
  },
  {
    id: "price-3",
    name: "Full Studio Retainer",
    price: "$7,500",
    period: "Per Month",
    description: "Dedicated full-stack design and development support to continuously iterate your product assets.",
    features: [
      "Up to 4 dev-sprints per month",
      "Ongoing AI Reels / UGC generation",
      "Unlimited quick revisions",
      "Dedicated Slack & Discord channel",
      "Priority roadmap scheduling",
      "Cancel or pause anytime"
    ],
    popular: false,
    cta: "Subscribe to Retainer"
  }
];
