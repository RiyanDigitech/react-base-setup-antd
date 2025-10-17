'use client';
import React from 'react';
import { Form, Input, Button, Card, Typography, message, Flex } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { SignUpFormData, signUpSchema } from '@/lib/schemas/authSchema';
import { useSignUp } from '@/services/signup';


const { Title, Text, Link } = Typography;

const SignUpPage: React.FC = () => {
    // React Router ka hook navigation ke liye
    const navigate = useNavigate();

    // React Hook Form aur Zod validation ka setup
    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur', // Jaise hi user field se bahar nikle, validation check ho
    });

    // TanStack Query se API call ke liye mutation hook
    const { mutate: signUp, isPending } = useSignUp();

    // Form submit hone par yeh function chalega
    const onSubmit = (data: SignUpFormData) => {
        signUp(data, {
            onSuccess: () => {
                message.success('Signup successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/auth/login'); // Login page par redirect karein
                }, 1500); // 1.5 second ka delay takay user message parh sakay
            },
            onError: (error: any) => {
                message.error(error.response?.data?.error || 'Signup failed. Please try again.');
            },
        });
    };

    return (
        <Flex align="center" justify="center" >
            <Card style={{ width: 400, boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)', padding: '6px' }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <Title level={2}>Create an Account</Title>
                    <Text type="secondary">Join us and start your journey!</Text>
                </div>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item label="Full Name" required validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                        <Controller name="name" control={control} render={({ field }) => <Input {...field} prefix={<UserOutlined />} placeholder="John Doe" size="large" />} />
                    </Form.Item>

                    <Form.Item label="Email" required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
                        <Controller name="email" control={control} render={({ field }) => <Input {...field} type="email" prefix={<MailOutlined />} placeholder="your.email@example.com" size="large" />} />
                    </Form.Item>
                    
                    <Form.Item label="Phone" required validateStatus={errors.phone ? 'error' : ''} help={errors.phone?.message}>
                        <Controller name="phone" control={control} render={({ field }) => <Input {...field} prefix={<PhoneOutlined />} placeholder="1234567890" size="large" />} />
                    </Form.Item>

                    <Form.Item label="Password" required validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                        <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} prefix={<LockOutlined />} placeholder="••••••••" size="large" />} />
                    </Form.Item>

                    <Form.Item label="Confirm Password" required validateStatus={errors.passwordConfirmation ? 'error' : ''} help={errors.passwordConfirmation?.message}>
                        <Controller name="passwordConfirmation" control={control} render={({ field }) => <Input.Password {...field} prefix={<LockOutlined />} placeholder="••••••••" size="large" />} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '14px' }}>
                        <Button  htmlType="submit" block loading={isPending} size="large">
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
                <div className=''>
                    Already have an account? <Link onClick={() => navigate('/auth/login')}>Log in here</Link>

                </div>

                {/* <Text >
                </Text> */}
            </Card>
        </Flex>
    );
};

export default SignUpPage;