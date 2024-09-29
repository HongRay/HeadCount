"use client"; // Add this at the top of the file

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
<<<<<<< HEAD
=======
    // Add login logic here (e.g., API call)
>>>>>>> main
    if (email === "admin@example.com" && password === "password") {
      alert("Login successful!");
    } else {
      alert("Invalid credentials, try again.");
    }
  };

  return (
<<<<<<< HEAD
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen w-full p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: "url('/background.jpg')", // Ensure the path is correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', 
      }}
    >

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-white bg-opacity-80 p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Login</h1>

=======
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Login</h1>

>>>>>>> main
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 items-center sm:items-start w-full"
        >
          <label className="w-full">
            <span className="block text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300 text-black"
=======
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
>>>>>>> main
              required
            />
          </label>

          <label className="w-full">
            <span className="block text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300 text-black"
=======
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
>>>>>>> main
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
        >
          Forgot Password?
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/register"
        >
          Register
        </a>
      </footer>
    </div>
  );
}
