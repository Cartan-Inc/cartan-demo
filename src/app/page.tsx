import Navigation from "@/components/Navigation";
import HeroScene from "@/components/scenes/HeroScene";
import ProblemScene from "@/components/scenes/ProblemScene";
import DigitalTwinScene from "@/components/scenes/DigitalTwinScene";
import SimulationScene from "@/components/scenes/SimulationScene";
import SurgeryScene from "@/components/scenes/SurgeryScene";
import PostOpScene from "@/components/scenes/PostOpScene";
import VisionScene from "@/components/scenes/VisionScene";

export default function Home() {
  return (
    <main>
      {/* FDA Investigational Device Disclaimer */}
      <div className="bg-amber-900/40 border-b border-amber-600/30 px-4 py-2 text-center text-[11px] text-amber-200/80 leading-relaxed z-50 relative">
        <strong>INVESTIGATIONAL DEVICE:</strong> The devices and technology described on this website
        have not been cleared or approved by the FDA. Their safety and effectiveness have not been
        established. Not available for sale.
      </div>
      <Navigation />
      <HeroScene />
      <ProblemScene />
      <DigitalTwinScene />
      <SimulationScene />
      <SurgeryScene />
      <PostOpScene />
      <VisionScene />
    </main>
  );
}
