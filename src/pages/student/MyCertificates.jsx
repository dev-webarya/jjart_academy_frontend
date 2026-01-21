import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaCertificate, FaDownload, FaShareAlt, FaCalendar, FaCheckCircle, FaSearch, FaFilter } from 'react-icons/fa';

const MyCertificates = () => {
  const { student } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [certificates] = useState([
    {
      id: 1,
      title: 'Watercolor Painting Masterclass',
      course: 'Watercolor Painting',
      issueDate: '2024-05-20',
      expiryDate: null,
      certificateNumber: 'CERT-2024-WP-001',
      skills: ['Color Theory', 'Watercolor Techniques', 'Landscape Painting'],
      instructor: 'Priya Sharma',
      status: 'active',
      certificateFile: 'watercolor_certificate.pdf',
      grade: 'A+'
    },
    {
      id: 2,
      title: 'Digital Art Fundamentals',
      course: 'Digital Art Fundamentals',
      issueDate: '2024-07-10',
      expiryDate: null,
      certificateNumber: 'CERT-2024-DA-002',
      skills: ['Digital Design', 'Software Proficiency', 'Creative Composition'],
      instructor: 'Raj Kumar',
      status: 'active',
      certificateFile: 'digital_art_certificate.pdf',
      grade: 'A'
    },
    {
      id: 3,
      title: 'Introduction to Sculpture',
      course: 'Clay Modeling & Sculpture',
      issueDate: '2024-03-15',
      expiryDate: '2025-03-15',
      certificateNumber: 'CERT-2024-CS-003',
      skills: ['Sculpture Basics', 'Material Handling', 'Form & Space'],
      instructor: 'Ananya Desai',
      status: 'active',
      certificateFile: 'sculpture_certificate.pdf',
      grade: 'A+'
    },
    {
      id: 4,
      title: 'Portrait Drawing Excellence',
      course: 'Advanced Portrait Drawing',
      issueDate: '2024-09-05',
      expiryDate: null,
      certificateNumber: 'CERT-2024-PD-004',
      skills: ['Portrait Techniques', 'Shading', 'Proportions', 'Expression'],
      instructor: 'Vikram Singh',
      status: 'active',
      certificateFile: 'portrait_certificate.pdf',
      grade: 'A+'
    },
  ]);

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const activeCertificates = certificates.filter(c => c.status === 'active').length;

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const daysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleDownload = (certificate) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    
    // In a real application, this would be the actual certificate file URL from the server
    // For now, we'll create a placeholder download
    const certificateData = `
      CERTIFICATE OF COMPLETION
      
      This is to certify that
      
      [Student Name]
      
      has successfully completed the course:
      ${certificate.course}
      
      Title: ${certificate.title}
      Certificate Number: ${certificate.certificateNumber}
      Issue Date: ${new Date(certificate.issueDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
      Instructor: ${certificate.instructor}
      
      Skills Covered:
      ${certificate.skills.join(', ')}
    `;
    
    // Create a blob with the certificate data
    const blob = new Blob([certificateData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Set download attributes
    link.href = url;
    link.download = `Certificate_${certificate.certificateNumber}_${certificate.course.replace(/\s+/g, '_')}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert(`Certificate "${certificate.title}" downloaded successfully!`);
  };

  const handleShare = (certificate) => {
    const shareText = `Check out my certificate in ${certificate.course}! Certificate #${certificate.certificateNumber}`;
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: shareText,
      });
    } else {
      alert(`Share: ${shareText}`);
    }
  };

  const getFilteredCertificates = () => {
    return certificates.filter(certificate => {
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && !isExpired(certificate.expiryDate)) ||
        (filter === 'expired' && isExpired(certificate.expiryDate));
      const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          certificate.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          certificate.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const filteredCertificates = getFilteredCertificates();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Certificates</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your earned certificates and credentials</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Total Certificates</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">{certificates.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <FaCertificate className="text-indigo-600 dark:text-indigo-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Active</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{activeCertificates}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 dark:text-green-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">Skills Learned</p>
              <p className="text-xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(certificates.flatMap(c => c.skills)).size}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FaCertificate className="text-purple-600 dark:text-purple-300 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, course or certificate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Certificates</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Certificate #
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentCertificates.map((certificate, index) => {
                const expired = isExpired(certificate.expiryDate);
                
                return (
                  <tr 
                    key={certificate.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Certificate Number */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaCertificate className="text-indigo-600 dark:text-indigo-400 text-lg" />
                        <span className="text-sm font-mono font-bold text-gray-800 dark:text-white">
                          {certificate.certificateNumber}
                        </span>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {certificate.course}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {certificate.instructor}
                        </p>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-full text-sm">
                        {certificate.grade}
                      </span>
                    </td>

                    {/* Issue Date */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800 dark:text-white">
                        {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                          month: 'numeric', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {expired ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          expired
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          issued
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(certificate)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                          title="Download Certificate"
                        >
                          <FaDownload size={16} />
                        </button>
                        <button
                          onClick={() => handleShare(certificate)}
                          className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                          title="Share Certificate"
                        >
                          <FaShareAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCertificates.length)} of {filteredCertificates.length} certificates
          </div>
        </div>
      </div>

      {/* Empty State */}
      {currentCertificates.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
          <FaCertificate className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No Certificates Found' : 'No Certificates Yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Complete courses to earn certificates!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Previous
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
