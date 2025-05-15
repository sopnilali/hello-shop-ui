import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-br pt-28 mb-10 from-[#00031b] to-[#0a0b2a] py-12  px-2 lg:px-8 animate-pulse">
      <div className="flex flex-col md:flex-row mt-8 items-center md:items-start gap-8 mb-8">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-white/10 border-4 border-white/10 shadow-xl mt-5 md:mt-2" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded mx-auto md:mx-0" />
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-5 h-5 bg-white/10 rounded-full" />
            <div className="h-4 w-32 bg-white/10 rounded" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="h-6 bg-white/10 rounded" />
              <div className="h-3 w-3/4 bg-white/10 rounded" />
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="h-6 bg-white/10 rounded" />
              <div className="h-3 w-3/4 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-2 mb-8">
        <div className="h-10 w-28 bg-white/10 rounded-xl" />
        <div className="h-10 w-40 bg-white/10 rounded-xl" />
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-12 bg-white/10 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-12 bg-white/10 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-12 bg-white/10 rounded-xl" />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-white/10 pt-8">
          <div className="h-10 w-24 bg-white/10 rounded-xl" />
          <div className="h-10 w-32 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
