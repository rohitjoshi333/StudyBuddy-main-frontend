import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Paperclip, 
  RefreshCw, 
  Settings,
  Minimize2,
  Maximize2,
  X,
  Lightbulb,
  FileText,
  Calculator,
  BookOpen
} from 'lucide-react';
import { AIMessage, AIConversation } from '../../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIAssistantProps {
  workspaceId: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  workspaceId, 
  isMinimized = false,
  onMinimize,
  onMaximize,
  onClose 
}) => {
  const [conversation, setConversation] = useState<AIConversation>({
    id: 'conv-1',
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Hello! I\'m your AI study assistant. I can help you with:\n\n• Explaining complex concepts\n• Summarizing documents\n• Generating study notes\n• Answering questions about your materials\n• Creating practice problems\n\nHow can I assist you today?',
        timestamp: new Date()
      }
    ],
    context: workspaceId,
    createdAt: new Date(),
    lastUpdated: new Date()
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { icon: Lightbulb, text: "Explain this concept", prompt: "Can you explain this concept in simple terms?" },
    { icon: FileText, text: "Summarize document", prompt: "Please summarize the key points from this document" },
    { icon: Calculator, text: "Solve problem", prompt: "Help me solve this step by step" },
    { icon: BookOpen, text: "Create study guide", prompt: "Create a study guide for this topic" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        lastUpdated: new Date()
      }));

      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple mock AI responses
    const responses = [
      `I understand you're asking about "${userInput}". Let me break this down for you:\n\n**Key Points:**\n1. This is a fundamental concept in the field\n2. It relates to several other important topics\n3. Understanding this will help with advanced concepts\n\n**Practical Application:**\nYou can apply this knowledge in real-world scenarios by...\n\n**Study Tips:**\n- Create visual diagrams\n- Practice with examples\n- Connect to previous knowledge\n\nWould you like me to elaborate on any specific aspect?`,
      
      `Great question! Here's a comprehensive explanation:\n\n\`\`\`\n// Example code or formula\nfunction example() {\n  return "This demonstrates the concept";\n}\n\`\`\`\n\n**Step-by-step breakdown:**\n1. First, we need to understand the basics\n2. Then, we apply the principles\n3. Finally, we verify our understanding\n\nThis approach ensures thorough comprehension. Need more examples?`,
      
      `I can help you with that! Based on your question about "${userInput}", here are the main points:\n\n> **Important Note:** This concept is crucial for your studies\n\n- **Definition:** Clear explanation of the term\n- **Examples:** Real-world applications\n- **Practice:** Suggested exercises\n\n**Next Steps:**\n1. Review the material\n2. Try practice problems\n3. Discuss with study partners\n\nShall we dive deeper into any particular area?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    setShowSuggestions(false);
  };

  const clearConversation = () => {
    setConversation(prev => ({
      ...prev,
      messages: [prev.messages[0]], // Keep only the initial message
      lastUpdated: new Date()
    }));
    setShowSuggestions(true);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={onMaximize}
          className="bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? 'Thinking...' : 'Ready to help'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={clearConversation}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={onMinimize}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.role === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            } rounded-lg p-3`}>
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="flex items-center space-x-2 p-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                >
                  <suggestion.icon className="h-3 w-3 text-primary-500" />
                  <span className="text-gray-700 dark:text-gray-300">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              disabled={isLoading}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;