"use client";

export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="min-h-screen min-w-screen absolute object-cover"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <source src="/background/5453622-uhd_3840_2160_24fps.mp4" type="video/mp4" />
      </video>
      {/* Gradient overlay for better readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))'
        }}
      />
    </div>
  );
}