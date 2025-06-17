"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface StreamingTextProps {
  content: string
  onComplete?: () => void
  speed?: number
}

const StreamingText = ({ content, onComplete, speed = 30 }: StreamingTextProps) => {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <span>{displayedContent}</span>
      {currentIndex < content.length && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-white/80 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.div>
  )
}

export default StreamingText
