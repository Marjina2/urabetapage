import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Navigation = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleRestrictedPageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

      {/* Rest of the code remains the same */}
    </nav>
  );
};

export default Navigation; 