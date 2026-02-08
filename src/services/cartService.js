/**
 * Cart Service
 * Handles shopping cart API calls to backend
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class CartService {
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
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    /**
     * Get user's cart
     * GET /api/v1/art-cart
     */
    async getCart() {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.CART.GET_MY_CART}`,
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
            console.error('Error fetching cart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Add item to cart
     * POST /api/v1/art-cart/items
     * @param {string} productId - ID of the product
     * @param {string} productType - Type: 'ART_WORK' or 'ART_MATERIAL'
     * @param {number} quantity - Quantity to add (default: 1)
     */
    async addItem(productId, productType, quantity = 1) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.CART.ADD_ITEM}`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        itemId: productId,    // Backend expects itemId
                        itemType: productType, // Backend expects itemType
                        quantity,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update item quantity in cart
     * PUT /api/v1/art-cart/items/{itemId}?quantity=X
     * @param {string} itemId - Cart item ID
     * @param {number} quantity - New quantity
     */
    async updateItemQuantity(itemId, quantity) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.CART.UPDATE_ITEM_QUANTITY(itemId)}?quantity=${quantity}`,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error updating cart item:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Remove item from cart
     * DELETE /api/v1/art-cart/items/{itemId}
     * @param {string} itemId - Cart item ID
     */
    async removeItem(itemId) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.CART.REMOVE_ITEM(itemId)}`,
                {
                    method: 'DELETE',
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Clear entire cart
     * DELETE /api/v1/art-cart
     */
    async clearCart() {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.CART.CLEAR_CART}`,
                {
                    method: 'DELETE',
                    headers: this.getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false, error: error.message };
        }
    }
}

const cartService = new CartService();
export default cartService;
