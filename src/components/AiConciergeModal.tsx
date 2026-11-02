import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Property } from '../types';
import { X, Send, Sparkles, Brain, Bot, User, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
}

export const AiConciergeModal: React.FC<AiConciergeModalProps> = ({
  isOpen,
  onClose,
  contextProperty,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: contextProperty
        ? `Hello! I am the digital assistant for Marina Art (Premier Haus Realty, LLC). We are looking at the concept for ${contextProperty.title} in ${contextProperty.location}. How can I help you explore this neighborhood, local school zones (such as Katy ISD), or discuss home staging ideas?`
        : `Welcome! I am the digital real estate assistant for Marina Art, licensed REALTOR® with Premier Haus Realty, LLC serving Houston, Katy, Cinco Ranch, and surrounding Texas communities. Whether you're curious about Katy ISD schools, Memorial neighborhoods, or how Marina's interior design background helps sellers stage their homes, I am here to help.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useHighThinking, setUseHighThinking] = useState(true); // Default to gemini-4-argon with High Thinking
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          useHighThinking,
          propertyContext: contextProperty
            ? {
                title: contextProperty.title,
                location: contextProperty.location,
                price: contextProperty.price,
                sqFt: contextProperty.sqFt,
                amenities: contextProperty.amenities,
              }
            : null,
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Thank you for your inquiry. Marina Art will be delighted to connect with you directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, an error occurred while connecting. Please reach out to Marina Art directly via the contact form or WhatsApp.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What makes Cinco Ranch in Katy popular for families?',
    'How does Marina’s interior design background help home sellers?',
    'Tell me about living in Memorial Villages vs The Heights.',
    'What should I know when relocating to Houston or Katy, TX?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl h-[88vh] bg-[#0B172E] border border-[#00F0FF]/45 rounded-xs shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#060D1E] border-b border-[#00F0FF]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#0B172E] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-serif-luxury text-[#F0F6FC] tracking-wider">
                  Marina Art &bull; Digital Assistant
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#060D1E] border border-[#00F0FF] text-[#00F0FF] rounded-xs font-mono uppercase font-semibold">
                  Houston & Katy, TX
                </span>
              </div>
              <p className="text-[11px] text-[#CBD5E1] font-editorial">
                Premier Haus Realty, LLC &bull; Community & Staging Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* High Thinking Toggle (gemini-4-argon with ThinkingLevel.HIGH) */}
            <button
              onClick={() => setUseHighThinking(!useHighThinking)}
              title={useHighThinking ? 'Deep Thinking Mode (gemini-4-argon)' : 'Fast Mode (gemini-3.8-flash)'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xs text-[11px] border transition-all cursor-pointer ${
                useHighThinking
                  ? 'bg-[#0B172E] border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-[#060D1E] border-[#00F0FF]/30 text-slate-400'
              }`}
            >
              <Brain className={`w-3.5 h-3.5 ${useHighThinking ? 'text-[#00F0FF]' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {useHighThinking ? 'Deep Thinking: High' : 'Speed Mode'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#CBD5E1] hover:text-[#00F0FF] hover:bg-[#060D1E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#040914]/95">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-4 rounded-xs text-xs leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-[#00F0FF] text-[#040914] font-semibold border border-[#70F3FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-[#0B172E] text-[#F0F6FC] border border-[#00F0FF]/25 font-light'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block mt-2 text-[9px] font-mono text-right ${
                      isUser ? 'text-[#040914]/80' : 'text-[#00F0FF]/80'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xs bg-[#00F0FF] text-[#040914] flex items-center justify-center shrink-0 mt-1 font-bold text-xs shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xs bg-[#060D1E] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#0B172E] border border-[#00F0FF]/25 rounded-xs text-xs text-[#00F0FF] flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
                <span>Executive Assistant analyzing Texas real estate criteria & design context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 bg-[#060D1E] border-t border-[#00F0FF]/20 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-[#00F0FF] uppercase font-semibold shrink-0">
              Suggested:
            </span>
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 text-[11px] bg-[#0B172E] border border-[#00F0FF]/30 text-[#CBD5E1] hover:border-[#00F0FF] hover:text-[#00F0FF] rounded-xs shrink-0 cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-[#060D1E] border-t border-[#00F0FF]/25 flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask about Katy ISD schools, Memorial real estate, or staging advice..."
            className="flex-1 px-4 py-3 bg-[#040914] border border-[#00F0FF]/35 text-[#F0F6FC] rounded-xs text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 bg-[#00F0FF] hover:bg-[#38BDF8] disabled:opacity-40 text-[#040914] font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
