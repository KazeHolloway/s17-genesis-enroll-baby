import { Hero } from "@/components/landing/Hero";
import { WhyChoose } from "@/components/landing/WhyChoose";
import { JourneySection } from "@/components/landing/JourneySection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AccessibilitySection } from "@/components/landing/AccessibilitySection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { ScrollProgress } from "@/components/landing/ui/ScrollProgress";

/**
 * Single-page premium landing: every section is reachable through the navbar
 * anchors. `landing-root` carries the Velora tokens and utility classes scoped
 * from the design source; the header and footer are rendered here so that
 * /login and /signup keep their own layouts.
 */
export default function LandingPage() {
  return (
    <div className="landing-root flex min-h-screen flex-col bg-[#fbfcfa] text-[#1b332d] antialiased selection:bg-[#c2ded3] selection:text-[#0d2a23]">
      <ScrollProgress />
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <WhyChoose />
        <JourneySection />
        <SecuritySection />
        <TestimonialsSection />
        <AccessibilitySection />
        <FAQSection />
        <FinalCTA />
      </main>

      <SiteFooter />
    </div>
  );
}
