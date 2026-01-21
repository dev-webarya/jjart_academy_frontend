import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { testimonialsData } from "../data/classesData";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden py-6 sm:py-8 md:py-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl relative z-10">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-4">
              What Our{' '}
              <span className="text-yellow-300">Students Say</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Don't just take our word for it - hear from our amazing community
              of artists
            </p>
          </div>
          
          {/* Testimonials Carousel */}
          <div className="max-w-6xl mx-auto">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={true}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="pb-12 sm:pb-14 md:pb-16"
            >
              {testimonialsData.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl h-full">
                    {/* Quote Icon */}
                    <div className="mb-4 sm:mb-6">
                      <FaQuoteLeft className="text-3xl sm:text-4xl text-purple-600 opacity-50" />
                    </div>
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, index) => (
                        <FaStar
                          key={index}
                          className="text-yellow-400 text-base sm:text-lg md:text-xl"
                        />
                      ))}
                    </div>
                    {/* Testimonial Text */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed italic mb-4 sm:mb-6">
                      "{testimonial.text}"
                    </p>
                    {/* Author Info */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="relative shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-3 sm:border-4 border-purple-600"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>{" "}
          {/* Stats Section */}{" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gamax-w-4xl mx-auto">
            {" "}
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "1000+", label: "Happy Students" },
              { value: "500+", label: "5-Star Reviews" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-md rounded-2xl"
              >
                {" "}
                <div className="text-4xl font-bold text-white">
                  {stat.value}
                </div>{" "}
                <div className="text-white/80 text-sm">{stat.label}</div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Custom Swiper Styles */}{" "}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: white;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>{" "}
    </section>
  );
};
export default Testimonials;
