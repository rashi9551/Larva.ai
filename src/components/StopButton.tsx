"use client"
import { motion } from "framer-motion"
import { Square } from "lucide-react"

interface StopButtonProps {
  onStop: () => void
  loading: boolean
}

const StopButton = ({ onStop, loading }: StopButtonProps) => {
  if (!loading) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={onStop}
      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
    >
      <Square size={14} className="fill-current" />
      <span className="text-sm font-medium">Stop generating</span>
    </motion.button>
  )
}

export default StopButton
