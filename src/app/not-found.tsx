import Link from "next/link";
import { BrandLogo } from "@/components/auth/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 30%, #ec4899 60%, #f97316 100%)",
        }}
      />

      <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-300 rounded-full blur-[120px] opacity-70 animate-float" />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-pink-300 rounded-full blur-[150px] opacity-70 animate-float-delayed" />
      <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-cyan-300 rounded-full blur-[100px] opacity-70 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-300 rounded-full blur-[80px] opacity-60 animate-float delay-300" />

      <div className="absolute top-[15%] left-[5%] w-16 h-16 border-4 border-white/40 rounded-2xl rotate-12 animate-float hidden md:block" />
      <div className="absolute bottom-[25%] right-[8%] w-12 h-12 bg-yellow-300 rounded-full opacity-80 animate-bounce-in delay-200 hidden md:block" />
      <div className="absolute top-[60%] left-[8%] w-8 h-8 bg-cyan-300 rounded-full opacity-70 animate-float-delayed delay-300 hidden md:block" />

      <div className="relative z-10 w-full max-w-md mx-auto bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-5">
          <BrandLogo />
        </div>

        <p className="text-7xl font-bold text-white drop-shadow-lg">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white drop-shadow">
          Page not found
        </h1>
        <p className="mt-2 text-white/90 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-yellow-400 text-purple-700 rounded-xl font-bold text-sm hover:bg-yellow-300 shadow-xl transition-all hover:scale-[1.02]"
          >
            Back to home
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 border-2 border-white/50 text-white rounded-xl font-bold text-sm hover:bg-white/20 backdrop-blur transition-all hover:scale-[1.02]"
          >
            Create your page
          </Link>
        </div>
      </div>
    </div>
  );
}
