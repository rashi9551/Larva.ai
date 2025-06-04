"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { SendHorizonal, Command , Worm} from "lucide-react"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = () => {
    if (query.trim()) {
      console.log("Sending:", query)
      setQuery("")
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
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Main Search Container */}
      <div className="relative">
        {/* Gradient Background Blur */}
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
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex items-end gap-3 p-4">
            {/* AI Icon */}
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
                rows={1}
                className="relative z-10 w-full resize-none bg-transparent outline-none text-white placeholder-white/50 text-base leading-6 max-h-32 overflow-y-auto pointer-events-auto focus:text-white"
                style={{
                  minHeight: "24px",
                  border: "none",
                  boxShadow: "none",
                }}
                autoFocus
              />
            </div>

            {/* Send Button */}
            <div className="flex-shrink-0 mb-1">
              <button
                onClick={handleSubmit}
                disabled={!query.trim()}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${
                    query.trim()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }
                `}
              >
                <SendHorizonal size={16} />
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
        </div>

        {/* Floating Suggestions (Optional) */}
        {!query && !isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Explain quantum computing",
                "Write a React component",
                "Plan a marketing strategy",
                "Debug this code",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/60 hover:text-white/80 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
