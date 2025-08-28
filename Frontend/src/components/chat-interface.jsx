'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { useAuth } from '@clerk/nextjs';

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const { getToken } = useAuth();

  useEffect(() => {
    return () => {
      messages.forEach((msg) => {
        if (msg.fileUrl) URL.revokeObjectURL(msg.fileUrl);
      });
    };
  }, [messages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  async function authHeaders() {
    try {
      const token = await getToken(); // or plain getToken()
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }
  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
  useEffect(() => {
    const handler = async (e) => {
      const bins = e?.detail?.bins ?? 20;
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/data/histogram/?bins=${bins}`,
          {
            headers: await authHeaders(),
          }
        );
        const data = await res.json();

        addMessage({
          type: 'bot',
          contentType: 'chart',
          content: data,
        });
      } catch (err) {
        console.error(err);
        addMessage({
          type: 'bot',
          contentType: 'text',
          content: '⚠️ Could not generate histogram.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener('cortexa:visualize', handler);
    return () => window.removeEventListener('cortexa:visualize', handler);
  }, [API_BASE]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    addMessage({ type: 'user', content: userMessage, contentType: 'text' });
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/data/chat/`,
        {
          text: userMessage,
        },
        {
          headers: await authHeaders(),
        }
      );
      addMessage({ type: 'bot', content: data.response, contentType: 'text' });
    } catch (err) {
      console.error(err);
      addMessage({
        type: 'bot',
        content: '⚠️ Please upload the data file first.',
        contentType: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const fileUrl = isImage ? URL.createObjectURL(file) : null;

    addMessage({
      type: 'user',
      content: `Uploaded file: ${file.name}`,
      contentType: 'file',
      fileType: isImage ? 'image' : 'document',
      fileUrl,
    });
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let response;
      if (isImage) {
        response = await axios.post(
          `${API_BASE}/api/image/detect-object`,
          formData
        );
        addMessage({
          type: 'bot',
          content: response.data.detection_result,
          contentType: 'text',
        });
      } else {
        response = await axios.post(
          `${API_BASE}/api/data/upload-data/`,
          formData,
          {
            headers: {
              ...(await authHeaders()),
            },
          }
        );
        if (!response.data.analysis_result) {
          addMessage({
            type: 'bot',
            content: '⚠️ Unsupported file format.',
            contentType: 'text',
          });
        } else {
          addMessage({
            type: 'bot',
            content: response.data.analysis_result,
            contentType: 'analysis',
          });
        }
      }
    } catch (err) {
      console.error(err);
      addMessage({
        type: 'bot',
        content: '⚠️ File upload failed.',
        contentType: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-[calc(100vh-3.5rem)] flex-col bg-background text-foreground'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-4 py-6 space-y-4'>
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='border-t border-border bg-background/95 px-4 py-3'>
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  );
}
