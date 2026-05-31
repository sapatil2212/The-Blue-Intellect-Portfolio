'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ImagePlus, Globe as GlobeIcon, TrendingUp, Sparkles, BarChart3, ScanSearch, MessageCircleHeart, SmilePlus, RefreshCw } from 'lucide-react';

const items = [
  { icon: <ImagePlus className="w-5 h-5" />, title: 'UI/UX Design', desc: 'Crafting experiences that convert.', subdesc: 'We design user-centric interfaces that are both intuitive and impactful, ensuring seamless interaction and maximum engagement.', bullets: ['Creative Design', 'Intuitive UX', 'Prototyping', 'Usability Testing'] },
  { icon: <GlobeIcon className="w-5 h-5" />, title: 'Custom Web Development', desc: 'Building scalable and secure digital platforms.', subdesc: 'Our web solutions are crafted to meet your business goals while ensuring performance, flexibility, and future growth.', bullets: ['Responsive Design', 'Custom Functionality', 'High Performance', 'Enterprise-Level Security'] },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Strategy & Consulting', desc: 'Digital roadmaps that drive results.', subdesc: 'Our consulting services are designed to provide clarity, direction, and measurable outcomes. We help businesses make smart digital decisions to fuel growth.', bullets: ['Brand Strategy', 'Digital Transformation Consulting', 'Marketing Roadmap', 'Competitive Analysis'] },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Graphic Designing', desc: 'Creative visuals that communicate', subdesc: 'We craft compelling visual designs that not only reflect your brand identity but also captivate your audience across digital and print platforms.', bullets: ['Logo & Branding', 'Marketing Collaterals', 'Social Media Creatives', 'Web & App UI Design'] },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Digital Marketing', desc: 'Get noticed, get results.', subdesc: 'We craft performance-driven digital marketing strategies that increase your brand visibility and ROI.', bullets: ['SEO & SEM', 'Social Media Marketing', 'Content Strategy', 'Paid Campaigns'] },
  { icon: <ScanSearch className="w-5 h-5" />, title: 'Data Analytics', desc: 'Transform Data into Business Intelligence', subdesc: 'Unlock the power of your data with our comprehensive Data Analytics services. We help you collect, process, and analyze complex datasets to uncover actionable insights that drive smarter decision-making.', bullets: ['Business Intelligence Dashboards', 'Predictive Analytics', 'Customer Segmentation'] },
  { icon: <GlobeIcon className="w-5 h-5" />, title: 'Domain & Hosting', desc: 'Reliable, Secure, and Scalable Web Infrastructure', subdesc: 'Build your digital presence on a solid foundation. We offer top-tier domain registration and reliable hosting solutions tailored for businesses of all sizes.', bullets: ['Domain Name Registration', 'Shared, VPS & Dedicated Hosting', 'Cloud Hosting Solutions', 'SSL Certificates & Security', 'Email Hosting'] },
  { icon: <GlobeIcon className="w-5 h-5" />, title: 'Google Cloud Services', desc: 'Innovate at Scale with Google Cloud', subdesc: 'Accelerate your digital transformation with our end-to-end Google Cloud services. As your cloud partner, we help you migrate, manage, and optimize workloads on GCP.', bullets: ['Cloud Migration & Deployment', 'Compute Engine & Storage', 'Cloud Functions & App Engine', 'BigQuery & Cloud AI Integration', 'Ongoing Cloud Management'] },
  { icon: <MessageCircleHeart className="w-5 h-5" />, title: 'Tata Tele Business Services', desc: 'Powering Businesses with Tata Teleservices', subdesc: 'As an official partner of Tata Tele Business Services, we bring you trusted, enterprise-grade communication and connectivity solutions backed by India\'s most reliable telecom network.', bullets: ['Leased Line Internet Solutions', 'PRI Lines & SIP Trunking', 'Cloud Telephony', 'IoT Solutions', 'Voice & Data Plans'] },
  { icon: <MessageCircleHeart className="w-5 h-5" />, title: 'WhatsApp & SMS Services', desc: 'Reach Your Customers Instantly', subdesc: 'Enhance your customer communication with our WhatsApp Business API and Bulk SMS solutions. We help you engage, inform, and convert through the most direct channels available today.', bullets: ['WhatsApp Business API Integration', 'Transactional & Promotional SMS', 'Bulk Messaging Campaigns', 'Automated Messaging Bots', 'Delivery Reports'] },
  { icon: <SmilePlus className="w-5 h-5" />, title: 'IVR Services', desc: 'Smart Call Management with IVR Solutions', subdesc: 'Deliver a seamless customer experience with our customizable Interactive Voice Response (IVR) systems. Route calls efficiently, provide self-service options, and ensure 24/7 customer support availability.', bullets: ['Multi-level IVR Systems', 'Call Routing & Forwarding', 'Voice Recording & Analytics', 'Cloud-based IVR Setup', 'Custom Greeting Messages'] },
  { icon: <RefreshCw className="w-5 h-5" />, title: 'Email Marketing Services', desc: 'Drive Conversions with Smart Email Campaigns', subdesc: 'Reach your audience where it matters most – their inbox. Our Email Marketing Services are designed to boost engagement, improve retention, and drive sales.', bullets: ['Email Campaign Design & Management', 'Automated Drip Campaigns', 'Subscriber List Segmentation', 'Performance Tracking & Analytics', 'GDPR & CAN-SPAM Compliance'] },
];

export default function ManageSection() {
  return (
    <section className="py-24 relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
            Strategies that shape <span className="text-accent italic">your business</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            We provide an end-to-end suite of marketing solutions to help you get the most out of your digital presence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group cursor-default flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-display">{item.title}</h3>
              <p className="text-accent text-sm font-medium mb-3">{item.desc}</p>
              <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{item.subdesc}</p>
              <ul className="space-y-2 mb-2 mt-auto">
                {item.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                <Link href="/services" className="text-[13px] font-semibold text-accent flex items-center gap-1.5 hover:text-accent-light transition-colors group-hover:gap-2.5">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact" className="glow-button px-4 py-2 text-[12px] font-semibold rounded-full text-white shadow-lg shadow-accent/20 transition-transform active:scale-95">
                  Book now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
