"use client"
import { useState } from "react"
import NextImage from "next/image"
import { UserIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ProfileProps {
  user: User | null
  size?: number
}

const Profile = ({ user, size = 16 }: ProfileProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const hasValidAvatar = user?.user_metadata?.avatar_url && !imageError

  if (hasValidAvatar) {
    return (
      <div className="relative">
        <NextImage
          src={ user?.user_metadata?.avatar_url as string}
          alt={`${user.user_metadata?.name || user.email || "User"}'s avatar`}
          width={size * 2} // Double for better quality
          height={size * 2}
          className="rounded-full object-cover"
          style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
          priority={false}
          unoptimized={false}
        />
        {imageLoading && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  // Fallback to icon
  return <UserIcon size={size} className="text-white" />
}

export default Profile
