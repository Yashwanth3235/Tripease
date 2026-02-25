import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHotel, FaArrowLeft, FaCreditCard, FaCheckCircle, FaStar } from 'react-icons/fa';
import { saveTrip } from '../services/storage';

const HotelBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotel, searchData } = location.state || {};

    const [guests, setGuests] = useState(
        Array.from({ length: searchData?.guests || 1 }, () => ({
            name: '',
            email: '',
            phone: ''
        }))
    );

    const [showPayment, setShowPayment] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle');

    if (!hotel || !searchData) {
        return (
            <Container className="py-5 text-center text-white">
                <h2>No booking data found.</h2>
                <Button onClick={() => navigate('/')} variant="primary" className="mt-3">Back to Home</Button>
            </Container>
        );
    }

    const handleGuestChange = (index, e) => {
        const { name, value } = e.target;
        const updatedGuests = [...guests];
        updatedGuests[index] = { ...updatedGuests[index], [name]: value };
        setGuests(updatedGuests);
    };

   const handleConfirmBooking = async (e) => {
    e.preventDefault();

    try {
        // Create an array of booking objects, one per guest
        const bookingData = guests.map(guest => ({
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            hotelName: hotel.name,               // ✅ matches entity
            city: searchData.hotelCity,          // ✅ matches entity
            checkIn: searchData.checkIn,         // ✅ matches entity
            checkOut: searchData.checkOut,       // ✅ matches entity
            price: String(5000 * (searchData.guests || 1)) // ✅ matches entity
        }));

        // Send all bookings one by one to backend
        for (let booking of bookingData) {
            const response = await fetch('http://localhost:8080/admin/hotelbooking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            await response.json();
        }

        console.log("All hotel guests booked successfully ✅");
        setShowPayment(true);

    } catch (error) {
        console.error("Database Save Error:", error);
        alert("Error storing hotel booking ❌");
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
            title: `Stay at ${hotel.name}`,
            destination: searchData.hotelCity,
            startDate: searchData.checkIn,
            endDate: searchData.checkOut,
            budget: 5000 * (searchData.guests || 1), // Mock price since API might not have it
            category: 'hotel',
            guests: guests,
            bookings: [{
                ...hotel,
                type: 'hotel',
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                guests: searchData.guests
            }]
        };

        const newTrip = saveTrip(tripData);

        try {
            // Simulated email sending
            console.log("Sending booking confirmation to", guests[0].email);
                        await fetch("http://localhost:8080/api/hotels/confirm-booking", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: guests[0].name,
        email: guests[0].email,
        phone: guests[0].phone,
        hotelName: hotel.name,
        city: searchData.hotelCity,
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests,
        rooms: 1,
        price: String(5000 * searchData.guests)
    })
});
            alert(`Payment Successful! Hotel booking confirmed for ${guests.length} guest(s). Confirmation details have been sent to ${guests[0].email}.`);
            navigate(`/booking-confirmation/${newTrip.id}`);
        } catch (error) {
            alert(`Payment Successful! Booking confirmed, but we couldn't send the confirmation email.`);
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
                            {guests.map((guest, index) => (
                                <Card key={index} className="glass-panel border-0 p-4 mb-4">
                                    <h3 className="fw-bold mb-4 text-white">
                                        Guest {index + 1} Details
                                    </h3>
                                    <Row className="g-3">
                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="text-muted small fw-bold">FULL NAME</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter guest name"
                                                    required
                                                    value={guest.name}
                                                    onChange={(e) => handleGuestChange(index, e)}
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
                                                    placeholder="guest@example.com"
                                                    required
                                                    value={guest.email}
                                                    onChange={(e) => handleGuestChange(index, e)}
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
                                                    value={guest.phone}
                                                    onChange={(e) => handleGuestChange(index, e)}
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
                                >
                                    CONFIRM BOOKING
                                </Button>
                            </div>
                        </Form>
                    </Col>

                    <Col lg={4}>
                        <Card className="glass-panel border-0 p-4 sticky-top shadow-sm" style={{ top: '90px', zIndex: 10 }}>
                            <h4 className="fw-bold mb-4">Reservation Summary</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Estimated Price</span>
                                <span>₹5,000</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Guests</span>
                                <span>{searchData.guests}</span>
                            </div>
                            <hr className="border-secondary" />
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="fw-bold mb-0">Total Amount</h5>
                                <h5 className="fw-bold mb-0 text-primary">₹{5000 * searchData.guests}</h5>
                            </div>

                            <Card className="bg-dark border-secondary p-3 rounded-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary rounded-circle p-2">
                                        <FaHotel className="text-white" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{hotel.name}</h6>
                                        <div className="text-warning small">
                                            <FaStar className="me-1" /> {hotel.rating}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 small text-muted">
                                    <div>Check-in: {searchData.checkIn}</div>
                                    <div>Check-out: {searchData.checkOut}</div>
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
                            <div className="h4 mb-0 fw-bold">₹{5000 * searchData.guests}</div>
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
                                        PAY ₹{5000 * searchData.guests}
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
                                <p style={{ color: '#666666', fontSize: '12px' }}>Your reservation is being generated...</p>
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

export default HotelBooking;