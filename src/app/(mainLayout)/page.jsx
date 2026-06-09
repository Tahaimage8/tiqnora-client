import Hero from "@/components/hero";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import WhyChoose from "@/components/WhyChoose";
import Image from "next/image";

const Home = () => {
  const stats = {
    totalEvents: 48,
    totalBookings: 1260,
    totalOrganizations: 18,
    platformModules: 6,
  };

  return (
    <section>
      <Hero />
      <WhyChoose />
      <Statistics stats={stats} />
      <Testimonials/>
    </section>
  );
};

export default Home;
