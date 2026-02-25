import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaArrowRight, FaClock, FaSuitcase } from 'react-icons/fa';
import { saveTrip } from '../services/storage';

const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchData, apiUrl } = location.state || {}; // Get search params and API URL from Router state

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterNonStop, setFilterNonStop] = useState(false);
    const [sortBy, setSortBy] = useState('cheapest');

    useEffect(() => {
        if (apiUrl) {
            fetchFlights();
        } else {
            setLoading(false);
        }
    }, [apiUrl]);

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch flight data');
            }
            const data = await response.json();

            // Handle Amadeus API Structure
            if (data && data.data && Array.isArray(data.data)) {
                const carriers = data.dictionaries?.carriers || {};
                const mappedFlights = data.data.map(f => {
                    const itin = f.itineraries?.[0];
                    const segment = itin?.segments?.[0];
                    return {
                        id: f.id,
                        airline: carriers[segment?.carrierCode] || segment?.carrierCode || 'Unknown',
                        flightNum: segment?.number || 'N/A',
                        dep: segment?.departure?.at?.split('T')?.[1]?.substring(0, 5) || '00:00',
                        arr: segment?.arrival?.at?.split('T')?.[1]?.substring(0, 5) || '00:00',
                        duration: itin?.duration?.replace('PT', '')?.toLowerCase() || 'N/A',
                        price: parseFloat(f.price?.total),
                        stops: itin?.segments?.length > 1 ? `${itin.segments.length - 1} Stop(s)` : 'Non-stop'
                    };
                });
                setFlights(mappedFlights);
            } else {
                setFlights(Array.isArray(data) ? data : []);
            }
            setError(null);
        } catch (err) {
            setError('Unable to fetch flights. The service might be offline or no flights are available for this route.');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (flight) => {
        navigate('/booking', { state: { flight, searchData } });
    };

    if (!searchData) {
        return (
            <Container className="py-5 text-center">
                <h2>No search parameters found.</h2>
                <Button onClick={() => navigate('/')} variant="primary" className="mt-3">Back to Search</Button>
            </Container>
        );
    }

    const filteredFlights = flights
        .filter(f => !filterNonStop || f.stops === 'Non-stop')
        .sort((a, b) => {
            if (sortBy === 'cheapest') return a.price - b.price;
            if (sortBy === 'highest') return b.price - a.price;
            return 0;
        });

    return (
        <Container className="py-5">
            <h2 className="mb-4">Flight Results</h2>
            <Card className="glass-panel border-0 p-3 mb-4">
                <Row className="align-items-center">
                    <Col md={8}>
                        <h5 className="mb-0 text-white">
                            {searchData.from} ({searchData.fromCode}) <FaArrowRight className="mx-2 small" /> {searchData.to} ({searchData.toCode})
                        </h5>
                        <p className="text-muted mb-0 small">
                            {searchData.date} • {searchData.passengers} Passenger(s) • Economy
                        </p>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button variant="outline-light" size="sm" onClick={() => navigate('/')}>Modify Search</Button>
                    </Col>
                </Row>
            </Card>

            {/* Filters Bar */}
            {!loading && flights.length > 0 && (
                <Card className="glass-panel border-0 p-3 mb-4 shadow-sm">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="d-flex gap-3 align-items-center">
                                <span className="text-muted small fw-bold">FILTERS:</span>
                                <Button
                                    variant={filterNonStop ? "primary" : "outline-secondary"}
                                    size="sm"
                                    className="rounded-pill px-3"
                                    onClick={() => setFilterNonStop(!filterNonStop)}
                                >
                                    Non-stop Only
                                </Button>
                            </div>
                        </Col>
                        <Col md={6} className="text-md-end mt-3 mt-md-0">
                            <div className="d-flex gap-3 align-items-center justify-content-md-end">
                                <span className="text-muted small fw-bold">SORT BY:</span>
                                <select
                                    className="bg-transparent text-white border-secondary rounded-pill px-3 py-1 small"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="cheapest" className="bg-dark text-white">Price: Low to High</option>
                                    <option value="highest" className="bg-dark text-white">Price: High to Low</option>
                                </select>
                            </div>
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
                    <p className="mt-3">Searching for the best flights...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredFlights.length > 0 ? filteredFlights.map((flight) => (
                        <Col xs={12} key={flight.id || flight.flightNum}>
                            <Card className="glass-panel border-0 hover-scale">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col md={3}>
                                            <h5 className="fw-bold mb-1">{flight.airline || 'Airline'}</h5>
                                            <small className="text-muted">{flight.flightNum || flight.number}</small>
                                        </Col>
                                        <Col md={5}>
                                            <div className="d-flex align-items-center justify-content-between text-center">
                                                <div>
                                                    <h4 className="mb-0 fw-bold">{flight.dep || flight.departureTime}</h4>
                                                    <small className="text-muted">{searchData.fromCode}</small>
                                                </div>
                                                <div className="px-3 flex-grow-1">
                                                    <div className="border-bottom border-light mb-1 position-relative" style={{ height: '1px' }}>
                                                        <FaPlane className="position-absolute start-50 top-0 translate-middle" style={{ marginTop: '-10px', fontSize: '14px' }} />
                                                    </div>
                                                    <small className="text-muted d-block mt-2">{flight.duration || 'Variable'}</small>
                                                    <Badge bg={(flight.stops === 'Non-stop' || !flight.stops) ? 'success' : 'warning'} pill>
                                                        {flight.stops || 'Non-stop'}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <h4 className="mb-0 fw-bold">{flight.arr || flight.arrivalTime}</h4>
                                                    <small className="text-muted">{searchData.toCode}</small>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-center border-start border-secondary">
                                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                                <FaSuitcase className="text-primary mb-1" />
                                                <small className="text-muted">Included</small>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-end">
                                            <h3 className="fw-bold text-primary mb-2">₹{flight.price}</h3>
                                            <Button variant="warning" size="lg" className="w-100 rounded-pill fw-bold" onClick={() => handleBook(flight)}>
                                                Select
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : (
                        <Col className="text-center py-5">
                            <h4>No flights found.</h4>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default FlightResults;
