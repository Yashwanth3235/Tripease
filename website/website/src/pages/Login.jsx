import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/loginUser', {
                UserId: email,
                password: password
            });

            if (response.data === true) {
                localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
                navigate('/');
                window.location.reload();
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials or server status.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/google', {
                token: credentialResponse.credential
            });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify({
                    email: response.data.mail,
                    name: response.data.name
                }));
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            setError('Google authentication failed.');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <Card className="glass-panel border-0 p-4">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-gradient">Welcome Back</h2>
                        <p className="text-muted">Sign in to continue planning your trips.</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                            <span className="mx-2 text-muted small">OR</span>
                            <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        <div className="d-flex justify-content-center mb-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google login failed.')}
                                theme="filled_blue"
                                shape="pill"
                                text="continue_with"
                            />
                        </div>

                        <div className="text-center">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/signup" className="text-decoration-none fw-bold">Sign Up</Link>
                        </div>
                    </Form>
                </Card>
            </motion.div>
        </Container>
    );
};

export default Login;
