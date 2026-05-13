import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Settings, UserCircle, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img 
                src="/oneinfoLOGO.png" 
                alt="OneInfo Logo" 
                className="w-8 h-8 rounded-lg drop-shadow-sm" 
              />
              <h1 className="text-3xl font-bebas bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight mt-1">
                OneInfo
              </h1>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>
            <NavLink 
              to="/editor" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            >
              {({ isActive }) => (
                <>
                  <PenSquare size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>Create Post</span>
                </>
              )}
            </NavLink>
          </div>

          {/* Bottom Settings/User snippet */}
          <div className="p-4 border-t border-slate-100 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 font-medium">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-stretch overflow-y-auto w-full relative scroll-smooth">
          <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10 w-full">
            <h2 className="text-2xl font-bebas text-slate-800 tracking-tight mt-1">Overview</h2>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-white border border-slate-200 py-1.5 px-3 rounded-full shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                   A
                 </div>
                 <span className="text-sm font-semibold text-slate-700 pr-2">Admin User</span>
               </div>
            </div>
          </header>
          
          <div className="p-8 w-full max-w-7xl mx-auto pb-24">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor/:slug" element={<Editor />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
