'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      messages.forEach((msg) => {
        if (msg.fileUrl) URL.revokeObjectURL(msg.fileUrl);
      });
    };
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((prev) => [
      ...prev,
      { type: 'user', content: userMessage, contentType: 'text' },
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/data/chat/',
        { text: userMessage }
      );

      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: response.data.response, contentType: 'text' },
      ]);
    } catch (error) {
      console.error('Send message error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: '⚠️ Failed to send message.',
          contentType: 'text',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = file.type.includes('image/')
      ? URL.createObjectURL(file)
      : null;

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        contentType: 'file',
        fileType: file.type.includes('image/') ? 'image' : 'document',
        fileUrl,
      },
    ]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let response;
      if (file.type.includes('image/')) {
        response = await axios.post(
          'http://127.0.0.1:8000/api/image/detect-object/',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: response.data.detection_result,
            contentType: 'text',
          },
        ]);
      } else {
        response = await axios.post(
          'http://127.0.0.1:8000/api/data/upload-data/',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (!response.data.analysis_result) {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              content: '⚠️ Invalid file format.',
              contentType: 'text',
            },
          ]);
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: response.data.analysis_result,
            contentType: 'analysis',
          },
        ]);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: '⚠️ File upload failed.', contentType: 'text' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4'>
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input */}
      <div>
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
