// import Image from "next/image";

import HeroSection from "@/components/HeroSection";
import PreLoader from "@/components/Others/PreLoader";

export default function Home() {
  return (
    <>
      <PreLoader />
      <main className="flex flex-col items-center justify-center bg-black">
        <HeroSection />
      </main>
    </>
  );
}
