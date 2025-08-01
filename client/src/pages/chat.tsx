  import { useState, useEffect, useRef } from "react";
  import { useLocation } from "wouter";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { apiRequest } from "@/lib/queryClient";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { useToast } from "@/hooks/use-toast";
  import { Send, Sparkles, Brain, Baby, BookOpen, Theater, Zap } from "lucide-react";
  import { cn } from "@/lib/utils";

  interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    messageType: string | null;
    metadata?: any;
    createdAt: string;
  }

  interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }

  const UselessIcons = {
    absurd: <Zap className="h-4 w-4" />,
    shakespearean: <Theater className="h-4 w-4" />,
    toddler: <Baby className="h-4 w-4" />,
    overcomplicated: <BookOpen className="h-4 w-4" />,
    random: <Sparkles className="h-4 w-4" />,
  };

  const UselessColors = {
    absurd: "bg-gradient-to-r from-purple-400 to-pink-400",
    shakespearean: "bg-gradient-to-r from-amber-400 to-orange-400",
    toddler: "bg-gradient-to-r from-blue-400 to-cyan-400",
    overcomplicated: "bg-gradient-to-r from-green-400 to-emerald-400",
    random: "bg-gradient-to-r from-indigo-400 to-purple-400",
  };

  export default function Chat() {
    const [, setLocation] = useLocation();
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Get conversations
    const { data: conversations = [] } = useQuery<Conversation[]>({
      queryKey: ["conversations"],
      queryFn: () => apiRequest("GET", "/api/conversations").then(res => res.json()),
    });

    // Get messages for current conversation
    const { data: messages = [] } = useQuery<Message[]>({
      queryKey: ["conversations", currentConversationId, "messages"],
      queryFn: () => apiRequest("GET", `/api/conversations/${currentConversationId}/messages`).then(res => res.json()),
      enabled: !!currentConversationId,
    });

    // Create conversation mutation
    const createConversation = useMutation({
      mutationFn: (title: string) => apiRequest("POST", "/api/conversations", { title }).then(res => res.json()),
      onSuccess: (conversation) => {
        setCurrentConversationId(conversation.id);
        setLocation(`/chat/${conversation.id}`);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

    // Send message mutation
    const sendMessage = useMutation({
      mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
        apiRequest("POST", `/api/conversations/${conversationId}/messages`, { content }).then(res => res.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations", currentConversationId, "messages"] });
        setInputValue("");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to send message. The AI is probably having an existential crisis.",
          variant: "destructive",
        });
      },
    });

    // Auto-scroll to bottom
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSendMessage = async () => {
      if (!inputValue.trim() || isLoading) return;

      setIsLoading(true);
      
      try {
        if (!currentConversationId) {
          // Create new conversation
          await createConversation.mutateAsync(`Useless Chat ${new Date().toLocaleTimeString()}`);
        } else {
          // Send message
          await sendMessage.mutateAsync({ conversationId: currentConversationId, content: inputValue });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const getRandomUselessPrompt = () => {
      const prompts = [
        "Ask me to fix a bug in your code... I'll explain it like you're a toddler!",
        "Want a pseudocode? I'll give you a Shakespearean algorithm!",
        "Need help with math? I'll overcomplicate it beyond recognition!",
        "Ask me anything... I'll go on a random tangent about my pet cat!",
        "Want to learn programming? I'll use absurd metaphors about cooking!",
      ];
      return prompts[Math.floor(Math.random() * prompts.length)];
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Absurd Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🤖 WhyBot - The Useless AI 🤖
            </h1>
            <p className="text-lg text-gray-600 animate-pulse">
              {getRandomUselessPrompt()}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="animate-bounce">
                <Brain className="h-3 w-3 mr-1" />
                Deliberately Useless
              </Badge>
              <Badge variant="secondary" className="animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Maximum Chaos
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Useless Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentConversationId(null);
                        setLocation("/chat");
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start New Chaos
                    </Button>
                    {conversations.map((conv) => (
                      <Button
                        key={conv.id}
                        variant={currentConversationId === conv.id ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setCurrentConversationId(conv.id);
                          setLocation(`/chat/${conv.id}`);
                        }}
                      >
                        <div className="truncate">{conv.title}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {currentConversationId ? "Useless Chat" : "Start Your Useless Journey"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.messageType && UselessIcons[message.messageType as keyof typeof UselessIcons]}
                              {message.messageType && (
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "text-xs",
                                    UselessColors[message.messageType as keyof typeof UselessColors]
                                  )}
                                >
                                  {message.messageType}
                                </Badge>
                              )}
                            </div>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              <span className="text-sm text-gray-600">
                                WhyBot is having an existential crisis...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything... I'll make it useless! 🎭"
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
