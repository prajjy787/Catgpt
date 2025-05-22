'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '../../services/auth';

const HomePage = () => {
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) {
        router.replace('/');
      } else {
        setUserEmail(user.email ?? '');
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <span className="text-6xl mb-4 animate-bounce">🐾</span>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to CatGPT! 🐱</h1>
      <p className="text-lg text-gray-600 mb-6">Logged in as: <strong>{userEmail}</strong></p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/chat')}
          className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
        >
          Start Chatting
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
