"use client";

import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-gray-50 -z-10 opacity-50">
      {/* Base Background */}
      <div
        className="absolute inset-0 "
        style={{
          backgroundColor: "rgb(244, 242, 241)",
          mask: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 37%)",
          WebkitMask:
            "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 37%)",
        }}
      />

      {/* Left Abstract Blurs */}
      <div className="absolute left-[-10%] top-0 w-[420px] h-[888px] blur-[2px] ">
        <div className="absolute top-[80px] left-[9px] w-[208px] h-[208px] rounded-full bg-[#2EFFEA] blur-[200px]" />
        <div className="absolute top-0 left-[213px] w-[207px] h-[207px] rounded-full bg-[#16ABF0] blur-[200px]" />
        <div className="absolute top-[207px] left-0 w-[208px] h-[208px] rounded-full bg-[#435EE0] blur-[200px]" />
        <div className="absolute top-[363px] left-[37px] w-[208px] h-[208px] rounded-full bg-[#122DFC] blur-[200px]" />

        <div className="absolute top-[100px] left-[50px] w-[180px] h-[180px] rounded-full bg-[#2EFFEA] blur-[100px]" />
        <div className="absolute top-[150px] left-[200px] w-[180px] h-[180px] rounded-full bg-[#16ABF0] blur-[100px]" />
        <div className="absolute top-[300px] left-[20px] w-[180px] h-[180px] rounded-full bg-[#435EE0] blur-[100px]" />
        <div className="absolute top-[400px] left-[80px] w-[180px] h-[180px] rounded-full bg-[#122DFC] blur-[100px]" />
      </div>

      {/* Right Abstract Blurs */}
      <div className="absolute right-0 top-0 w-full max-w-[1116px] h-[784px] blur-[2px] rotate-180">
        <div className="absolute top-[80px] left-[9px] w-[208px] h-[208px] rounded-full bg-[#2EFFEA] blur-[200px]" />
        <div className="absolute top-0 left-[213px] w-[207px] h-[207px] rounded-full bg-[#16ABF0] blur-[200px]" />
        <div className="absolute top-[207px] left-0 w-[208px] h-[208px] rounded-full bg-[#435EE0] blur-[200px]" />
        <div className="absolute top-[363px] left-[37px] w-[208px] h-[208px] rounded-full bg-[#122DFC] blur-[200px]" />

        <div
          className="absolute top-[20px] left-[-92px] w-[420px] h-[571px]"
          style={{ transform: "rotate(-25deg)" }}
        >
          <div className="absolute top-[100px] left-[50px] w-[180px] h-[180px] rounded-full bg-[#2EFFEA] blur-[100px]" />
          <div className="absolute top-[150px] left-[200px] w-[180px] h-[180px] rounded-full bg-[#16ABF0] blur-[100px]" />
          <div className="absolute top-[300px] left-[20px] w-[180px] h-[180px] rounded-full bg-[#435EE0] blur-[100px]" />
          <div className="absolute top-[400px] left-[80px] w-[180px] h-[180px] rounded-full bg-[#122DFC] blur-[100px]" />
        </div>
      </div>

      {/* Top Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[415px]"
        style={{
          background:
            "linear-gradient(180deg, rgb(242, 240, 238) 0%, rgba(242, 240, 238, 0) 100%)",
        }}
      />

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(242, 240, 238, 0) 0%, rgb(242, 240, 238) 100%)",
        }}
      />

      {/* Vertical Divider Lines */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-white/10 backdrop-blur-[25px]"
            style={{
              background:
                "linear-gradient(270deg, rgba(242, 240, 238, 0.2) 0%, rgba(242, 240, 238, 0) 100%)",
            }}
          />
        ))}
      </div>

      {/* Noise Texture Overlay */}
    </div>
  );
}
