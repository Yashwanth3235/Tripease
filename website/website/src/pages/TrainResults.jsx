import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrain, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const TrainResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { searchData, trains } = location.state || {};

    const [trainList, setTrainList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('departure');

    useEffect(() => {
        if (trains && Array.isArray(trains)) {
            setTrainList(trains);
        } else {
            setTrainList([]);
        }
        setLoading(false);
    }, [trains]);

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

    const sortedTrains = [...trainList].sort((a, b) => {
        if (sortBy === 'departure') {
            return (a.from_station?.departure_time || '').localeCompare(
                b.from_station?.departure_time || ''
            );
        }
        if (sortBy === 'arrival') {
            return (a.to_station?.arrival_time || '').localeCompare(
                b.to_station?.arrival_time || ''
            );
        }
        return 0;
    });

    return (
        <Container className="py-5">
            <h2 className="mb-4">Train Results</h2>

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
            {!loading && trainList.length > 0 && (
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
                    <p className="mt-3">Searching for trains...</p>
                </div>
            ) : (
                <Row className="g-4">
                    {sortedTrains.length > 0 ? (
                        sortedTrains.map((train, index) => (
                            <Col xs={12} key={index}>
                                <Card className="glass-panel border-0 hover-scale">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-1">
                                                    <FaTrain className="me-2 text-primary" />
                                                    {train.train_name} ({train.train_no})
                                                </h5>
                                                <small className="text-muted">
                                                    {train.from_station?.display_name_en} →
                                                    {train.to_station?.display_name_en}
                                                </small>
                                            </Col>

                                            <Col md={3} className="text-center">
                                                <Badge bg="info" pill>
                                                    <FaClock className="me-1" />
                                                    {train.from_station?.departure_time}
                                                </Badge>
                                            </Col>

                                            <Col md={3} className="text-end">
                                                <Button
                                                    variant="warning"
                                                    size="lg"
                                                    className="w-100 rounded-pill fw-bold"
                                                    onClick={() =>
                                                        navigate('/train-booking', {
                                                            state: { searchData, train }
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
                            <h4>No trains found.</h4>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default TrainResults;
