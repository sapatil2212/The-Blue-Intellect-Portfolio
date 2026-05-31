'use client';

import React from 'react';
import { User } from 'lucide-react';

const testimonials = [
  { name: 'Arya Foods', logo: 'Arya_Foods.png', handle: '@arya_foods', text: 'The Blue Intellect built our custom e-commerce solution, allowing us to manage orders seamlessly and increase our online food sales by 150%.' },
  { name: 'Kavyaas Slimming Center', logo: 'Kavyaas_Slimming_Center.png', handle: '@kavyaas_slimming', text: 'Our local SEO search rankings skyrocketed! We went from page three to ranking #1 for weight loss treatments in our region within months.' },
  { name: 'DS Moto', logo: 'DS Moto.png', handle: '@dsmoto_automotive', text: 'Exceptional WhatsApp & Bulk SMS automation campaigns. It helped us reach our auto service clients instantly and increased return customer bookings.' },
  { name: 'Hotel Trident', logo: 'Hotel_Trident.png', handle: '@hotel_trident', text: 'Their custom web development and booking funnel optimization are outstanding. Seamless reservations, crystal clear customer flow, and zero bugs.' },
  { name: 'Key Tech', logo: 'Key_Tech.png', handle: '@keytech_engineering', text: 'We partner with them for our Google Cloud infrastructure migration. The scaling and latency improvements are outstanding, drastically cutting server overhead.' },
  { name: 'Lily Events', logo: 'Lily_Events.png', handle: '@lily_events', text: 'Captivating graphic design and social media ad creatives. The Blue Intellect captured the elegance of our wedding planning firm and doubled our organic inquiries.' },
  { name: 'Jain Bakers', logo: 'Jain_Bakers _logo.png', handle: '@jain_bakers', text: 'Our brand identity was completely transformed by their graphic design team. The logo system and packaging creatives communicate our heritage beautifully.' },
  { name: 'Trade Bharat', logo: 'Trade Bharat.png', handle: '@trade_bharat', text: 'Data-backed strategies and analytics dashboard systems designed by The Blue Intellect gave us complete visibility over user acquisition metrics.' },
];

export default function TestimonialsSection() {
  const track1 = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-white tracking-wide">Our Customers</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">What people are saying</h2>
        <p className="text-muted max-w-2xl mx-auto">
          We are very proud of the service we provide and stand by every product we carry. Read our testimonials from our happy customers.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden">
        {/* Row 1: Right to Left */}
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] group">
          {track1.map((t, i) => (
            <div key={i} className="testimonial-card rounded-2xl p-6 w-[350px] shrink-0 outline-none flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-white p-1 shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={`/images/logo/${t.logo}`}
                    alt={t.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.handle}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max animate-marquee-reverse gap-6 hover:[animation-play-state:paused] group">
          {track1.map((t, i) => (
            <div key={`rev-${i}`} className="testimonial-card rounded-2xl p-6 w-[350px] shrink-0 outline-none flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-white p-1 shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={`/images/logo/${t.logo}`}
                    alt={t.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.handle}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
