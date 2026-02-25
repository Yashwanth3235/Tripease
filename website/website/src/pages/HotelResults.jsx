import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHotel, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const HotelResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { searchData, hotels } = location.state || {};

    const [hotelList, setHotelList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {

        if (hotels && hotels.data && Array.isArray(hotels.data)) {
            setHotelList(hotels.data);
        } else {
            setHotelList([]);
        }

        setLoading(false);

    }, [hotels]);


    if (!searchData) {
        return (
            <Container className="py-5 text-center">
                <h2>No search parameters found.</h2>
                <Button onClick={() => navigate('/')} variant="primary" className="mt-3">
                    Back to Search
                </Button>
            </Container>
        );
    }

    const sortedHotels = [...hotelList].sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    return (
        <Container className="py-5">
            <h2 className="mb-4">Hotel Results</h2>

            {/* Search Summary Card */}
            <Card className="glass-panel border-0 p-3 mb-4">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h5 className="mb-0 text-white">
                            <FaMapMarkerAlt className="me-2" />
                            {searchData.hotelCity}
                        </h5>
                        <p className="text-muted mb-0 small">
                            {searchData.checkIn} → {searchData.checkOut} • {searchData.guests} Guest(s)
                        </p>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button variant="outline-light" size="sm" onClick={() => navigate('/')}>
                            Modify Search
                        </Button>
                    </Col>
                </Row>
            </Card>
            {/* Sort Bar */}
            {!loading && hotelList.length > 0 && (
                <Card className="glass-panel border-0 p-3 mb-4 shadow-sm">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <span className="text-muted small fw-bold">SORT BY:</span>
                        </Col>
                        <Col md={6} className="text-md-end mt-3 mt-md-0">
                            <select
                                className="bg-transparent text-white border-secondary rounded-pill px-3 py-1 small"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="name" className="bg-dark text-white">
                                    Name (A-Z)
                                </option>
                                <option value="rating" className="bg-dark text-white">
                                    Rating (High to Low)
                                </option>
                            </select>
                        </Col>
                    </Row>
                </Card>
            )}

            {error && (
                <Alert variant="info" className="mb-4 glass-panel border-0 text-white">
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Searching for hotels...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {sortedHotels.length > 0 ? (
                        sortedHotels.map((hotel, index) => (
                            <Col xs={12} key={index}>
                                <Card className="glass-panel border-0 hover-scale">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-1">
                                                    <FaHotel className="me-2 text-primary" />
                                                    {hotel.name || "Hotel Name"}
                                                </h5>
                                                <small className="text-muted">
                                                    {hotel.address?.cityName || hotel.cityCode}
                                                </small>
                                            </Col>

                                            <Col md={3} className="text-center">
                                                <Badge bg="success" pill>
                                                    <FaStar className="me-1" />
                                                    {hotel.rating || "N/A"}
                                                </Badge>
                                            </Col>

                                            <Col md={3} className="text-end">
                                                <Button
                                                    variant="warning"
                                                    size="lg"
                                                    className="w-100 rounded-pill fw-bold"
                                                    onClick={() => navigate('/hotel-booking', { state: { searchData, hotel } })}
                                                >
                                                    Select
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <h4>No hotels found.</h4>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default HotelResults;
