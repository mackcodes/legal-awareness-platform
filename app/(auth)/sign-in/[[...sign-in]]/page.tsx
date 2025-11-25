import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, ArrowLeft, Sparkles, Shield, Brain } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 text-white/90 hover:text-white transition group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold text-white">Legal Help</span>
              <p className="text-blue-100 text-sm -mt-1">Know Your Rights</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 font-crimson">
            Welcome Back!
          </h2>
          <p className="text-blue-100 text-lg mb-10 font-medium">
            Continue your journey to legal empowerment and access all resources.
          </p>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">470+ Articles</h3>
                  <p className="text-blue-100 text-sm">Constitution explained in simple language</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">AI Assistant</h3>
                  <p className="text-blue-100 text-sm">Get instant answers to legal questions</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Emergency Services</h3>
                  <p className="text-blue-100 text-sm">Access all helpline numbers instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-sm font-medium">
          © 2025 Legal Help. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 py-8 overflow-y-auto bg-white/60 backdrop-blur-lg">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-3 font-crimson">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base xl:text-lg font-medium">
              Continue your legal awareness journey
            </p>
          </div>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-2xl border border-blue-100 rounded-2xl w-full bg-white/80 backdrop-blur-lg",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-2 border-blue-200 hover:border-blue-400 transition-all font-semibold",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 transition-all shadow-lg hover:shadow-xl",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-bold",
                formFieldInput: "border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all font-medium",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700 font-semibold",
                formFieldLabel: "text-sm font-semibold text-gray-700"
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton"
              }
            }}
          />

          <p className="text-center text-sm text-gray-600 mt-6 font-medium">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 font-bold hover:text-blue-700 transition">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
