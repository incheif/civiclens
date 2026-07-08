import React, { useState } from "react";
import { UserProfile, STATES, STATE_CONSTITUENCIES } from "../types";
import { Globe, MapPin, Check, LogIn, Sparkles, Building2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"welcome" | "google-loading" | "location-setup">("welcome");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Location details
  const [city, setCity] = useState("New Delhi");
  const [selectedState, setSelectedState] = useState("Delhi");
  const [country, setCountry] = useState("India");
  const [selectedConstituency, setSelectedConstituency] = useState("New Delhi");

  if (!isOpen) return null;

  const handleSimulatedGoogleSignIn = () => {
    setStep("google-loading");
    
    // Simulate authenticating against Google OAuth flow
    setTimeout(() => {
      // Pick some realistic mock details from active user or generate clean ones
      const mockEmail = "guptadhruv959@gmail.com";
      const mockName = "Dhruv Gupta";
      const mockAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
      
      setEmail(mockEmail);
      setName(mockName);
      setAvatar(mockAvatar);
      
      setCity("New Delhi");
      setSelectedState("Delhi");
      setCountry("India");
      setSelectedConstituency("New Delhi");
      
      setStep("location-setup");
    }, 1500);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      email,
      name,
      avatar,
      constituency: selectedConstituency,
      city: city || "New Delhi",
      state: selectedState,
      country: country || "India"
    };

    // Store in localStorage
    localStorage.setItem("civiclens_profile", JSON.stringify(updatedProfile));
    onSuccess(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Step 1: Simulated Google Authentication Trigger */}
        {step === "welcome" && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access CivicLens</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Join our transparent, people-powered prioritisation platform. Sync with Google to verify regional accountability.
              </p>
            </div>

            <button
              onClick={handleSimulatedGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 rounded-xl shadow-xs transition-all active:scale-98"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="text-[11px] font-mono text-slate-400">
              Secured by Google Identity • Secure Sandboxing Enabled
            </div>
          </div>
        )}

        {/* Step 2: Google Authentication Handshake Animation */}
        {step === "google-loading" && (
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center items-center h-16">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <LogIn className="w-5 h-5 text-indigo-600 absolute animate-pulse" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-slate-800">Contacting Google OAuth service...</p>
              <p className="text-xs text-slate-400">Exchanging regional credential tokens securely</p>
            </div>
          </div>
        )}

        {/* Step 3: Geographic Profile Setup Form */}
        {step === "location-setup" && (
          <form onSubmit={handleSubmitProfile} className="p-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
              <img src={avatar} alt={name} className="w-10 h-10 rounded-full border border-indigo-100" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Welcome, {name}!</h3>
                <p className="text-xs text-slate-500 font-mono">{email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" /> Specify Your Location
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Setting your precise city, state, and country customizes your <strong>My Constituency</strong> feed.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  City / Locality
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Camden, Austin, Mumbai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  State / Union Territory
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    value={selectedState}
                    onChange={(e) => {
                      const s = e.target.value;
                      setSelectedState(s);
                      const cons = STATE_CONSTITUENCIES[s] || [];
                      if (cons.length > 0) {
                        setSelectedConstituency(cons[0]);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Constituency */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  My Constituency
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    value={selectedConstituency}
                    onChange={(e) => setSelectedConstituency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {(STATE_CONSTITUENCIES[selectedState] || []).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  Country
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-1.5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-98"
            >
              <Check className="w-4 h-4" /> Save Profile & Launch
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
