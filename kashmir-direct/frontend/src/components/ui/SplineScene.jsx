'use client';

import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function SplineScene() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full z-[-1] overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10" />
      <Spline 
        scene="https://prod.spline.design/6Wq1Q7YGyWfAb3ic/scene.splinecode" 
        className="w-full h-full scale-110 sm:scale-100"
      />
    </motion.div>
  );
}
