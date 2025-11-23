import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, ArrowLeft, Sparkles, Award, Users, TrendingUp } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-800 p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 text-white hover:opacity-80 transition">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="h-10 w-10 xl:h-12 xl:w-12 text-white" />
            <span className="text-2xl xl:text-3xl font-bold text-white">Legal Awareness</span>
          </div>
          
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 xl:mb-6">
            Start Your Legal Empowerment Journey Today
          </h2>
          <p className="text-green-100 text-base xl:text-lg mb-6 xl:mb-8">
            Join thousands of citizens learning about their rights and responsibilities.
          </p>

          <div className="grid grid-cols-2 gap-4 xl:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xl:p-6">
              <Sparkles className="h-6 w-6 xl:h-8 xl:w-8 text-yellow-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">470+</h3>
              <p className="text-green-100 text-xs xl:text-sm">Constitution Articles</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xl:p-6">
              <Award className="h-6 w-6 xl:h-8 xl:w-8 text-orange-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">50+</h3>
              <p className="text-green-100 text-xs xl:text-sm">Key Acts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xl:p-6">
              <Users className="h-6 w-6 xl:h-8 xl:w-8 text-blue-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">1000+</h3>
              <p className="text-green-100 text-xs xl:text-sm">Active Learners</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xl:p-6">
              <TrendingUp className="h-6 w-6 xl:h-8 xl:w-8 text-green-300 mb-2 xl:mb-3" />
              <h3 className="text-white font-bold text-xl xl:text-2xl mb-1">100%</h3>
              <p className="text-green-100 text-xs xl:text-sm">Free Forever</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-green-100 text-xs xl:text-sm">
          © 2025 Legal Awareness Platform. GNIOT & AKTU.
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Start Learning for Free</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg">
              Begin your journey to legal empowerment
            </p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-2 hover:border-green-500 transition-colors",
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition-colors",
                footerActionLink: "text-green-600 hover:text-green-700 font-semibold",
                formFieldInput: "border-2 focus:border-green-500 rounded-lg transition-colors",
                identityPreviewEditButton: "text-green-600 hover:text-green-700",
                formFieldLabel: "text-sm font-medium",
                formFieldInputShowPasswordButton: "text-green-600 hover:text-green-700"
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton"
              }
            }}
          />

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 mb-8">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
