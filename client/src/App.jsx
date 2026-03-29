import React, { useState } from 'react';
import Board from './components/Board';
import { Layout, Bell, Info, Search } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0079bf]">
      {/* Trello Top Navigation Bar */}
      <nav className="bg-[#005c91] w-full h-12 flex items-center justify-between px-4 shadow-sm shrink-0">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded transition">
            <Layout size={20} />
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-1 text-white font-bold text-xl tracking-tight cursor-pointer">
            <span className="font-extrabold text-2xl pb-1">▤</span>
            <span>Trello</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <button className="text-white/90 font-medium text-sm hover:bg-white/20 px-3 py-1.5 rounded transition">Workspaces</button>
            <button className="text-white/90 font-medium text-sm hover:bg-white/20 px-3 py-1.5 rounded transition">Recent</button>
            <button className="text-white/90 font-medium text-sm hover:bg-white/20 px-3 py-1.5 rounded transition">Starred</button>
            <button className="bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-white/30 transition ml-2">Create</button>
          </div>
        </div>

        {/* Right Side: Search & Profile */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70" />
            <input 
              type="text" 
              placeholder="Search cards..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 text-white placeholder:text-white/70 text-sm rounded h-8 pl-8 pr-3 w-48 focus:w-64 focus:bg-white focus:text-[#172b4d] focus:placeholder:text-gray-500 transition-all outline-none"
            />
          </div>
          
          <button className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded transition">
            <Bell size={20} />
          </button>
          <button className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded transition">
            <Info size={20} />
          </button>
          
          {/* Default User Avatar */}
          <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold ml-2 cursor-pointer border border-white/20">
            JS
          </div>
        </div>
      </nav>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden relative">
        <Board searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;