import ThemeRegistry from "@/components/ThemeResistry/ThemeResistry";
import "./global.css";
import { Inter } from "next/font/google";
import { CourseProvider } from "@/lib/context/useCourse";
import { FloatingChat } from "@/components/FloatingChat/FloatingChat";
import { TutorialOverlay } from "@/components/Tutorial/TutorialOverlay";
import { TutorialTrigger } from "@/components/Tutorial/TutorialTrigger";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Simpatico",
  description: "Modulo do simpatia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeRegistry>
          <CourseProvider>
            {children}
            <FloatingChat />
            <TutorialOverlay />
            <TutorialTrigger />
          </CourseProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}


