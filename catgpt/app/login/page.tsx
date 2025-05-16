'use client';
import React, { useState, useEffect } from 'react';
import { signIn, getCurrentUser } from '../../services/auth';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '../../services/auth'; // for sign in with google


// Optional: You can move the paw image URL to your public folder for better performance
const PAW_IMG_URL =
  'https://em-content.zobj.net/source/microsoft-teams/337/paw-prints_1f43e.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) router.replace('/home');
    });
  }, [router]);

  const handleSignIn = async () => {
    setErrorMsg('');
    const { error } = await signIn(email, password);
    if (error) {
      if (
        error.message.toLowerCase().includes('email not confirmed') ||
        error.message.toLowerCase().includes('email confirmation') ||
        error.message.toLowerCase().includes('user has not been confirmed')
      ) {
        setErrorMsg(
          'Please confirm your email before logging in. Check your inbox (and spam folder) for the confirmation email.'
        );
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.replace('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Left-side paws */}
      <div className="hidden md:flex flex-col gap-6 absolute left-0 top-0 h-full justify-center z-0 pl-4">
        <img src={PAW_IMG_URL} alt="paw" className="w-10 h-10 opacity-20 mb-4" />
        <img src={PAW_IMG_URL} alt="paw" className="w-14 h-14 opacity-10 ml-4" />
        <img src={PAW_IMG_URL} alt="paw" className="w-8 h-8 opacity-20 mt-4" />
      </div>
      {/* Right-side paws */}
      <div className="hidden md:flex flex-col gap-6 absolute right-0 top-0 h-full justify-center z-0 pr-4">
        <img src={PAW_IMG_URL} alt="paw" className="w-8 h-8 opacity-15 mb-6 ml-auto" />
        <img src={PAW_IMG_URL} alt="paw" className="w-12 h-12 opacity-10" />
        <img src={PAW_IMG_URL} alt="paw" className="w-10 h-10 opacity-20 mt-4 ml-auto" />
      </div>

      {/* Login form */}
      <div className="relative z-10 bg-white border border-gray-200 rounded-2xl shadow-lg px-10 py-12 w-full max-w-md flex flex-col items-center">
        <span className="text-6xl mb-2 animate-bounce drop-shadow">🐱</span>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 tracking-wide">Welcome Back to CatGPT</h2>
        <p className="mb-8 text-gray-500 italic text-center">Enter your details to sign in</p>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 mb-4 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-gray-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 mb-4 p-3 rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-gray-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignIn}
          className="bg-black text-white px-6 py-3 rounded-full font-bold transition w-full hover:bg-gray-800"
        >
          Login
        </button>
        <button
  onClick={signInWithGoogle}
  className="mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-full w-full shadow hover:bg-gray-50 transition"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mt-4 w-full text-center">
            {errorMsg}
          </div>
        )}
        <p className="mt-6 text-gray-700 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="underline font-semibold">Sign Up</a>
        </p>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Haven&apos;t received the confirmation email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
