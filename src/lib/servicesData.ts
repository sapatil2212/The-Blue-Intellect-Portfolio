export interface ServiceItem {
  slug: string;
  title: string;
  category: string;
  desc: string;
  subdesc: string;
  accentColor: string;
  bullets: string[];
  stats: { label: string; value: string }[];
  challenge: string;
  solution: string;
  outcomes: string;
  bgGradient: string;
  imagePath?: string;
}

export const servicesData: ServiceItem[] = [
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    category: "Design & Dev",
    desc: "User-centric interactive interfaces.",
    subdesc: "We design intuitive user experiences and gorgeous, conversion-focused user interfaces built on deep research.",
    accentColor: "#3b82f6",
    bullets: ["User Research", "Wireframing & Prototyping", "Interactive Design Systems", "Usability Testing"],
    stats: [
      { label: "User Retention", value: "+85%" },
      { label: "Conversion Rate", value: "+40%" }
    ],
    challenge: "Traditional designs lack user-centric flows, leading to high bounce rates and poor conversion paths.",
    solution: "We implement rigorous user persona research, build high-fidelity interactive wireframes, and establish scalable design tokens that map to our clients' core offerings.",
    outcomes: "Seamless cross-device experiences that engage modern users, reduce friction, and boost organic conversions.",
    bgGradient: "from-blue-500/20 via-blue-950/10 to-transparent",
    imagePath: "/images/services/ui_ux_design.png"
  },
  {
    slug: "web-development",
    title: "Custom Web Development",
    category: "Design & Dev",
    desc: "Scalable, high-performance web products.",
    subdesc: "Fast, accessible, and enterprise-grade websites and web applications customized to scale with your brand.",
    accentColor: "#8b5cf6",
    bullets: ["Next.js & React Architectures", "Prisma & PostgreSQL Databases", "Responsive Styling", "SEO-First Codebases"],
    stats: [
      { label: "Page Load Speed", value: "<1.2s" },
      { label: "Core Web Vitals", value: "99/100" }
    ],
    challenge: "Legacy platforms suffer from slow loads, scaling bottlenecks, and outdated technology stacks.",
    solution: "We build fully responsive, state-of-the-art Next.js web applications, utilizing dynamic database optimization and static generation for lightning-fast speeds.",
    outcomes: "Highly secure, hyper-performing platforms that capture organic traffic and load instantaneously.",
    bgGradient: "from-purple-500/20 via-purple-950/10 to-transparent",
    imagePath: "/images/services/web_development.png"
  },
  {
    slug: "graphic-design",
    title: "Graphic Designing",
    category: "Design & Dev",
    desc: "Visual branding and logo designs.",
    subdesc: "Compelling corporate identity, logo systems, and visual guidelines that clearly communicate your brand identity.",
    accentColor: "#ec4899",
    bullets: ["Logo & Visual Systems", "Marketing Collaterals", "Social Media Creatives", "Corporate Guidelines"],
    stats: [
      { label: "Brand Recognition", value: "+120%" },
      { label: "Client NPS Score", value: "9.8/10" }
    ],
    challenge: "Inconsistent graphics and visual noise dilute brand trust and lead to poor market positioning.",
    solution: "We craft consistent, modern brand guidelines, clean vector assets, and bespoke digital illustrations tailored for multi-channel campaigns.",
    outcomes: "A premium, memorable, and unified identity that commands attention and establishes long-term customer trust.",
    bgGradient: "from-pink-500/20 via-pink-950/10 to-transparent",
    imagePath: "/images/services/graphic_design.png"
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Growth & Marketing",
    desc: "Performance marketing and SEO campaigns.",
    subdesc: "Drive targeted lead generation, search engine domination, and social media reach through ROI-backed digital campaigns.",
    accentColor: "#10b981",
    bullets: ["Search Engine Optimization (SEO)", "Social Media Marketing (SMM)", "Paid Performance Campaigns", "Content Strategy"],
    stats: [
      { label: "Organic Traffic", value: "+310%" },
      { label: "Cost-Per-Lead (CPL)", value: "-45%" }
    ],
    challenge: "Wasted ad spend on untargeted audiences and zero visibility on search result pages.",
    solution: "We execute exhaustive keyword mapping, optimize on-page/off-page SEO structures, and construct dynamic custom sales funnels that maximize ad conversions.",
    outcomes: "Top organic rankings, decreased cost-per-lead, and massive increases in highly qualified commercial traffic.",
    bgGradient: "from-emerald-500/20 via-emerald-950/10 to-transparent",
    imagePath: "/images/services/digital_marketing.png"
  },
  {
    slug: "email-marketing",
    title: "Email Marketing Services",
    category: "Growth & Marketing",
    desc: "Automated drip campaigns and funnels.",
    subdesc: "Nurture, engage, and retain your audience using automated drip sequences and high-converting commercial email campaigns.",
    accentColor: "#f59e0b",
    bullets: ["Drip Campaign Automation", "Audience Segmentation", "Responsive Newsletter Templates", "Analytics Tracking"],
    stats: [
      { label: "Email Open Rate", value: "32.4%" },
      { label: "Campaign ROI", value: "42:1" }
    ],
    challenge: "Low subscriber engagement, poor list health, and generic spam-like blasts that damage domain reputation.",
    solution: "We establish hyper-targeted audience segments, design custom responsive templates, and create multi-stage automated flows triggered by user actions.",
    outcomes: "Consistent brand touchpoints, maximized customer lifetime value, and immediate, direct revenue generation from email lists.",
    bgGradient: "from-amber-500/20 via-amber-950/10 to-transparent",
    imagePath: "/images/services/email_marketing.png"
  },
  {
    slug: "strategy-consulting",
    title: "Strategy & Consulting",
    category: "Growth & Marketing",
    desc: "Operation audits and growth roadmaps.",
    subdesc: "Transform your business operations and digital reach through expert transformation roadmaps and competitive analysis.",
    accentColor: "#06b6d4",
    bullets: ["Brand Growth Strategy", "Digital Transformation", "Marketing Funnel Auditing", "Competitor Research"],
    stats: [
      { label: "Market Growth Rate", value: "+60%" },
      { label: "Operational Savings", value: "30%" }
    ],
    challenge: "Businesses suffer from directionless digital spend, lack of cohesive roadmap, and disruption by competitors.",
    solution: "We conduct detailed market audits, map precise user journeys, and construct actionable growth roadmaps that detail timelines and budgets.",
    outcomes: "Complete clarity in digital investments, synchronized marketing channels, and bulletproof strategic advantages.",
    bgGradient: "from-cyan-500/20 via-cyan-950/10 to-transparent",
    imagePath: "/images/services/strategy_consulting.png"
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    category: "Analytics & Cloud",
    desc: "Turn data into business intelligence.",
    subdesc: "Construct high-fidelity interactive dashboards and run predictive analytics to drive faster decision-making.",
    accentColor: "#3b82f6",
    bullets: ["Interactive BI Dashboards", "Predictive Trend Analysis", "Customer Behavior Models", "Database Auditing"],
    stats: [
      { label: "Reporting Speed", value: "10x Fast" },
      { label: "Decision Efficiency", value: "94%" }
    ],
    challenge: "Siloed, complex databases and unorganized tracking metrics hide valuable customer buying patterns.",
    solution: "We build unified, easy-to-read business dashboards, set up pixel-perfect behavioral tracking, and construct predictive ML models to map sales trajectories.",
    outcomes: "Real-time visibility into company health, clear customer segmentation, and predictive business insights.",
    bgGradient: "from-blue-500/20 via-blue-950/10 to-transparent",
    imagePath: "/images/services/data_analytics.png"
  },
  {
    slug: "google-cloud",
    title: "Google Cloud Services",
    category: "Analytics & Cloud",
    desc: "Cloud migration and server scaling.",
    subdesc: "Accelerate your digital speed and agility with end-to-end cloud migrations and managed infrastructure on GCP.",
    accentColor: "#34a853",
    bullets: ["End-to-End Migration", "Kubernetes & Compute Engine", "Serverless Architecture", "GCP BigQuery Data Pipelines"],
    stats: [
      { label: "Server Uptime", value: "99.99%" },
      { label: "Infrastructure Cost", value: "-35%" }
    ],
    challenge: "Unstable servers, vulnerable local storage, and heavy operational costs of legacy network infrastructure.",
    solution: "We move workloads to Google Cloud Platform, set up auto-scaling serverless containers, and lock down ports with advanced Cloud IAM/SSL policies.",
    outcomes: "Infinite scalability, solid data protection, and massive reductions in recurring physical server costs.",
    bgGradient: "from-green-500/20 via-green-950/10 to-transparent",
    imagePath: "/images/services/google_cloud.png"
  },
  {
    slug: "domain-hosting",
    title: "Domain & Hosting",
    category: "Analytics & Cloud",
    desc: "Secure domain names and VPS servers.",
    subdesc: "Ultra-reliable, lightning-fast domain registry and cloud-based web servers tailored for small to enterprise businesses.",
    accentColor: "#6366f1",
    bullets: ["Top-Level Domain Registry", "Managed Cloud VPS Hosting", "Enterprise DNS Settings", "SSL Certificates & Security"],
    stats: [
      { label: "DNS Resolve Speed", value: "8ms" },
      { label: "Server Load Capacity", value: "20x Load" }
    ],
    challenge: "Frequent website downtime, slow server response times, and DNS routing errors that frustrate visitors.",
    solution: "We supply lightning-fast, redundant cloud servers, optimize globally distributed CDNs, and handle secure hosting infrastructure management.",
    outcomes: "Rock-solid site stability, bulletproof domain security, and blazing-fast loading speeds worldwide.",
    bgGradient: "from-indigo-500/20 via-indigo-950/10 to-transparent",
    imagePath: "/images/services/domain_hosting.png"
  },
  {
    slug: "tata-tele-services",
    title: "Tata Tele Business Services",
    category: "Business Communications",
    desc: "Official enterprise telecom solutions.",
    subdesc: "Trusted, enterprise-grade connectivity leased lines, VoIP trunks, and IoT networks backed by India's most secure telecom infrastructure.",
    accentColor: "#0284c7",
    bullets: ["High-Speed Leased Line Internet", "PRI & SIP VoIP Trunking", "Enterprise Cloud Telephony", "IoT Fleet & Asset Solutions"],
    stats: [
      { label: "Internet SLA", value: "99.5%" },
      { label: "Call Quality SLA", value: "100%" }
    ],
    challenge: "Unstable internet connections and dropped customer calls resulting in massive losses in operational trust.",
    solution: "As a certified partner of Tata Tele Business Services, we install dedicated high-speed leased fiber lines and deploy secure cloud-routed SIP trunks.",
    outcomes: "Enterprise-grade connectivity, crystal-clear voice clarity, and uninterrupted communication networks.",
    bgGradient: "from-sky-500/20 via-sky-950/10 to-transparent",
    imagePath: "/images/services/tata_tele_services.png"
  },
  {
    slug: "whatsapp-sms-services",
    title: "WhatsApp & SMS Services",
    category: "Business Communications",
    desc: "API integration and automated alerts.",
    subdesc: "Engage, notify, and convert audiences instantly through transactional APIs and Bulk SMS campaigns.",
    accentColor: "#22c55e",
    bullets: ["Official WhatsApp Business API", "Transactional & Alert SMS", "Automated Chatbot Workflows", "Delivery Verification Reports"],
    stats: [
      { label: "Message Open Rate", value: "98.2%" },
      { label: "Audience Engagement", value: "5x Up" }
    ],
    challenge: "Traditional customer emails are ignored, leading to massive friction in two-factor codes and package delivery alerts.",
    solution: "We integrate direct WhatsApp Business APIs, implement bulk SMS systems, and configure automated, smart chatbot trigger sequences.",
    outcomes: "Instant customer contact, highly verified action rates, and complete automation of customer replies.",
    bgGradient: "from-green-500/20 via-green-950/10 to-transparent",
    imagePath: "/images/services/whatsapp_sms_services.png"
  },
  {
    slug: "ivr-services",
    title: "IVR Services",
    category: "Business Communications",
    desc: "24/7 automated business routing.",
    subdesc: "Deliver a seamless customer experience with customizable multi-level interactive call routing and recording solutions.",
    accentColor: "#a855f7",
    bullets: ["Multi-level Interactive Menus", "Smart Inbound Call Routing", "Agent Performance Tracking", "Custom Greeting Audios"],
    stats: [
      { label: "Call Picked Rate", value: "100%" },
      { label: "Inbound Wait Time", value: "-60%" }
    ],
    challenge: "Overloaded phone lines, missed customer requests, and highly inefficient transfer routines that upset callers.",
    solution: "We build advanced, multi-level Interactive Voice Response (IVR) systems on scalable cloud telephone structures.",
    outcomes: "Complete query routing automation, zero missed calls, and a massive boost in professional corporate identity.",
    bgGradient: "from-purple-500/20 via-purple-950/10 to-transparent",
    imagePath: "/images/services/ivr_services.png"
  }
];
