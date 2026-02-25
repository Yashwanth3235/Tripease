import React, { useState } from 'react';
import { Container, Tabs, Tab, Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlane, FaTrain, FaBus, FaHotel, FaSearch, FaArrowRight } from 'react-icons/fa';
import { getTripById, updateTrip } from '../services/storage';

const mockFlights = [
    { id: 'f1', airline: 'SkyHigh Air', number: 'SH101', dept: '08:00', arr: '11:30', price: 450, from: 'NYC', to: 'LHR' },
    { id: 'f2', airline: 'Oceanic', number: 'OC815', dept: '14:00', arr: '17:30', price: 520, from: 'NYC', to: 'LHR' },
];

const mockHotels = [
    { id: 'h1', name: 'Grand Plaza', rating: 4.5, price: 200, location: 'City Center' },
    { id: 'h2', name: 'Cozy Inn', rating: 3.8, price: 120, location: 'Suburbs' },
];

const mockTrains = [
    { id: 't1', operator: 'RailExpress', number: 'RE400', dept: '09:00', arr: '13:00', price: 80 },
    { id: 't2', operator: 'CityConnector', number: 'CC22', dept: '15:00', arr: '19:00', price: 95 },
];

const mockBuses = [
    { id: 'b1', operator: 'MegaBus', dept: '10:00', arr: '16:00', price: 45 },
    { id: 'b2', operator: 'CityLink', dept: '12:00', arr: '18:00', price: 55 },
];

const BookServices = () => {
    const { id } = useParams(); // Trip ID
    const navigate = useNavigate();
    const trip = getTripById(id);

    const [activeTab, setActiveTab] = useState('flight');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        // Simulate API call
        setTimeout(() => {
            if (activeTab === 'flight') setResults(mockFlights);
            if (activeTab === 'hotel') setResults(mockHotels);
            if (activeTab === 'train') setResults(mockTrains);
            if (activeTab === 'bus') setResults(mockBuses);
            setLoading(false);
        }, 1000);
    };

    const handleBook = (item) => {
        if (!trip) return;

        const booking = {
            ...item,
            id: Date.now(), // New ID for the booking instance
            type: activeTab, // flight, hotel, train, bus
            bookingDate: new Date().toISOString()
        };

        const updatedTrip = { ...trip };

        // Add to expenses automatically for convenience
        const expense = {
            id: Date.now() + 1,
            name: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Booking: ${item.name || item.airline || item.operator || 'Service'}`,
            cost: item.price,
            date: new Date().toISOString().split('T')[0],
            type: activeTab === 'hotel' ? 'Accommodation' : 'Transport'
        };

        updatedTrip.bookings = [...(updatedTrip.bookings || []), booking];
        updatedTrip.expenses = [...(updatedTrip.expenses || []), expense];
        updatedTrip.spent = (updatedTrip.spent || 0) + item.price;

        updateTrip(updatedTrip);
        navigate(`/trip/${id}`);
    };

    if (!trip) return <Container className="py-5">Loading...</Container>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">Book Services for <span className="text-primary">{trip.destination}</span></h2>

            <Card className="glass-panel border-0 p-4 mb-4">
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => { setActiveTab(k); setResults([]); setSearched(false); }}
                    className="mb-4 custom-tabs"
                    variant="pills"
                >
                    <Tab eventKey="flight" title={<><FaPlane className="me-2" />Flight</>} />
                    <Tab eventKey="hotel" title={<><FaHotel className="me-2" />Hotel</>} />
                    <Tab eventKey="train" title={<><FaTrain className="me-2" />Train</>} />
                    <Tab eventKey="bus" title={<><FaBus className="me-2" />Bus</>} />
                </Tabs>

                <Form onSubmit={handleSearch}>
                    <Row className="g-3">
                        <Col md={activeTab === 'hotel' ? 12 : 4}>
                            <Form.Control type="text" placeholder={activeTab === 'hotel' ? "City or Hotel Name" : "From City"} defaultValue={activeTab !== 'hotel' ? "New York" : trip.destination} />
                        </Col>
                        {activeTab !== 'hotel' && (
                            <Col md={4}>
                                <Form.Control type="text" placeholder="To City" defaultValue={trip.destination} />
                            </Col>
                        )}
                        <Col md={activeTab === 'hotel' ? 6 : 4}>
                            <Form.Control type="date" />
                        </Col>
                    </Row>
                    <div className="mt-4 text-end">
                        <Button type="submit" size="lg" disabled={loading}>
                            {loading ? 'Searching...' : <><FaSearch className="me-2" /> Search</>}
                        </Button>
                    </div>
                </Form>
            </Card>

            {searched && !loading && (
                <div className="results-container">
                    <h4 className="mb-3">Results</h4>
                    {results.map((item) => (
                        <Card key={item.id} className="glass-panel border-0 mb-3 hover-scale">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={2} className="text-center">
                                        <div className="display-6 text-secondary">
                                            {activeTab === 'flight' && <FaPlane />}
                                            {activeTab === 'hotel' && <FaHotel />}
                                            {activeTab === 'train' && <FaTrain />}
                                            {activeTab === 'bus' && <FaBus />}
                                        </div>
                                    </Col>
                                    <Col md={7}>
                                        {activeTab === 'hotel' ? (
                                            <>
                                                <h5 className="mb-1 fw-bold">{item.name}</h5>
                                                <p className="mb-0 text-muted">{item.location} • {item.rating} Stars</p>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="mb-1 fw-bold">{item.airline || item.operator} <Badge bg="dark">{item.number}</Badge></h5>
                                                <div className="d-flex align-items-center text-muted">
                                                    <span>{item.dept}</span>
                                                    <FaArrowRight className="mx-2 small" />
                                                    <span>{item.arr}</span>
                                                </div>
                                            </>
                                        )}
                                    </Col>
                                    <Col md={3} className="text-end">
                                        <h3 className="text-primary mb-2">${item.price}</h3>
                                        <Button variant="success" onClick={() => handleBook(item)}>Book Now</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    {results.length === 0 && <p className="text-center text-muted">No results found.</p>}
                </div>
            )}
        </Container>
    );
};

export default BookServices;
