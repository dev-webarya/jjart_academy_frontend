import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const enrollmentService = {
    /**
     * Create a new enrollment
     * POST /api/v1/enrollments
     */
    createEnrollment: async (enrollmentData) => {
        try {
            const url = `${BASE_URL}${API_ENDPOINTS.ENROLLMENTS.ENROLL}`;
            console.log('📡 POST Enrollment:', url, enrollmentData);

            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(enrollmentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to enroll: ${response.status}`);
            }

            console.log('✅ Enrollment successful:', data);
            return { success: true, data: data };
        } catch (error) {
            console.error('❌ Enrollment error:', error);
            throw error;
        }
    },

    /**
     * Get current user's enrollments
     * GET /api/v1/enrollments/my-enrollments
     */
    getMyEnrollments: async () => {
        try {
            const url = `${BASE_URL}${API_ENDPOINTS.ENROLLMENTS.MY_ENROLLMENTS}`;
            console.log('📡 GET My Enrollments:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to fetch enrollments: ${response.status}`);
            }

            return { success: true, data: data };
        } catch (error) {
            console.error('❌ Fetch enrollments error:', error);
            throw error;
        }
    }
};

export default enrollmentService;
