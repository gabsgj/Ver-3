import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Send, Plus, MessageSquare, Bot, User, Loader } from "lucide-react";
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/atom-one-dark.css';

// --- Register languages for syntax highlighting ---
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

// --- Utility Function ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- UI Component Implementations ---
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl", className)} {...props} />
));
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
const Button = React.forwardRef(({ className, ...props }, ref) => (
    <button
        className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className)}
        ref={ref}
        {...props}
    />
));
const ScrollArea = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("overflow-y-auto", className)} {...props} />
));

// --- Markdown Renderer Setup ---
const md = new Remarkable({
  html: false, // Set to false for security
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (err) { console.error(err); }
    }
    try {
      return hljs.highlightAuto(str).value;
    } catch (err) { console.error(err); }
    return ''; // use external default escaping
  },
});

// --- Main Application ---
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const mockConversations = [
  { id: 'conv1', title: 'How to Over-Engineer a To-Do List' },
  { id: 'conv2', title: 'The Philosophy of a Centered Div' },
];

const initialMessages = {
    conv1: [
        { id: 'msg1', role: 'user', content: 'How do I build a simple to-do list app?' },
        { id: 'msg2', role: 'assistant', content: "A 'simple' to-do list? How quaint! We're not just listing tasks, we're orchestrating a symphony of productivity. First, we'll need a distributed microservices architecture, a blockchain for immutable task verification, and a custom-trained LLM to predict your procrastination patterns. Let's start with the foundational quantum-resistant database schema..." },
    ],
    conv2: [],
};

const getWittyResponse = (userInput) => {
    if (userInput.toLowerCase().includes("bug")) {
        return `An off-by-one error! A classic! A lesser mind would simply adjust the loop's condition. But we? We shall build 'The Sentinel of Singularity,' an AI guardian that perpetually monitors your codebase, using temporal logic and quantum entanglement to foresee such temporal discrepancies before they even manifest in our reality. Here is the blueprint for our Sentinel's consciousness core:
\`\`\`python
# Sentinel of Singularity - Consciousness Core v0.1
import time

class SentinelAI:
    def __init__(self, codebase):
        print("Analyzing temporal fabric of codebase...")
        self.codebase = codebase
        time.sleep(2)
        print("Fabric analyzed. Existential dread of bugs quantified.")

    def prevent_off_by_one_errors(self):
        print("Deploying quantum guards around all loop constructs...")
        time.sleep(3)
        print("Guards deployed. Your loops are now safe from the tyranny of numerical imprecision.")
        return True

# Initializing the Sentinel
my_buggy_code = "for i in range(10): print(i)"
sentinel = SentinelAI(my_buggy_code)
sentinel.prevent_off_by_one_errors()
\`\`\``
    }
    return `Ah, you're asking about "${userInput.substring(0, 20)}..." Fascinating! This clearly requires a new decentralized, AI-powered, blockchain-based framework. Let's call it 'Project Chimera'. It will revolutionize how we think about this problem by first creating a new problem that makes the original problem irrelevant. Step 1: Design the consensus algorithm...`
}

export default function ChatPage() {
  const [location, setLocation] = useLocation();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pathId = location.split('/')[2] || 'conv1';
    if (pathId && mockConversations.find(c => c.id === pathId)) {
        setCurrentConversationId(pathId);
        setMessages(initialMessages[pathId] || []);
    } else {
        const defaultId = 'conv1';
        setCurrentConversationId(defaultId);
        setMessages(initialMessages[defaultId]);
        setLocation(`/chat/${defaultId}`);
    }
  }, [location, setLocation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: `msg-${Date.now()}`, role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const aiContent = getWittyResponse(inputValue);
      const aiResponse: Message = { id: `msg-${Date.now() + 1}`, role: 'assistant', content: aiContent };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes rotate-border { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .loading-border::before {
        content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
        background: conic-gradient(from var(--angle), #84fab0, #8fd3f4, #a18cd1, #fbc2eb, #84fab0);
        border-radius: 1.2rem; z-index: 0; animation: rotate-border 4s linear infinite; --angle: 0deg;
      }
      @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-200 font-sans p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 blur-3xl"></div>
      
      <div className="w-full max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <Button className="w-full justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform">
                    <Plus className="h-4 w-4" /> New Useless Project
                </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockConversations.map((conv) => (
                  <Button
                    key={conv.id}
                    className={cn(
                      "w-full text-left p-3 rounded-lg flex items-center justify-start gap-3",
                      currentConversationId === conv.id 
                        ? "bg-white/10 text-white" 
                        : "bg-transparent hover:bg-white/5 text-gray-400"
                    )}
                    onClick={() => setLocation(`/chat/${conv.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card className={cn("relative h-[85vh] flex flex-col transition-all duration-500", isLoading && "loading-border")}>
              <CardHeader className="flex-row items-center justify-between border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white"/>
                  </div>
                  Over-Engineer Bot
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-green-400 animate-pulse">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Online & Ready to Overcomplicate
                </div>
              </CardHeader>
              
              <div className="flex-1 flex flex-col p-1 sm:p-4 overflow-hidden">
                <ScrollArea className="flex-1 -mr-4 pr-4" ref={scrollRef}>
                  <div className="space-y-6 p-4">
                    {messages.map((message) => (
                      <div key={message.id} className={cn("flex gap-3 items-start", message.role === 'user' ? "justify-end" : "justify-start")}>
                        {message.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white"/></div>}
                        <div className={cn("max-w-full sm:max-w-[85%] rounded-xl text-white/90 prose prose-invert prose-sm sm:prose-base prose-pre:bg-[#1e293b] prose-pre:rounded-lg prose-pre:p-4",
                            message.role === "user" ? "bg-blue-600/50 p-4 rounded-lg" : ""
                        )}>
                          <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }} />
                        </div>
                        {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-slate-300"/></div>}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white"/></div>
                        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                            <Loader className="animate-spin text-purple-400" />
                            <span className="text-sm text-gray-400">Brewing up an unnecessarily complex solution...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-auto p-4 border-t border-white/10">
                  <div className="relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Describe your trivial problem here..."
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-4 pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white disabled:opacity-50 disabled:saturate-50 hover:scale-110 transition-transform"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}