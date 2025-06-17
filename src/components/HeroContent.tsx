"use client"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Download } from "lucide-react"
import SearchBar from "./SearchBar"
import MarkdownRenderer from "./MarkdownRenderer"
import ThinkingIndicator from "./ThinkingIndicator"
import StreamingText from "./StreamingText"
import { downloadAsPDF } from "../utils/pdfDownload"

const StarsCanvas = dynamic(() => import("./Others/StarBackground"), { ssr: false, loading: () => null })

const HeroContent = () => {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasContent, setHasContent] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingComplete, setStreamingComplete] = useState(false)

  const handleNotesGenerated = (generatedNotes: string) => {
    if (generatedNotes && typeof generatedNotes === "string" && generatedNotes.trim()) {
      setNotes(generatedNotes)
      setHasContent(true)
      setIsStreaming(true)
      setStreamingComplete(false)
    }
  }

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading)
    if (!isLoading) {
      // Small delay before starting to stream
      setTimeout(() => {
        setIsStreaming(true)
      }, 500)
    }
  }

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage)
    setLoading(false)
    setIsStreaming(false)
  }

  const handleStreamingComplete = () => {
    setIsStreaming(false)
    setStreamingComplete(true)
  }

  const handleDownloadPDF = () => {
    if (notes) {
      // Convert markdown to HTML for PDF
      const marked = require("marked")
      const htmlContent = marked.parse(notes)
      downloadAsPDF(htmlContent, "larva-ai-study-notes")
    }
  }

  return (
    <motion.section
      className="z-10 flex min-h-[100vh] w-full justify-center"
      id="home"
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 z-30 opacity-80">
        <StarsCanvas />
      </div>

      <div className="flex flex-col items-center w-full max-w-6xl px-4 pt-10 sm:pt-20">
        {/* Title - moves up when content appears */}
        <motion.div
          className="flex flex-col items-center justify-center mb-8"
          animate={{
            y: hasContent ? -20 : 0,
            scale: hasContent ? 0.8 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="mb-8 text-center text-[28px] font-bold leading-[0.9em] tracking-tighter text-[#e4ded7] sm:text-[45px] md:text-[60px] lg:text-[80px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span
              style={{
                WebkitTextStroke: "2px white",
                color: "transparent",
                letterSpacing: "0.01em",
              }}
            >
              Larva AI
            </span>{" "}
            - Here to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-[#e4ded7]">assist</span>{" "}
            you!
          </motion.h1>
        </motion.div>

        {/* Search Bar - stays fixed */}
        <div className="w-full max-w-4xl mb-8 z-40">
          <SearchBar
            onNotesGenerated={handleNotesGenerated}
            onLoading={handleLoading}
            onError={handleError}
            loading={loading}
            error={error}
          />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl space-y-6 z-40">
          {/* Thinking Indicator */}
          <AnimatePresence>{loading && <ThinkingIndicator />}</AnimatePresence>

          {/* Generated Content */}
          <AnimatePresence>
            {hasContent && notes && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header with download button */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Generated Study Notes
                  </h2>
                  {streamingComplete && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Download size={16} />
                      Download PDF
                    </motion.button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {isStreaming ? (
                    <div className="text-white/90">
                      <StreamingText content={notes} onComplete={handleStreamingComplete} speed={20} />
                    </div>
                  ) : (
                    <MarkdownRenderer content={notes} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer for bottom */}
        <div className="h-20" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[900px] bg-gradient-to-t from-black/90 to-transparent -z-20" />
    </motion.section>
  )
}

export default HeroContent
