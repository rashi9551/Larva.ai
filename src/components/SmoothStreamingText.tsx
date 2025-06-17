"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface SmoothStreamingTextProps {
  content: string
  onComplete?: () => void
  speed?: number
}

const SmoothStreamingText = ({ content, onComplete, speed = 8 }: SmoothStreamingTextProps) => {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const contentEndRef = useRef<HTMLDivElement>(null);

  // Effect for streaming the text content
  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        const charsToAdd = Math.min(2, content.length - currentIndex)
        setDisplayedContent(prev => prev + content.slice(currentIndex, currentIndex + charsToAdd))
        setCurrentIndex(prev => prev + charsToAdd)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onComplete()
    }
  }, [currentIndex, content, speed, onComplete])

  // Effect for scrolling to the bottom when content changes
  useEffect(() => {
    if (contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedContent]); // <-- Dependency is now the displayed content

  // Effect for resetting when the source content prop changes
  useEffect(() => {
    setDisplayedContent("")
    setCurrentIndex(0)
  }, [content])

  return (
    // Make sure the parent container is the one that scrolls
    <div className="relative whitespace-pre-wrap text-white/90 font-mono text-sm leading-relaxed">
      {displayedContent}
      {currentIndex < content.length && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-white/80 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
      {/* This ref is now an invisible anchor at the very end */}
      <div ref={contentEndRef} />
    </div>
  )
}

export default SmoothStreamingText