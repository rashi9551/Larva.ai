"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MarkdownRenderer from "./MarkdownRenderer"

interface StreamingMarkdownProps {
  content: string
  onComplete?: () => void
  speed?: number
}

const StreamingMarkdown = ({ content, onComplete, speed = 5 }: StreamingMarkdownProps) => {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        // Stream multiple characters at once for faster display
        const charsToAdd = Math.min(3, content.length - currentIndex)
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <MarkdownRenderer content={displayedContent} />
      {currentIndex < content.length && (
        <motion.div
          className="inline-block w-0.5 h-5 bg-white/80 ml-1 mt-2"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.div>
  )
}

export default StreamingMarkdown
