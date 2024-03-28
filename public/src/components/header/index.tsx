import React, { Suspense } from 'react';
import Wave from 'react-wavify'

export default function Page() {
  return (
    <header>
      <div className="h-screen bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto flex flex-wrap flex-col pt-24">
          <p>Hola</p>
      </div>
      <Wave className='-mt-10' fill="url(#gradient)">
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%"  stopColor="#f9b9f0" />
            <stop offset="90%" stopColor="#f0f0f0" />
          </linearGradient>
        </defs>
      </Wave>
    </header>
  );
}

