import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaTrash, FaSuitcase, FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';
import { getTrips, deleteTrip } from '../services/storage';

const Dashboard = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const allTrips = getTrips();
        const plannedTrips = allTrips.filter(trip => trip.category === 'trip' || !trip.category);
        setTrips(plannedTrips);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            deleteTrip(id);
            const allTrips = getTrips();
            const plannedTrips = allTrips.filter(trip => trip.category === 'trip' || !trip.category);

            if (plannedTrips.length === 0) {
                navigate('/my-trips');
            } else {
                setTrips(plannedTrips);
            }
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="mb-0 fw-bold"
                >
                    My Trips
                </motion.h1>
                <Link to="/plan">
                    <Button variant="primary" className="rounded-pill shadow-sm">
                        + New Trip
                    </Button>
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="text-center py-5 text-muted glass-panel rounded-4">
                    <FaSuitcase size={50} className="mb-3 opacity-25" />
                    <h3>No planned trips.</h3>
                    <p>Redirecting to trip planner...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {trips.map((trip, index) => (
                        <Col key={trip.id} md={6} lg={4}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-100 overflow-hidden border-0 shadow-sm glass-panel text-white">
                                    <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#333' }}>
                                        <img
                                            src={trip.image || 'https://via.placeholder.com/800x600?text=Trip'}
                                            alt={trip.title}
                                            className="w-100 h-100 object-fit-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Trip' }}
                                        />
                                    </div>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className="h5 fw-bold mb-0">{trip.title}</Card.Title>
                                            <Badge bg={trip.status === 'Completed' ? 'secondary' : 'success'}>
                                                {trip.status}
                                            </Badge>
                                        </div>
                                        <div className="d-flex align-items-center mb-1 text-secondary">
                                            <FaCalendarAlt className="me-2" />
                                            <small>{trip.startDate} - {trip.endDate}</small>
                                        </div>
                                        {trip.members && (
                                            <div className="d-flex align-items-center mb-1 text-secondary">
                                                <FaUsers className="me-2" />
                                                <small>{trip.members} Members</small>
                                            </div>
                                        )}
                                        {trip.mail && (
                                            <div className="d-flex align-items-center mb-1 text-secondary">
                                                <FaEnvelope className="me-2" size={12} />
                                                <small className="text-truncate">{trip.mail}</small>
                                            </div>
                                        )}
                                        {trip.phone && (
                                            <div className="d-flex align-items-center mb-3 text-secondary">
                                                <FaPhone className="me-2" size={12} />
                                                <small>{trip.phone}</small>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between mt-4">
                                            <div>
                                                <small className="d-block text-secondary">Budget</small>
                                                <span className="fw-bold">₹{trip.budget}</span>
                                            </div>
                                            <div className="text-end">
                                                <small className="d-block text-secondary">Spent</small>
                                                <span className="fw-bold text-success">₹{trip.spent}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="bg-transparent border-top border-secondary d-flex gap-2">
                                        <Link to={`/trip/${trip.id}`} className="flex-grow-1">
                                            <Button variant="outline-light" size="sm" className="w-100">View Details</Button>
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(trip.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Dashboard;