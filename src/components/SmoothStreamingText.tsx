"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SmoothStreamingTextProps {
  content: string
  onComplete?: () => void
  speed?: number
}

const SmoothStreamingText = ({ content, onComplete, speed = 8 }: SmoothStreamingTextProps) => {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        // Stream 2-3 characters at once for smoother display
        const charsToAdd = Math.min(2, content.length - currentIndex)
        setDisplayedContent(content.slice(0, currentIndex + charsToAdd))
        setCurrentIndex(currentIndex + charsToAdd)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, content, speed, onComplete])

  useEffect(() => {
    setDisplayedContent("")
    setCurrentIndex(0)
  }, [content])

  return (
    <div className="relative">
      {/* Stream as plain text first to avoid shaking */}
      <div className="whitespace-pre-wrap text-white/90 font-mono text-sm leading-relaxed">
        {displayedContent}
        {currentIndex < content.length && (
          <motion.span
            className="inline-block w-0.5 h-4 bg-white/80 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>
    </div>
  )
}

export default SmoothStreamingText
