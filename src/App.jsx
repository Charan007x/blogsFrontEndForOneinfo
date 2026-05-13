import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PenSquare, UserCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <h1 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              <span className="bg-indigo-600 p-1.5 rounded-lg"><PenSquare size={20} className="text-white"/></span>
              Blogs Manager
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>
            <NavLink 
              to="/editor" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <PenSquare size={20} />
              <span className="font-medium">Create Post</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-stretch overflow-y-auto w-full relative">
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 shadow-sm justify-between sticky top-0 z-10 w-full">
            <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
            <div className="flex items-center gap-3">
               <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-inner">
                 <UserCircle size={22} />
               </div>
            </div>
          </header>
          
          <div className="p-8 w-full max-w-7xl mx-auto">
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
