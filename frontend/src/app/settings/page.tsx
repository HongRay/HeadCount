"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"; 
import Logo from '../../../public/images/logo.png';

export default function Settings() {
  const [maxOccupancy, setMaxOccupancy] = useState(50); 
  const [selectedWebcam, setSelectedWebcam] = useState("default"); 
  const [selectedFeedType, setSelectedFeedType] = useState('live');
  const [youtubeURL, setYoutubeURL] = useState('');
  const router = useRouter();

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem('maxOccupancy', maxOccupancy.toString());
    localStorage.setItem('selectedFeedType', selectedFeedType);
    if (selectedFeedType === 'prerecorded') {
      localStorage.setItem('youtubeURL', youtubeURL);
    }

    router.push('/dashboard');
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Settings Form Container */}
        <div className="bg-white p-8 rounded-md shadow-md text-center w-full sm:w-96">
          {/* Logo */}
          <img
            src={Logo.src}
            alt="HeadCount Logo"
            className="mx-auto h-12 w-auto mb-4" 
          /> 

          <h1 className="text-2xl font-bold mb-2">Settings</h1> 
          <p className="text-gray-500 text-sm mb-6">Configure your HeadCount settings below.</p> 

          <form onSubmit={handleSaveSettings} className="space-y-4">
            {/* Max Occupancy Input */}
            <div>
              <label htmlFor="maxOccupancy" className="block text-sm font-medium text-left mb-1"> 
                Max Occupancy
              </label>
              <input 
                type="number"
                id="maxOccupancy"
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(Number(e.target.value))}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Set Max Occupancy"
                required
              />
            </div>

            {/* Select Feed Type */}
            <div>
              <label htmlFor="feedType" className="block text-sm font-medium text-left mb-1">
                Select Feed Type
              </label>
              <select
                id="feedType"
                value={selectedFeedType}
                onChange={(e) => setSelectedFeedType(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="live">Live Feed</option>
                <option value="prerecorded">Pre-recorded Feed</option>
              </select>
            </div>

            {/* Conditionally Render Webcam or YouTube URL Input */}
            {selectedFeedType === 'live' && (
              <div>
                <label htmlFor="webcamSelect" className="block text-sm font-medium text-left mb-1">
                  Select Live Source
                </label>
                <Dropdown>
                  <DropdownTrigger>
                    <button className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300 text-left">
                      {selectedWebcam === "default" ? "Same as System" : selectedWebcam}
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Select Live Source"
                    onAction={(key) => setSelectedWebcam(key.toString())}
                    className="bg-white" 
                  >
                    <DropdownItem key="default">
                      Same as System
                    </DropdownItem>
                    <DropdownItem key="FaceTime HD Camera">
                      FaceTime HD Camera
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}

            {selectedFeedType === 'prerecorded' && (
              <div>
                <label htmlFor="youtubeURL" className="block text-sm font-medium text-left mb-1">
                  YouTube URL
                </label>
                <input
                  type="text"
                  id="youtubeURL"
                  value={youtubeURL}
                  onChange={(e) => setYoutubeURL(e.target.value)}
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter YouTube video URL"
                  required 
                />
              </div>
            )}

            {/* Start Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Start Program
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}