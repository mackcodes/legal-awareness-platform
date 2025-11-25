"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Languages } from "lucide-react";
import { useTranslation } from '../contexts/TranslationContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  simplified?: boolean;
}

export default function ConstitutionChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [simplifyingIndex, setSimplifyingIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only auto-scroll when new messages arrive, not on initial render
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/constitution-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t process your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async (messageIndex: number) => {
    const message = messages[messageIndex];
    if (message.role !== 'assistant' || message.simplified) return;

    setSimplifyingIndex(messageIndex);

    try {
      const response = await fetch('/api/constitution-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: message.content,
          simplify: true 
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = {
          ...message,
          content: data.answer,
          simplified: true,
        };
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Simplify error:', error);
    } finally {
      setSimplifyingIndex(null);
    }
  };

  const formatBotMessage = (content: string) => {
    // Clean up the content first - remove all asterisks used for markdown
    let cleanedContent = content
      .replace(/\*\*\*\*/g, '') // Remove quadruple asterisks
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Convert ** to strong tags
      .replace(/##\s*/g, '<heading>') // Convert ## to custom tag
      .replace(/\*/g, ''); // Remove remaining single asterisks
    
    const sections = cleanedContent.split('\n\n');
    
    return (
      <div className="space-y-3">
        {sections.map((section, idx) => {
          // Check if it's a heading
          if (section.includes('<heading>')) {
            const headingText = section.replace(/<heading>/g, '').trim();
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-5 mb-2 font-crimson first:mt-0">
                {headingText}
              </h3>
            );
          }
          
          // Check if it's a bullet list (contains line breaks with dashes or bullets)
          if ((section.includes('\n-') || section.startsWith('-') || section.includes('\n•') || section.startsWith('•')) && section.split('\n').length > 1) {
            const items = section.split('\n').filter(line => line.trim());
            return (
              <ul key={idx} className="space-y-1.5 ml-1">
                {items.map((item, i) => {
                  // Aggressively remove all types of bullets and dashes
                  let cleanItem = item.trim();
                  // Remove all leading special characters (bullets, dashes, asterisks, dots)
                  cleanItem = cleanItem.replace(/^[-•\*\.]+\s*/, '');
                  // Remove any remaining leading dashes or bullets after whitespace
                  cleanItem = cleanItem.replace(/^\s*[-•\*\.]+\s*/, '');
                  
                  if (!cleanItem || cleanItem === '') return null;
                  
                  return (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="text-blue-600 mt-0.5 font-bold flex-shrink-0 text-sm">•</span>
                      <span 
                        className="notranslate text-gray-700 font-medium text-sm leading-relaxed" 
                        lang={currentLanguage}
                        dangerouslySetInnerHTML={{ __html: cleanItem.replace(/<strong>/g, '<strong class="font-bold text-blue-700">').replace(/<\/strong>/g, '</strong>') }}
                      />
                    </li>
                  );
                })}
              </ul>
            );
          }
          
          // Check if it contains bold text (now using strong tags)
          if (section.includes('<strong>')) {
            return (
              <p 
                key={idx} 
                className="leading-relaxed notranslate text-gray-700 text-sm" 
                lang={currentLanguage}
                dangerouslySetInnerHTML={{ 
                  __html: section.replace(/<strong>/g, '<strong class="font-bold text-blue-700">').replace(/<\/strong>/g, '</strong>') 
                }}
              />
            );
          }
          
          // Regular paragraph
          if (section.trim()) {
            return (
              <p key={idx} className="leading-relaxed notranslate text-gray-700 font-medium text-sm" lang={currentLanguage}>
                {section.trim()}
              </p>
            );
          }
          
          return null;
        }).filter(Boolean)}
      </div>
    );
  };

  const suggestedQuestions = [
    "What is Article 21?",
    "Traffic helpline number",
    "Emergency helpline numbers",
    "How to contest invalid challan?",
  ];

  // Collapsed search bar view
  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 p-3 sm:p-5 cursor-pointer hover:border-blue-300 hover:shadow-xl transition-all duration-300 card-hover"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-md">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Ask legal questions..."
              className="w-full px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm font-medium cursor-pointer"
              readOnly
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>
    );
  }

  // Expanded chatbot view
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-blue-100" data-chatbot="expanded">
      {/* Header with close button */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-5 py-3 sm:py-4 border-b border-blue-500 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-lg font-crimson">Legal AI Assistant</h3>
            <p className="text-blue-100 text-[10px] sm:text-xs font-medium hidden sm:block">Constitution • Traffic • Emergency Services</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages or Empty State */}
      <div 
        ref={messagesContainerRef}
        className="h-[350px] sm:h-[450px] overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-2 sm:px-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3 font-crimson">
              Legal AI Assistant
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md font-medium">
              Ask me anything about Indian Constitution, Key Acts, Traffic Rules, and Emergency Services.
            </p>
            
            {/* Suggested Questions */}
            <div className="w-full max-w-2xl">
              <p className="text-gray-500 text-xs sm:text-sm mb-2 font-semibold">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(question)}
                    className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600 rounded-lg sm:rounded-xl transition-all border border-blue-100 hover:border-blue-300 font-medium shadow-sm hover:shadow-md"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start flex-col'}`}
              >
                <div className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-blue-100'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="text-xs sm:text-sm">{formatBotMessage(message.content)}</div>
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                    <span className="text-[10px] sm:text-xs opacity-60 mt-1 sm:mt-2 block">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                </div>
                
                {message.role === 'assistant' && !message.simplified && (
                  <div className="ml-10 sm:ml-12">
                    <button
                      type="button"
                      onClick={() => handleSimplify(index)}
                      disabled={simplifyingIndex === index}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600 rounded-lg transition-all border border-blue-100 hover:border-blue-300 text-xs sm:text-sm font-medium disabled:opacity-50 shadow-sm hover:shadow-md"
                    >
                      <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                      {simplifyingIndex === index ? 'Simplifying...' : 'Simplify'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="bg-white border border-blue-100 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-600" />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-3 border-t border-blue-100 bg-white/80 backdrop-blur-lg">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-xs sm:text-sm font-medium shadow-sm"
              disabled={loading}
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
