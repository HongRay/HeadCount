"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";

export default function Settings() {
  const [maxOccupancy, setMaxOccupancy] = useState(0);
  const [selectedWebcam, setSelectedWebcam] = useState("default");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate maxOccupancy before saving
    if (maxOccupancy < 0) {
      setErrorMessage("Max Occupancy cannot be less than 0");
      return;
    }

    // If validation passes, reset error message and proceed
    setErrorMessage("");
    alert(
      `Settings saved! Max Occupancy: ${maxOccupancy}, Webcam: ${selectedWebcam}`
    );
  };

  const handleMaxOccupancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setMaxOccupancy(value);
      setErrorMessage(""); // Clear error message if valid
    } else {
      setErrorMessage("Max Occupancy cannot be less than 0");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Settings</h1>

      <form
        onSubmit={handleSaveSettings}
        className="flex flex-col gap-4 items-center justify-center sm:items-start w-full"
      >
        {/* Max Occupancy Input */}
        <Input
          label="Max Occupancy"
          type="number"
          value={maxOccupancy.toString()} // Convert number to string
          onChange={handleMaxOccupancyChange} // Use custom handler
          className="mt-1 p-2 w-full"
          min={0} // HTML validation for minimum value
          required
        />

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1 text-center">
            {errorMessage}
          </p>
        )}

        {/* Centralized Webcam Selection Dropdown */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-2 text-center">
            Please select your preferred webcam:
          </label>
          <div className="flex justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="w-full">
                  {selectedWebcam === "default"
                    ? "Select Webcam"
                    : selectedWebcam}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Webcam"
                disallowEmptySelection
                selectionMode="single"
                variant="flat"
                onAction={(key) => setSelectedWebcam(key.toString())}
                className="dropdown-width"
              >
                <DropdownItem key="default">Same as System</DropdownItem>
                <DropdownItem key="webcam1">FaceTime HD Camera</DropdownItem>
                <DropdownItem key="webcam2">Logitech 4K Pro</DropdownItem>
                <DropdownItem key="webcam3">External USB Webcam</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Save Button */}
        <Button type="submit" className="mt-6 px-4 py-2 w-full" color="warning">
          Start
        </Button>
      </form>

      <style jsx>{`
        .dropdown-width {
          width: 100%;
        }
      `}</style>
    </>
  );
}
