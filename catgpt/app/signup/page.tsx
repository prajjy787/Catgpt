'use client'
import React, { useState, useEffect } from 'react';
import { signUp, getCurrentUser } from '../../services/auth';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to /home
    getCurrentUser().then(user => {
      if (user) router.replace('/home');
    });
  }, [router]);

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    if (error) alert(error.message);
    else {
      alert('Signup successful! Please check your email to confirm your account, then login.');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 p-2 rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 p-2 rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignUp}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>
      <p>
        Already have an account?{' '}
        <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
