import { FaBaby, FaChild, FaUserGraduate } from "react-icons/fa";
const AgeGroups = () => {
  const ageGroups = [
    {
      icon: FaBaby,
      age: "0-4 Years",
      title: "Tiny Tots",
      description: "Sensory play, finger painting, and early color exploration",
      features: [
        "Sensory Activities",
        "Finger Painting",
        "Basic Shapes",
        "Color Discovery",
      ],
      color: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      image:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600",
    },
    {
      icon: FaChild,
      age: "5-9 Years",
      title: "Young Creators",
      description: "Drawing, painting, crafts, and basic art techniques",
      features: ["Drawing Skills", "Watercolor", "Clay Modeling", "Crafts"],
      color: "from-purple-400 to-indigo-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600",
    },
    {
      icon: FaUserGraduate,
      age: "10-14 Years",
      title: "Teen Artists",
      description: "Advanced techniques, digital art, and portfolio building",
      features: [
        "Advanced Drawing",
        "Digital Art",
        "Portfolio Work",
        "Art History",
      ],
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      image:
        "https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=600",
    },
  ];
  return (
    <section className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-6">
      <div className="container mx-auto px-6 sm:px-8 lg:max-w-7xl">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-6 py-2 rounded-full text-sm font-semibold">
              Age-Appropriate Learning
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Programs for{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
                Ages 0-15
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Specially designed curriculum for children from birth to 15 years
            </p>
          </div>
          
          {/* Age Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            {ageGroups.map((group, index) => (
              <div key={index} className="relative group h-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  {/* Image with Overlay */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    {" "}
                    <img
                      src={group.image}
                      alt={group.title}
                      className="w-full h-full object-cover"
                    />{" "}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ₹{group.color} opacity-60`}
                    ></div>
                    {/* Icon */}
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      {" "}
                      <group.icon
                        className={`text-3xl bg-linear-to-br ₹{group.color} bg-clip-text text-transparent`}
                      />{" "}
                    </div>{" "}
                  </div>
                  {/* Content */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {" "}
                      {group.title}{" "}
                    </h3>{" "}
                    <p className="text-gray-600 dark:text-gray-300">
                      {" "}
                      {group.description}{" "}
                    </p>{" "}
                    {/* Features List */}{" "}
                    <div className="space-y-2">
                      {" "}
                      {group.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {" "}
                          <div
                            className={`w-2 h-2 rounded-full bg-linear-to-r ₹{group.color}`}
                          ></div>{" "}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>{" "}
                        </div>
                      ))}
                    </div>
                    {/* CTA Button */}
                    <button
                      className={`w-full rounded-full bg-linear-to-r ₹{group.color} text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all mt-auto`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AgeGroups;
