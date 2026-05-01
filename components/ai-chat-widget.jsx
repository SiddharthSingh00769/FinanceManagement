"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { askAura } from "@/actions/ai-chat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VoiceWave } from "./animations/voice-wave";
import { DarkMatterBackground } from "./animations/dark-matter";

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm Aura. Ask me anything about your finances." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Aura's Voice (TTS)
  const [voices, setVoices] = useState([]);
  
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakText = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    // Improved Female & Natural Voice Selection
    const femaleVoice = voices.find(v => 
      (v.name.includes("Aria") || v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("Google UK English Female")) &&
      v.lang.startsWith("en")
    ) || voices.find(v => 
      (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Samantha")) &&
      v.lang.startsWith("en")
    ) || voices.find(v => v.lang.startsWith("en"));

    const utterance = new SpeechSynthesisUtterance(text);
    if (femaleVoice) utterance.voice = femaleVoice;
    
    // Natural tuning
    utterance.pitch = 1.05; // Slightly warm
    utterance.rate = 0.95;  // Slightly slower for better articulation
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isOpen]);

  const processAudio = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        resolve(base64Audio);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const base64Audio = await processAudio(audioBlob);
        await sendAudioMessage(base64Audio);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const sendAudioMessage = async (base64Audio) => {
    if (isLoading) return;
    setIsLoading(true);

    const userMessage = { role: "user", content: "🎤 [Voice Message]" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await askAura({ 
        prompt: "", 
        audioBase64: base64Audio, 
        history: newMessages 
      });
      handleResponse(response);
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askAura({ 
        prompt: userMessage.content, 
        history: newMessages 
      });
      handleResponse(response);
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (response) => {
    if (response.success) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: response.data },
      ]);
      speakText(response.data);
    } else {
      toast.error(response.error || "Aura encountered an error.");
      const errorMsg = "Oops! I ran into an error. Try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: errorMsg },
      ]);
      speakText(errorMsg);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all z-50 animate-bounce"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border border-blue-100 dark:border-blue-900 z-50 overflow-hidden flex flex-col">
          <CardHeader className="bg-blue-600 text-white p-4 flex flex-row justify-between items-center rounded-t-lg space-y-0 relative z-10">
            <CardTitle className="text-md flex items-center gap-2">
              <Bot className={cn("h-5 w-5", isSpeaking && "animate-bounce")} />
              <div className="flex flex-col">
                <span>Aura</span>
                {isSpeaking && (
                  <span className="text-[8px] uppercase tracking-widest animate-pulse text-blue-200">Speaking...</span>
                )}
              </div>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700 h-8 w-8 rounded-full"
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isSpeaking) window.speechSynthesis.cancel();
                }}
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700 hover:text-white h-8 w-8 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
            <DarkMatterBackground isProcessing={isLoading} />
            
            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[85%] rounded-2xl p-3 text-sm transition-all duration-500",
                    msg.role === "user"
                      ? "bg-blue-600/90 text-white ml-auto rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "glass-card text-white mr-auto rounded-tl-sm border-white/10 backdrop-blur-md"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="glass-card text-white mr-auto rounded-2xl rounded-tl-sm border-white/10 p-3 max-w-[80%] flex items-center gap-2 text-sm backdrop-blur-md animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-blue-100">Aura is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-transparent backdrop-blur-sm">
              {isRecording && (
                <div className="mb-4">
                  <VoiceWave isRecording={isRecording} />
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="pr-12 rounded-full focus-visible:ring-blue-500"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "absolute right-10 top-1 h-8 w-8 rounded-full transition-all",
                    isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse text-white" : "hover:bg-muted text-muted-foreground"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
