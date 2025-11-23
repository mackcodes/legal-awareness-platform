"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Scale, Award, CheckCircle, XCircle, Sparkles, Loader2, ChevronDown, Search } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export default function QuizPage() {
  const { addQuizCompletion } = useUserStats();
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // Topic selection state
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Translation hooks for navigation
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  
  // Translation hooks for quiz UI
  const { text: quizCompleteText } = useTranslate("Quiz Complete!");
  const { text: youScoredText } = useTranslate("You scored");
  const { text: outOfText } = useTranslate("out of");
  const { text: takeAgainText } = useTranslate("Take New Quiz");
  const { text: backToDashboardText } = useTranslate("Back to Dashboard");
  const { text: questionText } = useTranslate("Question");
  const { text: ofText } = useTranslate("of");
  const { text: scoreText } = useTranslate("Score");
  const { text: selectTopicText } = useTranslate("Select Topic");
  const { text: chooseTopicText } = useTranslate("Choose a topic...");
  const { text: searchTopicsText } = useTranslate("Search topics...");
  const { text: constitutionTopicsText } = useTranslate("Constitution Topics");
  const { text: legalActsText } = useTranslate("Legal Acts & Laws");
  const { text: customText } = useTranslate("Custom");
  const { text: noTopicsFoundText } = useTranslate("No topics found matching");
  const { text: enterCustomTopicText } = useTranslate("Enter Custom Topic");
  const { text: numQuestionsText } = useTranslate("Number of Questions");
  const { text: difficultyLevelText } = useTranslate("Difficulty Level");
  const { text: easyText } = useTranslate("Easy");
  const { text: mediumText } = useTranslate("Medium");
  const { text: hardText } = useTranslate("Hard");
  const { text: generateQuizText } = useTranslate("Generate Quiz with AI");
  const { text: generatingQuizText } = useTranslate("Generating Quiz with AI...");
  const { text: randomQuizText } = useTranslate("Random Quiz (Surprise Me!)");
  const { text: generatingRandomText } = useTranslate("Generating Random Quiz...");
  const { text: quitQuizText } = useTranslate("Quit Quiz");
  const { text: aiPoweredQuizText } = useTranslate("AI-Powered Quiz");
  const { text: aiPoweredQuestionsText } = useTranslate("AI-Powered Questions");
  const { text: chooseTopicDescText } = useTranslate("Choose a topic to test your knowledge about Indian law and constitution");
  const { text: aiDescriptionText } = useTranslate("Our AI generates unique quiz questions tailored to your selected topic, ensuring a fresh learning experience every time!");
  const { text: orText } = useTranslate("or");
  const { text: perfectScoreText } = useTranslate("Perfect Score! 🎉");
  const { text: greatJobText } = useTranslate("Great Job! 👏");
  const { text: keepLearningText } = useTranslate("Keep Learning! 📚");

  // Predefined topics
  const topics = [
    { value: "fundamental-rights", label: "Fundamental Rights (Articles 12-35)" },
    { value: "directive-principles", label: "Directive Principles of State Policy" },
    { value: "fundamental-duties", label: "Fundamental Duties" },
    { value: "constitutional-amendments", label: "Constitutional Amendments" },
    { value: "preamble", label: "The Preamble" },
    { value: "union-government", label: "Union and its Territory" },
    { value: "citizenship", label: "Citizenship" },
    { value: "union-executive", label: "Union Executive" },
    { value: "parliament", label: "Parliament" },
    { value: "judiciary", label: "Judiciary and Courts" },
    { value: "rti-act", label: "Right to Information Act" },
    { value: "consumer-protection", label: "Consumer Protection Act" },
    { value: "motor-vehicles", label: "Motor Vehicles Act" },
    { value: "traffic-rules", label: "Traffic Rules and Penalties" },
    { value: "ipc-basics", label: "Indian Penal Code Basics" },
    { value: "cpc", label: "Civil Procedure Code" },
    { value: "rte-act", label: "Right to Education Act" },
    { value: "it-act", label: "Information Technology Act" },
    { value: "posh-act", label: "Prevention of Sexual Harassment Act" },
    { value: "pocso-act", label: "POCSO Act" },
    { value: "domestic-violence", label: "Domestic Violence Act" },
    { value: "labour-laws", label: "Labour Laws" },
    { value: "property-laws", label: "Property and Land Laws" },
    { value: "environmental-laws", label: "Environmental Laws" },
    { value: "cyber-laws", label: "Cyber Laws and Crimes" },
    { value: "custom", label: "Custom Topic (Enter your own)" },
  ];

  // Filter topics based on search
  const filteredTopics = topics.filter(topic => 
    topic.label.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const generateQuiz = async () => {
    const topic = selectedTopic === "custom" ? customTopic : topics.find(t => t.value === selectedTopic)?.label;
    
    if (!topic) {
      setGenerationError("Please select a topic");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          numQuestions,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setGenerationError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startRandomQuiz = async () => {
    // Randomly select topic from constitution-related topics
    const constitutionTopics = topics.filter(t => t.value !== 'custom');
    const randomTopic = constitutionTopics[Math.floor(Math.random() * constitutionTopics.length)];
    
    // Randomly select number of questions (5, 7, 10, or 15)
    const questionOptions = [5, 7, 10, 15];
    const randomNumQuestions = questionOptions[Math.floor(Math.random() * questionOptions.length)];
    
    // Randomly select difficulty
    const difficulties = ['easy', 'medium', 'hard'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    setIsGenerating(true);
    setGenerationError("");
    setSelectedTopic(randomTopic.value);
    setNumQuestions(randomNumQuestions);
    setDifficulty(randomDifficulty);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: randomTopic.label,
          numQuestions: randomNumQuestions,
          difficulty: randomDifficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
    } catch (error) {
      console.error('Error generating random quiz:', error);
      setGenerationError('Failed to generate random quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerClick = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  // Track quiz completion
  useEffect(() => {
    if (showScore && questions.length > 0) {
      const quizId = `quiz-${selectedTopic || 'default'}-${Date.now()}`;
      const percentageScore = Math.round((score / questions.length) * 100);
      addQuizCompletion(quizId, percentageScore);
    }
  }, [showScore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.topic-dropdown')) {
        setIsDropdownOpen(false);
        setTopicSearch("");
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setAnswered(false);
    setSelectedTopic("");
    setCustomTopic("");
    setGenerationError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-law-pattern">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Legal Awareness</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">{dashboardText}</Link>
              <Link href="/preamble" className="text-gray-600 hover:text-blue-600 transition-colors">{preambleText}</Link>
              <Link href="/constitution" className="text-gray-600 hover:text-blue-600 transition-colors">{constitutionText}</Link>
              <Link href="/acts" className="text-gray-600 hover:text-blue-600 transition-colors">{actsText}</Link>
              <Link href="/quiz" className="text-blue-600 font-medium">{quizText}</Link>
              <Link href="/forum" className="text-gray-600 hover:text-blue-600 transition-colors">{forumText}</Link>
              <LanguageSelector />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!quizStarted ? (
          /* Topic Selection Screen */
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Quiz</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 font-playfair">Legal Knowledge Quiz</h1>
              <p className="text-gray-600">Choose a topic to test your knowledge about Indian law and constitution</p>
            </div>

            <div className="space-y-6">
              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectTopicText}
                </label>
                <div className="relative topic-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition flex items-center justify-between"
                  >
                    <span className={selectedTopic ? "text-gray-900" : "text-gray-500"}>
                      {selectedTopic ? topics.find(t => t.value === selectedTopic)?.label : chooseTopicText}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={topicSearch}
                            onChange={(e) => setTopicSearch(e.target.value)}
                            placeholder={searchTopicsText}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Topics List */}
                      <div className="overflow-y-auto max-h-80">
                        {filteredTopics.length > 0 ? (
                          <>
                            {/* Constitution Topics */}
                            {filteredTopics.some(t => ['fundamental-rights', 'directive-principles', 'fundamental-duties', 'constitutional-amendments', 'preamble', 'union-government', 'citizenship', 'union-executive', 'parliament', 'judiciary'].includes(t.value)) && (
                              <div>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                  {constitutionTopicsText}
                                </div>
                                {filteredTopics.filter(t => ['fundamental-rights', 'directive-principles', 'fundamental-duties', 'constitutional-amendments', 'preamble', 'union-government', 'citizenship', 'union-executive', 'parliament', 'judiciary'].includes(t.value)).map((topic) => (
                                  <button
                                    key={topic.value}
                                    onClick={() => {
                                      setSelectedTopic(topic.value);
                                      setIsDropdownOpen(false);
                                      setTopicSearch("");
                                    }}
                                    className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm ${selectedTopic === topic.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                  >
                                    {topic.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Legal Acts & Laws */}
                            {filteredTopics.some(t => ['rti-act', 'consumer-protection', 'motor-vehicles', 'traffic-rules', 'ipc-basics', 'cpc', 'rte-act', 'it-act', 'posh-act', 'pocso-act', 'domestic-violence', 'labour-laws', 'property-laws', 'environmental-laws', 'cyber-laws'].includes(t.value)) && (
                              <div>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                  {legalActsText}
                                </div>
                                {filteredTopics.filter(t => ['rti-act', 'consumer-protection', 'motor-vehicles', 'traffic-rules', 'ipc-basics', 'cpc', 'rte-act', 'it-act', 'posh-act', 'pocso-act', 'domestic-violence', 'labour-laws', 'property-laws', 'environmental-laws', 'cyber-laws'].includes(t.value)).map((topic) => (
                                  <button
                                    key={topic.value}
                                    onClick={() => {
                                      setSelectedTopic(topic.value);
                                      setIsDropdownOpen(false);
                                      setTopicSearch("");
                                    }}
                                    className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm ${selectedTopic === topic.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                  >
                                    {topic.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Custom Topic */}
                            {filteredTopics.some(t => t.value === 'custom') && (
                              <div>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                  {customText}
                                </div>
                                {filteredTopics.filter(t => t.value === 'custom').map((topic) => (
                                  <button
                                    key={topic.value}
                                    onClick={() => {
                                      setSelectedTopic(topic.value);
                                      setIsDropdownOpen(false);
                                      setTopicSearch("");
                                    }}
                                    className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm ${selectedTopic === topic.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                  >
                                    {topic.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            {noTopicsFoundText} "{topicSearch}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Topic Input */}
              {selectedTopic === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {enterCustomTopicText}
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g., Article 370, Cyber Laws, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              )}

              {/* Number of Questions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {numQuestionsText}
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={7}>7 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                    <option value={30}>30 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {difficultyLevelText}
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="easy">{easyText}</option>
                    <option value="medium">{mediumText}</option>
                    <option value="hard">{hardText}</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {generationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{generationError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={generateQuiz}
                  disabled={isGenerating || !selectedTopic || (selectedTopic === "custom" && !customTopic)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-4 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {generatingQuizText}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      {generateQuizText}
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">{orText}</div>

                <button
                  onClick={startRandomQuiz}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {generatingRandomText}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      {randomQuizText}
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">{aiPoweredQuestionsText}</p>
                    <p className="text-blue-800">
                      {aiDescriptionText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showScore ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="mb-6">
              <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{quizCompleteText}</h2>
              <p className="text-xl text-gray-600">
                {youScoredText} {score} {outOfText} {questions.length}
              </p>
            </div>
            <div className="mb-6">
              <div className="text-6xl font-bold text-blue-600">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {score === questions.length ? perfectScoreText : score >= questions.length * 0.7 ? greatJobText : keepLearningText}
              </p>
            </div>
            <div className="space-y-3">
              <button onClick={resetQuiz} className="w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md">
                {takeAgainText}
              </button>
              <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition">
                {backToDashboardText}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            {/* Quit Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={resetQuiz}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {quitQuizText}
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {questionText} {currentQuestion + 1} {ofText} {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {questions.length} Questions
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {scoreText}: {score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                
                if (answered) {
                  if (index === questions[currentQuestion].correct) {
                    buttonClass += "border-green-500 bg-green-50 text-green-700";
                  } else if (index === selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-700";
                  } else {
                    buttonClass += "border-gray-200 text-gray-500";
                  }
                } else {
                  buttonClass += "border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900";
                }

                return (
                  <button key={index} onClick={() => handleAnswerClick(index)} disabled={answered} className={buttonClass}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {answered && index === questions[currentQuestion].correct && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                      {answered && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}