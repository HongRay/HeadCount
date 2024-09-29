"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardBody, Button, Input } from "@nextui-org/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Immediate login check
  const loginCheck = (email: string, password: string) => {
    if (email === "stan28@asu.edu" && password === "password") {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Invalid credentials. Please try again.",
      };
    }
  };

  const handleLoginClick = () => {
    setErrorMessage(""); // Reset error message
    setEmailError(false); // Reset email error
    setPasswordError(false); // Reset password error

    // Validate email and password fields
    let valid = true;

    if (!email) {
      setEmailError(true);
      valid = false;
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    }

    // If either field is empty, show an error message
    if (!valid) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    // Perform login check
    const result = loginCheck(email, password);

    if (result.success) {
      // Successful login, redirect to dashboard
      router.push("/settings");
    } else {
      // Invalid login credentials, show error message
      setErrorMessage(result.message || "Login failed. Please try again.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <Card className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <CardBody className="bg-white p-8 rounded-md shadow-md text-center w-full sm:w-96">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="HeadCount"
          width={96}
          height={96}
          className="mx-auto h-24 w-auto"
        />
        <h1 className="text-2xl font-bold mt-4">Sign in to HeadCount</h1>
        <p className="text-gray-500 text-sm mt-2">
          Welcome back! Please sign in to view the dashboard.
        </p>

        {/* Render Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm mt-4 mb-4 p-2 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* Email Input */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              isRequired
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              isInvalid={emailError} // Use isInvalid prop to indicate an error
              errorMessage="Please enter a valid email" // Error message if email is invalid
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              isRequired
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress} // Attach the keypress event
              className="w-full"
              isInvalid={passwordError} // Use isInvalid prop to indicate an error
              errorMessage="Please enter your password" // Error message if password is invalid
              required
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLoginClick}
            color="warning"
            className="w-full py-2"
          >
            Continue
          </Button>
        </div>

        {/* "Forgot Password?" and "Sign Up" Links */}
        <div className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?&nbsp;
          <a href="/register" className="hover:underline">
            Contact Sales
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
