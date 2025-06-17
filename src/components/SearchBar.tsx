"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { SendHorizonal, Command, Worm } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import axios, { AxiosError } from "axios"
import SearchBarThinking from "./SearchBarThinking"
import StopButton from "./StopButton"


interface SearchBarProps {
  onNotesGenerated: (notes: string) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
  onStop: () => void
  loading: boolean
}

const SearchBar = ({ onNotesGenerated, onLoading, onError, onStop, loading,  }: SearchBarProps) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuery(e.target.value)
    
  }
  useEffect(() => {
    console.log("useffect ",loading);
    if (loading) {
      if (query.trim() ) {
        generateNotes()
      }
    }else{
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [loading])
  
  
  const generateNotes = async () => {

    
    if (!query.trim()) return

    const currentQuery = query.trim()
    setQuery("") // Clear immediately for better UX
    onError(null)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await axios.get(`/api/gemini`, {
        params: {
          topic: currentQuery,
        },
        signal: abortControllerRef.current.signal,
      })

      const { notes: generatedNotes } = response.data

      if (generatedNotes && typeof generatedNotes === "string" && generatedNotes.trim()) {
        onNotesGenerated(generatedNotes)
      } else {
        onError("No content was generated. Please try a different topic.")
        setQuery(currentQuery) // Restore query on error
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === AxiosError.ERR_CANCELED) {
          // Request was cancelled, just restore query, don't show an error toast
          setQuery(currentQuery);
          return;
        }
        // Handle other Axios errors
        onError(err.response?.data?.error || err.message || "Failed to generate notes. Please try again.");
      } else if (err instanceof Error && err.name === "AbortError") {
        // Handle native AbortController abort (if not an axios error)
        setQuery(currentQuery);
        return;
      } else {
        // Handle any other unexpected errors
        console.error("Unknown error generating notes:", err);
        onError("An unexpected error occurred. Please try again.");
      }
      setQuery(currentQuery); 
    } finally {
      abortControllerRef.current = null
    }
  }



  const handleSubmit =() => {
    onLoading(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "25px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [query])

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Thinking Indicator - Top Left Corner */}
        <div className="absolute -top-12 left-4 z-10">
          <AnimatePresence>{loading && <SearchBarThinking />}</AnimatePresence>
        </div>

        {/* Search Bar */}
        <div
          className={`
            group relative bg-white/8 backdrop-blur-xl border transition-all duration-300 rounded-2xl pointer-events-auto shadow-2xl
            ${
              isFocused
                ? "border-white/30 shadow-blue-500/20 bg-white/12"
                : "border-white/20 hover:border-white/30 hover:bg-white/10"
            }
            ${loading ? "opacity-60" : ""}
          `}
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex items-end gap-3 p-4">
            <div className="flex-shrink-0 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Worm size={16} className="text-white" />
              </div>
            </div>

            {/* Textarea Container */}
            <div className="flex-1 min-w-0 relative">
              <textarea
                ref={textareaRef}
                placeholder={loading ? "Please wait for the current response to complete..." : "Ask me anything..."}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={loading}
                rows={1}
                className="
                  relative z-10 w-full resize-none bg-transparent outline-none
                  text-white placeholder-white/50
                  text-base leading-6             /* Applies to all screens (mobile-first) */
                  sm:text-lg sm:leading-7        /* Example: Slightly larger on small-medium screens */
                  lg:text-xl lg:leading-8        /* Example: Even larger on large screens */
                  max-h-32 overflow-y-auto pointer-events-auto focus:text-white
                  loading:opacity-50 loading:cursor-not-allowed
                "
                style={{
                  minHeight: "24px",
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </div>

            {/* Send/Stop Button - Inside SearchBar */}
            <div className="flex-shrink-0 mb-1">
              {loading ? <StopButton onStop={onStop} loading/> : 
                <button
                onClick={handleSubmit} // This is the only onClick needed
                disabled={!loading && (!query.trim() || loading)}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${
                    loading
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      : query.trim() && !loading
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }
                `}
                title={loading ? "Stop generating" : "Send message"}
              >
                {/* Just swap the icon directly */}
                <SendHorizonal size={16} />
              </button>
              }
              
            </div>
          </div>

          {/* Bottom Helper Text */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-1">
                <Command size={12} />
                <span>{loading ? "Click to stop generation" : "+ Enter to send"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{query.length}/2000</span>
                {query.length > 1800 && <span className="text-amber-400">• Approaching limit</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
