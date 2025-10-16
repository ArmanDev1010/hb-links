import { useState, useEffect } from "react";

const services = [
  "Low Voltage",
  "Security Systems",
  "Networking",
  "CCTV",
  "AV Integration",
  "Smart Home",
  "Access Control",
  "Audio/Video",
];

const LoadingScreen = ({ onFinish }) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [counter, setCounter] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Service text animation
    const serviceInterval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 500);

    // Counter animation
    const counterInterval = setInterval(() => {
      setCounter((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(counterInterval);
          clearInterval(serviceInterval);
          // Trigger reveal after a short delay
          setTimeout(() => {
            setIsRevealed(true);
            setTimeout(() => {
              onFinish();
            }, 1200);
          }, 500);
          return prev;
        }
      });
    }, 35);

    return () => {
      clearInterval(serviceInterval);
      clearInterval(counterInterval);
    };
  }, []);

  return (
    <div
      className={`absolute pointer-events-none top-0 left-0 w-full h-full bg-third z-[1000] transition-transform duration-1200 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isRevealed ? "translate-y-[-100%]" : ""
      }`}
    >
      {/* Services Text Animation - Top Left */}
      <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10]">
        <div className="relative overflow-hidden">
          <div className="invisible text-center text-[5vw] font-bold uppercase tracking-[2px] whitespace-nowrap">
            {services.reduce((a, b) => (a.length > b.length ? a : b))}
          </div>

          {services.map((service, index) => (
            <div
              key={service}
              className={`absolute text-center top-0 left-1/2 -translate-x-1/2 text-[5vw] font-bold uppercase text-white tracking-[2px] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] whitespace-nowrap`}
              style={{
                transform: `translateY(${
                  (index - currentServiceIndex) * 100
                }%)`,
              }}
            >
              {service}
            </div>
          ))}
        </div>
      </div>

      {/* Counter - Bottom Right */}
      <div className="absolute bottom-[40px] right-[40px] z-[10] max-768:bottom-[20px] max-768:right-[20px]">
        <div className="text-[4rem] font-bold text-white tracking-[3px] max-768:text-[3rem]">
          {counter.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
