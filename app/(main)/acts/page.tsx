"use client";

import Link from "next/link";
import { Scale, Search, ChevronLeft, ChevronRight, Book, FileText, DollarSign } from "lucide-react";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";
import { INDIAN_ACTS } from "../../data/acts";
import { useState } from "react";
import ResponsiveNav from "../../components/ResponsiveNav";

export default function ActsPage() {
  const { incrementArticlesRead, updateLearningProgress, stats } = useUserStats();
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<string | null>(null);
  const [showFines, setShowFines] = useState<boolean>(false);
  const [showChallenge, setShowChallenge] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Translation hooks for page text
  const { text: keyLegalActsText } = useTranslate("Key Legal Acts");
  const { text: essentialLawsText } = useTranslate("Essential laws that govern different aspects of life in India");
  const { text: searchActsText } = useTranslate("Search acts by name or category...");
  const { text: backText } = useTranslate("Back");
  const { text: previousText } = useTranslate("Previous");
  const { text: nextText } = useTranslate("Next");
  const { text: sectionsText } = useTranslate("Sections");
  const { text: enactedText } = useTranslate("Enacted");
  const { text: lastAmendedText } = useTranslate("Last Amended");
  const { text: objectivesText } = useTranslate("Objectives");
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  
  // Translation hooks for fines and challenge sections
  const { text: viewFinesButtonText } = useTranslate("View Traffic Fines & Penalties");
  const { text: challengeButtonText } = useTranslate("Challenge Wrong Charges");
  const { text: finesHeaderText } = useTranslate("Traffic Fines & Penalties");
  const { text: finesDescText } = useTranslate("Common traffic violations and their penalties under the Motor Vehicles Act");
  const { text: violationText } = useTranslate("Violation");
  const { text: fineAmountText } = useTranslate("Fine Amount");
  const { text: challengeHeaderText } = useTranslate("How to Challenge Wrong Traffic Charges");
  const { text: challengeDescText } = useTranslate("Step-by-step guide to dispute incorrect traffic fines and penalties");
  const { text: stepsHeaderText } = useTranslate("Steps to Challenge a Traffic Challan");
  const { text: commonGroundsText } = useTranslate("Common Grounds for Challenging");
  const { text: officialWebsitesText } = useTranslate("Official Websites & Resources");
  const { text: helplineNumbersText } = useTranslate("Helpline Numbers");
  const { text: officersToContactText } = useTranslate("Officers to Contact");

  const selectedAct = selectedActId ? INDIAN_ACTS.find(act => act.id === selectedActId) : null;
  const selectedSection = selectedAct && selectedSectionNumber 
    ? selectedAct.sections.find(sec => sec.number === selectedSectionNumber) 
    : null;

  // Filter acts based on search query
  const filteredActs = INDIAN_ACTS.filter(act => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      act.name.toLowerCase().includes(query) ||
      act.fullName.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query) ||
      act.category.toLowerCase().includes(query)
    );
  });

  const handleActClick = (actId: string) => {
    setSelectedActId(actId);
    setSelectedSectionNumber(null);
    setShowFines(false);
    setShowChallenge(false);
    // Track when user clicks to read an act
    incrementArticlesRead(actId);
  };

  const handleSectionClick = (sectionNumber: string) => {
    setSelectedSectionNumber(sectionNumber);
    setShowFines(false);
    setShowChallenge(false);
    // Track section read
    if (selectedAct) {
      incrementArticlesRead(`${selectedAct.id}-section-${sectionNumber}`);
      
      // Calculate progress based on sections read
      const totalSections = selectedAct.sections.length;
      const sectionsRead = stats.readArticles.filter(id => 
        id.startsWith(`${selectedAct.id}-section-`)
      ).length + 1; // +1 for the current section
      const progress = Math.round((sectionsRead / totalSections) * 100);
      updateLearningProgress(selectedAct.id, progress);
    }
  };

  const handleBack = () => {
    if (selectedSectionNumber) {
      setSelectedSectionNumber(null);
    } else if (showFines) {
      setShowFines(false);
    } else if (showChallenge) {
      setShowChallenge(false);
    } else if (selectedActId) {
      setSelectedActId(null);
    }
  };

  const getCurrentSectionIndex = () => {
    if (!selectedAct || !selectedSectionNumber) return -1;
    return selectedAct.sections.findIndex(sec => sec.number === selectedSectionNumber);
  };

  const goToPreviousSection = () => {
    if (!selectedAct) return;
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      setSelectedSectionNumber(selectedAct.sections[currentIndex - 1].number);
    }
  };

  const goToNextSection = () => {
    if (!selectedAct) return;
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < selectedAct.sections.length - 1) {
      setSelectedSectionNumber(selectedAct.sections[currentIndex + 1].number);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-law-pattern">
      <ResponsiveNav currentPage="acts" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-playfair">{keyLegalActsText}</h1>
          <p className="text-base sm:text-lg text-gray-600">{essentialLawsText}</p>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder={searchActsText} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Back Button - Show when viewing act or section */}
        {(selectedActId) && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">{backText}</span>
          </button>
        )}

        {/* Section Detail View */}
        {selectedSection && selectedAct && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-lg">
                  Section {selectedSection.number}
                </span>
                <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  {selectedAct.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-playfair">
                {selectedSection.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">{selectedSection.description}</p>
            </div>

            {selectedSection.content && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedSection.content}
                </p>
              </div>
            )}

            {/* Navigation between sections */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={goToPreviousSection}
                disabled={getCurrentSectionIndex() === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  getCurrentSectionIndex() === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>{previousText}</span>
              </button>
              <button
                onClick={goToNextSection}
                disabled={getCurrentSectionIndex() === selectedAct.sections.length - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  getCurrentSectionIndex() === selectedAct.sections.length - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{nextText}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Sections List View */}
        {selectedAct && !selectedSection && !showFines && !showChallenge && (
          <div>
            <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Book className="h-8 w-8 text-blue-600" />
                <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full border border-gray-300">
                  {selectedAct.year}
                </span>
                <span className="bg-green-50 text-green-600 text-sm font-semibold px-3 py-1 rounded-full border border-green-200">
                  {selectedAct.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-playfair">{selectedAct.fullName}</h2>
              <p className="text-gray-600 mb-4">{selectedAct.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                {selectedAct.enactedDate && (
                  <div>
                    <span className="text-gray-500">{enactedText}: </span>
                    <span className="font-semibold text-gray-900">{selectedAct.enactedDate}</span>
                  </div>
                )}
                {selectedAct.lastAmended && (
                  <div>
                    <span className="text-gray-500">{lastAmendedText}: </span>
                    <span className="font-semibold text-gray-900">{selectedAct.lastAmended}</span>
                  </div>
                )}
              </div>

              {selectedAct.objectives && selectedAct.objectives.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{objectivesText}</h3>
                  <ul className="space-y-2">
                    {selectedAct.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Show Fines Button for Motor Vehicles Act */}
            {selectedAct.id === 'motor-act' && selectedAct.fines && selectedAct.fines.length > 0 && (
              <div className="mb-8 flex gap-4">
                <button
                  onClick={() => setShowFines(true)}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 transition shadow-md font-semibold"
                >
                  {viewFinesButtonText}
                </button>
                <button
                  onClick={() => setShowChallenge(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition shadow-md font-semibold"
                >
                  {challengeButtonText}
                </button>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">
              {sectionsText} ({selectedAct.sections.length})
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {selectedAct.sections.map((section) => (
                <div
                  key={section.number}
                  onClick={() => handleSectionClick(section.number)}
                  className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                >
                  <div className="mb-3">
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                      Section {section.number}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{section.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fines View */}
        {selectedAct && showFines && selectedAct.fines && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">{finesHeaderText}</h2>
              <p className="text-gray-600">Comprehensive list of fines as per Motor Vehicles Act, 1988 (Amended 2019)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{violationText}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Section</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Penalty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Imprisonment</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAct.fines.map((fine, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">{fine.violation}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{fine.section}</td>
                      <td className="px-4 py-4 text-sm text-red-600 font-semibold">{fine.penalty}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{fine.imprisonment || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The penalties mentioned are as per the Motor Vehicles (Amendment) Act, 2019. 
                Actual fines may vary by state as regional governments may impose additional charges.
              </p>
            </div>
          </div>
        )}

        {/* Challenge Wrong Charges View */}
        {selectedAct && showChallenge && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-4">{challengeHeaderText}</h2>
              <p className="text-gray-600">{challengeDescText}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{stepsHeaderText}</h3>
                <ol className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verify the Challan Details</h4>
                      <p className="text-gray-600 text-sm mt-1">Check the challan number, date, time, location, and violation mentioned. Take photographs of the scene if possible.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Collect Evidence</h4>
                      <p className="text-gray-600 text-sm mt-1">Gather supporting documents: vehicle registration, insurance, driving license, dashcam footage, photographs, witness statements, and GPS data if available.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">File an Appeal Online</h4>
                      <p className="text-gray-600 text-sm mt-1">Visit your state's e-challan portal (e.g., eChallan.parivahan.gov.in) or traffic police website. Login with your credentials and submit an appeal with supporting documents.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Submit Written Representation</h4>
                      <p className="text-gray-600 text-sm mt-1">If online appeal is not available, submit a written representation to the issuing authority (traffic police station or RTO) within 60 days of receiving the challan.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Attend Hearing (if required)</h4>
                      <p className="text-gray-600 text-sm mt-1">You may be called for a hearing. Present your evidence clearly and respectfully explain why the charge is incorrect.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">6</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Approach Court if Appeal Rejected</h4>
                      <p className="text-gray-600 text-sm mt-1">If your appeal is rejected, you can file a petition in the Magistrate Court within 90 days, presenting your case with legal assistance if needed.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Common Grounds for Challenging</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Wrong vehicle number:</strong> Challan issued to incorrect registration number</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Vehicle was sold:</strong> You sold the vehicle before the violation date</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Incorrect date/time/location:</strong> You were not at the mentioned location at that time</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Duplicate challan:</strong> Fine already paid for the same violation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Medical emergency:</strong> Violation occurred during genuine emergency</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Faulty equipment:</strong> Speed camera or detection equipment malfunction</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700"><strong>Unclear signage:</strong> Traffic signs were missing, obscured, or confusing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Important Information</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><strong>Time Limit:</strong> Appeals must be filed within 60 days of receiving the challan notice.</p>
                  <p><strong>Payment:</strong> You can contest without paying first, but if you lose the appeal, you may face additional penalties.</p>
                  <p><strong>Documentation:</strong> Keep all original documents and make copies for submission.</p>
                  <p><strong>Legal Help:</strong> For complex cases, consider consulting a traffic lawyer or advocate.</p>
                  <p><strong>Online Portal:</strong> Most states now offer online appeal systems - check your state transport department website.</p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Official Websites & Portals</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">National e-Challan Portal</h4>
                    <a href="https://echallan.parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">echallan.parivahan.gov.in</a>
                    <p className="text-gray-600 text-xs mt-1">Check and pay challans, file appeals online</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">VAHAN - Vehicle Information</h4>
                    <a href="https://vahan.parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vahan.parivahan.gov.in</a>
                    <p className="text-gray-600 text-xs mt-1">Vehicle registration details and RC information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Ministry of Road Transport</h4>
                    <a href="https://morth.nic.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">morth.nic.in</a>
                    <p className="text-gray-600 text-xs mt-1">Official government portal for transport rules</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">State Transport Department Websites</h4>
                    <p className="text-gray-600 text-xs">Search for "[Your State] Transport Department" for state-specific portals</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Helpline Numbers</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">National Traffic Helpline</h4>
                      <p className="text-2xl font-bold text-indigo-600">1073</p>
                      <p className="text-gray-600 text-xs">For traffic-related complaints and assistance</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mt-3">Police Emergency</h4>
                      <p className="text-2xl font-bold text-indigo-600">100</p>
                      <p className="text-gray-600 text-xs">24/7 police emergency services</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mt-3">Highway Emergency</h4>
                      <p className="text-2xl font-bold text-indigo-600">1033</p>
                      <p className="text-gray-600 text-xs">National highway emergency assistance</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mt-3">Women Safety Helpline</h4>
                      <p className="text-2xl font-bold text-indigo-600">1091</p>
                      <p className="text-gray-600 text-xs">For women in distress</p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Officers to Contact</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">Traffic Police Station</h4>
                      <p className="text-gray-600">Visit the traffic police station mentioned on your challan</p>
                      <p className="text-xs text-gray-500 mt-1">Contact: Station House Officer (SHO)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Regional Transport Office (RTO)</h4>
                      <p className="text-gray-600">For registration and licensing related issues</p>
                      <p className="text-xs text-gray-500 mt-1">Contact: Regional Transport Officer</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Deputy Commissioner of Police (Traffic)</h4>
                      <p className="text-gray-600">For escalated complaints and appeals</p>
                      <p className="text-xs text-gray-500 mt-1">Available at district headquarters</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">State Transport Commissioner</h4>
                      <p className="text-gray-600">Highest authority for transport matters in state</p>
                      <p className="text-xs text-gray-500 mt-1">For major grievances and policy issues</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Filing false appeals or providing misleading information can result in additional penalties and legal consequences. Only challenge challans if you have genuine grounds and supporting evidence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Acts Grid View (Home) */}
        {!selectedActId && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredActs.length > 0 ? filteredActs.map((act) => (
              <div 
                key={act.id} 
                onClick={() => handleActClick(act.id)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                        {act.category}
                      </span>
                      <span className="text-sm text-gray-500">{act.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">{act.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{act.description}</p>
                    <p className="text-xs text-gray-500">{act.sections.length} sections</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400 ml-4 flex-shrink-0" />
                </div>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No acts found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}