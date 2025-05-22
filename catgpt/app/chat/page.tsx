'use client';
//imports reuqired for the page
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { getSession } from '../../services/auth';

type Message = { from: 'user' | 'cat'; text: string };
type ChatSession = { id: string; title: string };


// component for the chat page

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // useEffect to check if user is logged in and load chat history
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      const currentUserId = session?.user?.id || null;
      if (currentUserId !== userId) {
        setUserId(currentUserId);
        if (currentUserId) loadChatHistory();
      }
    };
  
    checkSession();
    const intervalId = setInterval(checkSession, 30000);
    return () => clearInterval(intervalId);
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ask-cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const catReply: Message = { from: 'cat', text: data.reply };
      setMessages((prev) => [...prev, catReply]);

      if (userId) {
        await saveChat([...messages, userMsg, catReply]);
      }
    } catch {
      setMessages((prev) => [...prev, { from: 'cat', text: 'Meow! Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const saveChat = async (msgs: Message[]) => {
    if (!userId || msgs.length === 0) return;
    const title = msgs[0]?.text.slice(0, 30) || 'New Chat';
    const res = await fetch('/api/save-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        title,
        session_id: activeSessionId,
        messages: msgs,
      }),
    });
    const saved = await res.json();
    if (!activeSessionId && saved.id) {
      setActiveSessionId(saved.id);
      setSessions((prev) => [...prev, { id: saved.id, title }]);
      loadChatHistory();
    }
  };

  const loadChat = async (chatId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`/api/get-chat?id=${chatId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const chat = await res.json();
    setMessages(chat.messages || []);
    setActiveSessionId(chat.id);
  };

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch('/api/get-chat-history', {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const history = await res.json();
    setChatHistory(history);
    setIsLoadingHistory(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: 250, background: '#FFF5E1', padding: 20,
        borderRight: '2px solid #FFD2A6', overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>🐾 Chats</h2>
        <button onClick={startNewChat} style={{
          marginBottom: 20, padding: '10px 14px', width: '100%',
          backgroundColor: '#FF6F61', color: 'white', border: 'none',
          borderRadius: 8, cursor: 'pointer'
        }}>
          ➕ New Chat
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {isLoadingHistory ? (
            <li style={{ color: '#888' }}>Loading chats...</li>
          ) : chatHistory.length === 0 ? (
            <li style={{ color: '#888' }}>
              {userId ? 'No saved chats yet' : 'Log in to see your chats'}
            </li>
          ) : (
            chatHistory.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => loadChat(chat.id)}
                  style={{
                    width: '100%', padding: 10, marginBottom: 6, textAlign: 'left',
                    border: '1px solid #FFD2A6', borderRadius: 6,
                    backgroundColor: activeSessionId === chat.id ? '#FFDAC1' : '#fff',
                    cursor: 'pointer', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}
                >
                  <div >{chat.title || 'Untitled Chat'}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>
                    messages: {chat.messages?.length || 0}
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, padding: 30, background: '#FFF8F0',
        display: 'flex', flexDirection: 'column'
      }}>
        <h1 style={{ color: '#FF6F61', fontSize: 24, marginBottom: 20 }}>
          Chat with CatGPT 🐱 {userId ? '(Logged in)' : '(Not logged in)'}
        </h1>

        {error && (
          <div style={{
            background: '#FFEBE9', border: '1px solid #FF6F61',
            color: '#D32F2F', padding: 12, borderRadius: 8, marginBottom: 16
          }}>
            Error: {error}
          </div>
        )}

        <div style={{
          flex: 1, overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: 10, marginBottom: 20
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: 50 }}>
              No messages yet. Start by saying hello to the cat!
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              background: msg.from === 'user' ? '#FFF3E0' : '#FFE5B4',
              alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
              padding: 12, borderRadius: msg.from === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              maxWidth: '70%', whiteSpace: 'pre-wrap'
            }}>
              <strong>{msg.from === 'user' ? 'You' : 'CatGPT'}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the cat something..."
            style={{
              flex: 1, padding: 12, fontSize: 16,
              borderRadius: 8, border: '2px solid #FFB27F', resize: 'none'
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '12px 20px', backgroundColor: '#FF6F61',
              color: 'white', fontWeight: 700, border: 'none',
              borderRadius: 8, cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Meowing...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
