import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, ProgressBar, Modal, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveTrip } from '../services/storage';
import { FaCreditCard, FaCheckCircle, FaLock, FaShieldAlt } from 'react-icons/fa';

const PlanTrip = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success

    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelStyle: [],
        budget: 1000,
        members: 1,
        mail: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStyleSelect = (style) => {
        setFormData(prev => {
            const styles = prev.travelStyle.includes(style)
                ? prev.travelStyle.filter(s => s !== style)
                : [...prev.travelStyle, style];
            return { ...prev, travelStyle: styles };
        });
    };

    const handlePaymentClick = () => {
        setShowPayment(true);
    };

    const handleProcessPayment = async () => {
        setPaymentStatus('processing');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        setPaymentStatus('success');
        // Small delay to show success state
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowPayment(false);
        handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);

        // Simulate AI generation feel
        setTimeout(async () => {

            try {
                // ✅ ADD BACKEND FETCH (added only this block)
                await fetch("http://localhost:8080/api/trips", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        destination: formData.destination,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        travelStyle: formData.travelStyle.join(","),
                        budget: parseFloat(formData.budget),
                        members: parseInt(formData.members),
                        mail: formData.mail,
                        phone: formData.phone
                    })
                });
            } catch (error) {
                console.error("Backend error:", error);
            }

            // ✅ YOUR ORIGINAL CODE (unchanged)
            saveTrip({
                title: `Trip to ${formData.destination}`,
                destination: formData.destination,
                startDate: formData.startDate,
                endDate: formData.endDate,
                budget: formData.budget,
                members: formData.members,
                mail: formData.mail,
                phone: formData.phone,
                category: 'trip',
                image: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60`
            });

            setLoading(false);
            navigate('/my-trips');

        }, 1500);
    };

    // Simple Step Progress
    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto"
                style={{ maxWidth: '800px' }}
            >
                <div className="text-center mb-5">
                    <h1 className="fw-bold mb-3">Plan Your Next Adventure</h1>
                    <p className="text-muted">Tell us your preferences and we'll craft the perfect itinerary.</p>
                </div>

                <Card className="glass-panel border-0 p-4 p-md-5">
                    <div className="mb-4">
                        <ProgressBar now={progress} variant="primary" className="mb-2" style={{ height: '6px' }} />
                        <div className="d-flex justify-content-between text-muted small">
                            <span>Destination</span>
                            <span>Preferences</span>
                            <span>Budget</span>
                        </div>
                    </div>

                    <Form>
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key="step1"
                            >
                                <Form.Group className="mb-4">
                                    <Form.Label>Where do you want to go?</Form.Label>
                                    <Form.Control
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="e.g., Kyoto, Japan"
                                        size="lg"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                type="date"
                                                size="lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                type="date"
                                                size="lg"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label>Number of Members</Form.Label>
                                    <Form.Control
                                        name="members"
                                        value={formData.members}
                                        onChange={handleChange}
                                        type="number"
                                        min="1"
                                        size="lg"
                                        placeholder="Enter number of travelers"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                name="mail"
                                                value={formData.mail}
                                                onChange={handleChange}
                                                type="email"
                                                size="lg"
                                                placeholder="Enter your email"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                size="lg"
                                                placeholder="Enter your phone number"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="text-end">
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant="primary"
                                        size="lg"
                                        disabled={!formData.destination || !formData.startDate || !formData.endDate || !formData.members}
                                    >
                                        Next Step
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key="step2"
                            >
                                <h4 className="mb-4">What kind of traveler are you?</h4>
                                <div className="d-grid gap-3 mb-4">
                                    {['Relaxation & Wellness', 'Adventure & Sports', 'Culture & History', 'Food & Dining'].map((type) => (
                                        <Button
                                            key={type}
                                            variant={formData.travelStyle.includes(type) ? "primary" : "outline-light"}
                                            className="text-start p-3"
                                            onClick={() => handleStyleSelect(type)}
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Button onClick={() => setStep(1)} variant="outline-secondary">Back</Button>
                                    <Button onClick={() => setStep(3)} variant="primary">Next Step</Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key="step3"
                            >
                                <h4 className="mb-4">What is your budget?</h4>
                                <Form.Group className="mb-4">
                                    <Form.Label>Total Budget (₹)</Form.Label>
                                    <Form.Control
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        type="number"
                                        min="500"
                                        size="lg"
                                        placeholder="Enter your budget amount"
                                        className="bg-dark border-secondary text-white"
                                    />
                                    <Form.Text className="text-muted">
                                        Suggested minimum: ₹500
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex justify-content-between mt-5">
                                    <Button onClick={() => setStep(2)} variant="outline-secondary">Back</Button>
                                    <Button
                                        onClick={handlePaymentClick}
                                        variant="success"
                                        size="lg"
                                        className="px-5"
                                        disabled={loading}
                                    >
                                        {loading ? 'Generating...' : 'Confirm & Pay'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </Form>
                </Card>
            </motion.div>

            {/* Simulated Razorpay Modal */}
            <Modal
                show={showPayment}
                onHide={() => paymentStatus === 'idle' && setShowPayment(false)}
                centered
                backdrop="static"
                contentClassName="border-0 rounded-4 overflow-hidden"
                style={{ zIndex: 2000 }}
            >
                <Modal.Body className="p-0 bg-white text-dark">
                    <div className="p-4 d-flex justify-content-between align-items-center border-bottom" style={{ background: '#ffffff', color: '#000000' }}>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <div style={{ background: '#3395ff', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaCreditCard size={14} color="white" />
                                </div>
                                <h6 className="mb-0 fw-bold" style={{ color: '#000000' }}>Tripease Payments</h6>
                            </div>
                            <small style={{ fontSize: '10px', color: '#666666' }}>SECURED BY RAZORPAY</small>
                        </div>
                        <div className="text-end" style={{ color: '#000000' }}>
                            <div className="h4 mb-0 fw-bold">₹{formData.budget}</div>
                            <small style={{ fontSize: '10px', color: '#666666' }}>ORDER ID: ord_{Math.random().toString(36).substr(2, 9)}</small>
                        </div>
                    </div>

                    <div className="p-4 bg-white">
                        {paymentStatus === 'idle' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#444444' }}>Cards, UPI & More</h6>
                                    <div className="d-grid gap-2">
                                        <div
                                            className="p-3 border rounded-3 d-flex align-items-center gap-3 bg-white"
                                            style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: '#dee2e6' }}
                                            onClick={handleProcessPayment}
                                        >
                                            <FaCreditCard style={{ color: '#666666' }} />
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold small" style={{ color: '#222222' }}>Card</div>
                                                <div style={{ fontSize: '11px', color: '#666666' }}>Visa, MasterCard, RuPay, Maestro</div>
                                            </div>
                                        </div>
                                        <div className="p-3 border rounded-3 d-flex align-items-center gap-3 bg-white opacity-75">
                                            <img src="https://checkout.razorpay.com/v1/checkout/public/images/upi_logos.png" alt="UPI" style={{ height: '20px' }} />
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold small" style={{ color: '#222222' }}>UPI</div>
                                                <div style={{ fontSize: '11px', color: '#666666' }}>Google Pay, PhonePe, Paytm</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button variant="primary" className="w-100 py-3 fw-bold border-0" style={{ background: '#3395ff' }} onClick={handleProcessPayment}>
                                        PAY ₹{formData.budget}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {paymentStatus === 'processing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
                                <Spinner animation="border" style={{ color: '#3395ff', width: '3rem', height: '3rem' }} className="mb-4" />
                                <h5 className="fw-bold mb-2" style={{ color: '#222222' }}>Processing payment...</h5>
                            </motion.div>
                        )}

                        {paymentStatus === 'success' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-5">
                                <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: '#e6f7ed' }}>
                                    <FaCheckCircle className="text-success" size={50} />
                                </div>
                                <h4 className="fw-bold mb-2" style={{ color: '#222222' }}>Payment Successful</h4>
                            </motion.div>
                        )}
                    </div>

                    <div className="p-3 text-center border-top bg-white d-flex align-items-center justify-content-center gap-2">
                        <small className="text-muted fw-bold" style={{ fontSize: '9px', letterSpacing: '1px' }}>POWERED BY</small>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" style={{ height: '14px' }} />
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PlanTrip;