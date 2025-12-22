import Experience from "@/components/scene/Experience";
import Interface from "@/components/ui/Interface";

export default function Home() {
  return (
    <main className="w-full h-screen relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Experience />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Interface />
      </div>
    </main>
  );
}
