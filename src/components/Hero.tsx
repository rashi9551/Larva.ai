import HeroContent from "./HeroContent";


export const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full">
      <video
        autoPlay
        muted
        loop
       className="rotate-180 absolute top-0 left-0 w-full h-full object-cover -z-20 transform -translate-y-[52.5vh]"
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
      <HeroContent/>
    </div>
  );
};
