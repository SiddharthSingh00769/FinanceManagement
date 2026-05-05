import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { AiChatWidget } from "@/components/ai-chat-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinAura",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Inline script to prevent flash of wrong theme (FOUC) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body className={`${inter.className}`}>
          {/* header */}
          <Header />

          <main className="min-h-screen">
            {children}
          </main>
          <Toaster richColors />

          <SignedIn>
            <AiChatWidget />
          </SignedIn>

          {/* footer */}
          <footer className="bg-blue-50 dark:bg-blue-950/30 py-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>Made with ❤️ by Team</p>
            </div>
          </footer>

        </body>
      </html>
    </ClerkProvider>
  );
}
