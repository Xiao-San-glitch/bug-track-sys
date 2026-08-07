const API_URL = '/api';

/**
 * Utility for making API requests with JWT token automatically attached.
 */
async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        
        // Handle unauthorized (token expired or invalid)
        if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
        
        return { response, data };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Check authentication status and redirect if not logged in.
 * Use on protected pages.
 */
async function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return null;
    }

    const { response, data } = await fetchWithAuth('/auth/me');
    if (response.ok && data.success) {
        return data; // returns the user object
    } else {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return null;
    }
}

/**
 * Logout the user
 */
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
