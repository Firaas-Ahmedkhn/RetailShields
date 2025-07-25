import React from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, type: "spring" },
  }),
};

const ComingSoon = () => {
  const words = ["Coming", "Soon", "Stay", "Tuned!"];

  return (
    <div className="h-screen w-full bg-white  flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
      <div className="text-center">
        {words.map((word, i) => (
          <motion.h1
            key={i}
            custom={i}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl font-bold tracking-wide"
          >
            {word}
          </motion.h1>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: words.length * 0.3 + 0.5, duration: 0.8 }}
        className="mt-6 text-gray-300 text-lg"
      >
        We’re building something amazing for you!
      </motion.p>
    </div>
  );
};

export default ComingSoon;
