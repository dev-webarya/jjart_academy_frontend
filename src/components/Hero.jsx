import { Link } from "react-router-dom";
import { FaPlay, FaStar, FaUsers, FaAward } from "react-icons/fa";

const Hero = () => {
  const stats = [
    { icon: FaUsers, value: "1000+", label: "Happy Kids" },
    { icon: FaStar, value: "4.9/5", label: "Parent Rating" },
    { icon: FaAward, value: "100+", label: "Fun Activities" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-0"
    >
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/ve.mp4" type="video/mp4" />
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&q=80"
            alt="Kids Art Studio Background"
            className="w-full h-full object-cover object-center"
          />
        </video>
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/50 via-pink-900/45 to-orange-900/40"></div>
      </div>
      
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-4xl relative z-10">
        <div className="flex justify-center items-center">
          {/* Center Content */}
          <div className="text-white space-y-6 sm:space-y-8 text-center max-w-3xl">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl xs:text-5xl sm:text-9xl md:text-8xl lg:text-8xl font-bold leading-tight">
                JJ Art{' '}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-yellow-300 to-orange-300">
                  Academy
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95">
                Vision for Future
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
                Their imagination is a treasure,
                Their creativity a beautiful journey.
                Give them a space to express freely,
                And watch confidence bloom like art.
              </p>
            </div>

            {/* Book Demo Button */}
            <div className="mt-8">
              <a
                href="https://wa.me/917337880767?text=Hi,%20I%20would%20like%20to%20book%20a%20demo%20class"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-full hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50"
              >
                
                Book Your Demo Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
