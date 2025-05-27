'use client';
import { motion } from "framer-motion";
import HeroBackground from "./Others/HeroBackground";
import React from "react";
import AnimatedTitle from "./Others/AnimatedTitle";

console.log("HeroBackground is:", HeroBackground);
console.log("AnimatedTitle is:", AnimatedTitle);

const HeroSection = () => {
    return (
        <motion.section
            className="relative z-10 flex h-[100vh] w-full justify-center"
            id="home"
            initial="initial"
            animate="animate"
        >
            <HeroBackground />
            <div className="mt-10 flex flex-col items-center justify-center sm:mt-0">
                <div
                    className={`relative flex flex-col items-center justify-center pointer-events-none`}
                >                 
                    <AnimatedTitle
                        text={"Larva AI - #ProjectHired initiative."}
                        className={
                            "mb-1 text-left text-[40px] font-bold leading-[0.9em] tracking-tighter text-[#e4ded7] sm:text-[45px] md:mb-16 md:text-[60px] lg:text-[80px]"
                        }
                        wordSpace={"mr-[10px]"}
                        charSpace={"mr-[0.001em]"}
                    />                  
                </div>
                
            </div>
        </motion.section>
    );
};

export default HeroSection;
