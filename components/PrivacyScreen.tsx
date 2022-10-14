import React from 'react';

import { motion, useIsPresent } from 'framer-motion';

export const PrivacyScreen: React.FC<{}> = () => {
  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={{ scaleX: 1 }}
      animate={{
        scaleX: 0,
        transition: { duration: 0.5, ease: 'linear' }
      }}
      exit={{
        scaleX: 1,
        transition: { duration: 0.5, ease: 'linear' }
      }}
      style={{
        originX: isPresent ? 0 : 1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F5DA59',
        zIndex: 2
      }}
    />
  );
};
