'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
    >
      {children}
    </MotionConfig>
  );
}
