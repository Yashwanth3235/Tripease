import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tabs, Tab, Table, Form, Modal, ProgressBar } from 'react-bootstrap';
import { getTripById, updateTrip } from '../services/storage';
import { FaArrowLeft, FaPlus, FaTrash, FaHotel, FaPlane, FaTrain, FaBus, FaCalendarAlt, FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaPhone, FaEnvelope } from 'react-icons/fa';
import WeatherWidget from '../components/WeatherWidget';

const TripDetails = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [activeTab, setActiveTab] = useState('budget');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'activity' or 'expense'

    // Form States
    const [newItem, setNewItem] = useState({ name: '', cost: '', date: '', time: '', type: '' });

    useEffect(() => {
        const t = getTripById(id);
        if (t) {
            setTrip(t);
            setActiveTab('budget');
        }
    }, [id]);

    const handleSaveItem = () => {
        if (!trip) return;

        const updatedTrip = { ...trip };
        const cost = parseFloat(newItem.cost) || 0;
        const expense = { ...newItem, id: Date.now(), cost };
        updatedTrip.expenses = [...(updatedTrip.expenses || []), expense];
        updatedTrip.spent = (updatedTrip.spent || 0) + cost;

        updateTrip(updatedTrip);
        setTrip(updatedTrip);
        setShowModal(false);
        setNewItem({ name: '', cost: '', date: '', time: '', type: '' });
    };

    if (!trip) return <Container className="py-5 text-center">Loading...</Container>;

    const budgetProgress = (trip.spent / trip.budget) * 100;
    const variant = budgetProgress > 90 ? 'danger' : budgetProgress > 70 ? 'warning' : 'success';

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/my-trips" className="text-decoration-none text-light d-inline-block">
                    <FaArrowLeft className="me-2" /> Back to Trips
                </Link>
            </div>

            <div className="mb-5">
                <Row className="align-items-start">
                    <Col md={8}>
                        <h1 className="display-4 fw-bold text-white">{trip.title}</h1>
                        <div className="d-flex align-items-center gap-4">
                            <p className="lead text-muted mb-0"><FaCalendarAlt className="me-2" />{trip.startDate} to {trip.endDate}</p>
                            {trip.members && (
                                <p className="lead text-muted mb-0"><FaUsers className="me-2" />{trip.members} Members</p>
                            )}
                        </div>
                        <div className="d-flex align-items-center gap-4 mt-2">
                            {trip.mail && (
                                <p className="text-muted mb-0"><FaEnvelope className="me-2" />{trip.mail}</p>
                            )}
                            {trip.phone && (
                                <p className="text-muted mb-0"><FaPhone className="me-2" />{trip.phone}</p>
                            )}
                        </div>
                    </Col>
                    <Col md={4}>
                        <WeatherWidget city={trip.destination || trip.title.replace('Trip to ', '')} />
                    </Col>
                </Row>
                <Card className="glass-panel border-0 text-white p-3 mt-4">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h5 className="mb-1">Budget Overview</h5>
                            <ProgressBar now={budgetProgress} variant={variant} style={{ height: '10px' }} className="my-2 bg-dark" />
                            <div className="d-flex justify-content-between small">
                                <span>Spent: ₹{trip.spent}</span>
                                <span>Total: ₹{trip.budget}</span>
                            </div>
                        </Col>
                        <Col md={4} className="text-end">
                            <h3 className={`mb-0 text-${variant}`}>₹{trip.budget - trip.spent}</h3>
                            <small className="text-muted">Remaining</small>
                        </Col>
                    </Row>
                </Card>
            </div>

            <div className="mt-5 pt-4 border-top border-secondary">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-white mb-0">Trip Expenses</h2>
                    <Button onClick={() => { setModalType('expense'); setShowModal(true); }} variant="success" className="rounded-pill px-4">
                        Add Expense
                    </Button>
                </div>

                <div className="mt-3">
                    <Table hover variant="dark" responsive className="glass-panel border-0">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th className="text-end">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trip.expenses && trip.expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.name}</td>
                                    <td>{expense.type}</td>
                                    <td>{expense.date}</td>
                                    <td className="text-end">₹{expense.cost}</td>
                                </tr>
                            ))}
                            {(!trip.expenses || trip.expenses.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-4">No expenses recorded for this trip.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-panel text-white">
                <Modal.Header closeButton closeVariant="white" className="border-bottom-0">
                    <Modal.Title>Add Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </Form.Group>
                        {modalType === 'expense' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Cost (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newItem.cost}
                                    onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newItem.date}
                                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category/Type</Form.Label>
                            <Form.Select
                                value={newItem.type}
                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                                style={{ backgroundColor: '#1E293B', color: 'white', borderColor: '#ffffff20' }}
                            >
                                <option value="">Select...</option>
                                <option value="Accommodation">Accommodation</option>
                                <option value="Flight">Flight</option>
                                <option value="Food">Food</option>
                                <option value="Activity">Activity</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveItem}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TripDetails;