"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Scale, ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";

export default function PreamblePage() {
  const [showKeyFeatures, setShowKeyFeatures] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showHistoricalContext, setShowHistoricalContext] = useState(false);

  // Translation hooks for navigation
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  
  // Translation hooks for header
  const { text: soulOfConstitutionText } = useTranslate("The Soul of the Constitution");
  const { text: preambleOfIndiaText } = useTranslate("Preamble of India");
  const { text: preambleDescText } = useTranslate("The Preamble serves as the introduction to the Constitution of India and reflects the dreams and aspirations of our founding fathers");
  const { text: englishText } = useTranslate("English");
  
  // Translation hooks for buttons
  const { text: keyFeaturesText } = useTranslate("Key Features");
  const { text: objectivesText } = useTranslate("Objectives");
  const { text: simplifyText } = useTranslate("Simplify");
  const { text: historicalContextText } = useTranslate("Historical Context");
  
  // Translation hooks for Key Features section
  const { text: sovereignText } = useTranslate("Sovereign");
  const { text: sovereignDescText } = useTranslate("India is internally and externally independent");
  const { text: socialistText } = useTranslate("Socialist");
  const { text: socialistDescText } = useTranslate("Wealth to be shared equally by society");
  const { text: secularText } = useTranslate("Secular");
  const { text: secularDescText } = useTranslate("No state religion, equal respect for all faiths");
  const { text: democraticText } = useTranslate("Democratic");
  const { text: democraticDescText } = useTranslate("Government elected by the people");
  const { text: republicText } = useTranslate("Republic");
  const { text: republicDescText } = useTranslate("Head of state is elected, not hereditary");
  
  // Translation hooks for Objectives section
  const { text: justiceText } = useTranslate("Justice");
  const { text: justiceDescText } = useTranslate("Social, Economic, and Political equality");
  const { text: libertyText } = useTranslate("Liberty");
  const { text: libertyDescText } = useTranslate("Freedom of thought, expression, and worship");
  const { text: equalityText } = useTranslate("Equality");
  const { text: equalityDescText } = useTranslate("Equal status and opportunities for all");
  const { text: fraternityText } = useTranslate("Fraternity");
  const { text: fraternityDescText } = useTranslate("Unity and dignity of all citizens");
  
  // Translation hooks for Simplified Explanations
  const { text: preambleExplainedText } = useTranslate("Preamble Explained Simply (Like You're 5!)");
  const { text: wePeopleText } = useTranslate("WE, THE PEOPLE OF INDIA");
  const { text: wePeopleSimpleText } = useTranslate("All of us Indians together decided to make special rules for our country!");
  const { text: wePeopleExampleText } = useTranslate("Just like when you and your friends decide the rules for a game, all Indians decided rules for our country.");
  
  const { text: sovereignBossText } = useTranslate("SOVEREIGN (Boss of Ourselves)");
  const { text: sovereignSimpleText } = useTranslate("India is the boss of itself! Nobody else tells us what to do.");
  const { text: sovereignExampleText } = useTranslate("Like when you build with your own blocks, you decide what to make - nobody else can tell you!");
  
  const { text: socialistSharingText } = useTranslate("SOCIALIST (Sharing is Caring)");
  const { text: socialistSimpleText } = useTranslate("Everyone should get to share good things fairly!");
  const { text: socialistExampleText } = useTranslate("If you have candies, you should share with everyone, not keep all for yourself.");
  
  const { text: secularFriendsText } = useTranslate("SECULAR (All Friends Welcome)");
  const { text: secularSimpleText } = useTranslate("Everyone can pray to any god they like, or no god at all. All are equal!");
  const { text: secularExampleText } = useTranslate("Like how you can be friends with kids who like different cartoons - everyone's choice is okay!");
  
  const { text: democraticChooseText } = useTranslate("DEMOCRATIC (You Get to Choose)");
  const { text: democraticSimpleText } = useTranslate("People choose their leaders by voting, just like raising hands!");
  const { text: democraticExampleText } = useTranslate("Like when your class votes to choose the class monitor - everyone gets a say!");
  
  const { text: justiceFairText } = useTranslate("JUSTICE (Being Fair)");
  const { text: justiceSimpleText } = useTranslate("Everyone should be treated fairly - no cheating!");
  const { text: justiceExampleText } = useTranslate("If you and your friend both clean your room, you should both get the same reward!");
  
  const { text: libertyFreedomText } = useTranslate("LIBERTY (Freedom to Choose)");
  const { text: libertySimpleText } = useTranslate("You can think what you want, say what you feel, and believe what you like!");
  const { text: libertyExampleText } = useTranslate("You can choose to like blue or red, pizza or pasta - it's YOUR choice!");
  
  const { text: equalitySameText } = useTranslate("EQUALITY (Everyone is Same)");
  const { text: equalitySimpleText } = useTranslate("Rich or poor, boy or girl, everyone is equal and special!");
  const { text: equalityExampleText } = useTranslate("In class, whether you're tall or short, the teacher treats everyone the same!");
  
  const { text: fraternityFamilyText } = useTranslate("FRATERNITY (We Are Family)");
  const { text: fraternitySimpleText } = useTranslate("All Indians are like one big family who care for each other!");
  const { text: fraternityExampleText } = useTranslate("Like how you help your brother or sister when they fall - we all help each other!");
  
  const { text: bigIdeaText } = useTranslate("The Big Idea!");
  const { text: bigIdeaDescText } = useTranslate("The Preamble is like a promise that all Indians made together: to make India a place where everyone is free, equal, and happy - just like the best playground ever! 🌈");
  
  // Translation hooks for Historical Context
  const { text: historicalContext1Text } = useTranslate("The Preamble to the Constitution of India was adopted on 26 November 1949 by the Constituent Assembly. It was later amended by the 42nd Amendment Act, 1976, which added three important words: Socialist, Secular, and Integrity.");
  const { text: historicalContext2Text } = useTranslate("The Preamble is based on the Objectives Resolution drafted by Jawaharlal Nehru and adopted by the Constituent Assembly on 22 January 1947. It embodies the fundamental values and guiding principles of the Constitution.");
  const { text: historicalContext3Text } = useTranslate("In the famous Kesavananda Bharati case (1973), the Supreme Court ruled that the Preamble is a part of the Constitution and can be used to interpret ambiguous provisions. However, it is not enforceable in a court of law.");
  
  // Translation hooks for Significance
  const { text: significanceText } = useTranslate("Significance of the Preamble");
  const { text: significanceDescText } = useTranslate("The Preamble reflects the philosophy and fundamental values - moral, political, and religious - on which the Constitution is based. It serves as a guiding light, a criterion to examine and evaluate any law and action of the government.");
  const { text: simpleText } = useTranslate("Simple");
  const { text: exampleText } = useTranslate("Example");
  
  return (
    <div className="min-h-screen bg-gray-50 bg-constitution-lines">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Legal Awareness</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">{dashboardText}</Link>
              <Link href="/preamble" className="text-blue-600 font-medium">{preambleText}</Link>
              <Link href="/constitution" className="text-gray-600 hover:text-blue-600 transition-colors">{constitutionText}</Link>
              <Link href="/acts" className="text-gray-600 hover:text-blue-600 transition-colors">{actsText}</Link>
              <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors">{quizText}</Link>
              <Link href="/forum" className="text-gray-600 hover:text-blue-600 transition-colors">{forumText}</Link>
              <LanguageSelector />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ScrollText className="h-4 w-4" />
            <span>{soulOfConstitutionText}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 font-playfair">
            {preambleOfIndiaText}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {preambleDescText}
          </p>
        </div>

        {/* Preamble Images */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* English Preamble */}
          <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-orange-200">
            <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">{englishText}</h2>
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/preamble-english.jpeg"
                alt="Preamble of India in English"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Hindi Preamble */}
          <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-green-200">
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">हिंदी (Hindi)</h2>
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/preamble-hindi.jpeg"
                alt="Preamble of India in Hindi"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowKeyFeatures(!showKeyFeatures)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {keyFeaturesText}
            {showKeyFeatures ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowObjectives(!showObjectives)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {objectivesText}
            {showObjectives ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowExplain(!showExplain)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {simplifyText}
            {showExplain ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowHistoricalContext(!showHistoricalContext)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {historicalContextText}
            {showHistoricalContext ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {/* Key Points Section */}
        {(showKeyFeatures || showObjectives) && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Key Features */}
            {showKeyFeatures && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🇮🇳</span>
                  {keyFeaturesText}
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <div><strong>{sovereignText}:</strong> {sovereignDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <div><strong>{socialistText}:</strong> {socialistDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <div><strong>{secularText}:</strong> {secularDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <div><strong>{democraticText}:</strong> {democraticDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <div><strong>{republicText}:</strong> {republicDescText}</div>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* Objectives */}
            {showObjectives && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  {objectivesText}
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <div>
                      <div><strong>{justiceText}:</strong> {justiceDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <div>
                      <div><strong>{libertyText}:</strong> {libertyDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <div>
                      <div><strong>{equalityText}:</strong> {equalityDescText}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <div>
                      <div><strong>{fraternityText}:</strong> {fraternityDescText}</div>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Explain for 5-year-old */}
        {showExplain && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              🎈 {preambleExplainedText}
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  🏰 {wePeopleText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {wePeopleSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {wePeopleExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  👑 {sovereignBossText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {sovereignSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {sovereignExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-green-600 mb-3">
                  🤝 {socialistSharingText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {socialistSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {socialistExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  🙏 {secularFriendsText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {secularSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {secularExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  🗳️ {democraticChooseText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {democraticSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {democraticExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-pink-600 mb-3">
                  🎯 {justiceFairText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {justiceSimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {justiceExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-yellow-600 mb-3">
                  🕊️ {libertyFreedomText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {libertySimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {libertyExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-teal-600 mb-3">
                  ⚖️ {equalitySameText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {equalitySimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {equalityExampleText}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  💕 {fraternityFamilyText}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>{simpleText}:</strong> {fraternitySimpleText}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {exampleText}: {fraternityExampleText}
                </p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 shadow-md">
                <h3 className="text-2xl font-bold mb-3 text-center text-orange-700">
                  🎉 {bigIdeaText}
                </h3>
                <p className="text-lg leading-relaxed text-center text-gray-800">
                  {bigIdeaDescText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Historical Context */}
        {showHistoricalContext && (
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📖</span>
              {historicalContextText}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div>
                <p>{historicalContext1Text}</p>
              </div>
              <div>
                <p>{historicalContext2Text}</p>
              </div>
              <div>
                <p>{historicalContext3Text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Significance */}
        <div className="bg-white border-l-4 border-orange-500 rounded-lg p-10 shadow-sm">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
            {significanceText}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl font-light">
            {significanceDescText}
          </p>
        </div>
      </main>
    </div>
  );
}
