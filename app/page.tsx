import { HeroSection } from "@/app/_components/HeroSection";
import { EventSection } from "@/app/_components/EventSection";

const Welcome = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Hero Section */}
        <HeroSection />
        {/* Add Suspense boundary around EventSection */}
        <EventSection />
      </div>
    </div>
  );
};

export default Welcome;
