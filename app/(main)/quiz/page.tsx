"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Scale, Award, CheckCircle, XCircle, Sparkles, Loader2, ChevronDown, Search, Clock, Lightbulb, History, Trophy, Info, X } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";
import Leaderboard from "../../components/Leaderboard";
import ResponsiveNav from "../../components/ResponsiveNav";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  hint?: string;
  explanation?: string;
}

interface QuizAttempt {
  id: string;
  topic: string;
  difficulty: string;
  numQuestions: number;
  score: number;
  percentage: number;
  timeTaken: number; // seconds
  date: string;
  hintsUsed: number;
}

export default function QuizPage() {
  const { user } = useUser();
  const { addQuizCompletion, saveQuizAttempt } = useUserStats();
  const quizCompletedRef = useRef(false);
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuizConfig, setActiveQuizConfig] = useState({ topic: "", difficulty: "medium", numQuestions: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [hintVisibility, setHintVisibility] = useState<Record<number, boolean>>({});
  const [timedOut, setTimedOut] = useState(false);
  const [lastQuizDuration, setLastQuizDuration] = useState(0);
  
  // Topic selection state
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [aiReport, setAiReport] = useState<string>("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  const historyKey = useMemo(() => `quizHistory-${user?.id ?? 'guest'}`, [user?.id]);
  const leaderboard = useMemo(
    () =>
      [...quizHistory]
        .sort((a, b) => {
          if (b.percentage !== a.percentage) return b.percentage - a.percentage;
          return a.timeTaken - b.timeTaken;
        })
        .slice(0, 5),
    [quizHistory]
  );

  const recentHistory = useMemo(() => quizHistory.slice(0, 5), [quizHistory]);
  const hintsUsedThisQuiz = useMemo(
    () => Object.values(hintVisibility).filter(Boolean).length,
    [hintVisibility]
  );
  const averageTimePerQuestion = useMemo(() => {
    if (questions.length === 0 || lastQuizDuration === 0) {
      return 0;
    }
    return Math.max(1, Math.round(lastQuizDuration / questions.length));
  }, [questions.length, lastQuizDuration]);
  const isTimerCritical = questionTimeLimit > 0 && timeLeft <= Math.max(5, Math.floor(questionTimeLimit * 0.25));
  const timerProgress = questionTimeLimit > 0 ? Math.max(0, Math.min(100, (timeLeft / questionTimeLimit) * 100)) : 0;
  const hintShownForCurrentQuestion = !!hintVisibility[currentQuestion];
  const isLastQuestion = questions.length > 0 && currentQuestion === questions.length - 1;

  const getTimeLimitForDifficulty = (level: string) => {
    switch (level) {
      case "easy":
        return 60;
      case "hard":
        return 25;
      default:
        return 40;
    }
  };

  const initializeQuestionTimer = (level: string) => {
    const limit = getTimeLimitForDifficulty(level);
    setQuestionTimeLimit(limit);
    setTimeLeft(limit);
  };

  const initializeQuizSession = (topicLabel: string, totalQuestions: number, difficultyLevel: string) => {
    setActiveQuizConfig({ topic: topicLabel, difficulty: difficultyLevel, numQuestions: totalQuestions });
    setHintVisibility({});
    setTimedOut(false);
    setQuizStartTime(Date.now());
    initializeQuestionTimer(difficultyLevel);
  };

  const formatSeconds = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const proceedToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setAnswered(false);
      setTimedOut(false);
      initializeQuestionTimer(activeQuizConfig.difficulty);
    } else {
      // Stop the timer immediately when showing results
      setTimeLeft(0);
      setShowScore(true);
    }
  };

  // Load and persist quiz history for leaderboard & insights
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        setQuizHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error parsing quiz history:', error);
    }
  }, [historyKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(historyKey, JSON.stringify(quizHistory.slice(0, 50)));
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  }, [quizHistory, historyKey]);

  useEffect(() => {
    if (!quizStarted || showScore) return;
    if (answered) return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, answered, timeLeft, showScore]);

  useEffect(() => {
    if (!quizStarted || showScore) return;
    if (answered) return;
    if (timeLeft > 0) return;

    setTimedOut(true);
    setAnswered(true);
    setSelectedAnswer(null);
  }, [timeLeft, quizStarted, showScore, answered]);

  useEffect(() => {
    if (!showScore || questions.length === 0) return;
    if (!quizStartTime || quizCompletedRef.current) return; // Prevent running multiple times

    // Mark as completed
    quizCompletedRef.current = true;

    const quizId = `quiz-${activeQuizConfig.topic || 'default'}-${Date.now()}`;
    const percentageScore = Math.round((score / questions.length) * 100);

    // Calculate final time taken immediately when quiz ends
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
    setLastQuizDuration(timeTaken);

    // Calculate points based on score, difficulty, and time
    const calculatePoints = () => {
      const basePoints = score * 10;
      const difficultyMultiplier = activeQuizConfig.difficulty === 'hard' ? 2 : activeQuizConfig.difficulty === 'medium' ? 1.5 : 1;
      const timeBonus = timeTaken < questionTimeLimit * questions.length * 0.5 ? 50 : 0;
      return Math.round(basePoints * difficultyMultiplier + timeBonus);
    };

    const points = calculatePoints();

    console.log('🎯 Quiz completed! Attempting to save...');
    console.log('📊 Quiz stats:', { 
      quizId, 
      topic: activeQuizConfig.topic,
      score, 
      percentage: percentageScore,
      points,
      timeTaken 
    });

    // Save quiz attempt to MongoDB (stats and leaderboard data only)
    saveQuizAttempt({
      quizId,
      topic: activeQuizConfig.topic || 'Custom Quiz',
      difficulty: activeQuizConfig.difficulty as 'easy' | 'medium' | 'hard',
      numQuestions: questions.length,
      score,
      percentage: percentageScore,
      points,
      timeTaken,
    }).then((success) => {
      if (success) {
        console.log('✅ Quiz data saved to MongoDB');
      } else {
        console.error('❌ Failed to save quiz data to MongoDB');
      }
    }).catch((error) => {
      console.error('❌ Exception while saving quiz:', error);
    });

    // Keep localStorage history for immediate UI updates
    const attempt: QuizAttempt = {
      id: quizId,
      topic: activeQuizConfig.topic || 'Custom Quiz',
      difficulty: activeQuizConfig.difficulty,
      numQuestions: questions.length,
      score,
      percentage: percentageScore,
      timeTaken,
      date: new Date().toISOString(),
      hintsUsed: hintsUsedThisQuiz,
    };

    setQuizHistory((prev) => [attempt, ...prev].slice(0, 50));
  }, [showScore, questions.length, score, saveQuizAttempt, activeQuizConfig, quizStartTime, hintsUsedThisQuiz, questionTimeLimit]);

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
  const { text: showHintLabelText } = useTranslate("Show Hint");
  const { text: hintShownLabelText } = useTranslate("Hint Shown");
  const { text: hintTitleText } = useTranslate("Hint");
  const { text: explanationTitleText } = useTranslate("Explanation");
  const { text: timeExpiredText } = useTranslate("Time's up! This question was marked incorrect.");
  const { text: nextQuestionText } = useTranslate("Next Question");
  const { text: viewResultsText } = useTranslate("View Results");
  const { text: leaderboardTitleText } = useTranslate("Leaderboard");
  const { text: recentAttemptsText } = useTranslate("Recent Attempts");
  const { text: timeTakenText } = useTranslate("Time Taken");
  const { text: avgTimePerQuestionText } = useTranslate("Avg Time per Question");
  const { text: hintsUsedText } = useTranslate("Hints Used");
  const { text: timerLabelText } = useTranslate("Timer");
  const { text: noAttemptsText } = useTranslate("No attempts yet.");
  const { text: viewAllText } = useTranslate("View All");
  const { text: hideDetailsText } = useTranslate("Hide Details");

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

    if (isGenerating) return; // Prevent multiple clicks

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
      const normalizedQuestions: QuizQuestion[] = data.questions.map((question: QuizQuestion, index: number) => ({
        ...question,
        hint: question.hint || `Revisit the key principles behind this legal concept to guide your answer for question ${index + 1}.`,
        explanation: question.explanation || "Refer back to the relevant article or act to reinforce this concept.",
      }));

      setQuestions(normalizedQuestions);
      initializeQuizSession(topic, normalizedQuestions.length, difficulty);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
      setAnswered(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setGenerationError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startRandomQuiz = async () => {
    if (isGenerating) return; // Prevent multiple clicks

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
      const normalizedQuestions: QuizQuestion[] = data.questions.map((question: QuizQuestion, index: number) => ({
        ...question,
        hint: question.hint || `Think about why this law was introduced to uncover the answer for question ${index + 1}.`,
        explanation: question.explanation || "Cross-check the provisions of this law to understand the rationale.",
      }));

      setQuestions(normalizedQuestions);
      initializeQuizSession(randomTopic.label, normalizedQuestions.length, randomDifficulty);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
      setAnswered(false);
    } catch (error) {
      console.error('Error generating random quiz:', error);
      setGenerationError('Failed to generate random quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const showHintForCurrentQuestion = () => {
    setHintVisibility((prev) => {
      if (prev[currentQuestion]) {
        return prev;
      }
      return { ...prev, [currentQuestion]: true };
    });
  };

  const handleAnswerClick = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    setTimedOut(false);

    // Track user's answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

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

  const generatePerformanceReport = async () => {
    setGeneratingReport(true);
    setShowReport(true);

    try {
      // Calculate hints used
      const hintsUsedCount = Object.keys(hintVisibility).filter(key => hintVisibility[parseInt(key)]).length;

      // Prepare quiz analysis data
      const incorrectQuestions = questions
        .map((q, idx) => ({
          question: q.question,
          userAnswer: userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : "No answer",
          correctAnswer: q.options[q.correct],
          explanation: q.explanation || "",
          topic: activeQuizConfig.topic
        }))
        .filter((_, idx) => userAnswers[idx] === undefined || userAnswers[idx] !== questions[idx].correct);

      console.log('Sending report request:', {
        topic: activeQuizConfig.topic,
        difficulty: activeQuizConfig.difficulty,
        score,
        totalQuestions: questions.length,
        incorrectCount: incorrectQuestions.length,
        hintsUsed: hintsUsedCount,
      });

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: activeQuizConfig.topic,
          difficulty: activeQuizConfig.difficulty,
          score,
          totalQuestions: questions.length,
          incorrectQuestions,
          hintsUsed: hintsUsedCount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const data = await response.json();
      setAiReport(data.report);
    } catch (error) {
      console.error('Error generating report:', error);
      setAiReport('Failed to generate performance report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

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
    setHintVisibility({});
    setTimeLeft(0);
    setQuestionTimeLimit(0);
    setQuizStartTime(null);
    setActiveQuizConfig({ topic: "", difficulty: "medium", numQuestions: 0 });
    setLastQuizDuration(0);
    setShowReport(false);
    setAiReport("");
    setUserAnswers([]);
    quizCompletedRef.current = false; // Reset completion tracker
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-law-pattern">
      <ResponsiveNav currentPage="quiz" />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
        {!quizStarted && quizHistory.length > 0 && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">{recentAttemptsText}</h2>
              </div>
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showHistoryPanel ? hideDetailsText : viewAllText}
              </button>
            </div>
            <div className="space-y-3">
              {recentHistory.map((attempt) => (
                <div key={attempt.id} className="border border-gray-100 rounded-lg p-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 sm:items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{attempt.topic}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.date).toLocaleString()} · {attempt.difficulty} · {attempt.numQuestions} questions
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <span className="font-semibold text-blue-600">{attempt.score}/{attempt.numQuestions}</span>
                    <span className="text-gray-500">{attempt.percentage}%</span>
                    <span className="text-gray-500">{formatSeconds(attempt.timeTaken)}</span>
                  </div>
                </div>
              ))}
            </div>
            {showHistoryPanel && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Full History</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {quizHistory.map((attempt) => (
                    <div key={attempt.id} className="border border-gray-100 rounded-lg p-3 flex flex-wrap gap-4 items-center text-sm">
                      <span className="font-medium text-gray-900">{attempt.topic}</span>
                      <span className="text-gray-500">{new Date(attempt.date).toLocaleDateString()}</span>
                      <span className="text-gray-500">{attempt.difficulty}</span>
                      <span className="text-gray-500">{attempt.numQuestions} questions</span>
                      <span className="font-semibold text-blue-600">{attempt.percentage}%</span>
                      <span className="text-gray-500">{hintsUsedText}: {attempt.hintsUsed}</span>
                      <span className="text-gray-500">Duration: {formatSeconds(attempt.timeTaken)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!quizStarted ? (
          /* Topic Selection Screen */
          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">AI-Powered Quiz</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 font-playfair">Legal Knowledge Quiz</h1>
              <p className="text-sm sm:text-base text-gray-600">Choose a topic to test your knowledge about Indian law and constitution</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
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
                            suppressHydrationWarning
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
                    suppressHydrationWarning
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    generateQuiz();
                  }}
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startRandomQuiz();
                  }}
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
          <div className="space-y-4 sm:space-y-6">
            {/* Main Results Card */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm border border-gray-200 text-center">
              <div className="mb-4 sm:mb-6">
                <Award className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{quizCompleteText}</h2>
                <p className="text-lg sm:text-xl text-gray-600">
                  {youScoredText} {score} {outOfText} {questions.length}
                </p>
              </div>
              <div className="mb-4 sm:mb-6">
                <div className="text-4xl sm:text-6xl font-bold text-blue-600">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {score === questions.length ? perfectScoreText : score >= questions.length * 0.7 ? greatJobText : keepLearningText}
                </p>
              </div>

              {/* Quiz Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">{timeTakenText}</p>
                  <p className="text-lg font-bold text-blue-900">{formatSeconds(lastQuizDuration)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-purple-600 font-medium mb-1">{avgTimePerQuestionText}</p>
                  <p className="text-lg font-bold text-purple-900">{formatSeconds(averageTimePerQuestion)}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-xs text-yellow-600 font-medium mb-1">{hintsUsedText}</p>
                  <p className="text-lg font-bold text-yellow-900">{hintsUsedThisQuiz}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={generatePerformanceReport}
                  disabled={generatingReport}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generatingReport ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating AI Report...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Get AI Performance Report</span>
                    </>
                  )}
                </button>
                <button onClick={resetQuiz} className="w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md">
                  {takeAgainText}
                </button>
                <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition">
                  {backToDashboardText}
                </Link>
              </div>

              {/* AI Performance Report Modal */}
              {showReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowReport(false)}>
                  <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Sparkles className="h-8 w-8" />
                          <div>
                            <h2 className="text-2xl font-bold">AI Performance Report</h2>
                            <p className="text-purple-100 text-sm">Personalized learning recommendations</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowReport(false)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                      {generatingReport ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                          <p className="text-gray-600">Analyzing your performance...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {aiReport.split('\n').map((line, index) => {
                            // Headings with emojis
                            if (line.match(/^(📊|🎯|📚|💡|🎓)/)) {
                              return (
                                <div key={index} className="mt-6 mb-3">
                                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {line}
                                  </h3>
                                  <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
                                </div>
                              );
                            }
                            // Section headers (### or ##)
                            if (line.startsWith('###')) {
                              return (
                                <h4 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                  {line.replace(/###/g, '').trim()}
                                </h4>
                              );
                            }
                            if (line.startsWith('##')) {
                              return (
                                <h3 key={index} className="text-xl font-bold text-gray-900 mt-5 mb-3">
                                  {line.replace(/##/g, '').trim()}
                                </h3>
                              );
                            }
                            // Bullet points
                            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                              const content = line.replace(/^[-•]\s*/, '').trim();
                              // Bold text in **
                              const formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
                              return (
                                <div key={index} className="flex gap-3 ml-4 mb-2">
                                  <span className="text-purple-600 mt-1.5 flex-shrink-0">•</span>
                                  <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }}></p>
                                </div>
                              );
                            }
                            // Regular paragraphs
                            if (line.trim()) {
                              const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
                              return (
                                <p key={index} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }}></p>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{leaderboardTitleText}</h3>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((attempt, index) => (
                    <div 
                      key={attempt.id} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-50 border border-yellow-200' : 
                        index === 1 ? 'bg-gray-50 border border-gray-200' : 
                        index === 2 ? 'bg-orange-50 border border-orange-200' : 
                        'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{attempt.topic}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(attempt.date).toLocaleDateString()} · {attempt.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{attempt.percentage}%</p>
                        <p className="text-xs text-gray-500">{formatSeconds(attempt.timeTaken)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <div className="flex items-center gap-3">
                  {/* Timer Display */}
                  {questionTimeLimit > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${
                      isTimerCritical ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Clock className={`h-4 w-4 ${isTimerCritical ? 'animate-pulse' : ''}`} />
                      <span>{formatSeconds(timeLeft)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-blue-600">
                    {scoreText}: {score}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
              </div>
              {/* Timer Progress Bar */}
              {questionTimeLimit > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className={`h-1 rounded-full transition-all ${
                      isTimerCritical ? 'bg-red-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${timerProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h2>

            {/* Hint Button */}
            {!answered && questions[currentQuestion].hint && (
              <div className="mb-6">
                <button
                  onClick={showHintForCurrentQuestion}
                  disabled={hintShownForCurrentQuestion}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {hintShownForCurrentQuestion ? hintShownLabelText : showHintLabelText}
                  </span>
                </button>
                {hintShownForCurrentQuestion && (
                  <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900 mb-1">{hintTitleText}</p>
                        <p className="text-sm text-yellow-800">{questions[currentQuestion].hint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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

            {/* Timeout Message */}
            {timedOut && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{timeExpiredText}</p>
              </div>
            )}

            {/* Explanation/Feedback after answer */}
            {answered && questions[currentQuestion].explanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">{explanationTitleText}</p>
                    <p className="text-sm text-blue-800">{questions[currentQuestion].explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            {answered && (
              <div className="mt-6">
                <button
                  onClick={proceedToNextQuestion}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {isLastQuestion ? viewResultsText : nextQuestionText}
                  <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                </button>
              </div>
            )}
          </div>
        )}
          </div>

          {/* Right Sidebar - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Leaderboard compact={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}