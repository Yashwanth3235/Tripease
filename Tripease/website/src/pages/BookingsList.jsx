import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlane, FaHotel, FaTrain, FaBus, FaTicketAlt, FaEye, FaMapMarkerAlt } from 'react-icons/fa';
import { getTrips } from '../services/storage';

const BookingsList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const allTrips = getTrips();
        // Filter for all confirmed booking categories
        const confirmedBookings = allTrips.filter(trip =>
            trip.category === 'booking' ||
            trip.category === 'hotel' ||
            trip.category === 'train' ||
            trip.category === 'bus'
        );
        setBookings(confirmedBookings);
    }, []);

    const getIcon = (category) => {
        switch (category) {
            case 'hotel': return <FaHotel className="text-warning" />;
            case 'train': return <FaTrain className="text-info" />;
            case 'bus': return <FaBus className="text-success" />;
            default: return <FaPlane className="text-primary" />;
        }
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1 className="fw-bold mb-0">My Bookings</h1>
                </div>

                {bookings.length === 0 ? (
                    <Card className="glass-panel border-0 p-5 text-center text-muted">
                        <FaTicketAlt size={50} className="mb-3 opacity-25" />
                        <h3>No bookings found.</h3>
                        <p>Your tickets and reservations will appear here once you book them.</p>
                        <Link to="/">
                            <Button variant="primary" className="rounded-pill mt-3 px-4">Search & Book</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="glass-panel rounded-4 overflow-hidden border-0">
                        <Table hover variant="dark" responsive className="mb-0 mmt-table">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="ps-4 py-3">Booked For</th>
                                    <th className="py-3">Service / Trip</th>
                                    <th className="py-3">Destination</th>
                                    <th className="py-3">Dates</th>
                                    <th className="py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, idx) => {
                                    const service = booking.bookings[0];
                                    const passengers = booking.passengers || booking.guests || [booking.passenger || booking.guest];
                                    const primaryPassenger = passengers[0];
                                    return (
                                        <tr key={booking.id} className="align-middle">
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold">
                                                    {primaryPassenger?.name}
                                                    {passengers.length > 1 && (
                                                        <Badge bg="info" className="ms-2" style={{ fontSize: '10px' }}>
                                                            +{passengers.length - 1} more
                                                        </Badge>
                                                    )}
                                                </div>
                                                <small className="text-muted">{primaryPassenger?.email}</small>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    {getIcon(booking.category)}
                                                    <span>{booking.category === 'hotel' ? service.name : (service.airline || service.train_name || service.operator)}</span>
                                                </div>
                                                <small className="text-muted d-block">
                                                    {booking.category === 'flight' ? service.flightNum :
                                                        booking.category === 'train' ? `Train #${service.train_no}` :
                                                            booking.category === 'bus' ? `Bus ${service.bus_id}` : null}
                                                </small>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="dark" className="border border-secondary">
                                                    <FaMapMarkerAlt size={10} className="me-1" />
                                                    {booking.destination}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div>{booking.startDate}</div>
                                                {booking.endDate !== booking.startDate && (
                                                    <small className="text-muted">to {booking.endDate}</small>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <Link to={`/booking-confirmation/${booking.id}`}>
                                                    <Button variant="outline-primary" size="sm" className="rounded-pill">
                                                        <FaEye className="me-1" /> View Voucher
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </motion.div>
        </Container>
    );
};

export default BookingsList;