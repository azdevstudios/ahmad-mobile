

import Hero from "@/components/home/Hero";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedPhones from "@/components/home/FeaturedPhones";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AboutPreview from "@/components/home/AboutPreview";
import ContactPreview from "@/components/home/ContactPreview";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      
      <Hero />
      <ServicesPreview />
      <FeaturedPhones />
      <WhyChooseUs />
      <AboutPreview />
      <ContactPreview />
    
    </main>
  );
}
