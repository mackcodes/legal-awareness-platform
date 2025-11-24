import Link from "next/link";
import { Scale, BookOpen, MessageSquare, Award, ArrowRight, CheckCircle2, Users, BookMarked, LogIn, UserPlus } from "lucide-react";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Legal Awareness</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <UserPlus className="h-5 w-5" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="h-4 w-4" />
            <span>Empowering Citizens with Legal Knowledge</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Know Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Rights
            </span>
            <br />
            Understand Your{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Responsibilities
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Access India's Constitution and key legal acts in simplified language.
            Learn, explore, and engage with the laws that shape our democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="group bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              Start Learning
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/constitution"
              className="bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Explore Constitution
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>100% Free Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-purple-600" />
              <span>Verified Content</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive resources to help you understand your legal rights and civic duties
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Link href="/constitution" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-500 h-full hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Scale className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Constitution
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore all articles and amendments with simplified explanations
              </p>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link href="/acts" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-500 h-full hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Key Acts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access important acts like RTI, Consumer Protection, and more
              </p>
            </div>
          </Link>

          {/* Feature 3 */}
          <Link href="/forum" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-500 h-full hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Forums
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Discuss legal topics and share insights with the community
              </p>
            </div>
          </Link>

          {/* Feature 4 */}
          <Link href="/quiz" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-500 h-full hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Quiz System
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Test your knowledge and track your legal awareness progress
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">470+</div>
              <div className="text-blue-100 text-lg font-medium">Constitution Articles</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-blue-100 text-lg font-medium">Key Acts Covered</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-3 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-blue-100 text-lg font-medium">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Empower Yourself with Legal Knowledge
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of citizens learning about their rights and responsibilities
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Scale className="h-7 w-7 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Legal Awareness
                </span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                Making legal knowledge accessible to every Indian citizen.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-5 text-lg">Platform</h3>
              <ul className="space-y-3 text-base">
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
              <h3 className="font-bold text-gray-900 mb-5 text-lg">Resources</h3>
              <ul className="space-y-3 text-base">
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
          <div className="border-t border-gray-200 mt-10 pt-10 text-center text-base text-gray-600">
            <p>&copy; 2025 Legal Awareness Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}