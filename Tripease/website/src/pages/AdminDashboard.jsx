import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Container, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import { FaBus, FaCommentAlt, FaEnvelope, FaHeadset, FaHotel, FaPhone, FaPlane, FaSignOutAlt, FaTrain, FaUserCircle, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [trainBookings, setTrainBookings] = useState([]);
    const [busBookings, setBusBookings] = useState([]);
    const [tripBookings, setTripBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Users - using mock data for now as API might not be ready
                try {
                    const userRes = await axios.get('http://localhost:8080/admin/users');
                    setUsers(userRes.data);
                } catch (e) {
                    console.log("Using mock users data");
                    setUsers([
                        { name: 'John Doe', mail: 'john@example.com', phone: '9876543210' },
                        { name: 'Jane Smith', mail: 'jane@smith.com', phone: '8765432109' }
                    ]);
                }

                // Fetch Contacts - using mock data for now
                try {
                    const contactRes = await axios.get('http://localhost:8080/admin/contactmessages');
                    setContacts(contactRes.data);
                } catch (e) {
                    console.log("Using mock contacts data");
                }

                // Fetch Flight Bookings
               try {
    const bookingRes = await axios.get(
        'http://localhost:8080/admin/flightbooking'
    );

    setFlightBookings(bookingRes.data);

} catch (error) {
    console.error("Error fetching flight bookings:", error);
    setFlightBookings([]); // optional fallback
}

                // Fetch Hotel Bookings
               try {
    const bookingRes = await axios.get(
        'http://localhost:8080/admin/hotelbooking'
    );

    setHotelBookings(bookingRes.data);

} catch (error) {
    console.error("Error fetching hotel bookings:", error);
    setHotelBookings([]); // optional fallback
}
                // Fetch Train Bookings
                try {
    const bookingRes = await axios.get(
        'http://localhost:8080/admin/trainbooking'
    );

    setTrainBookings(bookingRes.data);

} catch (error) {
    console.error("Error fetching train bookings:", error);
    setTrainBookings([]); // optional fallback
}

                // Fetch Bus Bookings
               try {
    const bookingRes = await axios.get(
        'http://localhost:8080/admin/busbooking'
    );

    setBusBookings(bookingRes.data);

} catch (error) {
    console.error("Error fetching bus bookings:", error);
    setBusBookings([]); // optional fallback
}
// Fetch Trips
try {
    const tripRes = await axios.get(
        'http://localhost:8080/admin/trips'
    );
    setTripBookings(tripRes.data);
} catch (error) {
    console.error("Error fetching trips:", error);
    setTripBookings([]);
}
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError('Failed to fetch data from the server.');
            } finally {
                setLoading(false);
            }
        };

        
        fetchData();
    }, []);
    

    return (
        <div style={{ minHeight: '100vh', background: '#0F172A', padding: '40px 0' }}>
            <Container>
                <div className="d-flex align-items-center mb-5">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-3 me-3">
                        <FaHeadset size={32} className="text-primary" />
                    </div>
                    <div className="flex-grow-1">
                        <h1 className="text-white fw-bold mb-0">Admin Management</h1>
                        <p className="text-muted mb-0">Monitor user registrations and contact inquiries</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                        style={{ borderWidth: '2px', fontWeight: '600' }}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

                {error && <Alert variant="danger" className="glass-panel border-danger text-danger mb-4">{error}</Alert>}

                <Row className="g-4 mb-5">
                    {[
                        { title: 'Total Users', count: users.length, icon: <FaUsers />, color: '#3B82F6' },
                        { title: 'Inquiries', count: contacts.length, icon: <FaCommentAlt />, color: '#10B981' },
                        { title: 'Flights', count: flightBookings.length, icon: <FaPlane />, color: '#6366F1' },
                        { title: 'Hotels', count: hotelBookings.length, icon: <FaHotel />, color: '#F59E0B' },
                        { title: 'Trains', count: trainBookings.length, icon: <FaTrain />, color: '#06B6D4' },
                        { title: 'Buses', count: busBookings.length, icon: <FaBus />, color: '#EC4899' },
                        { title: 'Trips', count: tripBookings.length, icon: <FaPlane />, color: '#22C55E' }
                    ].map((stat, i) => (
                        <Col key={i} xs={6} md={4} lg={2} style={{ flex: '0 0 auto', width: '16.66%' }} className="stat-col">
                            <Card className="glass-panel border-0 p-4 h-100 stats-card">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="p-2 rounded-3 me-3" style={{ background: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{stat.title}</span>
                                </div>
                                <h2 className="text-white fw-bold mb-0">{loading ? '...' : stat.count}</h2>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Tabs defaultActiveKey="users" className="mb-4 custom-admin-tabs">
                    <Tab
                        eventKey="users"
                        title={<div className="d-flex align-items-center gap-2"><FaUsers /> Registered Users</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-admin-table">
                                    <thead>
                                        <tr className="border-bottom border-secondary border-opacity-25">
                                            <th className="py-4 ps-4">User</th>
                                            <th className="py-4">Email</th>
                                            <th className="py-4 pe-4">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                </td>
                                            </tr>
                                        ) : users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={index} className="border-bottom border-secondary border-opacity-10">
                                                    <td className="py-4 ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-circle me-3 bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center fw-bold">
                                                                {user.name?.charAt(0).toUpperCase() || <FaUserCircle />}
                                                            </div>
                                                            <span className="text-white fw-semibold">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="d-flex align-items-center text-muted">
                                                            <FaEnvelope size={12} className="me-2" />
                                                            {user.mail}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pe-4">
                                                        <div className="d-flex align-items-center text-muted">
                                                            <FaPhone size={12} className="me-2" />
                                                            {user.phone || 'N/A'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-muted">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>

                    <Tab
                        eventKey="contacts"
                        title={<div className="d-flex align-items-center gap-2"><FaCommentAlt /> Contact Inquiries</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-admin-table">
                                   <thead>
    <tr className="border-bottom border-secondary border-opacity-25">
        <th className="py-4 ps-4">Sender</th>
        <th className="py-4 pe-4">Email</th>
        <th className="py-4 pe-4">Subject</th>
        <th className="py-4 pe-4">Message</th>
    </tr>
</thead>
<tbody>
    {loading ? (
        <tr>
            <td colSpan="4" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </td>
        </tr>
    ) : contacts.length > 0 ? (
        contacts.map((contact, index) => (
            <tr key={index} className="border-bottom border-secondary border-opacity-10">
                <td className="py-4 ps-4">
                    <div className="fw-semibold text-white">{contact.fullName}</div>
                </td>
                <td className="py-4 pe-4">
                    <div className="text-muted small">{contact.email}</div>
                </td>
                <td className="py-4 pe-4">
                    <div className="text-muted small">{contact.subject}</div>
                </td>
                <td className="py-4 pe-4" style={{ maxWidth: '500px' }}>
                    <div className="text-muted small text-truncate-2" title={contact.message}>
                        {contact.message}
                    </div>
                </td>
            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No contact inquiries found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>

                    <Tab
                        eventKey="bookings"
                        title={<div className="d-flex align-items-center gap-2"><FaPlane /> Flight Bookings</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-admin-table">
                                    <thead>
                                        <tr className="border-bottom border-secondary border-opacity-25">
                                            <th className="py-4 ps-4">Passenger</th>
                                            <th className="py-4">Route</th>
                                            {/* <th className="py-4">Flight Details</th> */}
                                            <th className="py-4 ps-4">travelDate</th>
                                            <th className="py-4 pe-4">Fare</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5">
                                                    <Spinner animation="border" variant="primary" />
                                                </td>
                                            </tr>
                                        ) : flightBookings.length > 0 ? (
                                            flightBookings.map((booking, index) => (
                                                <tr key={index} className="border-bottom border-secondary border-opacity-10">
                                                    <td className="py-4 ps-4">
                                                        <div className="fw-semibold text-white">{booking.name}</div>
                                                        <div className="small text-muted">
                                                            <FaEnvelope size={10} className="me-1" />
                                                            {booking.email}
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="d-flex align-items-center text-white small fw-bold">
                                                            {booking.from} <span className="mx-2 text-primary">→</span> {booking.to}
                                                        </div>
                                                    </td>
                                                        <td className="py-4 ps-4">
                                                         <div className="text-white small fw-bold">
                                                          {booking.travelDate || booking.date || 'N/A'}
                                                         </div>
                                                        </td>

                                                    <td className="py-4 pe-4">
                                                        <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary border-opacity-25">
                                                            {booking.price}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No flight bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>

                    <Tab
                        eventKey="hotels"
                        title={<div className="d-flex align-items-center gap-2"><FaHotel /> Hotel Bookings</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-admin-table">
                                   <thead>
    <tr className="border-bottom border-secondary border-opacity-25">
        <th className="py-4 ps-4">Guest</th>
        <th className="py-4">Hotel Details</th>
        <th className="py-4">Stay Dates</th>
        <th className="py-4 pe-4">Total</th>
    </tr>
</thead>
<tbody>
    {loading ? (
        <tr>
            <td colSpan="4" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </td>
        </tr>
    ) : hotelBookings.length > 0 ? (
        hotelBookings.map((booking, index) => (
            <tr key={index} className="border-bottom border-secondary border-opacity-10">
                {/* Guest */}
                <td className="py-4 ps-4">
                    <div className="fw-semibold text-white">{booking.name}</div>
                    <div className="small text-muted">{booking.email}</div>
                    <div className="small text-muted">{booking.phone}</div>
                </td>

                {/* Hotel Details */}
                <td className="py-4">
                    <div className="text-white small fw-bold">{booking.hotelName}</div>
                    <div className="text-muted small">{booking.city}</div>
                </td>

                {/* Stay Dates */}
                <td className="py-4">
                    <div className="text-white small fw-bold">{booking.checkIn}</div>
                    <div className="text-muted small">to {booking.checkOut}</div>
                </td>

                {/* Total Price */}
                <td className="py-4 pe-4">
                    <Badge
                        bg="warning"
                        className="bg-opacity-10 text-warning px-3 py-2 rounded-pill border border-warning border-opacity-25"
                    >
                        ₹{booking.price}
                    </Badge>
                </td>
            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No hotel bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>

                    <Tab
                        eventKey="trains"
                        title={<div className="d-flex align-items-center gap-2"><FaTrain /> Train Bookings</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                                <Table hover variant="dark" className="mb-0 custom-admin-table">
                                    <thead>
    <tr className="border-bottom border-secondary border-opacity-25">
      <th className="py-4 ps-4">Passenger</th>
      <th className="py-4">Train Details</th>
      <th className="py-4">Date & Route</th>
      <th className="py-4 pe-4">Fare</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="4" className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </td>
      </tr>
    ) : trainBookings.length > 0 ? (
      trainBookings.map((booking, index) => (
        <tr key={index} className="border-bottom border-secondary border-opacity-10">
          {/* Passenger */}
          <td className="py-4 ps-4">
            <div className="fw-semibold text-white">{booking.name}</div>
            <div className="small text-muted">{booking.email}</div>
          </td>

          {/* Train Details */}
          <td className="py-4">
            <div className="text-white small fw-bold">{booking.trainName || '-'}</div>
            <div className="text-muted small">#{booking.trainNo || '-'}</div>
          </td>

          {/* Date & Route */}
          <td className="py-4">
            <div className="text-white small fw-bold">{booking.travelDate}</div>
            <div className="text-muted small">
              {booking.fromLocation} → {booking.toLocation}
            </div>
          </td>

          {/* Fare */}
          <td className="py-4 pe-4">
            <Badge
              bg="info"
              className="bg-opacity-10 text-info px-3 py-2 rounded-pill border border-info border-opacity-25"
            >
              ₹{booking.fare}
            </Badge>
          </td>
        </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No train bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>

                    <Tab
                        eventKey="buses"
                        title={<div className="d-flex align-items-center gap-2"><FaBus /> Bus Bookings</div>}
                    >
                        <Card className="glass-panel border-0 overflow-hidden mt-3">
                            <div className="table-responsive">
                               <Table hover variant="dark" className="mb-0 custom-admin-table">
           <thead>
    <tr className="border-bottom border-secondary border-opacity-25">
        <th className="py-4 ps-4">Passenger</th>
        <th className="py-4">Bus Details</th>
        <th className="py-4">Date & Route</th>
        <th className="py-4 pe-4">Fare</th>
    </tr>
</thead>
<tbody>
    {loading ? (
        <tr>
            <td colSpan="4" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </td>
        </tr>
    ) : busBookings.length > 0 ? (
        busBookings.map((booking, index) => (
            <tr key={index} className="border-bottom border-secondary border-opacity-10">
                {/* Passenger */}
                <td className="py-4 ps-4">
                    <div className="fw-semibold text-white">{booking.name}</div>
                    <div className="small text-muted">{booking.email}</div>
                </td>

                {/* Bus Details */}
                <td className="py-4">
                    <div className="text-white small fw-bold">{booking.operator}</div>
                    <div className="text-muted small">ID: {booking.busId}</div>
                </td>

                {/* Date & Route */}
                <td className="py-4">
                    <div className="text-white small fw-bold">{booking.travelDate}</div>
                    <div className="text-muted small">
                        {booking.fromLocation} → {booking.toLocation}
                    </div>
                </td>

                {/* Fare */}
                <td className="py-4 pe-4">
                    <Badge
                        bg="danger"
                        className="bg-opacity-10 text-danger px-3 py-2 rounded-pill border border-danger border-opacity-25"
                    >
                        ₹{booking.fare}
                    </Badge>
                </td>
            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No bus bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Tab>
                    <Tab
    eventKey="trips"
    title={<div className="d-flex align-items-center gap-2"><FaPlane /> Trips</div>}
>
    <Card className="glass-panel border-0 overflow-hidden mt-3">
        <div className="table-responsive">
            <Table hover variant="dark" className="mb-0 custom-admin-table">
               <thead>
    <tr className="border-bottom border-secondary border-opacity-25">
        
        <th className="py-4">Destination</th>
        <th className="py-4">Travel Style</th>
        <th className="py-4">Members</th>
        <th className="py-4">Email</th>
        <th className="py-4">Phone</th>
        <th className="py-4 pe-4">Budget</th>
    </tr>
</thead>
               <tbody>
    {loading ? (
        <tr>
            <td colSpan="9" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </td>
        </tr>
    ) : tripBookings.length > 0 ? (
        tripBookings.map((trip) => (
            <tr key={trip.id} className="border-bottom border-secondary border-opacity-10">

               

                {/* Destination */}
                <td className="py-4">
                    <div className="fw-semibold text-white">
                        {trip.destination}
                    </div>
                </td>

               

                {/* Travel Style */}
                <td className="py-4 text-muted small">
                    {trip.travelStyle}
                </td>

                {/* Members */}
                <td className="py-4 text-muted small">
                    {trip.members}
                </td>

                {/* Email */}
                <td className="py-4 text-muted small">
                    {trip.mail}
                </td>

                {/* Phone */}
                <td className="py-4 text-muted small">
                    {trip.phone}
                </td>

                {/* Budget */}
                <td className="py-4 pe-4">
                    <Badge
                        bg="success"
                        className="bg-opacity-10 text-success px-3 py-2 rounded-pill border border-success border-opacity-25"
                    >
                        ₹{trip.budget}
                    </Badge>
                </td>

            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-5 text-muted">
                                No trips found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    </Card>
</Tab>
                </Tabs>
            </Container>

            <style>{`
                .custom-admin-tabs.nav-tabs {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .custom-admin-tabs .nav-link {
                    color: #94A3B8 !important;
                    border: none !important;
                    padding: 1rem 2rem;
                    font-weight: 600;
                    background: transparent !important;
                    transition: all 0.3s ease;
                }
                .custom-admin-tabs .nav-link.active {
                    color: #2563EB !important;
                    background: rgba(37, 99, 235, 0.05) !important;
                    border-bottom: 3px solid #2563EB !important;
                }
                .custom-admin-table {
                    background: transparent !important;
                }
                .custom-admin-table thead th {
                    background: rgba(255, 255, 255, 0.02) !important;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 1px;
                    color: #94A3B8;
                }
                .custom-admin-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.03) !important;
                }
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .text-truncate-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .stats-card {
                    transition: transform 0.3s ease, background 0.3s ease;
                }
                .stats-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05) !important;
                }
                @media (max-width: 991px) {
                    .stat-col {
                        width: 33.33% !important;
                    }
                }
                @media (max-width: 767px) {
                    .stat-col {
                        width: 50% !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;