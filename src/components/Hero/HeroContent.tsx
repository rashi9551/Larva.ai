"use client"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Download, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import SearchBar from "../SearchBar"
import MarkdownRenderer from "../MarkdownRenderer"
import ThinkingIndicator from "../ThinkingIndicator"
import SmoothStreamingText from "../SmoothStreamingText"
import { downloadAsPDF } from "../../utils/pdfDownload"
import createClientForBrowser from "@/utils/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Profile from "../../components/Profile"
import { toast } from 'sonner';

const StarsCanvas = dynamic(() => import("../Others/StarBackground"), { ssr: false, loading: () => null })

const HeroContent = () => {
  const supabase = createClientForBrowser()
  const router = useRouter()

  // Auth states
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // App states
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasContent, setHasContent] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingComplete, setStreamingComplete] = useState(false)
  const [wasStopped, setWasStopped] = useState(false)

  // Disable input when loading or streaming
  const isDisabled = loading || isStreaming

  useEffect(() => {
    async function getSupabaseUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          toast.error('Session expired, please login again');
          router.push("/signup")
          return
        }

        if (!user) {
          // No user found, redirect to signup
          router.push("/signup")
          return
        }

        setUser(user)
        console.log("User authenticated:", user)
      } catch (err) {
        console.error("Unexpected error:", err)
        router.push("/signup")
      } finally {
        setAuthLoading(false)
      }
    }

    getSupabaseUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/signup")
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/signup")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleNotesGenerated = (generatedNotes: string) => {
    if (generatedNotes && typeof generatedNotes === "string" && generatedNotes.trim()) {
      setNotes(generatedNotes)
      setHasContent(true)
      setWasStopped(false)
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
      setWasStopped(false)
      setError(null)
    }
  }

  const handleError = (errorMessage: string | null) => {
    // NO ERROR MESSAGES - just handle states
    setLoading(false)
    setIsStreaming(false)
    if (!wasStopped) {
      setStreamingComplete(false)
    }
  }

  const handleStop = () => {
    setLoading(false)
    setIsStreaming(false)
    setWasStopped(true)
    setError(null) // Clear everything

    // ALWAYS show partial content if we have any
    if (notes && notes.trim()) {
      setHasContent(true)
      setStreamingComplete(true)
    }
  }

  const handleStreamingComplete = () => {
    setIsStreaming(false)
    setStreamingComplete(true)
  }

  const handleDownloadPDF = () => {
    if (notes) {
      const filename = wasStopped ? "larva-ai-partial-notes" : "larva-ai-study-notes"
      downloadAsPDF(notes, filename)
    }
  }

  // Get display name from user metadata or email
  const getDisplayName = () => {
    if (!user) return "User"

    // Try to get name from user metadata (from OAuth providers)
    if (user.user_metadata?.name) {
      return user.user_metadata.name
    }

    // Try to get name from user metadata (from email signup)
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }

    // Fall back to email username
    if (user.email) {
      return user.email.split("@")[0]
    }

    return "User"
  }

  const displayName = getDisplayName()

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 z-30 opacity-80">
            <StarsCanvas />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[900px] bg-gradient-to-t from-black/90 to-transparent" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
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

      {/* User Menu - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <Profile user={user} size={16} />
            </div>
            <span className="text-sm font-medium">{displayName}</span>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
              >
                <div className="p-3 border-b border-white/10">
                  <p className="text-white font-medium text-sm">{displayName}</p>
                  <p className="text-white/60 text-xs">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              {displayName}!
            </motion.h1>

            {/* Welcome back message */}
            <motion.p
              className="text-white/60 text-lg text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Welcome back, {displayName}! Ready to learn something new?
            </motion.p>
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
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isStreaming ? "bg-blue-500 animate-pulse" : wasStopped ? "bg-orange-500" : "bg-green-500"
                        }`}
                      ></div>
                      {isStreaming ? "Generating..." : wasStopped ? "Partial Study Notes" : "Generated Study Notes"}
                    </h2>
                    <div className="flex items-center gap-3">
                      {streamingComplete && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleDownloadPDF}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          <Download size={16} />
                          Download {wasStopped ? "Partial" : ""} PDF
                        </motion.button>
                      )}
                    </div>
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
              onStop={handleStop}
              loading={loading}
              error={error}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroContent
