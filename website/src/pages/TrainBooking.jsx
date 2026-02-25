import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrain, FaArrowLeft, FaCreditCard, FaCheckCircle, FaClock } from 'react-icons/fa';
import { saveTrip } from '../services/storage';


const TrainBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { train, searchData } = location.state || {};

    const [passengers, setPassengers] = useState(
        Array.from({ length: searchData?.passengers || 1 }, () => ({
            name: '',
            email: '',
            phone: ''
        }))
    );

    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle');

    if (!train || !searchData) {
        return (
            <Container className="py-5 text-center text-white">
                <h2>No booking data found.</h2>
                <Button onClick={() => navigate('/')} variant="primary" className="mt-3">Back to Home</Button>
            </Container>
        );
    }

    const handlePassengerChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [name]: value };
        setPassengers(updatedPassengers);
    };

   const handleConfirmBooking = async (e) => {
    e.preventDefault();

    try {
        // Create an array of booking objects, one per passenger
        const bookingData = passengers.map(passenger => ({
            name: passenger.name,
            email: passenger.email,
            fromLocation: searchData.from,
            toLocation: searchData.to,
            travelDate: searchData.date,
            fare: String(750 * (searchData.passengers || 1)) // Adjust train fare
        }));

        // Send all bookings one by one to backend
        for (let booking of bookingData) {
            const response = await fetch('http://localhost:8080/admin/trainbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            await response.json();
        }

        console.log("All train passengers booked successfully ✅");
        setShowPayment(true);

    } catch (error) {
        console.error("Database Save Error:", error);
        alert("Error storing train booking ❌");
    }
};

    const handleProcessPayment = async () => {
        setPaymentStatus('processing');
        await new Promise(resolve => setTimeout(resolve, 2500));
        setPaymentStatus('success');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await completeBooking();
    };

    const completeBooking = async () => {
        const tripData = {
            title: `Train Trip to ${searchData.to}`,
            destination: searchData.to,
            startDate: searchData.date,
            endDate: searchData.date,
            budget: 750 * (searchData.passengers || 1), // Mock price
            category: 'train',
            passengers: passengers,
            bookings: [{
                ...train,
                type: 'train',
                from: searchData.from,
                to: searchData.to,
                date: searchData.date,
                passengers: searchData.passengers
            }]
        };

        const newTrip = saveTrip(tripData);

        try {
            console.log("Sending train tickets to", passengers[0].email);
                       for (let passenger of passengers) {
    await fetch("http://localhost:8080/api/trains/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: passenger.name,
            email: passenger.email,
            phone: passenger.phone,
            from: searchData.from,
            to: searchData.to,
            date: searchData.date,
            passengers: searchData.passengers,
            trainName: train.train_name,
            trainNumber: train.train_no,
            departureTime: train.from_station?.departure_time,
            arrivalTime: train.to_station?.arrival_time,
            amount: 750 // fare per passenger
        })
    });
}
            alert(`Payment Successful! Train booking confirmed for ${passengers.length} passenger(s). Ticket has been sent to ${passengers[0].email}.`);
            navigate(`/booking-confirmation/${newTrip.id}`);
        } catch (error) {
            alert(`Payment Successful! Booking confirmed, but we couldn't send the ticket.`);
            navigate(`/booking-confirmation/${newTrip.id}`);
        }
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    variant="link"
                    className="text-white text-decoration-none mb-4 p-0 d-flex align-items-center gap-2"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Back to Results
                </Button>

                <Row className="g-4">
                    <Col lg={8}>
                        <Form onSubmit={handleConfirmBooking}>
                            {passengers.map((passenger, index) => (
                                <Card key={index} className="glass-panel border-0 p-4 mb-4">
                                    <h3 className="fw-bold mb-4 text-white">
                                        Passenger {index + 1} Details
                                    </h3>
                                    <Row className="g-3">
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold">FULL NAME</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter passenger name"
                                                    required
                                                    value={passenger.name}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                    className="bg-dark border-secondary text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold">EMAIL ADDRESS</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="passenger@example.com"
                                                    required
                                                    value={passenger.email}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                    className="bg-dark border-secondary text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold">PHONE NUMBER</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="+91 00000 00000"
                                                    required
                                                    value={passenger.phone}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                    className="bg-dark border-secondary text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="rounded-pill px-5 fw-bold w-100"
                                    onClick={handleConfirmBooking}
                                >
                                    CONFIRM BOOKING
                                </Button>
                            </div>
                        </Form>
                    </Col>

                    <Col lg={4}>
                        <Card className="glass-panel border-0 p-4 sticky-top shadow-sm" style={{ top: '90px', zIndex: 10 }}>
                            <h4 className="fw-bold mb-4">Fare Summary</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Base Fare</span>
                                <span>₹750</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Passengers</span>
                                <span>x {searchData.passengers}</span>
                            </div>
                            <hr className="border-secondary" />
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="fw-bold mb-0">Total Amount</h5>
                                <h5 className="fw-bold mb-0 text-primary">₹{750 * searchData.passengers}</h5>
                            </div>

                            <Card className="bg-dark border-secondary p-3 rounded-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary rounded-circle p-2">
                                        <FaTrain className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{train.train_name}</h6>
                                        <small className="text-muted">{train.train_no}</small>
                                    </div>
                                </div>
                                <div className="mt-3 small text-muted">
                                    <div className="d-flex justify-content-between">
                                        <span>{train.from_station.display_name_en}</span>
                                        <FaClock className="mx-2" />
                                        <span>{train.from_station.departure_time}</span>
                                    </div>
                                    <div className="text-center my-1">↓</div>
                                    <div className="d-flex justify-content-between">
                                        <span>{train.to_station.display_name_en}</span>
                                        <FaClock className="mx-2" />
                                        <span>{train.to_station.arrival_time}</span>
                                    </div>
                                </div>
                            </Card>
                        </Card>
                    </Col>
                </Row>
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
                    {/* Razorpay Header Style */}
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
                            <div className="h4 mb-0 fw-bold">₹{750 * searchData.passengers}</div>
                            <small style={{ fontSize: '10px', color: '#666666' }}>ORDER ID: ord_{Math.random().toString(36).substr(2, 9)}</small>
                        </div>
                    </div>

                    <div className="p-4 bg-white">
                        {paymentStatus === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#444444' }}>Cards, UPI & More</h6>

                                    <div className="d-grid gap-2">
                                        <div
                                            className="p-3 border rounded-3 d-flex align-items-center gap-3 bg-white"
                                            style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: '#dee2e6' }}
                                            onClick={handleProcessPayment}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = '#3395ff'}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                                        >
                                            <FaCreditCard style={{ color: '#666666' }} />
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold small" style={{ color: '#222222' }}>Card</div>
                                                <div style={{ fontSize: '11px', color: '#666666' }}>Visa, MasterCard, RuPay, Maestro</div>
                                            </div>
                                            <div className="small fw-bold" style={{ color: '#3395ff' }}>{'>'}</div>
                                        </div>

                                        <div className="p-3 border rounded-3 d-flex align-items-center gap-3 bg-white opacity-75">
                                            <img src="https://checkout.razorpay.com/v1/checkout/public/images/upi_logos.png" alt="UPI" style={{ height: '20px' }} />
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold small" style={{ color: '#222222' }}>UPI</div>
                                                <div style={{ fontSize: '11px', color: '#666666' }}>Google Pay, PhonePe, Paytm</div>
                                            </div>
                                        </div>

                                        <div className="p-3 border rounded-3 d-flex align-items-center gap-3 bg-white opacity-75">
                                            <div style={{ color: '#666666', fontSize: '11px', fontWeight: 'bold' }}>EMI</div>
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold small" style={{ color: '#222222' }}>EMI</div>
                                                <div style={{ fontSize: '11px', color: '#666666' }}>No Cost EMI available</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Button
                                        variant="primary"
                                        className="w-100 py-3 fw-bold border-0"
                                        style={{ background: '#3395ff' }}
                                        onClick={handleProcessPayment}
                                    >
                                        PAY ₹{750 * searchData.passengers}
                                    </Button>
                                    <div className="mt-3 text-center" style={{ fontSize: '10px', color: '#999999' }}>
                                        By continuing, you agree to our Terms and Conditions.
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {paymentStatus === 'processing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-5"
                            >
                                <Spinner animation="border" style={{ color: '#3395ff', width: '3rem', height: '3rem' }} className="mb-4" />
                                <h5 className="fw-bold mb-2" style={{ color: '#222222' }}>Processing your payment...</h5>
                                <p style={{ color: '#666666', fontSize: '12px' }}>Please do not press back or refresh.</p>
                            </motion.div>
                        )}

                        {paymentStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-5"
                            >
                                <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: '#e6f7ed' }}>
                                    <FaCheckCircle className="text-success" size={50} />
                                </div>
                                <h4 className="fw-bold mb-2" style={{ color: '#222222' }}>Payment Successful</h4>
                                <p style={{ color: '#666666', fontSize: '12px' }}>Your ticket is being generated...</p>
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

export default TrainBooking;