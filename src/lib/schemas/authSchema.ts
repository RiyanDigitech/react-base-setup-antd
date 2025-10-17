import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
    passwordConfirmation: z.string()
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"], // Error ko is field par dikhayein
});

export type SignUpFormData = z.infer<typeof signUpSchema>;