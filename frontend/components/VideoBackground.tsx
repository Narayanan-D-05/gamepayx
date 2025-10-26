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
        <source src="/background/bg.mp4" type="video/mp4" />
      </video>
      {/* Enhanced gradient overlay for better readability with new video */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
        }}
      />
      {/* Additional vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );
}