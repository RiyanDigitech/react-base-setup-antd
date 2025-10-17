import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/config/axios-instance'; // Aapka configured axios instance
import { SignUpFormData } from '@/lib/schemas/authSchema';

// API response ki type (example)
interface SignUpResponse {
    message: string;
    userId: string;
}

// Signup karne wala async function
const signUpUser = async (payload: SignUpFormData): Promise<SignUpResponse> => {
    // passwordConfirmation ko API par nahi bhejna
    const { passwordConfirmation, ...apiPayload } = payload;
    const { data } = await axios.post('/api/auth/signup', apiPayload);
    return data;
};

// Signup ke liye custom mutation hook
export const useSignUp = () => {
    return useMutation({
        mutationFn: signUpUser,
    });
};