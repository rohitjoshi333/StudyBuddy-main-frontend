import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  RefreshCw, 
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name}! 👋 I'm your AI study assistant. I can help you with:

• **Explaining complex concepts** - Break down difficult topics into simple terms
• **Code review and debugging** - Help you find and fix issues in your code
• **Study planning** - Create personalized study schedules and goals
• **Research assistance** - Help you find relevant resources and materials
• **Problem solving** - Work through challenging problems step by step
• **Writing assistance** - Help with essays, reports, and documentation

What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('code') || lowerInput.includes('programming')) {
      return `Great question about programming! Here's how I can help:

\`\`\`javascript
// Example: Clean code principles
function calculateStudyTime(subjects, hoursPerDay) {
  return subjects.map(subject => ({
    name: subject.name,
    dailyHours: hoursPerDay / subjects.length,
    weeklyHours: (hoursPerDay / subjects.length) * 7
  }));
}
\`\`\`

**Key Programming Tips:**
1. **Write readable code** - Use descriptive variable names
2. **Follow DRY principle** - Don't Repeat Yourself
3. **Test your code** - Write unit tests for reliability
4. **Comment wisely** - Explain the "why", not the "what"

Would you like me to review any specific code or explain a particular concept?`;
    }
    
    if (lowerInput.includes('study') || lowerInput.includes('plan')) {
      return `I'd be happy to help you create an effective study plan! Here's a framework:

## 📚 Effective Study Planning

### **1. Assessment Phase**
- Identify your subjects and topics
- Determine your current knowledge level
- Set specific, measurable goals

### **2. Time Management**
- Use the **Pomodoro Technique** (25 min study + 5 min break)
- Schedule regular review sessions
- Plan for both active learning and practice

### **3. Study Techniques**
- **Active Recall** - Test yourself without looking at notes
- **Spaced Repetition** - Review material at increasing intervals
- **Feynman Technique** - Explain concepts in simple terms

### **4. Progress Tracking**
- Keep a study journal
- Set weekly milestones
- Celebrate small wins

What specific subject or topic would you like to create a study plan for?`;
    }
    
    if (lowerInput.includes('explain') || lowerInput.includes('concept')) {
      return `I love explaining concepts! Here's my approach to breaking down complex topics:

## 🧠 The Learning Pyramid

### **1. Start with the Big Picture**
- What problem does this concept solve?
- How does it fit into the larger subject?
- Why is it important to learn?

### **2. Break It Down**
- Identify the core components
- Use analogies and real-world examples
- Connect to things you already know

### **3. Practice Application**
- Work through examples together
- Apply the concept to different scenarios
- Test your understanding

### **4. Build Connections**
- How does this relate to other concepts?
- What are the practical applications?
- Where might you use this in the future?

**What specific concept would you like me to explain?** Just describe what you're struggling with, and I'll break it down step by step!`;
    }

    return `Thanks for your question! I'm here to help you succeed in your studies. Here are some ways I can assist:

## 🎯 How I Can Help You

### **Academic Support**
- Explain difficult concepts in simple terms
- Help with homework and assignments
- Provide study strategies and techniques
- Create custom study schedules

### **Technical Skills**
- Code review and debugging
- Programming concept explanations
- Project planning and architecture
- Best practices and optimization

### **Research & Writing**
- Help find reliable sources
- Assist with essay structure
- Improve writing clarity
- Citation and formatting help

### **Problem Solving**
- Break down complex problems
- Step-by-step solution approaches
- Alternative methods and strategies
- Critical thinking development

**What specific area would you like to focus on?** Feel free to ask me anything - from basic concepts to advanced topics!`;
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep only the initial message
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-chat-export.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Study Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your personal AI tutor for all subjects
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportChat}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-4xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )
                ) : (
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 ${message.role === 'user' ? 'mr-3' : 'ml-3'}`}>
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
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
                
                {/* Message Actions */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-500 rounded">
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500 rounded">
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything about your studies..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                disabled={isLoading}
              />
              <button className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Sparkles className="h-3 w-3" />
              <span>AI can make mistakes. Verify important information.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;