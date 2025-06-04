"use client";
import dynamic from "next/dynamic"
import { motion } from "framer-motion";
import React from "react";
import SearchBar from "./SearchBar";
const StarsCanvas = dynamic(() => import("./Others/StarBackground"), { ssr: false, loading: () => null })


const HeroContent = () => {
  return (
    <motion.section
      className="z-10 flex h-[100vh] w-full justify-center "
      id="home"
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 z-0 opacity-80">
        <StarsCanvas />
      </div>
      <div className="mt-10 flex flex-col items-center justify-center sm:mt-0">
        <div className={`relative flex flex-col items-center justify-center`}>
          <motion.h1
             className="mb-12 text-left text-[28px] font-bold leading-[0.9em] tracking-tighter text-[#e4ded7] sm:text-[45px] md:mb-16 md:text-[60px] lg:text-[80px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span
              style={{
                WebkitTextStroke: "2px white",
                color: "transparent",
                letterSpacing: "0.01em",
              }}
            >
              Larva AI
            </span>{" "}
            - Here to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-[#e4ded7]">
              assist
            </span>{" "}
            you!
          </motion.h1>

          <SearchBar />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black/90 to-transparent z-20" />
    </motion.section>
  );
};

export default HeroContent;
