import { HeroSection } from "@/src/components/HeroSection";

const Welcome = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Hero Section */}
        <HeroSection />
        {/* list all the events with possibility to filter and join */}
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 text-white">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default Welcome;
