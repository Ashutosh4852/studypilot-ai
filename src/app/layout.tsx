import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://studypilot-app-seven.vercel.app"),
  title: {
    default: "StudyPilot AI — 100% Free Online PDF Editor & AI Image Studio (No Watermark)",
    template: "%s | StudyPilot AI",
  },
  description:
    "Free online PDF editor and AI image studio. Edit PDFs, add text, signatures, annotations, merge, split, extract text, OCR scanned documents, remove backgrounds, and generate AI notes & MCQs 100% free with zero watermarks.",
  keywords: [
    "free pdf editor",
    "edit pdf online free without watermark",
    "free online pdf editor no sign up",
    "ai pdf summarizer free",
    "generate mcqs from pdf online",
    "free background remover hd",
    "ai image editor free online",
    "pdf to jpg converter free",
    "merge pdf files free",
    "split pdf online free",
    "sign pdf online free",
    "free ocr scanned pdf to text",
    "youtube thumbnail maker free online",
    "feynman technique concept explainer ai",
    "studypilot ai",
    "free student study tool ai",
  ],
  authors: [{ name: "StudyPilot AI Team" }],
  creator: "StudyPilot AI",
  publisher: "StudyPilot AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "StudyPilot AI — Free Online PDF Studio & AI Image Editor",
    description:
      "Edit PDFs, remove image backgrounds, summarize documents with AI, and create social media designs 100% free with zero watermarks or signup barriers.",
    url: "https://studypilot-app-seven.vercel.app",
    siteName: "StudyPilot AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyPilot AI Free PDF and Image Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyPilot AI — 100% Free PDF Editor & AI Image Studio",
    description: "Free in-browser PDF editor, background remover, and AI study companion.",
    images: ["/og-image.png"],
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
  verification: {
    google: "d1ad132d9160143a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "StudyPilot AI",
        url: "https://studypilot-app-seven.vercel.app",
        description:
          "Free browser-based visual PDF editor, converter, AI summarizer, and AI image studio with background remover and social media presets.",
        applicationCategory: "EducationalApplication, MultimediaApplication",
        operatingSystem: "All (Web Browser, Chrome, Edge, Safari, Firefox, Android, iOS)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2840",
          bestRating: "5",
          worstRating: "1",
        },
        featureList: [
          "100% Free Online PDF Editor",
          "Edit PDF without Watermark",
          "AI PDF Summarizer and MCQ Generator",
          "Free AI Background Remover HD",
          "Merge and Split PDF Files Free",
          "Digital Signature for PDF Documents",
          "Client-side 100% Private Processing",
          "YouTube Thumbnail Presets (1280x720)",
          "In-browser WASM OCR",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is StudyPilot AI really free with no watermark?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, StudyPilot AI is 100% free forever. You can edit PDFs, add digital signatures, remove image backgrounds, and generate AI flashcards with zero watermarks and no credit card required.",
            },
          },
          {
            "@type": "Question",
            name: "How can I edit a PDF online without paying?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Open StudyPilot AI PDF Studio, upload your PDF file, add text boxes, draw freehand, insert shapes, signatures, or stamps, and click Download PDF. All edits are processed locally in your browser for total privacy.",
            },
          },
          {
            "@type": "Question",
            name: "How do I remove the background from an image for free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use the AI Image Studio on StudyPilot AI to upload any JPG, PNG, or WebP photo. Click 'Remove Background' to get a 100% transparent cutout in HD resolution with no watermark.",
            },
          },
          {
            "@type": "Question",
            name: "Can I generate MCQ quizzes and study notes from a PDF?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, StudyPilot AI features an AI PDF Copilot that summarizes complex documents, extracts definitions, and generates 5-question multiple choice quizzes with instant scoring.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
        <ToastProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
