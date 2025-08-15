'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, BarChart3, Beer, Coffee } from 'lucide-react'
import { generateAIResponse } from '../utils/aiResponses'
import Navigation from '../components/Navigation'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface SuggestedQuestion {
  text: string
  icon: any
  category: string
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm CraftBot, your AI brewing assistant. I can help you with brewing questions, recipe advice, beer styles, troubleshooting, and analyzing your data. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: "How do I calculate ABV for my recipe?",
      icon: BarChart3,
      category: "Recipe Analysis"
    },
    {
      text: "What's the difference between ale and lager yeast?",
      icon: Beer,
      category: "Brewing Science"
    },
    {
      text: "My beer tastes too bitter, how can I fix it?",
      icon: Coffee,
      category: "Troubleshooting"
    },
    {
      text: "Which beer styles are trending this season?",
      icon: Lightbulb,
      category: "Market Trends"
    }
  ]



  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="AI Chat Assistant" />
      <div className="flex">
        {/* Main Content Area - Left Side */}
        <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to CraftBot AI</h1>
            <p className="text-gray-600 mb-6">
              Your intelligent brewing assistant is ready to help! Use the chat panel on the right to ask questions about:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🍺 Brewing Process</h3>
                <p className="text-blue-700 text-sm">Mashing, boiling, fermentation, packaging</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">📊 Recipe Analysis</h3>
                <p className="text-green-700 text-sm">ABV, IBU, SRM calculations and guidelines</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">🔧 Troubleshooting</h3>
                <p className="text-yellow-700 text-sm">Off-flavors, clarity issues, fermentation problems</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">📈 Data Insights</h3>
                <p className="text-purple-700 text-sm">Sales trends, optimization recommendations</p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Popular Questions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• How do I calculate ABV for my recipe?</li>
                <li>• What's the difference between ale and lager yeast?</li>
                <li>• My beer tastes too bitter, how can I fix it?</li>
                <li>• Which beer styles are trending this season?</li>
                <li>• How do I interpret my sales analytics data?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar - Right Side */}
      <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Chat Header */}
        <div className="bg-indigo-500 text-white p-4">
          <h2 className="text-lg font-semibold">CraftBot AI Assistant</h2>
          <p className="text-indigo-100 text-sm">Ask me anything about brewing, recipes, beer styles, or data analytics</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-indigo-500 text-white ml-2'
                        : 'bg-gray-100 text-gray-800 mr-2'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg mr-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="border-t bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-3 font-medium">Try asking about:</p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => {
                  const IconComponent = question.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question.text)}
                      className="flex items-start space-x-2 p-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left w-full"
                    >
                      <IconComponent className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 leading-tight">{question.text}</p>
                        <p className="text-xs text-gray-500">{question.category}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about brewing, recipes, beer styles, or your data..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
