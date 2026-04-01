import Gatekeeper from "@/components/Entrance/Gatekeeper";
import BackgroundLayer from "@/components/Layout/BackgroundLayer";
import Hero from "@/components/Sections/Hero";
import Story from "@/components/Sections/Story";
import Timeline from "@/components/Sections/Timeline";
import Venue from "@/components/Sections/Venue";
import BridalTeam from "@/components/Sections/BridalTeam";
import AudioPlayer from "@/components/Layout/AudioPlayer";
import FloatingRSVP from "@/components/RSVP/FloatingRSVP";
import Guestbook from "@/components/Sections/Guestbook";
import Gallery from "@/components/Sections/Gallery";
import Gifting from "@/components/Sections/Gifting";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent text-gray-900 overflow-x-hidden selection:bg-primary/30">
      <BackgroundLayer />
      <AudioPlayer />
      <FloatingRSVP />

      <Gatekeeper>
        <div className="relative z-10 w-full">
          <Hero />
          <Story />
          <Timeline />
          <Venue />
          <Gallery />
          <Gifting />
          <Guestbook />
          <BridalTeam />

          <div className="h-[20vh] flex items-center justify-center text-primary/50 font-serif">
            See you there.
          </div>
        </div>
      </Gatekeeper>
    </main>
  );
}