import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-green-600 dark:from-blue-800 dark:to-green-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 text-white hover:opacity-80 transition">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <Scale className="h-12 w-12 text-white" />
            <span className="text-3xl font-bold text-white">Legal Awareness</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Journey to Legal Empowerment Continues
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Access comprehensive legal resources and stay informed about your rights.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Constitution & Acts</h3>
                <p className="text-blue-100 text-sm">Access all 470+ articles in simplified language</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Interactive Learning</h3>
                <p className="text-blue-100 text-sm">Test your knowledge with quizzes and forums</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Track Progress</h3>
                <p className="text-blue-100 text-sm">Monitor your legal awareness journey</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-sm">
          © 2025 Legal Awareness Platform. GNIOT & AKTU.
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base xl:text-lg">
              Sign in to continue your legal awareness journey
            </p>
          </div>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-2 hover:border-blue-500 transition-colors",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
                formFieldInput: "border-2 focus:border-blue-500 rounded-lg transition-colors",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                formFieldLabel: "text-sm font-medium"
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton"
              }
            }}
          />

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 mb-8">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
