"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [maxOccupancy, setMaxOccupancy] = useState<number>(50); 
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(0);
  const [occupancyRate, setOccupancyRate] = useState<number>(0);

  useEffect(() => {
    // Retrieve maxOccupancy from local storage on component mount
    const savedMaxOccupancy = localStorage.getItem('maxOccupancy');
    if (savedMaxOccupancy) {
      setMaxOccupancy(parseInt(savedMaxOccupancy, 10));
    }
  }, []);

  // Fetch occupancy data from the API
  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/countPeople?source=live"
        );
        setCurrentOccupancy(response.data.person_count || 0);
      } catch (error) {
        console.error("Error fetching occupancy:", error);
      }
    };

    fetchOccupancy();
    const intervalId = setInterval(fetchOccupancy, 2000); // Fetch occupancy every 2 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Calculate occupancy rate
  useEffect(() => {
    if (maxOccupancy > 0) {
      setOccupancyRate(
        parseFloat(((currentOccupancy / maxOccupancy) * 100).toFixed(2))
      );
    }
  }, [currentOccupancy, maxOccupancy]);

  const availableEntries = maxOccupancy - currentOccupancy;

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full max-w-6xl p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-center text-black">
        Dashboard
      </h1>

      {/* Main Content: Video and Stats */}
      <div className="flex flex-col lg:flex-row w-full gap-6">
        {/* Video Feed - takes 3/4 width on large screens */}
        <div className="w-full lg:w-3/4 flex justify-center items-center p-4">
          <iframe
            className="rounded-lg border-2 border-orange-300 shadow-md w-full h-[600px]"
            src="http://localhost:8000/video_feed"
            allowFullScreen
            frameBorder="0"
            title="Video Feed"
          />
        </div>

        {/* Stats - takes 1/4 width on large screens */}
        <div className="w-full lg:w-1/4 bg-orange-300 shadow-lg rounded-lg p-8">
          <h3 className="text-xl mb-4">Max Occupancy: {maxOccupancy}</h3>
          <h3 className="text-xl mb-4">
            Current Occupancy: {currentOccupancy}
          </h3>
          <h3 className="text-xl mb-4">
            Available Entries: {availableEntries}
          </h3>
          <h3 className="text-xl mb-4">Occupancy Rate: {occupancyRate}%</h3>
          {currentOccupancy > maxOccupancy && (
            <h3 className="text-xl text-red-500">⚠️ Occupancy exceeded!</h3>
          )}
        </div>
      </div>
    </div>
  );
}