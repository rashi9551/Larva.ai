"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { SendHorizonal, Command, Worm } from "lucide-react"
import axios from "axios"

interface SearchBarProps {
  onNotesGenerated: (notes: string) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
  loading: boolean
  error: string | null
}

const SearchBar = ({ onNotesGenerated, onLoading, onError, loading, error }: SearchBarProps) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
  }

  const generateNotes = async () => {
    if (!query.trim()) return

    const currentQuery = query.trim()
    setQuery("") // Clear immediately for better UX
    onLoading(true)
    onError(null)

    try {
      const response = await axios.get(`/api/gemini`, {
        params: {
          topic: currentQuery,
        },
      })

      const { notes: generatedNotes } = response.data

      if (generatedNotes && typeof generatedNotes === "string" && generatedNotes.trim()) {
        onNotesGenerated(generatedNotes)
      } else {
        onError("No content was generated. Please try a different topic.")
        setQuery(currentQuery) // Restore query on error
      }
    } catch (err: any) {
      console.error("Error generating notes:", err)
      onError(err.response?.data?.error || err.message || "Failed to generate notes. Please try again.")
      setQuery(currentQuery) // Restore query on error
    } finally {
      onLoading(false)
    }
  }

  const handleSubmit = () => {
    if (query.trim() && !loading) {
      generateNotes()
    }
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

        {/* Search Bar */}
        <div
          className={`
            group relative bg-white/6 backdrop-blur-xl border transition-all duration-300 rounded-2xl pointer-events-auto
            ${
              isFocused
                ? "border-white/30 shadow-2xl shadow-blue-500/20 bg-white/10"
                : "border-white/10 hover:border-white/20 hover:bg-white/8"
            }
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
                placeholder="Ask me anything..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={loading}
                rows={1}
                className="relative z-10 w-full resize-none bg-transparent outline-none text-white placeholder-white/50 text-base leading-6 max-h-32 overflow-y-auto pointer-events-auto focus:text-white disabled:opacity-50"
                style={{
                  minHeight: "24px",
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </div>

            {/* Send Button */}
            <div className="flex-shrink-0 mb-1">
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || loading}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${
                    query.trim() && !loading
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }
                `}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <SendHorizonal size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Helper Text */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-1">
                <Command size={12} />
                <span>+ Enter to send</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{query.length}/2000</span>
                {query.length > 1800 && <span className="text-amber-400">• Approaching limit</span>}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar
