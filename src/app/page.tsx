'use client';
import { useEventListener } from 'usehooks-ts';
import PreLoader from "@/components/Others/PreLoader";
import { useState, useEffect } from "react";
import { Hero } from '@/components/Hero';

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
      <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero/>
        </div>
      </main>
    </>
  );
}
