"use client"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Download } from "lucide-react"
import SearchBar from "./SearchBar"
import MarkdownRenderer from "./MarkdownRenderer"
import ThinkingIndicator from "./ThinkingIndicator"
import SmoothStreamingText from "./SmoothStreamingText"
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
      // Start streaming after a small delay
      setTimeout(() => {
        setIsStreaming(true)
        setStreamingComplete(false)
      }, 300)
    }
  }

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading)
    if (isLoading) {
      // Reset states when starting new request
      setHasContent(false)
      setIsStreaming(false)
      setStreamingComplete(false)
      setNotes("")
    }
  }

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage)
    setLoading(false)
    setIsStreaming(false)
    setStreamingComplete(false)
  }

  const handleStreamingComplete = () => {
    setIsStreaming(false)
    setStreamingComplete(true)
  }

  const handleDownloadPDF = () => {
    if (notes) {
      // Use the original notes content for PDF with proper formatting
      downloadAsPDF(notes, "larva-ai-study-notes")
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 z-30 opacity-80">
          <StarsCanvas />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[900px] bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pt-10 sm:pt-20 pb-32">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-[#e4ded7]">
                assist
              </span>{" "}
              you!
            </motion.h1>
          </motion.div>

          {/* Content Area */}
          <div className="w-full max-w-4xl space-y-6">
            {/* Thinking Indicator - Shows when loading */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThinkingIndicator />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Content */}
            <AnimatePresence mode="wait">
              {hasContent && notes && (
                <motion.div
                  key="content"
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
                      <SmoothStreamingText content={notes} onComplete={handleStreamingComplete} speed={5} />
                    ) : (
                      <MarkdownRenderer content={notes} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky Search Bar at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-6">
          <div className="w-full max-w-4xl mx-auto px-4">
            <SearchBar
              onNotesGenerated={handleNotesGenerated}
              onLoading={handleLoading}
              onError={handleError}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroContent
