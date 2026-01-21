import { useState } from 'react';
import { FaCertificate, FaDownload, FaCalendar, FaTrophy, FaGraduationCap } from 'react-icons/fa';

const StudentCertificates = () => {
  const [certificates] = useState([
    {
      id: 1,
      courseName: 'Watercolor Painting',
      certificateNumber: 'CERT-2026-001',
      issueDate: '2026-01-10',
      completionDate: '2026-01-05',
      grade: 'A+',
      instructor: 'Ms. Sarah Johnson',
      certificateFile: '',
      status: 'issued'
    },
    {
      id: 2,
      courseName: 'Digital Art Fundamentals',
      certificateNumber: 'CERT-2025-142',
      issueDate: '2025-12-20',
      completionDate: '2025-12-15',
      grade: 'A',
      instructor: 'Mr. David Chen',
      certificateFile: '',
      status: 'issued'
    }
  ]);
  const handleDownload = (certificate) => {
    if (certificate.certificateFile) {
      const link = document.createElement('a');
      link.href = certificate.certificateFile;
      link.download = `${certificate.certificateNumber}_${certificate.courseName}.pdf`;
      link.click();
    } else {
      alert('Certificate file will be available soon. Please contact admin.');
    }
  };
  const getGradeBadgeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          
          <div>
            <h1 className="text-4xl font-bold">My Certificates</h1>
            <p className="text-purple-100 mt-1">View and download your course completion certificates</p>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{certificates.length}</p>
            </div>
           
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Courses Completed</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{certificates.length}</p>
            </div>
           
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Average Grade</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">A+</p>
            </div>
           
          </div>
        </div>
      </div>
      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 max-w-md"
          >
            {/* Certificate Header */}
            <div className="bg-white p-4 text-black border-b border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black">{certificate.courseName}</h3>
                  <p className="text-gray-500 text-xs font-mono">{certificate.certificateNumber}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Grade: {certificate.grade}
                </span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-4 space-y-3 bg-white">
              <div className="flex items-center space-x-3 text-black">
                <FaCalendar className="text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Completed On</p>
                  <p className="font-semibold text-sm text-black">{new Date(certificate.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-black">
                <FaCertificate className="text-pink-600" />
                <div>
                  <p className="text-xs text-gray-600">Issued On</p>
                  <p className="font-semibold text-sm text-black">{new Date(certificate.issueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-black">
                <FaGraduationCap className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Instructor</p>
                  <p className="font-semibold text-sm text-black">{certificate.instructor}</p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(certificate)}
                className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center space-x-2 text-sm"
              >
                <FaDownload />
                <span>Download Certificate</span>
              </button>
            </div>

            {/* Certificate Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                This certificate validates the successful completion of the course
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {certificates.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCertificate className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete your courses to earn certificates
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
