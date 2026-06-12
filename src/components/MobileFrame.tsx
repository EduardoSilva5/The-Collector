import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

export default function MobileFrame({ children, isFullscreen, setIsFullscreen }: MobileFrameProps) {
  const [time, setTime] = useState('13:45');

  useEffect(() => {
    // Start with the local build time from meta (2026-05-22T13:45:49Z) or user clock
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-[#f5f7f8] flex flex-col">
        {/* Toggle Bar / Fullscreen banner */}
        <div className="w-full bg-[#263238] text-white px-4 py-2 flex items-center justify-between text-xs font-mono shadow-sm border-b border-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4db6ac] animate-pulse"></span>
            <span>Mesa de Trabalho - The Collector</span>
          </div>
          <button
            id="btn-toggle-mobile"
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#4db6ac] hover:bg-[#3ca095] text-white transition-colors cursor-pointer font-sans text-[11px] font-semibold"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simular App Móvel</span>
          </button>
        </div>
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eceff1] py-8 px-4 flex flex-col items-center justify-center transition-colors duration-300">
      {/* Viewport controls */}
      <div className="mb-4 flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
        <span className="text-xs text-gray-500 font-medium">Modo de Visualização:</span>
        <button
          id="btn-mode-mobile-active"
          onClick={() => setIsFullscreen(false)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-semibold transition bg-[#263238] text-white"
        >
          <Smartphone className="w-3 h-3" />
          <span>Mobile</span>
        </button>
        <button
          id="btn-mode-desktop-activate"
          onClick={() => setIsFullscreen(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium transition text-gray-600 hover:text-black hover:bg-gray-100"
        >
          <Monitor className="w-3 h-3" />
          <span>Desktop</span>
        </button>
      </div>

      {/* Realistic Mobile Device Container */}
      <div className="relative mx-auto w-[385px] h-[810px] bg-[#10171a] rounded-[52px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-3 border-[4px] border-[#37474f] flex flex-col overflow-hidden ring-[1px] ring-[#263238]">
        {/* Notch / Dynamic Island simulated */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-[22px] bg-black rounded-2xl z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10171a] mr-12 ml-2 border border-gray-950"></div>
          <div className="w-5 h-1.5 rounded-full bg-gray-900 border border-gray-950"></div>
        </div>

        {/* Hardware details - Volume keys, Power Key simulations left & right */}
        <div className="absolute top-28 -left-1 w-1 h-12 bg-gray-600 rounded-r-md"></div>
        <div className="absolute top-44 -left-1 w-1 h-12 bg-gray-600 rounded-r-md"></div>
        <div className="absolute top-36 -right-1 w-1 h-16 bg-gray-600 rounded-l-md"></div>

        {/* Inner App Container with curved corners */}
        <div className="relative flex-1 w-full bg-[#f5f7f8] rounded-[42px] overflow-hidden flex flex-col shadow-inner select-none">
          {/* Status Bar */}
          <div className="h-10 bg-white text-[#263238] px-6 pt-3 flex justify-between items-center text-[11px] font-semibold tracking-tight shrink-0 select-none z-43">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
              {/* Signal Bar Icon */}
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-[3px] h-1 bg-[#263238] rounded-full"></span>
                <span className="w-[3px] h-1.5 bg-[#263238] rounded-full"></span>
                <span className="w-[3px] h-2 bg-[#263238] rounded-full"></span>
                <span className="w-[3px] h-2.5 bg-[#263238] rounded-full"></span>
              </div>
              <span>5G</span>
              {/* Battery */}
              <div className="w-5 h-2.5 border border-[#263238] rounded-sm p-0.5 flex items-center">
                <div className="h-full w-4 bg-[#4db6ac] rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Core App View */}
          <div className="flex-1 w-full flex flex-col overflow-y-auto select-none">
            {children}
          </div>

          {/* Virtual Bottom Pill Navigation Indicator */}
          <div className="h-6 bg-white flex items-center justify-center shrink-0 z-43">
            <div className="w-28 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
