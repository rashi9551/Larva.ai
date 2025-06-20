import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ToastContainer } from "react-toastify"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Larva AI - AI-Powered Note Maker & PDF Generator",
    template: "%s | Larva AI",
  },
  description:
    "Transform your ideas into organized notes and professional PDFs with Larva AI. Our intelligent note-making tool uses advanced AI to help you create, organize, and export your thoughts effortlessly.",
  keywords: [
    "AI note maker",
    "PDF generator",
    "artificial intelligence notes",
    "smart note taking",
    "AI writing assistant",
    "document generator",
    "note organization",
    "AI productivity tool",
    "automated note creation",
    "intelligent PDF creation",
  ],
  authors: [{ name: "Larva AI Team" }],
  creator: "Larva AI",
  publisher: "Larva AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://larva-ai.vercel.app"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://larva-ai.vercel.app", 
    title: "Larva AI - AI-Powered Note Maker & PDF Generator",
    description:
      "Transform your ideas into organized notes and professional PDFs with Larva AI. Our intelligent note-making tool uses advanced AI to help you create, organize, and export your thoughts effortlessly.",
    siteName: "Larva AI",
    images: [
      {
        url: "/larva-ai.jpg", 
        width: 1200,
        height: 630,
        alt: "Larva AI - AI Note Maker and PDF Generator",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Larva AI",
              description:
                "AI-powered note maker and PDF generator that transforms your ideas into organized notes and professional documents",
              url: "https://larva-ai.vercel.app", 
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Larva AI",
              },
              featureList: [
                "AI-powered note creation",
                "PDF generation",
                "Smart note organization",
                "Intelligent content suggestions",
                "Export to multiple formats",
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastContainer />
        <Toaster position="top-center" expand={true} richColors />
        {children}
      </body>
    </html>
  )
}
