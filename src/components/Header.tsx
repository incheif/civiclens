import React from "react";
import { Shield, MapPin, Eye, Settings, LogOut, CheckCircle, HelpCircle } from "lucide-react";
import { UserProfile, STATE_CONSTITUENCIES } from "../types";

interface HeaderProps {
  user: UserProfile;
  onChangeConstituency: (constituency: string) => void;
  isAdminMode: boolean;
  onToggleAdminMode: (admin: boolean) => void;
}

export default function Header({
  user,
  onChangeConstituency,
  isAdminMode,
  onToggleAdminMode
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand & Track */}
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            Civic<span className="text-indigo-600 font-semibold">Lens</span>
            {isAdminMode && (
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" /> MP TERMINAL
              </span>
            )}
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            People's Priorities Governance
          </p>
        </div>

        {/* Global Admin Switching Controls */}
        <div className="flex items-center gap-2">
          {/* Admin Switcher */}
          <button
            id="admin-mode-toggle"
            onClick={() => onToggleAdminMode(!isAdminMode)}
            className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
              isAdminMode
                ? "bg-emerald-50 text-emerald-600 ring-2 ring-emerald-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Switch to Government Terminal View"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* User Profile Widget */}
          <div className="relative">
            <button
              id="user-profile-menu-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-100 shadow-xl p-3 z-50">
                  <div className="border-b border-slate-100 pb-2 mb-2">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate">{user.email}</p>
                  </div>

                  {/* Active Constituency Selection Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      My Geographic Region
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <select
                        id="constituency-dropdown-selector"
                        value={user.constituency}
                        onChange={(e) => {
                          onChangeConstituency(e.target.value);
                          setShowProfileMenu(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {Object.entries(STATE_CONSTITUENCIES).map(([stateName, consList]) => (
                          <optgroup key={stateName} label={stateName} className="font-sans font-semibold text-slate-800">
                            {consList.map((c) => (
                              <option key={c} value={c} className="font-sans font-medium text-slate-600">
                                {c}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> Account Active
                    </span>
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="hover:text-slate-600 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Regional Announcement Banner */}
      <div className="mt-2 flex items-center justify-between bg-indigo-50/50 border border-indigo-100/30 rounded-lg px-2.5 py-1.5 text-xs">
        <span className="flex items-center gap-1 text-slate-700 font-medium truncate">
          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-bounce" />
          <span className="text-indigo-900 truncate">
            {isAdminMode ? "Gov Terminal" : "My Constituency"}:{" "}
            <span className="font-semibold">{user.constituency}</span>
          </span>
        </span>
        <span className="text-[10px] font-mono bg-white text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-semibold shrink-0">
          TRACK V1.2
        </span>
      </div>
    </header>
  );
}
