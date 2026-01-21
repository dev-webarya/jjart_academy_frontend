import { FaCalendar, FaClock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
const CallToAction = () => {
  return (
    <section className="bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden py-10 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-5xl relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4">
              Ready to Start Your Child's{' '}
              <span className="text-cyan-300">Creative Journey?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Join our community of young artists and watch them flourish!
            </p>
          </div>
          
          {/* Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: FaCalendar, text: "Flexible Schedule" },
              { icon: FaClock, text: "Mon-Sat Classes" },
              { icon: FaMapMarkerAlt, text: "Multiple Locations" },
              { icon: FaPhone, text: "Call Anytime" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-md p-3 sm:p-4 rounded-lg sm:rounded-xl text-white"
              >
                <item.icon className="text-2xl sm:text-3xl mx-auto mb-1.5 sm:mb-2" />
                <p className="font-semibold text-xs sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CallToAction;
