import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlane, FaHotel, FaTrain, FaBus, FaCalendarAlt, FaUser, FaClock, FaPrint, FaArrowLeft, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { getTripById } from '../services/storage';

const BookingConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const data = getTripById(id);
        if (data) {
            setTrip(data);
        }
    }, [id]);

    if (!trip) {
        return (
            <Container className="py-5 text-center text-white">
                <h2>Booking not found.</h2>
                <Button as={Link} to="/" variant="primary" className="mt-3">Back to Home</Button>
            </Container>
        );
    }

    const booking = trip.bookings?.[0]; // Assuming one booking per confirmation view
    const passengersList = trip.passengers || trip.guests || [trip.passenger || trip.guest];
    const category = trip.category || 'flight';

    const getIcon = () => {
        switch (category) {
            case 'hotel': return <FaHotel size={30} />;
            case 'train': return <FaTrain size={30} />;
            case 'bus': return <FaBus size={30} />;
            default: return <FaPlane size={30} />;
        }
    };

    const getTitle = () => {
        switch (category) {
            case 'hotel': return "Hotel Voucher";
            case 'train': return "E-Ticket (Train)";
            case 'bus': return "E-Ticket (Bus)";
            default: return "Boarding Pass";
        }
    };

    const getSubtext = () => {
        if (category === 'hotel') return booking?.name;
        if (category === 'train') return `Train ${booking?.train_no}`;
        if (category === 'bus') return `Bus ${booking?.bus_id}`;
        return `Flight ${booking?.flightNum}`;
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-5">
                    <FaCheckCircle className="text-success mb-3" size={60} />
                    <h1 className="display-4 fw-bold text-white">Booking Confirmed!</h1>
                    <p className="lead text-muted">Your {category} confirmation has been sent to {passengersList[0]?.email}</p>
                </div>

                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Ticket Style Card */}
                        <div className="ticket-container position-relative mb-4">
                            <Card className="glass-panel border-0 overflow-hidden shadow-lg" style={{ borderRadius: '20px' }}>
                                <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        {getIcon()}
                                        <div>
                                            <h4 className="mb-0 fw-bold">{getTitle()}</h4>
                                            <small className="opacity-75">{getSubtext()}</small>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <h4 className="mb-0 fw-bold">Tripease</h4>
                                        <small className="opacity-75">Confirmation: #{trip.id.slice(-6).toUpperCase()}</small>
                                    </div>
                                </div>

                                <Card.Body className="p-5 text-white">
                                    <Row className="mb-5">
                                        <Col md={6}>
                                            <small className="text-muted d-block text-uppercase fw-bold mb-2">
                                                {category === 'hotel' ? 'Guest(s)' : 'Passenger(s)'}
                                            </small>
                                            {passengersList.map((p, idx) => (
                                                <h4 key={idx} className="fw-bold mb-1">{p?.name}</h4>
                                            ))}
                                        </Col>
                                        <Col md={6} className="text-md-end">
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1">Status</small>
                                            <Badge bg="success" className="px-3 py-2 fs-6">CONFIRMED</Badge>
                                        </Col>
                                    </Row>

                                    {category === 'hotel' ? (
                                        <Row className="align-items-center mb-5">
                                            <Col md={12}>
                                                <h3 className="fw-bold mb-2">{booking?.name}</h3>
                                                <div className="d-flex align-items-center gap-3 text-muted">
                                                    <span><FaMapMarkerAlt className="text-primary me-1" /> {booking?.address?.cityName || trip.destination}</span>
                                                    <span><FaStar className="text-warning me-1" /> {booking?.rating} Stars</span>
                                                </div>
                                                <div className="mt-4 p-3 rounded-3 bg-dark border border-secondary d-flex justify-content-between">
                                                    <div>
                                                        <small className="text-muted d-block text-uppercase fw-bold mb-1">Check-in</small>
                                                        <span className="fw-bold fs-5">{trip.startDate}</span>
                                                    </div>
                                                    <div className="border-end border-secondary mx-3"></div>
                                                    <div>
                                                        <small className="text-muted d-block text-uppercase fw-bold mb-1">Check-out</small>
                                                        <span className="fw-bold fs-5">{trip.endDate}</span>
                                                    </div>
                                                    <div className="border-end border-secondary mx-3"></div>
                                                    <div className="text-end">
                                                        <small className="text-muted d-block text-uppercase fw-bold mb-1">Guests</small>
                                                        <span className="fw-bold fs-5">{booking?.guests} Person(s)</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Row className="align-items-center mb-5">
                                            <Col xs={5}>
                                                <h2 className="display-6 fw-bold mb-0">{booking?.from}</h2>
                                                <p className="text-muted mb-0">{trip.startDate}</p>
                                            </Col>
                                            <Col xs={2} className="text-center">
                                                {getIcon()}
                                                <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '5px' }}></div>
                                            </Col>
                                            <Col xs={5} className="text-end">
                                                <h2 className="display-6 fw-bold mb-0">{booking?.to}</h2>
                                                <p className="text-muted mb-0">{trip.endDate}</p>
                                            </Col>
                                        </Row>
                                    )}

                                    <Row className="g-4 border-top border-secondary pt-4">
                                        {category !== 'hotel' && (
                                            <>
                                                <Col xs={6} md={3}>
                                                    <small className="text-muted d-block text-uppercase fw-bold mb-1">Departure</small>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FaClock className="text-primary" />
                                                        <span className="fw-bold">{booking?.dep || booking?.from_station?.departure_time || booking?.departure_time}</span>
                                                    </div>
                                                </Col>
                                                <Col xs={6} md={3}>
                                                    <small className="text-muted d-block text-uppercase fw-bold mb-1">Arrival</small>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FaClock className="text-primary" />
                                                        <span className="fw-bold">{booking?.arr || booking?.to_station?.arrival_time || booking?.arrival_time}</span>
                                                    </div>
                                                </Col>
                                            </>
                                        )}
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1">Booking Type</small>
                                            <span className="fw-bold text-capitalize">{category}</span>
                                        </Col>
                                        <Col xs={6} md={category === 'hotel' ? 6 : 3} className={category === 'hotel' ? 'text-md-end' : ''}>
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1">Price Paid</small>
                                            <span className="fw-bold text-success fs-5">₹{trip.budget}</span>
                                        </Col>
                                    </Row>
                                </Card.Body>

                                <div className="bg-dark p-3 text-center border-top border-secondary border-dashed">
                                    <small className="text-muted">
                                        {category === 'hotel'
                                            ? 'Please present this voucher and a valid ID at the hotel front desk upon arrival.'
                                            : `Please present this E-ticket at the ${category} terminal/station counter.`}
                                    </small>
                                </div>
                            </Card>

                            <div className="position-absolute" style={{ width: '40px', height: '40px', background: '#0f172a', borderRadius: '50%', left: '-20px', top: '50%', marginTop: '-20px', zIndex: 2 }}></div>
                            <div className="position-absolute" style={{ width: '40px', height: '40px', background: '#0f172a', borderRadius: '50%', right: '-20px', top: '50%', marginTop: '-20px', zIndex: 2 }}></div>
                        </div>

                        <div className="d-flex gap-3 justify-content-center mt-4">
                            <Button variant="outline-light" className="rounded-pill px-4" onClick={() => window.print()}>
                                <FaPrint className="me-2" /> Print Confirmation
                            </Button>
                            <Button as={Link} to="/bookings" variant="primary" className="rounded-pill px-4">
                                View My Bookings
                            </Button>
                        </div>
                    </Col>
                </Row>
            </motion.div>
        </Container>
    );
};

export default BookingConfirmation;