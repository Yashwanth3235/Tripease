import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/addUser', {
                name: formData.name,
                mail: formData.email,
                phone: 0,
                password: formData.password
            });

            if (response.data) {
                localStorage.setItem('user', JSON.stringify({
                    email: formData.email,
                    name: formData.name
                }));
                navigate('/login');
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                        <h2 className="fw-bold text-gradient">Create Account</h2>
                        <p className="text-muted">Join Tripease and start planning your trips.</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSignUp}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
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
                            <span className="text-muted">Already have an account? </span>
                            <Link to="/login" className="text-decoration-none fw-bold">Sign In</Link>
                        </div>
                    </Form>
                </Card>
            </motion.div>
        </Container>
    );
};

export default SignUp;
