import HeroContent from "./HeroContent"

export const Hero = () => {
  return (
    <div className="relative w-full min-h-screen">
      <video
        autoPlay
        muted
        playsInline
        controls={false}
        loop
        className="fixed top-0 left-0 w-full h-full object-cover -z-30 rotate-180 transform -translate-y-[52.5vh]"
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
      <HeroContent />
    </div>
  )
}

