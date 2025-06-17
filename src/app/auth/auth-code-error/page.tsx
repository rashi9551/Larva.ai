export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-white/60 mb-6">There was an error during the authentication process.</p>
        <a
          href="/signup"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  )
}
