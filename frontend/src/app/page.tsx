"use client";
import Logo from '../../public/images/logo.png'
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (email === "admin@gmail.com" && password === "password") {
      // Successful login
      router.push('/settings'); 
    } else {
      // Handle incorrect credentials (e.g., show error message)
      alert("Invalid credentials, try again.");
    }  
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Login Form Container */}
        <div className="bg-white p-8 rounded-md shadow-md text-center w-full sm:w-96"> 
          {/* Logo */}
          <img 
            src={Logo.src} // Access the src property of the imported Logo
            alt="HeadCount"
            className="mx-auto h-12 w-auto" // Adjust size as needed 
          />

          <h1 className="text-2xl font-bold mt-4">Sign in to HeadCount</h1>
          <p className="text-gray-500 text-sm mt-2">Welcome back! Please sign in to view the dashboard.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Email Input */}
            <div>
              <input 
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Continue
            </button>
          </form>

          {/* "Forgot Password?" and "Sign Up" Links */}
          <div className="mt-4 text-sm text-gray-600">
            
            Don't have an account?{" "}
            <a href="/register" className="hover:underline">Contact Sales</a>
          </div>
        </div> 
      </main>
    </div>
  );
}