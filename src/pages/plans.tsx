import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Navigation from '@/components/Navigation';

// Separate the PlanToggle into its own component
const PlanToggle: FC<{ isYearly: boolean; onToggle: () => void }> = ({ isYearly, onToggle }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
      <button
        onClick={onToggle}
        className="w-16 h-8 bg-purple-900/30 rounded-full p-1 relative transition-colors hover:bg-purple-900/50"
      >
        <motion.div
          className="w-6 h-6 bg-purple-500 rounded-full shadow-lg"
          animate={{ x: isYearly ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      <div className="flex items-center gap-2">
        <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
          Save 8%
        </span>
      </div>
    </div>
  );
};

// Separate the PricingCard into its own component
const PricingCard: FC<{
  name: string;
  price: { monthly: number; yearly: number };
  features: string[];
  isPopular?: boolean;
  isYearly: boolean;
  onContinueClick: () => void;
}> = ({ name, price, features, isPopular, isYearly, onContinueClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-[#1C1C1E]/50 backdrop-blur-xl rounded-xl p-6 border
                ${isPopular ? 'border-purple-500' : 'border-purple-500/20'}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-white">₹</span>
          <span className="text-4xl font-bold text-white">
            {isYearly ? price.yearly.toLocaleString() : price.monthly.toLocaleString()}
          </span>
          <span className="text-gray-400">/{isYearly ? 'year' : 'month'}</span>
        </div>
        {isYearly && (
          <div className="text-green-400 text-sm mt-2">
            Save ₹{((price.monthly * 12) - price.yearly).toLocaleString()} yearly
          </div>
        )}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-300">
            <i className="fas fa-check-circle text-purple-400 mt-1"></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onContinueClick}
        className={`w-full py-3 rounded-lg font-medium transition-colors
                 ${isPopular 
                   ? 'bg-purple-500 text-white hover:bg-purple-600' 
                   : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}
      >
        Continue
      </button>
    </motion.div>
  );
};

const PlansPage: FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Access to URA AI (up to 10 searches/day)",
        "Limited Gemini Flash and SerpAPI usage",
        "1 saved research project",
        "Standard visualizations",
        "Basic API settings",
        "Limited drag-and-drop functionality"
      ]
    },
    {
      name: "Basic",
      price: { 
        monthly: 399, 
        yearly: Math.round(399 * 12 * 0.92)
      },
      features: [
        "Access to URA AI (up to 50 searches/day)",
        "Full access to Gemini Flash and SerpAPI",
        "10 saved research projects",
        "Advanced visualizations",
        "Enhanced drag-and-drop functionality",
        "Full block marketplace access"
      ],
      isPopular: true
    },
    {
      name: "Premium",
      price: { 
        monthly: 1199,
        yearly: Math.round(1199 * 12 * 0.92)
      },
      features: [
        "Unlimited access to URA AI",
        "Full access to all integrated APIs",
        "Unlimited saved research projects",
        "AI-driven smart assistance",
        "Real-time collaboration",
        "Enhanced interactivity"
      ]
    },
    {
      name: "Teams",
      price: { 
        monthly: 3499,
        yearly: Math.round(3499 * 12 * 0.92)
      },
      features: [
        "All Premium Plan features",
        "Team-wide research sharing",
        "Customizable workflows",
        "Priority support",
        "Admin dashboard",
        "External tools integration"
      ]
    }
  ];

  const handleContinueClick = () => {
    setShowPaymentPopup(true);
    setTimeout(() => setShowPaymentPopup(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Pricing | URA</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan for your research needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <PlanToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                {...plan}
                isYearly={isYearly}
                onContinueClick={handleContinueClick}
              />
            ))}
          </div>

          {/* Enterprise Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-gray-400 mb-8">
              Get in touch with us for enterprise solutions and custom pricing.
            </p>
            <button className="px-8 py-3 bg-purple-500/10 text-purple-400 rounded-lg 
                           hover:bg-purple-500/20 transition-colors">
              Contact Sales
            </button>
          </div>

          {/* Payment Integration Popup */}
          <AnimatePresence>
            {showPaymentPopup && (
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
                          <span className="text-3xl">💳</span>
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
                          Payment Integration Coming Soon
                        </h3>
                        <p className="text-gray-400 text-sm">
                          We're currently setting up our payment system.
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
                  onClick={() => setShowPaymentPopup(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PlansPage; 