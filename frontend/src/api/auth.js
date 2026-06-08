const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const loginUser =  async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);
        return data; // Return user data on successful login
    } catch (error) {
        console.error('Error during login:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful:', data);
        return data; // Return user data on successful registration
    } catch (error) {
        console.error('Error during registration:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const verifyOtp = async (email, otp) => {
    try {
        const response = await fetch(`${BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'OTP verification failed');
        }

        const data = await response.json();
        console.log('OTP verification successful:', data);
        return data; // Return user data on successful OTP verification
    } catch (error) {
        console.error('Error during OTP verification:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const resendOtp = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Resend OTP failed');
        }

        const data = await response.json();
        console.log('OTP resent successfully:', data);
        return data; // Return success message on successful OTP resend
    } catch (error) {
        console.error('Error during OTP resend:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}