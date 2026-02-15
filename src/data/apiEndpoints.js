// Base Configuration
// export const BASE_URL = "http://93.127.194.118:8095";
export const BASE_URL = "https://api.jjartacademy.com";
// export const BASE_URL = "http://localhost:8095";
export const API_PREFIX = "/api/v1";

/**
 * API Endpoints Configuration
 * Usage example: 
 * fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, ...)
 * fetch(`${BASE_URL}${API_ENDPOINTS.USERS.GET_BY_ID('123')}`, ...)
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    DEV_REGISTER: `${API_PREFIX}/auth/dev-register`,
    REFRESH_TOKEN: `${API_PREFIX}/auth/refresh`,
    REQUEST_OTP: `${API_PREFIX}/auth/request-otp`,
    VERIFY_OTP: `${API_PREFIX}/auth/verify-otp`,
    VERIFY_LOGIN_OTP: `${API_PREFIX}/auth/verify-login-otp`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  },

  // User Management
  USERS: {
    GET_ALL: `${API_PREFIX}/users`,
    CREATE: `${API_PREFIX}/users`,
    CURRENT_USER: `${API_PREFIX}/users/me`,
    UPDATE_CURRENT_USER: `${API_PREFIX}/users/me`,
    GET_BY_ID: (id) => `${API_PREFIX}/users/${id}`,
    UPDATE: (id) => `${API_PREFIX}/users/${id}`,
    DELETE: (id) => `${API_PREFIX}/users/${id}`,
  },

  // Class Enrollments
  ENROLLMENTS: {
    GET_ALL: `${API_PREFIX}/enrollments`, // Admin
    ENROLL: `${API_PREFIX}/enrollments`,
    MY_ENROLLMENTS: `${API_PREFIX}/enrollments/my-enrollments`,
    GET_BY_ID: (enrollmentId) => `${API_PREFIX}/enrollments/${enrollmentId}`,
    UPDATE: (enrollmentId) => `${API_PREFIX}/enrollments/${enrollmentId}`,
    DELETE: (enrollmentId) => `${API_PREFIX}/enrollments/${enrollmentId}`,
    UPDATE_STATUS: (enrollmentId) => `${API_PREFIX}/enrollments/${enrollmentId}/status`,
    CANCEL: (enrollmentId) => `${API_PREFIX}/enrollments/${enrollmentId}/cancel`,
  },

  // Art Works
  ART_WORKS: {
    GET_ALL: `${API_PREFIX}/art-works`,
    CREATE: `${API_PREFIX}/art-works`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-works/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-works/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-works/${id}`,
    INCREMENT_VIEWS: (id) => `${API_PREFIX}/art-works/${id}/views`,
    INCREMENT_LIKES: (id) => `${API_PREFIX}/art-works/${id}/likes`,
  },

  // Art Works Categories
  ART_WORKS_CATEGORIES: {
    GET_ALL: `${API_PREFIX}/art-works-categories`,
    CREATE: `${API_PREFIX}/art-works-categories`,
    GET_ROOT: `${API_PREFIX}/art-works-categories/root`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-works-categories/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-works-categories/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-works-categories/${id}`,
  },

  // Art Materials
  ART_MATERIALS: {
    GET_ALL: `${API_PREFIX}/art-materials`,
    CREATE: `${API_PREFIX}/art-materials`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-materials/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-materials/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-materials/${id}`,
  },

  // Art Materials Categories
  ART_MATERIALS_CATEGORIES: {
    GET_ALL: `${API_PREFIX}/art-materials-categories`,
    CREATE: `${API_PREFIX}/art-materials-categories`,
    GET_ROOT: `${API_PREFIX}/art-materials-categories/root`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-materials-categories/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-materials-categories/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-materials-categories/${id}`,
  },

  // Art Galleries
  ART_GALLERIES: {
    GET_ALL: `${API_PREFIX}/art-galleries`,
    MY: `${API_PREFIX}/art-galleries/my`, // Get current user's gallery items
    CREATE: `${API_PREFIX}/art-galleries`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-galleries/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-galleries/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-galleries/${id}`,
  },

  // Art Galleries Categories
  ART_GALLERIES_CATEGORIES: {
    GET_ALL: `${API_PREFIX}/art-galleries-categories`,
    CREATE: `${API_PREFIX}/art-galleries-categories`,
    GET_ROOT: `${API_PREFIX}/art-galleries-categories/root`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-galleries-categories/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-galleries-categories/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-galleries-categories/${id}`,
  },

  // Art Exhibitions
  ART_EXHIBITIONS: {
    GET_ALL: `${API_PREFIX}/art-exhibitions`,
    CREATE: `${API_PREFIX}/art-exhibitions`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-exhibitions/${id}`,
  },

  // Art Exhibitions Categories
  ART_EXHIBITIONS_CATEGORIES: {
    GET_ALL: `${API_PREFIX}/art-exhibitions-categories`,
    CREATE: `${API_PREFIX}/art-exhibitions-categories`,
    GET_ROOT: `${API_PREFIX}/art-exhibitions-categories/root`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-exhibitions-categories/${id}`,
  },

  // Art Classes
  ART_CLASSES: {
    GET_ALL: `${API_PREFIX}/art-classes`,
    CREATE: `${API_PREFIX}/art-classes`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-classes/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-classes/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-classes/${id}`,
  },

  // Art Classes Categories
  ART_CLASSES_CATEGORIES: {
    GET_ALL: `${API_PREFIX}/art-classes-categories`,
    CREATE: `${API_PREFIX}/art-classes-categories`,
    GET_ROOT: `${API_PREFIX}/art-classes-categories/root`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-classes-categories/${id}`,
    UPDATE: (id) => `${API_PREFIX}/art-classes-categories/${id}`,
    DELETE: (id) => `${API_PREFIX}/art-classes-categories/${id}`,
  },

  // Shopping Cart
  CART: {
    GET_MY_CART: `${API_PREFIX}/art-cart`,
    CLEAR_CART: `${API_PREFIX}/art-cart`,
    ADD_ITEM: `${API_PREFIX}/art-cart/items`,
    UPDATE_ITEM_QUANTITY: (itemId) => `${API_PREFIX}/art-cart/items/${itemId}`,
    REMOVE_ITEM: (itemId) => `${API_PREFIX}/art-cart/items/${itemId}`,
  },

  // Orders
  ORDERS: {
    GET_ALL: `${API_PREFIX}/art-orders`,
    CREATE: `${API_PREFIX}/art-orders`,
    MY_ORDERS: `${API_PREFIX}/art-orders/my-orders`,
    CHECKOUT: `${API_PREFIX}/art-orders/checkout`,
    GET_BY_ID: (id) => `${API_PREFIX}/art-orders/${id}`,
    UPDATE_STATUS: (id) => `${API_PREFIX}/art-orders/${id}/status`,
  },

  // Payments
  PAYMENTS: {
    INITIATE: `${API_PREFIX}/art-payments/initiate`,
    VERIFY: `${API_PREFIX}/art-payments/verify`,
    GET_BY_ORDER_ID: (orderId) => `${API_PREFIX}/art-payments/order/${orderId}`,
  },

  // LMS Events
  LMS_EVENTS: {
    GET_ALL: `${API_PREFIX}/lms/events`,
    CREATE: `${API_PREFIX}/lms/events`,
    GET_BY_ID: (id) => `${API_PREFIX}/lms/events/${id}`,
    UPDATE: (id) => `${API_PREFIX}/lms/events/${id}`,
    DELETE: (id) => `${API_PREFIX}/lms/events/${id}`,
    GET_UPCOMING: `${API_PREFIX}/lms/events/upcoming`,
    GET_PUBLIC: `${API_PREFIX}/lms/events/public`,
    GET_BY_TYPE: (eventType) => `${API_PREFIX}/lms/events/type/${eventType}`,
  },

  // LMS Subscriptions (Student)
  LMS_SUBSCRIPTIONS: {
    MY: `${API_PREFIX}/lms/subscriptions/my`,
    MY_ACTIVE: `${API_PREFIX}/lms/subscriptions/my/active`,
    // Admin endpoints
    GET_ALL: `${API_PREFIX}/lms/subscriptions`,
    CREATE: `${API_PREFIX}/lms/subscriptions`,
    GET_BY_ID: (id) => `${API_PREFIX}/lms/subscriptions/${id}`,
    UPDATE: (id) => `${API_PREFIX}/lms/subscriptions/${id}`,
    DELETE: (id) => `${API_PREFIX}/lms/subscriptions/${id}`,
    GET_ACTIVE: `${API_PREFIX}/lms/subscriptions/active`,
    GET_BY_STUDENT: (studentId) => `${API_PREFIX}/lms/subscriptions/student/${studentId}`,
    RENEW: (enrollmentId) => `${API_PREFIX}/lms/subscriptions/enrollment/${enrollmentId}/renew`,
    CANCEL: (id) => `${API_PREFIX}/lms/subscriptions/${id}/cancel`,
    GET_OVER_LIMIT: `${API_PREFIX}/lms/subscriptions/over-limit`,
  },

  // LMS Attendance (Student)
  LMS_ATTENDANCE: {
    MY: `${API_PREFIX}/lms/attendance/my`,
    // Admin endpoints
    MARK: `${API_PREFIX}/lms/attendance`,
    GET_BY_SESSION: (sessionId) => `${API_PREFIX}/lms/attendance/session/${sessionId}`,
    GET_BY_STUDENT: (studentId) => `${API_PREFIX}/lms/attendance/student/${studentId}`,
    GET_OVER_LIMIT: (year, month) => `${API_PREFIX}/lms/attendance/over-limit/${year}/${month}`,
    GET_ELIGIBLE_STUDENTS: `${API_PREFIX}/lms/attendance/eligible-students`,
  },

  // LMS Gallery (Student)
  LMS_GALLERY: {
    UPLOAD: `${API_PREFIX}/lms/gallery`,
    MY: `${API_PREFIX}/lms/gallery/my`,
    PUBLIC: `${API_PREFIX}/lms/gallery/public`,
    FEATURED: `${API_PREFIX}/lms/gallery/featured`,
    // Admin endpoints
    GET_ALL: `${API_PREFIX}/lms/gallery`,
    GET_BY_ID: (id) => `${API_PREFIX}/lms/gallery/${id}`,
    UPDATE: (id) => `${API_PREFIX}/lms/gallery/${id}`,
    DELETE: (id) => `${API_PREFIX}/lms/gallery/${id}`,
    GET_BY_STATUS: (status) => `${API_PREFIX}/lms/gallery/status/${status}`,
    VERIFY: (id) => `${API_PREFIX}/lms/gallery/${id}/verify`,
    COUNT_PENDING: `${API_PREFIX}/lms/gallery/pending/count`,
  },

  // LMS Class Sessions (Admin)
  LMS_SESSIONS: {
    GET_ALL: `${API_PREFIX}/lms/sessions`,
    CREATE: `${API_PREFIX}/lms/sessions`,
    GET_BY_ID: (id) => `${API_PREFIX}/lms/sessions/${id}`,
    UPDATE: (id) => `${API_PREFIX}/lms/sessions/${id}`,
    DELETE: (id) => `${API_PREFIX}/lms/sessions/${id}`,
    GET_UPCOMING: `${API_PREFIX}/lms/sessions/upcoming`,
    GET_BY_DATE: (date) => `${API_PREFIX}/lms/sessions/date/${date}`,
    GET_BY_RANGE: `${API_PREFIX}/lms/sessions/range`,
    UPDATE_STATUS: (id) => `${API_PREFIX}/lms/sessions/${id}/status`,
    GET_WITH_ATTENDANCE: (id) => `${API_PREFIX}/lms/sessions/${id}/attendance`,
  },

  // LMS Events (Public)
  LMS_EVENTS: {
    GET_ALL: `${API_PREFIX}/lms/events`,
    GET_PUBLIC: `${API_PREFIX}/lms/events/public`,
    GET_UPCOMING: `${API_PREFIX}/lms/events/upcoming`,
    GET_BY_ID: (id) => `${API_PREFIX}/lms/events/${id}`,
    CREATE: `${API_PREFIX}/lms/events`,
    UPDATE: (id) => `${API_PREFIX}/lms/events/${id}`,
    DELETE: (id) => `${API_PREFIX}/lms/events/${id}`,
  },
};


export default API_ENDPOINTS;