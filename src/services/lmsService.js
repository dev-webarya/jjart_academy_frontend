/**
 * LMS Service
 * Handles all student-facing LMS API calls (subscriptions, attendance, gallery)
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class LmsService {
    constructor() {
        this.baseURL = BASE_URL;
    }

    /**
     * Get auth headers with token
     */
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    // ==================== SUBSCRIPTIONS ====================

    /**
     * Get current user's subscriptions
     * GET /api/v1/lms/subscriptions/my
     */
    async getMySubscriptions() {
        try {
            const response = await fetch(`${this.baseURL}${API_ENDPOINTS.LMS_SUBSCRIPTIONS.MY}`, {
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch subscriptions: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ My subscriptions fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching subscriptions:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get current user's active subscription
     * GET /api/v1/lms/subscriptions/my/active
     */
    async getMyActiveSubscription() {
        try {
            const response = await fetch(`${this.baseURL}${API_ENDPOINTS.LMS_SUBSCRIPTIONS.MY_ACTIVE}`, {
                headers: this.getAuthHeaders(),
            });

            if (response.status === 404) {
                return { success: true, data: null }; // No active subscription
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch active subscription: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Active subscription fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching active subscription:', error);
            return { success: false, message: error.message, error };
        }
    }

    // ==================== ATTENDANCE ====================

    /**
     * Get current user's attendance history
     * GET /api/v1/lms/attendance/my
     */
    async getMyAttendance(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_ATTENDANCE.MY}?page=${page}&size=${size}`,
                { headers: this.getAuthHeaders() }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch attendance: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ My attendance fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching attendance:', error);
            return { success: false, message: error.message, error };
        }
    }

    // ==================== GALLERY ====================

    /**
     * Upload a new gallery item
     * POST /api/v1/lms/gallery
     */
    async uploadGalleryItem(galleryData) {
        try {
            const response = await fetch(`${this.baseURL}${API_ENDPOINTS.LMS_GALLERY.UPLOAD}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(galleryData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to upload: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Gallery item uploaded:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error uploading gallery item:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get current user's gallery uploads
     * GET /api/v1/lms/gallery/my
     */
    async getMyGalleryUploads(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_GALLERY.MY}?page=${page}&size=${size}`,
                { headers: this.getAuthHeaders() }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch gallery uploads: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ My gallery uploads fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching gallery uploads:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get public gallery items (approved)
     * GET /api/v1/lms/gallery/public
     */
    async getPublicGallery(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_GALLERY.PUBLIC}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch public gallery: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Public gallery fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching public gallery:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get featured gallery items
     * GET /api/v1/lms/gallery/featured
     */
    async getFeaturedGallery(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_GALLERY.FEATURED}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch featured gallery: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Featured gallery fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching featured gallery:', error);
            return { success: false, message: error.message, error };
        }
    }

    // ==================== EVENTS ====================

    /**
     * Get public events
     * GET /api/v1/lms/events/public
     */
    async getPublicEvents(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_EVENTS.GET_PUBLIC}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch public events: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Public events fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching public events:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get upcoming events
     * GET /api/v1/lms/events/upcoming
     */
    async getUpcomingEvents(page = 0, size = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_EVENTS.GET_UPCOMING}?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch upcoming events: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Upcoming events fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching upcoming events:', error);
            return { success: false, message: error.message, error };
        }
    }

    // ==================== SESSIONS ====================

    /**
     * Get all class sessions
     * GET /api/v1/lms/sessions
     */
    async getAllSessions(page = 0, size = 50) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_SESSIONS.GET_ALL}?page=${page}&size=${size}`,
                {
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch sessions: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ All sessions fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching sessions:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get upcoming class sessions
     * GET /api/v1/lms/sessions/upcoming
     */
    async getUpcomingSessions(page = 0, size = 50) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_SESSIONS.GET_UPCOMING}?page=${page}&size=${size}`,
                {
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch upcoming sessions: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Upcoming sessions fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching upcoming sessions:', error);
            return { success: false, message: error.message, error };
        }
    }

    /**
     * Get sessions by date
     * GET /api/v1/lms/sessions/date/{date}
     */
    async getSessionsByDate(date) {
        try {
            // date format: YYYY-MM-DD
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.LMS_SESSIONS.GET_BY_DATE(date)}`,
                {
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch sessions for date: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Sessions by date fetched:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching sessions by date:', error);
            return { success: false, message: error.message, error };
        }
    }
}

// Export singleton instance
export default new LmsService();
