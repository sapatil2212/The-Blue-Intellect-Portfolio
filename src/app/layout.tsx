import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import FloatingNavbar from "@/components/layout/FloatingNavbar";
import Footer from "@/components/layout/Footer";
import ProjectModal from "@/components/ui/ProjectModal";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Blue Intellect | Creative AI Agency & Digital Showcase Platform",
  description: "Explore The Blue Intellect's premium portfolio of award-winning websites, minimalist logos, viral UGC videos, generative AI art, and high-impact social campaigns.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "The Blue Intellect | Creative AI Agency Portfolio",
    description: "Premium digital portfolio showcase platform for next-gen agency deliverables.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-noise relative" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Soft Background Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] animate-blob" />
            <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-400/10 blur-[130px] animate-blob [animation-delay:_4s]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-400/10 blur-[120px] animate-blob [animation-delay:_8s]" />
          </div>



          <SmoothScroll>
            <FloatingNavbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <ProjectModal />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
