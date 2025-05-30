import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getCurrentUser = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/users/me", {
            method: "GET",
            credentials: "include", // BẮT BUỘC để gửi cookie JWT
            headers: {
                "Accept": "application/json"
            }
        });
        if (!response.ok) throw new Error("Not authenticated");
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}; 