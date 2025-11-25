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
  const { currentLanguage } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
    // Split content into sections
    const sections = content.split('\n\n');
    
    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          // Check if it's a heading (starts with ##)
          if (section.startsWith('##')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-blue-400 mt-4 mb-2">
                {section.replace('##', '').trim()}
              </h3>
            );
          }
          
          // Check if it's a bullet list
          if (section.includes('•') || section.includes('-')) {
            const items = section.split('\n').filter(line => line.trim());
            return (
              <ul key={idx} className="space-y-2 ml-4">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="notranslate" lang={currentLanguage}>
                      {item.replace(/^[•\-]\s*/, '').trim()}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }
          
          // Check if it contains bold text (wrapped in **)
          if (section.includes('**')) {
            const parts = section.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={idx} className="leading-relaxed notranslate" lang={currentLanguage}>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={i} className="font-semibold text-blue-300">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            );
          }
          
          // Regular paragraph
          return (
            <p key={idx} className="leading-relaxed notranslate" lang={currentLanguage}>
              {section}
            </p>
          );
        })}
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
        className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-4 cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Ask about Constitution, Traffic Rules, Emergency Services..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
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
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      {/* Header with close button */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Legal AI Assistant</h3>
            <p className="text-slate-400 text-xs">Constitution • Traffic • Emergency Services</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages or Empty State */}
      <div className="min-h-[500px] max-h-[600px] overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-blue-600 p-4 rounded-2xl mb-6">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Legal AI Assistant
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
              Ask me anything about Indian Constitution, Key Acts, Traffic Rules, and Emergency Services.
            </p>
            
            {/* Suggested Questions */}
            <div className="w-full max-w-2xl">
              <p className="text-slate-500 text-sm mb-3">Try asking:</p>
              <div className="grid grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(question)}
                    className="text-sm px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-slate-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start flex-col'}`}
              >
                <div className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-100 border border-slate-700'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="text-sm">{formatBotMessage(message.content)}</div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                    <span className="text-xs opacity-60 mt-2 block">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                
                {message.role === 'assistant' && !message.simplified && (
                  <div className="ml-14">
                    <button
                      type="button"
                      onClick={() => handleSimplify(index)}
                      disabled={simplifyingIndex === index}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600 text-sm disabled:opacity-50"
                    >
                      <Languages className="h-4 w-4" />
                      {simplifyingIndex === index ? 'Simplifying...' : 'Simplify'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="text-sm text-slate-300">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
              disabled={loading}
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
