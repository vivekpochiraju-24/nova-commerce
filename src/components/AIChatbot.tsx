import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI shopping assistant. How can I help you find the perfect product today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I found some great options for you! Based on your preferences, I'd recommend checking out our Premium Wireless Earbuds Pro - they're currently trending with a 4.8-star rating.",
        "Great choice! That product has excellent reviews. Would you like me to compare similar items or add it to your cart?",
        "I can help you find alternatives in your budget. What price range are you looking for?",
        "Based on what other customers with similar interests bought, you might also like our Smart Watch Series X!",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-neon-cyan"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? 'none' 
            : ['0 0 20px hsl(187 100% 50% / 0.5)', '0 0 40px hsl(187 100% 50% / 0.3)', '0 0 20px hsl(187 100% 50% / 0.5)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] md:w-[400px] rounded-2xl overflow-hidden shadow-large"
          >
            {/* Dark Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
                  <p className="text-xs text-primary-foreground/70">Always here to help</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-card h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-neon-violet to-neon-pink'
                        : 'bg-gradient-to-br from-neon-cyan to-neon-violet'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-tr-md'
                        : 'bg-secondary text-foreground rounded-tl-md'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary p-3 rounded-2xl rounded-tl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="bg-card border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Powered by AI • Responses may vary
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
