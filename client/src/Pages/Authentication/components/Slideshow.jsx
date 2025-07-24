import React, { useRef } from "react";
import gsap from "gsap";
import pic1 from "../../../assets/pic1.png";

const SlideshowWithText = () => {
  const defendRef = useRef(null);
  const fortifyRef = useRef(null);
  const secureRef = useRef(null);
  const protectRef = useRef(null);
  const rightSideRef = useRef(null);

  const handleHover = (ref) => {
    gsap.to(rightSideRef.current.children, {
      filter: "blur(3px)",
      opacity: 0.4,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(ref.current, {
      filter: "blur(0px)",
      opacity: 1,
      color: "#111",
      scale: 1.1,
      zIndex: 10,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = (ref) => {
    gsap.to(rightSideRef.current.children, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut",
    });

    gsap.to(ref.current, {
      color: "#757575",
      scale: 1,
      zIndex: 1,
      duration: 0.3,
      ease: "power2.inOut",
    });
  };

  return (
    <div className="w-full md:w-1/2 bg-[#f0f0f0] hidden  relative md:flex flex-col items-center justify-center p-10 overflow-hidden">
      {/* Top Heading (always visible) */}
      <h1 className="text-4xl font-bold mb-3 text-center">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Retail Shield
        </span>
      </h1>

      {/* Extra Mobile Text */}
      <p className="text-gray-600 text-base mt-1 block md:hidden text-center">
        Empowering your store’s digital defenses.
      </p>

      {/* Right Side (hidden on mobile) */}
      <div
        ref={rightSideRef}
        className="relative w-full h-full items-center justify-center hidden md:flex"
      >
        <img
          src={pic1}
          alt="Cybersecurity"
          className="w-[90%] max-w-[600px] h-auto z-3 relative object-contain"
        />

        {/* DEFEND */}
        <span
          ref={defendRef}
          onMouseEnter={() => handleHover(defendRef)}
          onMouseLeave={() => handleLeave(defendRef)}
          className="absolute top-30 left-2 text-5xl font-bold text-gray-600 tracking-tight uppercase transition-all duration-300"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          DEFEND.
        </span>

        {/* FORTIFY */}
        <span
          ref={fortifyRef}
          onMouseEnter={() => handleHover(fortifyRef)}
          onMouseLeave={() => handleLeave(fortifyRef)}
          className="absolute top-30 right-2 text-5xl font-bold text-gray-600 tracking-tight uppercase transition-all duration-300"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          FORTIFY.
        </span>

        {/* SECURE */}
        <span
          ref={secureRef}
          onMouseEnter={() => handleHover(secureRef)}
          onMouseLeave={() => handleLeave(secureRef)}
          className="absolute bottom-30 left-2 text-6xl font-bold text-gray-600 tracking-tight uppercase transition-all duration-300"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          SECURE.
        </span>

        {/* PROTECT */}
        <span
          ref={protectRef}
          onMouseEnter={() => handleHover(protectRef)}
          onMouseLeave={() => handleLeave(protectRef)}
          className="absolute bottom-30 right-2 text-5xl font-bold text-gray-600 tracking-tight uppercase transition-all duration-300"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          PROTECT.
        </span>
      </div>
    </div>
  );
};

export default SlideshowWithText;
