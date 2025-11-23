import Link from "next/link";
import { Scale, BookOpen, MessageSquare, Award, ArrowRight, CheckCircle2, Users, BookMarked } from "lucide-react";

export default async function Home() {
  return (
    <div className="min-h-screen bg-white bg-justice-dots">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Scale className="h-4 w-4" />
            <span>Empowering Citizens with Legal Knowledge</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight font-playfair">
            Know Your{" "}
            <span className="text-blue-600">
              Rights
            </span>
            <br />
            Understand Your{" "}
            <span className="text-blue-600">
              Responsibilities
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-inter">
            Access India's Constitution and key legal acts in simplified language.
            Learn, explore, and engage with the laws that shape our democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="group bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              Start Learning
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/constitution"
              className="bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-sm"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 rounded-3xl bg-law-pattern">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Comprehensive resources to help you understand your legal rights and civic duties
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Link href="/constitution" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-200 hover:border-blue-500 h-full">
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-blue-200">
                <Scale className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair">
                Constitution
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore all articles and amendments with simplified explanations
              </p>
            </div>
          </Link>

          {/* Feature 2 */}
          <Link href="/acts" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-200 hover:border-green-500 h-full">
              <div className="bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-green-200">
                <BookOpen className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair">
                Key Acts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access important acts like RTI, Consumer Protection, and more
              </p>
            </div>
          </Link>

          {/* Feature 3 */}
          <Link href="/forum" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-200 hover:border-purple-500 h-full">
              <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-purple-200">
                <MessageSquare className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair">
                Forums
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Discuss legal topics and share insights with the community
              </p>
            </div>
          </Link>

          {/* Feature 4 */}
          <Link href="/quiz" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-200 hover:border-orange-500 h-full">
              <div className="bg-orange-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-orange-200">
                <Award className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair">
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
        <div className="bg-blue-600 rounded-3xl p-12 md:p-16 shadow-sm">
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
        <div className="bg-gray-900 rounded-3xl p-12 md:p-16 text-center shadow-sm bg-scales-pattern relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-playfair">
              Empower Yourself with Legal Knowledge
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-inter">
              Join thousands of citizens learning about their rights and responsibilities
            </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-sm hover:shadow-md"
          >
            Get Started for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold text-white">
                  Legal Awareness
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Making legal knowledge accessible to every Indian citizen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/constitution" className="hover:text-blue-400 transition">
                    Constitution
                  </Link>
                </li>
                <li>
                  <Link href="/acts" className="hover:text-blue-400 transition">
                    Key Acts
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-blue-400 transition">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="hover:text-blue-400 transition">
                    Forum
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Project Team</h3>
              <p className="text-sm text-gray-400 mb-2">
                Kumkum Kumari<br />
                Mayank Kumar<br />
                Om Yadav
              </p>
              <p className="text-xs text-gray-500 mt-4">
                GNIOT, Greater Noida<br />
                AKTU, Lucknow
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Legal Awareness Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}