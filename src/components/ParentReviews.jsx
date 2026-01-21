import { FaQuoteLeft, FaStar } from "react-icons/fa";
const ParentReviews = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Mother of Emma (7 years)",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      text: "My daughter absolutely loves the classes! She has grown so much in confidence and creativity. The teachers are wonderful with kids.",
    },
    {
      name: "Michael Chen",
      role: "Father of Alex (10 years)",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5,
      text: "The structured curriculum and age-appropriate activities are perfect. Alex looks forward to every class and his artwork has improved tremendously!",
    },
    {
      name: "Priya Sharma",
      role: "Mother of twins (5 years)",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 5,
      text: "Best decision we made! Both my kids are thriving in this nurturing environment. The staff is patient, caring, and truly passionate.",
    },
  ];
  return (
    <section className="bg-linear-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 py-6 sm:py-8 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="inline-block bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              💝 Parent Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white px-4">
              What{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-orange-600">
                Parents Say
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Hear from parents whose children love learning with us
            </p>
          </div>
          
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <FaQuoteLeft className="text-4xl text-purple-300 dark:text-purple-700" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  "{review.text}"
                </p>
                
                {/* Reviewer Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {" "}
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover ring-4 ring-purple-200 dark:ring-purple-800"
                  />{" "}
                  <div>
                    {" "}
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {" "}
                      {review.name}{" "}
                    </h4>{" "}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {" "}
                      {review.role}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default ParentReviews;
