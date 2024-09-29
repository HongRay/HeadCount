"use client";

import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import {Button, ButtonGroup} from "@nextui-org/button";
import Link from 'next/link';

export default function Dashboard() {
  //Get from setting page
  const [maxOccupancy] = useState<number>(50); // Placeholder max occupancy
  const [currentOccupancy, setCurrentOccupancy] = useState<number>(0);
  const [occupancyRate, setOccupancyRate] = useState<number>(0);

  useEffect(() => {
    //Fetch curent occupancy from video
    const fetchOccupancy = async () => {
      try {
        const response = await axios.get('http://localhost:8000/current_occupancy');
        setCurrentOccupancy(response.data.currentOccupancy || 0);
      } catch (error) {
        console.error('Error fetching occupancy:', error);
      }
    };

    fetchOccupancy();
  }, []);

  useEffect(() => {
    // Calculate occupancy rate (current / max * 100)
    if (maxOccupancy > 0) {
      setOccupancyRate(parseFloat(((currentOccupancy / maxOccupancy) * 100).toFixed(2)));
    }
  }, [currentOccupancy, maxOccupancy]);

  const availableEntries = maxOccupancy - currentOccupancy;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dashboardbg bg-cover bg-center">
      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>
      
      {/* Container with 3:1 ratio */}
      <div className="flex w-4/5">
        {/* Webcam - 3/4 of the width */}
        <div className="w-3/4 flex justify-center items-center p-4">
          <Webcam className="rounded-lg border-2 border-orange-300 shadow-md w-full h-auto" />
        </div>

        {/* Stats - 1/4 of the width */}
        <div className="w-1/4 bg-orange-300 shadow-lg rounded-lg p-8 ml-4">
          <h3 className="text-xl mb-4">Max Occupancy: {maxOccupancy}</h3>
          <h3 className="text-xl mb-4">Current Occupancy: {currentOccupancy}</h3>
          <h3 className="text-xl mb-4">Available Entries: {availableEntries}</h3>
          <h3 className="text-xl mb-4">Occupancy Rate: {occupancyRate}%</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/settings">
              <Button color="default" variant="ghost">
                  Back
              </Button>
            </Link>
          </div>
          {currentOccupancy > maxOccupancy && (
            <h3 className="text-xl text-red-500">⚠️ Occupancy exceeded!</h3>
          )}
        </div>
      </div>
    </div>
  );
}
