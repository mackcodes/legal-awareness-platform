import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, ArrowLeft, Sparkles, Award, Users, Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 text-white/90 hover:text-white transition group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Scale className="h-10 w-10 xl:h-12 xl:w-12 text-white" />
            </div>
            <div>
              <span className="text-2xl xl:text-3xl font-bold text-white">Legal Help</span>
              <p className="text-purple-100 text-sm -mt-0.5">Know Your Rights</p>
            </div>
          </div>
          
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 xl:mb-6 font-crimson">
            Begin Your Legal Journey
          </h2>
          <p className="text-purple-100 text-base xl:text-lg mb-6 xl:mb-8 font-medium">
            Join thousands learning about their rights and responsibilities.
          </p>

          <div className="grid grid-cols-2 gap-4 xl:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 xl:p-6 border border-white/20">
              <Sparkles className="h-6 w-6 xl:h-8 xl:w-8 text-yellow-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">470+</h3>
              <p className="text-purple-100 text-xs xl:text-sm font-medium">Articles</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 xl:p-6 border border-white/20">
              <Award className="h-6 w-6 xl:h-8 xl:w-8 text-orange-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">50+</h3>
              <p className="text-purple-100 text-xs xl:text-sm font-medium">Key Acts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 xl:p-6 border border-white/20">
              <Users className="h-6 w-6 xl:h-8 xl:w-8 text-blue-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">1000+</h3>
              <p className="text-purple-100 text-xs xl:text-sm font-medium">Learners</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 xl:p-6 border border-white/20">
              <Shield className="h-6 w-6 xl:h-8 xl:w-8 text-green-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">100%</h3>
              <p className="text-purple-100 text-xs xl:text-sm font-medium">Free</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-purple-100 text-xs xl:text-sm font-medium">
          © 2025 Legal Help. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 py-8 overflow-y-auto bg-white/60 backdrop-blur-lg">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-bold mb-4 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Start Learning Free</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-3 font-crimson">
              Create Account
            </h1>
            <p className="text-gray-600 text-base xl:text-lg font-medium">
              Begin your legal empowerment journey
            </p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-2xl border border-indigo-100 rounded-2xl w-full bg-white/80 backdrop-blur-lg",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-2 border-indigo-200 hover:border-indigo-400 transition-all font-semibold",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 transition-all shadow-lg hover:shadow-xl",
                footerActionLink: "text-indigo-600 hover:text-indigo-700 font-bold",
                formFieldInput: "border-2 border-indigo-200 focus:border-indigo-500 rounded-xl transition-all font-medium",
                identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700 font-semibold",
                formFieldLabel: "text-sm font-semibold text-gray-700",
                formFieldInputShowPasswordButton: "text-indigo-600 hover:text-indigo-700 font-semibold"
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton"
              }
            }}
          />

          <p className="text-center text-sm text-gray-600 mt-6 mb-8 font-medium">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-600 font-bold hover:text-indigo-700 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
