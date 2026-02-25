import React, { useState } from 'react';
import { Container, Form, Button, Card, FloatingLabel, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSignInAlt } from 'react-icons/fa';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulated admin check
        setTimeout(() => {
            if (credentials.email === 'tripeaseforyou@gmail.com' && credentials.password === 'Admin@123') {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin-dashboard');
            } else {
                setError('Invalid admin credentials. Please try again.');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="admin-login-wrapper" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'radial-gradient(circle at top right, #1e293b, #0f172a 60%)'
        }}>
            <Container>
                <div className="d-flex justify-content-center">
                    <Card className="glass-panel border-0 p-4 p-md-5" style={{ maxWidth: '450px', width: '100%' }}>
                        <div className="text-center mb-4">
                            <div className="admin-icon-container mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                                <FaUserShield size={40} className="text-primary" />
                            </div>
                            <h2 className="fw-bold text-white mb-1">Admin Portal</h2>
                            <p className="text-muted small">Restricted access for authorized personnel only</p>
                        </div>

                        {error && <Alert variant="danger" className="py-2 small bg-danger bg-opacity-10 border-danger text-danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <FloatingLabel controlId="adminEmail" label="Admin Email" className="mb-3">
                                <Form.Control
                                    type="email"
                                    className="glass-input"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    required
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="adminPassword" label="Security Password" className="mb-4">
                                <Form.Control
                                    type="password"

                                    className="glass-input"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                />
                            </FloatingLabel>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-3 fw-bold mmt-btn d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    'Authenticating...'
                                ) : (
                                    <>
                                        <FaSignInAlt /> Secure Login
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Card>
                </div>
            </Container>

            <style>{`
                .glass-input {
                    background: rgba(15, 23, 42, 0.4) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 12px !important;
                }
                .glass-input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                .glass-input:focus {
                    border-color: #2563EB !important;
                    box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.15) !important;
                }
                .form-floating > label {
                    padding-left: 1.25rem;
                    color: rgba(255, 255, 255, 0.7) !important;
                }
                .form-floating > .glass-input:focus ~ label,
                .form-floating > .glass-input:not(:placeholder-shown) ~ label {
                    color: #60a5fa !important;
                    opacity: 0.8;
                }
                .admin-login-wrapper {
                    position: relative;
                    z-index: 1;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;