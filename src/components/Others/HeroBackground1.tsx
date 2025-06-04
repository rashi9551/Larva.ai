export const HeroBackground1 = () => {
  return (
    <div className="absolute inset-0 flex flex-col h-full w-full -z-20 opacity-90">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-330px] left-0 w-full h-full object-cover"
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
    </div>
  );
};
