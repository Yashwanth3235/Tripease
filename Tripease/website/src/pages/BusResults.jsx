import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBus, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const BusResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { searchData, buses } = location.state || {};

    const [busList, setBusList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('departure');

    useEffect(() => {
        if (buses && Array.isArray(buses)) {
            setBusList(buses);
        } else {
            setBusList([]);
        }
        setLoading(false);
    }, [buses]);

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

    const sortedBuses = [...busList].sort((a, b) => {
        if (sortBy === 'departure') {
            return (a.departure_time || '').localeCompare(b.departure_time || '');
        }
        if (sortBy === 'arrival') {
            return (a.arrival_time || '').localeCompare(b.arrival_time || '');
        }
        return 0;
    });

    return (
        <Container className="py-5">
            <h2 className="mb-4">Bus Results</h2>

            {/* Search Summary Card */}
            <Card className="glass-panel border-0 p-3 mb-4">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h5 className="mb-0 text-white">
                            <FaMapMarkerAlt className="me-2" />
                            {searchData.from} → {searchData.to}
                        </h5>
                        <p className="text-muted mb-0 small">
                            {searchData.date}
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
            {!loading && busList.length > 0 && (
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
                                <option value="departure" className="bg-dark text-white">
                                    Departure Time
                                </option>
                                <option value="arrival" className="bg-dark text-white">
                                    Arrival Time
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
                    <p className="mt-3">Searching for buses...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {sortedBuses.length > 0 ? (
                        sortedBuses.map((bus, index) => (
                            <Col xs={12} key={index}>
                                <Card className="glass-panel border-0 hover-scale">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-1">
                                                    <FaBus className="me-2 text-primary" />
                                                    {bus.operator} ({bus.bus_id})
                                                </h5>
                                                <small className="text-muted">
                                                    {bus.from} → {bus.to}
                                                </small>
                                            </Col>

                                            <Col md={3} className="text-center">
                                                <Badge bg="info" pill>
                                                    <FaClock className="me-1" />
                                                    {bus.departure_time || 'N/A'}
                                                </Badge>
                                            </Col>

                                            <Col md={3} className="text-end">
                                                <Button
                                                    variant="warning"
                                                    size="lg"
                                                    className="w-100 rounded-pill fw-bold"
                                                    onClick={() =>
                                                        navigate('/bus-booking', {
                                                            state: { searchData, bus }
                                                        })
                                                    }
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
                            <h4>No buses found.</h4>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default BusResults;
