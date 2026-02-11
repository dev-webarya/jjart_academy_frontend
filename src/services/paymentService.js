/**
 * Payment Service
 * Handles Razorpay payment API calls
 */
import { BASE_URL, API_ENDPOINTS } from '../data/apiEndpoints';

class PaymentService {
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
     * Load Razorpay script dynamically
     */
    loadRazorpayScript() {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    /**
     * Initiate payment for an order
     * POST /api/v1/art-payments/initiate
     * @param {string} orderId - Order ID to initiate payment for
     */
    async initiatePayment(orderId) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.PAYMENTS.INITIATE}`,
                {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({ orderId }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error initiating payment:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify payment after Razorpay checkout
     * POST /api/v1/art-payments/verify
     * @param {string} razorpayOrderId - Razorpay order ID
     * @param {string} razorpayPaymentId - Razorpay payment ID
     * @param {string} razorpaySignature - Razorpay signature
     */
    async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        try {
            const url = new URL(`${this.baseURL}${API_ENDPOINTS.PAYMENTS.VERIFY}`);
            url.searchParams.append('razorpayOrderId', razorpayOrderId);
            url.searchParams.append('razorpayPaymentId', razorpayPaymentId);
            url.searchParams.append('razorpaySignature', razorpaySignature);

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error verifying payment:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get payment details for an order
     * GET /api/v1/art-payments/order/{orderId}
     * @param {string} orderId - Order ID
     */
    async getPaymentByOrderId(orderId) {
        try {
            const response = await fetch(
                `${this.baseURL}${API_ENDPOINTS.PAYMENTS.GET_BY_ORDER_ID(orderId)}`,
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
            console.error('Error fetching payment:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Open Razorpay checkout modal
     * @param {Object} paymentData - Payment data from initiatePayment response
     * @param {Function} onSuccess - Callback on successful payment
     * @param {Function} onFailure - Callback on payment failure
     * @param {Object} userInfo - Optional user info for prefill
     */
    async openRazorpayCheckout(paymentData, onSuccess, onFailure, userInfo = {}) {
        const scriptLoaded = await this.loadRazorpayScript();

        if (!scriptLoaded) {
            onFailure({ error: 'Failed to load Razorpay SDK' });
            return;
        }

        const options = {
            key: paymentData.razorpayKeyId,
            amount: paymentData.amount * 100, // Amount in paise
            currency: paymentData.currency || 'INR',
            name: 'JJ Art Academy',
            description: paymentData.orderNumber
                ? `Order: ${paymentData.orderNumber}`
                : 'Art Academy Order',
            image: '/logo.png',
            order_id: paymentData.razorpayOrderId,
            prefill: {
                name: userInfo.name || '',
                email: userInfo.email || '',
                contact: userInfo.phone || '',
            },
            theme: {
                color: '#7c3aed', // Purple theme
            },
            handler: async (response) => {
                // Payment successful, verify with backend
                const verifyResult = await this.verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );

                if (verifyResult.success) {
                    onSuccess(verifyResult.data);
                } else {
                    onFailure({ error: verifyResult.error || 'Payment verification failed' });
                }
            },
            modal: {
                ondismiss: () => {
                    onFailure({ error: 'Payment cancelled by user', cancelled: true });
                },
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', (resp) => {
            onFailure({
                error: resp.error.description || 'Payment failed',
                code: resp.error.code,
                reason: resp.error.reason,
            });
        });

        rzp.open();
    }
}

const paymentService = new PaymentService();
export default paymentService;
