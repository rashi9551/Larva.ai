/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEventListener } from 'usehooks-ts';
import HeroSection from "@/components/HeroSection";
import PreLoader from "@/components/Others/PreLoader";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
        });
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEventListener('resize', () => {
        setIsMobile(window.innerWidth < 768);
    });

  return (
    <>
      <PreLoader />
      <main className="flex flex-col items-center justify-center bg-black">
        <HeroSection />
      </main>
    </>
  );
}
