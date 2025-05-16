'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '../../services/auth';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login if user is not logged in
    getCurrentUser().then(user => {
      if (!user) router.replace('/login');
    });
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Welcome to CatGPT! 🐱</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
