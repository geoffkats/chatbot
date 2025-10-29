import React, { useState, useRef, useEffect } from 'react';
import type { Message, FAQ, Lead } from '../types';
import { getBotResponse, translateText, detectLanguage } from '../services/geminiService';
import { SendIcon, GlobeIcon } from './IconComponents';
import type { Language } from '../App';

interface ChatPanelProps {
  faqs: FAQ[];
  addLead: (lead: Omit<Lead, 'id'>) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const greetings: Record<Language, string> = {
  en: "Hello 👋 Welcome to Zentara! I’m your AI assistant. How can I help you today?",
  es: "¡Hola! 👋 ¡Bienvenido a Zentara! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?",
  fr: "Bonjour 👋 Bienvenue chez Zentara ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
  de: "Hallo 👋 Willkommen bei Zentara! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?",
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ faqs, addLead, language, setLanguage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: greetings[language],
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: greetings[language],
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const originalUserInput = userInput;

    const userMessage: Message = {
      id: new Date().toISOString(),
      text: originalUserInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const inputLanguage = await detectLanguage(originalUserInput);
      let messageForBot = originalUserInput;

      if (inputLanguage !== language) {
        messageForBot = await translateText(originalUserInput, language, inputLanguage);
      }

      let botResponseText = await getBotResponse(messageForBot, faqs, language);
      
      if (inputLanguage !== language) {
        if (!botResponseText.startsWith('LEAD::') && !botResponseText.includes("transferring you to a human agent")) {
           botResponseText = await translateText(botResponseText, inputLanguage, language);
        }
      }

      if (botResponseText.startsWith('LEAD::')) {
        try {
          const jsonString = botResponseText.replace('LEAD::', '');
          const newLead: Omit<Lead, 'id'> = JSON.parse(jsonString);
          addLead(newLead);
          let confirmationText = `Great! I've saved your information for ${newLead.name}. A representative will contact you shortly regarding your interest in ${newLead.interest}. Is there anything else I can help with?`;
          
          if (inputLanguage !== 'en') {
             confirmationText = await translateText(confirmationText, inputLanguage, 'en');
          }

          const confirmationMessage: Message = {
            id: new Date().toISOString() + '-bot',
            text: confirmationText,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, confirmationMessage]);
        } catch (error) {
          console.error("Failed to parse lead JSON:", error);
          const errorMessage: Message = {
            id: new Date().toISOString() + '-bot-error',
            text: "I had a little trouble saving your details. Could you please provide them again?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        const botMessage: Message = {
          id: new Date().toISOString() + '-bot',
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = {
        id: new Date().toISOString() + '-bot-error',
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto">
      <div className="bg-rich-charcoal rounded-3xl shadow-2xl flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-matte-gold/20 flex-shrink-0">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
          <div className="flex-1">
            <div className="font-semibold text-platinum">Zentara</div>
            <div className="text-xs text-green-500">online</div>
          </div>
          <div className="relative flex items-center space-x-1 group">
            <GlobeIcon className="w-5 h-5 text-platinum/70" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent appearance-none cursor-pointer p-1 pr-6 border-none text-platinum text-sm focus:ring-0"
                aria-label="Select language"
            >
                <option value="en" className="bg-rich-charcoal">English</option>
                <option value="es" className="bg-rich-charcoal">Español</option>
                <option value="fr" className="bg-rich-charcoal">Français</option>
                <option value="de" className="bg-rich-charcoal">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-midnight-blue space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow ${
                msg.sender === 'user'
                  ? 'bg-deep-teal text-white rounded-br-none'
                  : 'bg-gray-800 text-platinum rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="max-w-xs px-4 py-2 rounded-2xl shadow bg-gray-800 rounded-bl-none">
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-matte-gold/20 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 w-full bg-midnight-blue border border-gray-700 focus:ring-matte-gold focus:border-matte-gold text-platinum rounded-full px-5 py-3 text-sm placeholder:text-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-matte-gold hover:bg-opacity-90 disabled:bg-matte-gold/50 disabled:cursor-not-allowed text-rich-charcoal rounded-full p-3 transition-colors duration-200"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};