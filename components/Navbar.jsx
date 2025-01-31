import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Navigation = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleRestrictedPageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  return (
    <nav className="relative z-50 floating-nav">
      <div className="nav-links">
        <Link href="/register" className="nav-link register-button">
          JOIN BETA
        </Link>
      </div>

      {/* Coming Soon Popup */}
      <AnimatePresence>
        {showComingSoon && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20
                         shadow-2xl shadow-purple-500/20 max-w-md w-full
                         relative overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                
                {/* Animated dots */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                            rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                            rounded-full blur-xl animate-pulse delay-300" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                rounded-2xl flex items-center justify-center
                                border border-purple-500/20 shadow-lg shadow-purple-500/10">
                      <span className="text-3xl">🚀</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4"
                  >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 
                               bg-clip-text text-transparent">
                      Coming Soon
                    </h3>
                    <p className="text-gray-400 text-sm">
                      This feature is currently under development.
                      <br />Stay tuned for updates!
                    </p>
                  </motion.div>

                  {/* Progress bar */}
                  <motion.div 
                    className="mt-6 h-1 bg-purple-500/20 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowComingSoon(false)}
            />
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation; 