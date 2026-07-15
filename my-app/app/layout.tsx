import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import { PHProvider } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DevEvents",
  description: "The Hub for Tech Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <PHProvider>
          <Navbar />
          <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays
              raysOrigin="top-center-offset"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={10}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0.0}
              distortion={0.01}
              className="custom-rays"
              pulsating={false}
              fadeDistance={1}
              saturation={1}
            />
          </div>
          <main>{children}</main>
        </PHProvider>
      </body>
    </html>
  );
}
