"use client";

import React from "react";
import { Hammer } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="flex flex-col items-center max-w-md text-center space-y-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
          <Hammer className="w-10 h-10 text-slate-500 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Under Construction
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            We are currently building this feature. Check back soon to see what we've been working on.
          </p>
        </div>
      </div>
    </div>
  );
}
