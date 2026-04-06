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
