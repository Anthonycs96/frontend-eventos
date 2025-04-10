"use client";

import { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';

export default function Home() {

  return (
    <div className="min-h-screen p-0 transition-colors duration-100 flex items-center justify-center bg-[var(--background)]">
      <LoginForm />
      {/* <LoginBasico /> */}
    </div>

  );
}

