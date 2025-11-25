import Link from "next/link";
import { Scale, BookOpen, MessageSquare, Award, ArrowRight, CheckCircle2, Users, BookMarked, LogIn, UserPlus, Sparkles, Shield, Brain, Globe } from "lucide-react";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Navigation */}
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="hidden sm:flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Legal Help</span>
              <p className="text-xs text-gray-500 -mt-1">Know Your Rights</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-blue-50 flex-1 sm:flex-initial"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 sm:flex-initial"
            >
              <UserPlus className="h-5 w-5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-blue-200 text-blue-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Empowering Citizens with Legal Knowledge</span>
            <span className="sm:hidden">Legal Knowledge Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight font-crimson px-2">
            Your Digital Guide to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Legal Rights
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Access India's Constitution, key legal acts, and emergency services in simplified language.
            Learn, explore, and empower yourself with legal knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
            <Link
              href="/sign-up"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/constitution"
              className="bg-white/80 backdrop-blur-lg text-gray-900 border-2 border-blue-200 hover:border-blue-400 px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 hover:shadow-xl text-center"
            >
              Explore Constitution
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-10 sm:mt-16 flex flex-wrap justify-center items-center gap-3 sm:gap-8 text-xs sm:text-sm font-semibold text-gray-600 px-4">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-blue-100">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-blue-100">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>1000+ Users</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-blue-100">
              <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              <span>Verified Content</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-crimson px-4">
            Everything You Need
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium px-4">
            Comprehensive resources to help you understand your legal rights and civic duties
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <Link href="/constitution" className="group">
            <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 h-full transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">
                Constitution
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Explore 470+ articles with simplified explanations
              </p>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link href="/acts" className="group">
            <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 h-full transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">
                Key Acts
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                RTI, Consumer Protection, Traffic Rules & more
              </p>
            </div>
          </Link>

          {/* Feature 3 */}
          <Link href="/forum" className="group">
            <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 h-full transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">
                Community
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Discuss and share insights with others
              </p>
            </div>
          </Link>

          {/* Feature 4 */}
          <Link href="/quiz" className="group">
            <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 hover:border-orange-300 h-full transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">
                AI Quizzes
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Test your knowledge with smart quizzes
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">Emergency Services</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              Quick access to all emergency helplines and traffic assistance numbers across India
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">AI-Powered Help</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              Get instant answers to legal questions with our intelligent AI chatbot assistant
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-crimson">Multiple Languages</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              Access content in your preferred language for better understanding
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
            <div className="group">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform">470+</div>
              <div className="text-blue-100 text-base sm:text-lg font-semibold">Constitution Articles</div>
            </div>
            <div className="group">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-blue-100 text-base sm:text-lg font-semibold">Key Acts Covered</div>
            </div>
            <div className="group">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-blue-100 text-base sm:text-lg font-semibold">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -ml-32 sm:-ml-48 -mb-32 sm:-mb-48"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 font-crimson px-4">
              Empower Yourself Today
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium px-4">
              Join thousands learning about their rights and responsibilities
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3.5 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none mx-4 sm:mx-0"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-lg text-gray-700 border-t border-blue-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                  <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Legal Help
                  </span>
                  <p className="text-[10px] sm:text-xs text-gray-500 -mt-0.5">Know Your Rights</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Making legal knowledge accessible to every Indian citizen.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-5 text-base sm:text-lg">Platform</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-medium">
                <li>
                  <Link href="/constitution" className="text-gray-600 hover:text-blue-600 transition">
                    Constitution
                  </Link>
                </li>
                <li>
                  <Link href="/acts" className="text-gray-600 hover:text-blue-600 transition">
                    Key Acts
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="text-gray-600 hover:text-blue-600 transition">
                    Forum
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-5 text-base sm:text-lg">Resources</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-medium">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-100 mt-8 sm:mt-10 pt-8 sm:pt-10 text-center text-sm sm:text-base text-gray-600 font-medium">
            <p>&copy; 2025 Legal Help. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}