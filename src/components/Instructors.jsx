import { FaInstagram, FaLinkedin, FaGlobe, FaAward } from "react-icons/fa";
import { instructorsData } from "../data/classesData";
const Instructors = () => {
  return (
    <section
      id="instructors"
      className="bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-8"
    >
      <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-6 py-2 rounded-full text-sm font-semibold">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Meet Our{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
                Expert Instructors
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn from award-winning artists and passionate educators
              dedicated to your success
            </p>
          </div>
          
          {/* Instructors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {instructorsData.map((instructor) => (
              <div
                key={instructor.id}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                {/* Image with Overlay */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-purple-900/80 via-purple-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <FaAward /> {instructor.experience}
                  </div>
                  
                  {/* Social Links - Show on Hover */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    {[
                      { icon: FaInstagram, link: instructor.social.instagram },
                      { icon: FaLinkedin, link: instructor.social.linkedin },
                      { icon: FaGlobe, link: instructor.social.website },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-purple-600 hover:bg-white transition-all"
                      >
                        <social.icon />
                      </a>
                    ))}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {instructor.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold text-sm md:text-base">
                      {instructor.specialty}
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {instructor.bio}
                  </p>
                  {/* Qualifications */}
                  <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                    {instructor.qualifications.map((qual, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-2 h-2 bg-purple-600 rounded-full shrink-0" />
                        {qual}
                      </div>
                    ))}
                  </div>
                  {/* Contact Button */}
                  <button className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-2.5 md:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    View Classes
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Join Team CTA */}
          <div className="text-center bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl text-white p-6 sm:p-8 md:p-12 mx-4 sm:mx-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Want to Join Our Team?</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6">
              We're always looking for passionate artists to inspire the next
              generation
            </p>
            <button className="bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
