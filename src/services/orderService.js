/**
 * Order Service
 * Handles student-facing order API calls
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class OrderService {
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

    /**
     * Get my orders (student)
     * GET /api/v1/art-orders/my-orders
     */
    async getMyOrders(page = 0, size = 20) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.ORDERS.MY_ORDERS}?page=${page}&size=${size}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching my orders:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get order by ID
     * GET /api/v1/art-orders/:id
     */
    async getOrderById(orderId) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.ORDERS.GET_BY_ID(orderId)}`,
                {
                    method: 'GET',
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching order:', error);
            return { success: false, error: error.message };
        }
    }
}

const orderService = new OrderService();
export default orderService;
