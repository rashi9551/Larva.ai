"use client"
import { useState, useActionState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Apple, Worm, ChevronDown, Github, Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { signupWithEmailPassword, signinWithEmailPassword, signinWithGithub, signinWithGoogle } from "../action"
import createClientForBrowser from "@/utils/supabase/client"
import { toast } from "sonner"

const SignupPage = () => {
  const router = useRouter()
  const supabase = createClientForBrowser()

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isSignup, setIsSignup] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Initial state
  const initialState: { success: null; error: null; message: undefined } = {
    success: null,
    error: null,
    message: undefined,
  }

  // Separate states for signup and signin
  const [signupState, signupAction, signupPending] = useActionState(signupWithEmailPassword, initialState)
  const [signinState, signinAction, signinPending] = useActionState(signinWithEmailPassword, initialState)

  // Get current state based on mode
  const currentState:{
  success: string | boolean | null;
  error: string | null;
  message?: string | null | undefined;
} = isSignup ? signupState : signinState
  const currentAction = isSignup ? signupAction : signinAction
  const currentPending = isSignup ? signupPending : signinPending

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (user && !error) {
          // User is already logged in, redirect to home
          toast.info('User already authenticated')
          console.log("User already authenticated, redirecting to home...")
          router.push("/")
          return
        }
      } catch (err) {
        console.error("Error checking auth status:", err)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuthStatus()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // User just signed in, redirect to home
        // router.push("/")
        router.back()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleOAuthSignin = async (provider: "github" | "google") => {
    setLoading(provider)
    try {
      if (provider === "github") {
        await signinWithGithub()
      } else if (provider === "google") {
        await signinWithGoogle()
      }
    } catch (error) {
      console.error(`${provider} signin error:`, error)
      setLoading(null)
    }
  }

  const toggleAuthMode = () => {
    setIsSignup(!isSignup)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0">
        {/* Main geometric pattern on the right */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Large curved shapes */}
            <path
              d="M600 100C700 200 750 350 700 500C650 650 500 750 350 700C200 650 100 500 150 350C200 200 350 100 500 150"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M500 50C650 100 750 250 700 400C650 550 500 650 350 600C200 550 100 400 150 250C200 100 350 50 500 50"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M450 200C550 250 600 350 550 450C500 550 400 600 300 550C200 500 150 400 200 300C250 200 350 150 450 200"
              stroke="url(#gradient3)"
              strokeWidth="1"
              fill="none"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Additional subtle patterns */}
        <div className="absolute right-20 top-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute right-40 bottom-40 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Worm size={18} className="text-white" />
          </div>
        </div>

        {/* Service Selector */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
          <span className="text-sm text-white/80">You are signing into</span>
          <button className="flex items-center gap-2 text-white font-medium">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Worm size={12} className="text-white" />
              </div>
              <span>Larva AI</span>
            </div>
            <ChevronDown size={16} className="text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md px-6">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-light text-white mb-12 text-center"
          >
            {showEmailForm ? (isSignup ? "Create your account" : "Log into your account") : "Log into your account"}
          </motion.h1>

          {/* Success/Error Messages */}
          {currentState?.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm text-center"
            >
              {currentState?.message}
            </motion.div>
          )}

          {currentState?.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center"
            >
              {currentState.error}
            </motion.div>
          )}

          {/* Email Form */}
           {showEmailForm && (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              action={currentAction}
              className="space-y-4 mb-8"
            >
              {isSignup && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-colors"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-colors"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={currentPending || true} // Add '|| true' to always disable for "Coming Soon"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isSignup ? (
                  "Create Account (Coming Soon)" // Changed text
                ) : (
                  "Sign In (Coming Soon)" // Changed text
                )}
              </button>
              <div className="text-center">
                <button type="button" onClick={toggleAuthMode} className="text-white/60 hover:text-white text-sm">
                  {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-white/60 hover:text-white text-sm underline"
                >
                  ← Back to other options
                </button>
              </div>
            </motion.form>
          )}
          {/* OAuth Login Options */}
          {!showEmailForm && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Login with GitHub */}
              <button
                onClick={() => handleOAuthSignin("github")}
                disabled={loading === "github"}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === "github" ? <Loader2 size={20} className="animate-spin" /> : <Github size={20} />}
                {loading === "github" ? "Connecting..." : "Login with GitHub"}
              </button>
              {/* Login with Email */}
              <button
                onClick={() => setShowEmailForm(true)}
                disabled={true} // Add this to disable
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed" // Add opacity and cursor styles
              >
                <Mail size={20} />
                Login with email (Coming Soon) {/* Changed text */}
              </button>
              {/* Login with Google */}
              <button
                onClick={() => handleOAuthSignin("google")}
                disabled={loading === "google"}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === "google" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {loading === "google" ? "Connecting..." : "Login with Google"}
              </button>
              {/* Login with Apple */}
              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed">
                <Apple size={20} />
                Login with Apple (Coming Soon)
              </button>
            </motion.div>
          )}
          {/* Sign Up Link */}
          {!showEmailForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-8"
            >
              <span className="text-white/60">New to Larva AI? </span>
              <button
                onClick={() => {
                  setShowEmailForm(true)
                  setIsSignup(true)
                }}
                disabled={true} // Add this to disable
                className="text-white hover:underline font-medium opacity-50 cursor-not-allowed" // Add opacity and cursor styles
              >
                Create account (Coming Soon) {/* Changed text */}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="text-center text-sm text-white/50">
          <span>By continuing, you agree to Larva AI&apos;s </span>
          <button className="underline hover:text-white/70">Terms of Service</button>
          <span> and </span>
          <button className="underline hover:text-white/70">Privacy Policy</button>
          <span>.</span>
        </div>
      </footer>
    </div>
  )
}

export default SignupPage
