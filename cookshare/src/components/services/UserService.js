import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/me`, {
            withCredentials: true // This is important for sending cookies
        });
        
        // Store only username in localStorage
        localStorage.setItem('username', response.data.userName);
        localStorage.setItem('userId', response.data.id);
        return response.data.userName;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}; 