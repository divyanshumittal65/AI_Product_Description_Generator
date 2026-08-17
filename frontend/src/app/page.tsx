'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { ChatFeed, ChatMessage } from '@/components/ChatFeed';
import { ChatInput } from '@/components/ChatInput';
import { ProductFormData } from '@/components/ProductForm';
import { GeneratedRecord } from '@/components/DescriptionCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<GeneratedRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>('llama3.2:1b');
  const [selectedPreset, setSelectedPreset] = useState<ProductFormData | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/history`);
      if (res.data && res.data.data) {
        setHistory(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Check if an item was selected from the /history page
    if (typeof window !== 'undefined') {
      const savedItemStr = sessionStorage.getItem('selected_history_item');
      if (savedItemStr) {
        try {
          const item: GeneratedRecord = JSON.parse(savedItemStr);
          sessionStorage.removeItem('selected_history_item');

          const userMsgId = 'user-hist-' + Date.now();
          const assistantMsgId = 'assistant-hist-' + Date.now();

          const userMessage: ChatMessage = {
            id: userMsgId,
            role: 'user',
            content: `Loaded saved description for "${item.productName}"`,
            productDetails: {
              productName: item.productName,
              color: item.color,
              material: item.material,
              features: item.features,
              tone: item.tone,
            },
          };

          const assistantMessage: ChatMessage = {
            id: assistantMsgId,
            role: 'assistant',
            content: item.generatedDescription,
            modelUsed: item.modelUsed,
            isStreaming: false,
          };

          setMessages([userMessage, assistantMessage]);
        } catch (e) {
          console.error('Failed to parse history item:', e);
        }
      }
    }
  }, []);

  const handleGenerateStream = async (formData: ProductFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    const userMsgId = 'user-' + Date.now();
    const assistantMsgId = 'assistant-' + Date.now();

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: `Generate a ${formData.tone} product description for "${formData.productName}" (${formData.color}, ${formData.material}).`,
      productDetails: formData,
    };

    const assistantMessagePlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      modelUsed: 'Streaming...',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessagePlaceholder]);

    try {
      // 1. Obtain streaming session ID from backend
      const sessionRes = await axios.post(`${API_BASE_URL}/generate/session`, formData);
      const sessionId = sessionRes.data?.sessionId;

      if (!sessionId) {
        throw new Error('Failed to initialize streaming session');
      }

      // 2. Open EventSource SSE Connection
      const eventSource = new EventSource(`${API_BASE_URL}/generate/stream/${sessionId}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setErrorMsg(data.error);
            eventSource.close();
            setIsLoading(false);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: `Error: ${data.error}`, isStreaming: false }
                  : msg
              )
            );
            return;
          }

          if (data.text) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: msg.content + data.text }
                  : msg
              )
            );
          }

          if (data.done) {
            eventSource.close();
            setIsLoading(false);
            if (data.modelUsed) {
              const cleanModelName = data.modelUsed.replace('Ollama (', '').replace(')', '');
              setActiveModel(cleanModelName);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, modelUsed: data.modelUsed, isStreaming: false }
                    : msg
                )
              );
            } else {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
                )
              );
            }
            fetchHistory();
          }
        } catch (parseErr) {
          console.error('Error parsing SSE message:', parseErr);
        }
      };

      eventSource.onerror = (err) => {
        console.error('EventSource connection error:', err);
        eventSource.close();
        setIsLoading(false);
        setErrorMsg('Connection lost while streaming description.');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      };
    } catch (err: any) {
      console.error('Generation Error:', err);
      const message = err.response?.data?.message || err.message || 'Failed to generate product description';
      setErrorMsg(message);
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, content: `Error: ${message}`, isStreaming: false }
            : msg
        )
      );
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setErrorMsg(null);
    setSelectedPreset({
      productName: '',
      color: '',
      material: '',
      features: '',
      tone: 'Professional',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        modelName={activeModel}
        historyCount={history.length}
        onNewChatClick={handleNewChat}
        isStreaming={isLoading}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto relative overflow-hidden px-4">
        
        {/* Error Alert Toast */}
        {errorMsg && (
          <div className="m-4 p-3 rounded-lg bg-red-950 border border-red-800 text-red-200 text-xs font-medium flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs underline hover:text-white ml-4 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <ChatFeed
            messages={messages}
            isLoading={isLoading}
            onSelectPreset={(preset) => setSelectedPreset(preset)}
          />

          <ChatInput
            onSend={handleGenerateStream}
            isLoading={isLoading}
            selectedPreset={selectedPreset}
          />
        </div>

      </div>
    </div>
  );
}
