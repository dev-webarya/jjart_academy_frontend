import { useState, useEffect } from 'react';
import { FaTimes, FaAward, FaCheckCircle } from 'react-icons/fa';

const ExhibitionApplicationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds on page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend
    console.log('Exhibition application:', { name, email });
    setSubmitted(true);
    
    // Close popup after 2 seconds
    setTimeout(() => {
      handleClose();
      setName('');
      setEmail('');
      setSubmitted(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const styles = `
    @keyframes slideInUp {
      from {
        transform: translateY(400px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in-up {
      animation: slideInUp 0.5s ease-out;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      {/* Backdrop - Only on mobile/tablet, removed on desktop for side popup */}
      {false && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        ></div>
      )}

      {/* Popup Modal - Bottom Right */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-80 sm:w-96">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-900 animate-slide-in-up">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all z-10"
          >
            <FaTimes className="text-gray-600 dark:text-gray-400 text-xl" />
          </button>
          {!submitted ? (
            <div className="p-4 sm:p-6">
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaAward className="text-white text-lg" />
                </div>
              </div>
              {/* Content */}
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-1.5">
                Showcase Your Art!
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
                Apply for our upcoming exhibitions
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none transition-all text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-purple-500 focus:outline-none transition-all text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all text-xs sm:text-sm"
                >
                  Apply Now
                </button>
              </form>
              <button
                onClick={handleClose}
                className="w-full mt-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold text-xs sm:text-sm transition-all"
              >
                Skip
              </button>
            </div>
          ) : (
            /* Success Message */
            <div className="p-4 sm:p-6 text-center">
              <div className="flex justify-center mb-2">
                <FaCheckCircle className="text-green-500 text-3xl animate-bounce" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">
                Applied Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                We'll contact you soon with details.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ExhibitionApplicationPopup;