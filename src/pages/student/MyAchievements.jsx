import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaTrophy, FaStar, FaFire, FaMedal, FaLock } from 'react-icons/fa';

const MyAchievements = () => {
  const { student } = useOutletContext();
  const [achievements] = useState([
    {
      id: 1,
      name: 'First Masterpiece',
      description: 'Complete your first painting course',
      icon: FaTrophy,
      unlocked: true,
      unlockedDate: '2024-03-15',
      points: 50,
      rarity: 'common',
    },
    {
      id: 2,
      name: 'Consistent Learner',
      description: 'Attend 20 consecutive classes without missing',
      icon: FaFire,
      unlocked: true,
      unlockedDate: '2024-05-20',
      points: 100,
      rarity: 'uncommon',
    },
    {
      id: 3,
      name: 'Perfect Attendance',
      description: 'Achieve 100% attendance in a course',
      icon: FaMedal,
      unlocked: true,
      unlockedDate: '2024-06-10',
      points: 150,
      rarity: 'rare',
    },
    {
      id: 4,
      name: 'Digital Master',
      description: 'Master digital art techniques',
      icon: FaStar,
      unlocked: false,
      progress: 65,
      points: 120,
      rarity: 'uncommon',
    },
    {
      id: 5,
      name: 'Exhibition Star',
      description: 'Have your artwork displayed in an exhibition',
      icon: FaTrophy,
      unlocked: false,
      progress: 30,
      points: 200,
      rarity: 'rare',
    },
    {
      id: 6,
      name: 'Legendary Artist',
      description: 'Complete all available courses',
      icon: FaMedal,
      unlocked: false,
      progress: 45,
      points: 500,
      rarity: 'legendary',
    },
  ]);

  const getRarityStyles = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-600';
      case 'uncommon':
        return 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 border-green-300 dark:border-green-600';
      case 'rare':
        return 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-300 dark:border-blue-600';
      case 'legendary':
        return 'from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-600';
      default:
        return 'from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-600';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 dark:text-gray-400';
      case 'uncommon':
        return 'text-green-600 dark:text-green-400';
      case 'rare':
        return 'text-blue-600 dark:text-blue-400';
      case 'legendary':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Achievements</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Unlock badges and achievements on your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Unlocked</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{unlockedCount}/{achievements.length}</p>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Total Points</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalPoints}</p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold mb-1">Progress</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => {
          const Icon = achievement.icon;
          const rarityClass = getRarityStyles(achievement.rarity);
          const rarityColor = getRarityColor(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`bg-linear-to-br ${rarityClass} rounded-xl p-4 shadow-sm border-2 transition-all hover:shadow-lg`}
            >
              {/* Icon */}
              <div className="mb-3">
                {achievement.unlocked ? (
                  <Icon className={`text-4xl ${rarityColor}`} />
                ) : (
                  <FaLock className="text-4xl text-gray-400 dark:text-gray-500" />
                )}
              </div>

              {/* Title and Description */}
              <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">
                {achievement.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {achievement.description}
              </p>

              {/* Rarity Badge */}
              <div className="mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${rarityColor} bg-opacity-10`}>
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </span>
              </div>

              {/* Progress or Points */}
              {achievement.unlocked ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Unlocked</span>
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    +{achievement.points} pts
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {achievement.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlockedDate && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 pt-2 border-t border-gray-300 dark:border-gray-500">
                  {new Date(achievement.unlockedDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAchievements;
