"use client"
import { motion } from "framer-motion"

const SearchBarThinking = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-lg"
    >
      <motion.div
        className="w-3 h-3 rounded-full bg-blue-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <span className="text-blue-300 text-xs font-medium">Thinking</span>
      <div className="flex">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-blue-300 text-xs"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          >
            .
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default SearchBarThinking
