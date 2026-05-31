'use client';

const clientLogos = [
  { file: '1.png', name: 'Client 1' },
  { file: '2.png', name: 'Client 2' },
  { file: '3.png', name: 'Client 3' },
  { file: '4.png', name: 'Client 4' },
  { file: '5.png', name: 'Client 5' },
  { file: '6.png', name: 'Client 6' },
  { file: '7.png', name: 'Client 7' },
  { file: '8.png', name: 'Client 8' },
  { file: '9.png', name: 'Client 9' },
  { file: '10.png', name: 'Client 10' },
  { file: '11.png', name: 'Client 11' },
  { file: '12.png', name: 'Client 12' },
  { file: '13.png', name: 'Client 13' },
  { file: '14.png', name: 'Client 14' },
  { file: '15.png', name: 'Client 15' },
  { file: '16.png', name: 'Client 16' },
  { file: '17.png', name: 'Client 17' },
  { file: '18.png', name: 'Client 18' },
  { file: '19.png', name: 'Client 19' },
  { file: 'Arya_Foods.png', name: 'Arya Foods' },
  { file: 'Darshan_Jadhav.png', name: 'Darshan Jadhav' },
  { file: 'DS Moto.png', name: 'DS Moto' },
  { file: 'Gaurav Kirana.png', name: 'Gaurav Kirana' },
  { file: 'Hotel_Omkar_Garden.png', name: 'Hotel Omkar Garden' },
  { file: 'Hotel_Trident.png', name: 'Hotel Trident' },
  { file: 'Jain_Bakers _logo.png', name: 'Jain Bakers' },
  { file: 'Jogeshwari_Super_Shopee.png', name: 'Jogeshwari Super Shopee' },
  { file: 'Kavyaas_Slimming_Center.png', name: 'Kavyaas Slimming Center' },
  { file: 'Key_Tech.png', name: 'Key Tech' },
  { file: 'Laser Dental.png', name: 'Laser Dental' },
  { file: 'Lily_Events.png', name: 'Lily Events' },
  { file: 'Logo Final.png', name: 'Client' },
  { file: 'Logo SM 1.png', name: 'Client' },
  { file: 'Logo.png', name: 'Client' },
  { file: 'MA Events.jpg', name: 'MA Events' },
  { file: 'OK_Kirana.png', name: 'OK Kirana' },
  { file: 'Pranika_Arts.png', name: 'Pranika Arts' },
  { file: 'Scenic_Lands.png', name: 'Scenic Lands' },
  { file: 'TE_LOGO_1_1.png', name: 'TE Logo' },
  { file: 'The bright logo 1.png', name: 'The Bright' },
  { file: 'Trade Bharat.png', name: 'Trade Bharat' },
  { file: 'Utkarsh Wani Samaj_HD_Png.png', name: 'Utkarsh Wani Samaj' },
  { file: 'UWPL_Logo_HD_Png.png', name: 'UWPL' },
];

export default function TrustedBySection() {
  const track = [...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="py-12 overflow-hidden relative" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-xs text-muted uppercase tracking-[0.2em] font-display">
          Trusted by growing businesses and established brands
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />

        <div className="animate-marquee flex flex-nowrap items-center gap-4 w-max group-hover:[animation-play-state:paused]">
          {track.map((logo, i) => (
            <div
              key={i}
              className="client-logo-card shrink-0 flex items-center justify-center rounded-xl border"
              style={{
                width: 140,
                height: 72,
                background: 'var(--card-bg)',
                borderColor: 'var(--border)',
              }}
            >
              <img
                src={`/images/logo/${logo.file}`}
                alt={logo.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '6px' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
