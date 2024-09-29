"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"; 

export default function Settings() {
  const [maxOccupancy, setMaxOccupancy] = useState(50); 
  const [selectedWebcam, setSelectedWebcam] = useState("default"); 

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Settings saved! Max Occupancy: ${maxOccupancy}, Webcam: ${selectedWebcam}`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Settings</h1>

        <form
          onSubmit={handleSaveSettings}
          className="flex flex-col gap-4 items-center sm:items-start w-full"
        >
          <label className="w-full">
            <span className="block text-sm font-medium">Max Occupancy</span>
            <input
              type="number"
              value={maxOccupancy}
              onChange={(e) => setMaxOccupancy(Number(e.target.value))}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Set Max Occupancy"
              required
            />
          </label>

          <label className="w-full">
            <span className="block text-sm font-medium">Select Webcam</span>
            <Dropdown>
              <DropdownTrigger>
              <button className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300 text-left">
                  {selectedWebcam === "default" ? "Click to select" : selectedWebcam}
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Live Source"
                onAction={(key) => setSelectedWebcam(key.toString())}
                className="bg-white custom-dropdown-menu" // Add this line to set the background color of the dropdown menu
              >
                <DropdownItem key="default">
                  <span className="w-full">Same as System</span> {/* Apply text-left to a span within the item */}
                </DropdownItem>
                <DropdownItem key="webcam1">
                  <span className="w-full">FaceTime HD Camera</span> {/* Apply text-left to a span within the item */}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </label>

          <Button
            type="submit"
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </Button>
        </form>
      </main>
    </div>
  );
}