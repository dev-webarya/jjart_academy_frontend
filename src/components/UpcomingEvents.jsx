import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserFriends,
} from "react-icons/fa";
const UpcomingEvents = () => {
  const events = [
    {
      title: "Summer Art Camp 🌞",
      date: "July 15-30, 2024",
      time: "9:00 AM - 3:00 PM",
      ageGroup: "6-12 years",
      location: "Main Campus",
      image:
        "https://images.unsplash.com/photo-1493673272479-a20888bcee10?w=800&q=80",
      color: "from-yellow-400 to-orange-400",
    },
    {
      title: "Parent-Kid Workshop 👨‍👧",
      date: "Every Saturday",
      time: "10:00 AM - 12:00 PM",
      ageGroup: "3-8 years",
      location: "All Branches",
      image:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
      color: "from-pink-400 to-purple-400",
    },
    {
      title: "Teen Art Exhibition 🎨",
      date: "August 5, 2024",
      time: "5:00 PM - 8:00 PM",
      ageGroup: "10-14 years",
      location: "Art Gallery",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      color: "from-blue-400 to-indigo-400",
    },
  ];
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-6">
      <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-6 py-2 rounded-full text-sm font-semibold">
              📅 Upcoming Events
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Special{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                Events & Workshops
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our exciting events and create memories while learning
            </p>
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {" "}
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${event.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}
                  ></div>
                  {/* Age Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-gray-900">
                      {event.ageGroup}
                    </span>
                  </div>
                </div>
                {/* Event Details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {" "}
                    {event.title}{" "}
                  </h3>{" "}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaCalendarAlt className="text-blue-500" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-green-500" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaUserFriends className="text-purple-500" />
                      <span className="text-sm">{event.ageGroup}</span>
                    </div>
                  </div>
                  {/* Register Button */}
                  <button
                    className={`w-full rounded-full bg-linear-to-r ${event.color} text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all`}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default UpcomingEvents;
