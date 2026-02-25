import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { FaBus, FaHotel, FaMapMarkedAlt, FaPaperPlane, FaPlane, FaTrain, FaUsers, FaWallet } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { airports } from '../data/airports';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('flight');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const [formData, setFormData] = useState({
        from: 'New York',
        fromCode: 'JFK',
        to: 'London',
        toCode: 'LHR',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Default to tomorrow to avoid 'date in past' errors
        passengers: 1,
        hotelCity: '',
        checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        guests: 2
    });

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [hotelSuggestions, setHotelSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState({ from: false, to: false, hotel: false });
    const typingTimeoutRef = useRef(null);
    // The 'searching' state is no longer needed as results are displayed on a new page.
    // const [searching, setSearching] = useState(false); 
    const [contactStatus, setContactStatus] = useState('');
    const [contactFormData, setContactFormData] = useState({
        fullName: '',
        email: '',
        message: ''
    });

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const airlineCarriers = {
        'BA': 'British Airways',
        'AA': 'American Airlines',
        'LH': 'Lufthansa',
        'EK': 'Emirates',
        'AF': 'Air France',
        'UA': 'United Airlines',
        'DL': 'Delta',
        '6E': 'IndiGo',
        'AI': 'Air India',
        'UK': 'Vistara',
        'EY': 'Etihad Airways',
        'QR': 'Qatar Airways'
    };



    const handleContactSubmit = async (e) => {
        e.preventDefault();
        console.log('Contact form data submitted:', contactFormData);
        setContactStatus('sending');

        try {
            const response = await fetch('http://localhost:8080/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...contactFormData,
                    subject: 'General Inquiry (Home)'
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Saved message from Home:', data);

            setContactStatus('success');
            alert('Message sent successfully!');
            setContactFormData({
                fullName: '',
                email: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form from Home:', error);
            setContactStatus('error');
            alert('Failed to send message. Please try again.');
        } finally {
            setContactStatus('');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        // ================= HOTEL SEARCH =================
        if (activeTab === 'hotel') {

            if (!formData.hotelCity || !formData.checkIn || !formData.checkOut) {
                alert('Please fill in all hotel details.');
                return;
            }

            try {

                const cityCode = formData.hotelCity.substring(0, 3).toUpperCase();

                const response = await fetch(
                    `http://localhost:8080/api/hotels/by-city?cityCode=${cityCode}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch hotels");
                }
                const data = await response.json();

                navigate('/hotels', {
                    state: {
                        searchData: formData,
                        hotels: data
                    }
                });

            } catch (error) {
                console.error("Hotel Search Error:", error);
                alert("Unable to fetch hotels.");
            }

            return;
        }

        // ================= TRAIN =================
        if (activeTab === 'train') {

            if (!formData.from || !formData.to) {
                alert('Please enter From and To stations.');
                return;
            }

            try {

                // Convert input to uppercase station code (example: NDLS, BCT)
                const fromCode = formData.from.substring(0, 4).toUpperCase();
                const toCode = formData.to.substring(0, 4).toUpperCase();

                const response = await fetch(
                    `http://localhost:8080/api/trains/between?from=${fromCode}&to=${toCode}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch trains");
                }

                const data = await response.json();

                navigate('/trains', {
                    state: {
                        searchData: formData,
                        trains: data.data
                    }
                });

            } catch (error) {
                console.error("Train Search Error:", error);
                alert("Unable to fetch trains.");
            }

            return;
        }



        // ================= BUS =================
        if (activeTab === 'bus') {
            if (!formData.from || !formData.to || !formData.date) {
                alert('Please fill in all bus journey details.');
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/buses/between?from=${encodeURIComponent(formData.from)}&to=${encodeURIComponent(formData.to)}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch buses');
                }

                const data = await response.json();

                // Navigate to a BusResults page (like you do for trains/hotels)
                navigate('/buses', {
                    state: {
                        searchData: formData,
                        buses: data
                    }
                });
            } catch (error) {
                console.error('Bus Search Error:', error);
                alert('Unable to fetch buses.');
            }

            return;
        }


        // ================= FLIGHT (EXISTING LOGIC UNTOUCHED) =================
        if (activeTab !== 'flight') {
            navigate('/plan');
            return;
        }

        let fromCode = formData.fromCode;
        let toCode = formData.toCode;

        const resolveAirportCode = async (query) => {
            if (!query) return null;

            const localMatch = airports.find(a =>
                a.city.toLowerCase() === query.toLowerCase() ||
                a.code.toLowerCase() === query.toLowerCase()
            );
            if (localMatch) return localMatch.code;

            try {
                const response = await fetch(
                    `http://localhost:8080/api/flights/cities?keyword=${encodeURIComponent(query)}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.data && data.data.length > 0) {
                        return data.data[0].iataCode;
                    }
                }
            } catch (error) {
                console.error("Error resolving airport code:", error);
            }
            return null;
        };

        if (!fromCode && formData.from) {
            fromCode = await resolveAirportCode(formData.from);
            if (fromCode) setFormData(prev => ({ ...prev, fromCode }));
        }

        if (!toCode && formData.to) {
            toCode = await resolveAirportCode(formData.to);
            if (toCode) setFormData(prev => ({ ...prev, toCode }));
        }

        if (!fromCode || !toCode || !formData.date) {
            alert(`Unable to find airport code. Please select from suggestions.`);
            return;
        }

        const apiUrl =
            `http://localhost:8080/api/flights/search?from=${fromCode}&to=${toCode}&departDate=${formData.date}&passengers=${formData.passengers}`;

        navigate('/flights', {
            state: {
                searchData: { ...formData, fromCode, toCode },
                apiUrl
            }
        });
    };


    const fetchCitySuggestions = async (keyword, type) => {
        if (!keyword || keyword.length < 2) {
            if (type === 'from') setFromSuggestions([]);
            else if (type === 'to') setToSuggestions([]);
            else setHotelSuggestions([]);
            return;
        }

        try {
            setLoadingSuggestions(prev => ({ ...prev, [type]: true }));

            // Try to fetch from API first
            const response = await fetch(`http://localhost:8080/api/flights/cities?keyword=${keyword}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`API Results for "${keyword}":`, data);

                if (data && data.data && Array.isArray(data.data)) {
                    const formatted = data.data.map(loc => ({
                        code: loc.iataCode,
                        city: loc.address?.cityName || loc.name || 'Unknown',
                        name: loc.name || ''
                    }));

                    if (type === 'from') setFromSuggestions(formatted);
                    else if (type === 'to') setToSuggestions(formatted);
                    else setHotelSuggestions(formatted);
                    return;
                }
            }

            // Fallback to local data if API fails or returns no data
            const localMatches = airports.filter(a =>
                a.city.toLowerCase().includes(keyword.toLowerCase()) ||
                a.code.toLowerCase().includes(keyword.toLowerCase())
            );

            if (type === 'from') setFromSuggestions(localMatches);
            else if (type === 'to') setToSuggestions(localMatches);
            else setHotelSuggestions(localMatches);

        } catch (error) {
            console.error("Fetch Error, using fallback:", error);
            const localMatches = airports.filter(a =>
                a.city.toLowerCase().includes(keyword.toLowerCase()) ||
                a.code.toLowerCase().includes(keyword.toLowerCase())
            );
            if (type === 'from') setFromSuggestions(localMatches);
            else if (type === 'to') setToSuggestions(localMatches);
            else setHotelSuggestions(localMatches);
        } finally {
            setLoadingSuggestions(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleFromChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, from: val, fromCode: '' }));

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => fetchCitySuggestions(val, 'from'), 300);
    };

    const selectFrom = (airport) => {
        setFormData(prev => ({ ...prev, from: airport.city, fromCode: airport.code }));
        setFromSuggestions([]);
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, to: val, toCode: '' }));

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => fetchCitySuggestions(val, 'to'), 300);
    };

    const selectTo = (airport) => {
        setFormData(prev => ({ ...prev, to: airport.city, toCode: airport.code }));
        setToSuggestions([]);
    };

    const handleHotelChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, hotelCity: val }));

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => fetchCitySuggestions(val, 'hotel'), 300);
    };

    const selectHotel = (airport) => {
        setFormData(prev => ({ ...prev, hotelCity: airport.city }));
        setHotelSuggestions([]);
    };

    const tabs = [
        { id: 'flight', icon: <FaPlane size={24} />, label: 'Flights' },
        { id: 'hotel', icon: <FaHotel size={24} />, label: 'Hotels' },
        { id: 'train', icon: <FaTrain size={24} />, label: 'Trains' },
        { id: 'bus', icon: <FaBus size={24} />, label: 'Buses' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section position-relative py-5">
                <div className="blobs-container">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>

                <Container className="position-relative z-1 py-5">
                    {!user ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-center"
                        >
                            <Card className="border-0 glass-panel mx-auto py-5 px-4" style={{ maxWidth: '600px' }}>
                                <h2 className="fw-bold mb-4">Start Your Journey Today</h2>
                                <p className="mb-4 text-muted">Join Tripease to access our travel planner, book flights, and manage your custom itineraries.</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <Button as={Link} to="/login" variant="primary" size="lg" className="rounded-pill px-5">Sign In</Button>
                                    <Button as={Link} to="/signup" variant="outline-primary" size="lg" className="rounded-pill px-5">Sign Up</Button>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        /* MMT Style Booking Widget - Only for Logged In Users */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Card className="border-0 mmt-widget mx-auto" style={{ maxWidth: '1000px' }}>
                                <div className="d-flex justify-content-center border-bottom mb-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                    {tabs.map(tab => (
                                        <div
                                            key={tab.id}
                                            className={`mmt-tab ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.icon}
                                            <span>{tab.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <Card.Body className="p-4 pt-0 pb-5" style={{ paddingBottom: '150px' }}>
                                    <Form onSubmit={handleSearch}>
                                        <Row className="g-3">
                                            {activeTab === 'hotel' ? (
                                                <>
                                                    <Col lg={3}>
                                                        <div className="mmt-input-group h-100 position-relative">
                                                            <label className="mmt-label">CITY</label>
                                                            <input
                                                                type="text"
                                                                className="mmt-input"
                                                                value={formData.hotelCity}
                                                                onChange={handleHotelChange}
                                                                onFocus={() => fetchCitySuggestions(formData.hotelCity, 'hotel')}
                                                                placeholder="Enter City"
                                                                list="hotel-suggestions"
                                                            />

                                                            {/* Hotel Suggestions DataList */}
                                                            <datalist id="hotel-suggestions">
                                                                {hotelSuggestions.map((place) => (
                                                                    <option key={place.code + Math.random()} value={place.city}>
                                                                        {place.name}
                                                                    </option>
                                                                ))}
                                                            </datalist>
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="mmt-input-group h-100">
                                                            <label className="mmt-label">CHECK-IN</label>
                                                            <input
                                                                type="date"
                                                                className="mmt-input form-control-plaintext text-white p-0"
                                                                value={formData.checkIn}
                                                                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="mmt-input-group h-100">
                                                            <label className="mmt-label">CHECK-OUT</label>
                                                            <input
                                                                type="date"
                                                                className="mmt-input form-control-plaintext text-white p-0"
                                                                value={formData.checkOut}
                                                                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="mmt-input-group h-100">
                                                            <label className="mmt-label">MEMBERS</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                className="mmt-input"
                                                                value={formData.guests}
                                                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                                                            />
                                                        </div>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col lg={activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus' ? 3 : 5}>
                                                        <div className="mmt-input-group h-100 position-relative">
                                                            <label className="mmt-label">From</label>
                                                            <input
                                                                type="text"
                                                                className="mmt-input"
                                                                value={formData.from}
                                                                onChange={handleFromChange}
                                                                onFocus={() => fetchCitySuggestions(formData.from, 'from')}
                                                                placeholder={activeTab === 'train' ? "City or Station" : (activeTab === 'bus' ? "City or Terminal" : "City or Airport")}
                                                                list="from-suggestions"
                                                            />

                                                            {/* From Suggestions DataList */}
                                                            <datalist id="from-suggestions">
                                                                {fromSuggestions.map((airport) => (
                                                                    <option key={airport.code + Math.random()} value={airport.city}>
                                                                        {airport.name} ({airport.code})
                                                                    </option>
                                                                ))}
                                                            </datalist>
                                                        </div>
                                                    </Col>
                                                    {(activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus') && (
                                                        <Col lg={3}>
                                                            <div className="mmt-input-group h-100 position-relative">
                                                                <label className="mmt-label">To</label>
                                                                <input
                                                                    type="text"
                                                                    className="mmt-input"
                                                                    value={formData.to}
                                                                    onChange={handleToChange}
                                                                    onFocus={() => fetchCitySuggestions(formData.to, 'to')}
                                                                    placeholder={activeTab === 'train' ? "City or Station" : (activeTab === 'bus' ? "City or Terminal" : "City or Airport")}
                                                                    list="to-suggestions"
                                                                />

                                                                {/* To Suggestions DataList */}
                                                                <datalist id="to-suggestions">
                                                                    {toSuggestions.map((airport) => (
                                                                        <option key={airport.code + Math.random()} value={airport.city}>
                                                                            {airport.name} ({airport.code})
                                                                        </option>
                                                                    ))}
                                                                </datalist>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    <Col lg={activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus' ? 3 : 3}>
                                                        <div className="mmt-input-group h-100">
                                                            <label className="mmt-label">Departure</label>
                                                            <input
                                                                type="date"
                                                                className="mmt-input form-control-plaintext text-white p-0"
                                                                value={formData.date}
                                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus' ? 3 : 4}>
                                                        <div className="mmt-input-group h-100">
                                                            <label className="mmt-label">{activeTab === 'train' || activeTab === 'bus' ? 'Members' : (activeTab === 'flight' ? 'Passengers' : 'Return')}</label>
                                                            {activeTab === 'flight' || activeTab === 'train' || activeTab === 'bus' ? (
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    className="mmt-input"
                                                                    value={formData.passengers}
                                                                    onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                                                                />
                                                            ) : (
                                                                <input type="date" className="mmt-input form-control-plaintext text-white p-0" />
                                                            )}
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>



                                        <div className="text-center mt-5 position-relative">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="mmt-btn rounded-pill px-5 py-3 position-absolute start-50 translate-middle-x"
                                                style={{ top: '-40px' }}
                                            >
                                                <span className="h4 mb-0 fw-bold">SEARCH</span>
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    )}
                </Container>
            </section>

            {
                user && (
                    <>
                        {/* Top Visiting Places */}
                        <section className="py-5">
                            <Container>
                                <h2 className="display-5 fw-bold text-center mb-5">Top Visiting <span className="text-gradient">Places</span></h2>
                                <Row className="g-4">
                                    {[
                                        { name: 'Taj Mahal, Agra', img: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600', desc: 'The iconic symbol of love and one of the seven wonders of the world.' },
                                        { name: 'Jaipur, Rajasthan', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=60', desc: 'The Pink City, famous for its majestic palaces and vibrant culture.' },
                                        { name: 'Kerala Backwaters', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=60', desc: "God's Own Country, known for its serene backwaters and lush greenery." },
                                        { name: 'Goa Beaches', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60', desc: 'The party capital of India with sun-kissed beaches and vibrant nightlife.' }
                                    ].map((place, idx) => (
                                        <Col md={3} key={idx}>
                                            <motion.div
                                                whileHover={{ y: -10 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="h-100"
                                            >
                                                <Card className="h-100 border-0 glass-panel overflow-hidden d-flex flex-column">
                                                    <div style={{ height: '200px', minHeight: '200px', overflow: 'hidden' }}>
                                                        <Card.Img variant="top" src={place.img} style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                                                    </div>
                                                    <Card.Body className="d-flex flex-column flex-grow-1">
                                                        <Card.Title className="fw-bold mb-2">{place.name}</Card.Title>
                                                        <Card.Text className="text-muted small mb-3">
                                                            {place.desc}
                                                        </Card.Text>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="w-100 rounded-pill mt-auto"
                                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`, '_blank')}
                                                        >
                                                            Explore
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </section>

                        {/* About Us Section */}
                        <section className="py-5" style={{ background: '#0f172a', color: '#f8fafc' }}>
                            <Container>
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <h2 className="display-5 fw-bold mb-4">About <span className="text-gradient">Us</span></h2>
                                        <p className="lead mb-4" style={{ color: '#cbd5e1' }}>
                                            We are a team of passionate travelers and tech enthusiasts dedicated to making your travel dreams a reality.
                                            Our mission is to simplify the travel planning process, helping you discover new destinations, find the best deals,
                                            and create unforgettable memories.
                                        </p>
                                        <p style={{ color: '#94a3b8' }}>
                                            Whether you're planning a solo backpacking trip, a romantic getaway, or a family vacation,
                                            our booking engine and intuitive itinerary tools are here to assist you every step of the way.
                                            Join our community of explorers today!
                                        </p>

                                    </Col>
                                    <Col md={6}>
                                        <div className="p-4 glass-panel rounded-4 mt-4 mt-md-0 position-relative">
                                            <div className="blob blob-1 position-absolute" style={{ width: '100px', height: '100px', top: '-20px', right: '-20px', opacity: 0.5 }}></div>
                                            <h3 className="fw-bold mb-3">Why Choose Us?</h3>
                                            <ul className="list-unstyled">
                                                <li className="mb-3 d-flex align-items-center"><FaMapMarkedAlt className="text-primary me-3" size={24} /> Curated Experiences</li>
                                                <li className="mb-3 d-flex align-items-center"><FaWallet className="text-success me-3" size={24} /> Best Price Guarantee</li>
                                                <li className="mb-3 d-flex align-items-center"><FaUsers className="text-warning me-3" size={24} /> 24/7 Customer Support</li>
                                                <li className="d-flex align-items-center"><FaPlane className="text-info me-3" size={24} /> Seamless Booking</li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </section>

                        {/* Contact Us Section on Home Page */}
                        <section className="py-5" style={{ background: '#0f172a', color: '#f8fafc', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Container>
                                <div className="text-center mb-5">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <h2 className="display-4 fw-bold mb-3 text-white">Get in <span className="text-gradient">Touch</span></h2>
                                        <p className="lead mx-auto" style={{ maxWidth: '600px', color: '#94a3b8' }}>
                                            Have questions or need help planning your next adventure? Our team is available 24/7.
                                        </p>
                                    </motion.div>
                                </div>

                                <Row className="justify-content-center">
                                    <Col lg={8}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2, duration: 0.8 }}
                                        >
                                            <Card className="border-0 rounded-4" style={{ background: 'rgba(25, 30, 45, 0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <Card.Body className="p-4 p-md-5">
                                                    <Form onSubmit={handleContactSubmit}>
                                                        <Row>
                                                            <Col md={6} className="mb-4">
                                                                <Form.Group>
                                                                    <Form.Label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold' }}>FULL NAME</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="fullName"
                                                                        value={contactFormData.fullName}
                                                                        onChange={handleContactChange}
                                                                        placeholder="John Doe"
                                                                        className="bg-transparent text-white border-secondary"
                                                                        style={{ borderRadius: '10px', padding: '12px' }}
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={6} className="mb-4">
                                                                <Form.Group>
                                                                    <Form.Label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold' }}>EMAIL ADDRESS</Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        name="email"
                                                                        value={contactFormData.email}
                                                                        onChange={handleContactChange}
                                                                        placeholder="john@example.com"
                                                                        className="bg-transparent text-white border-secondary"
                                                                        style={{ borderRadius: '10px', padding: '12px' }}
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold' }}>MESSAGE</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={4}
                                                                name="message"
                                                                value={contactFormData.message}
                                                                onChange={handleContactChange}
                                                                placeholder="Tell us more about your inquiry..."
                                                                className="bg-transparent text-white border-secondary"
                                                                style={{ borderRadius: '10px', padding: '12px' }}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Button
                                                            type="submit"
                                                            className="mmt-btn w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center"
                                                            disabled={contactStatus === 'sending'}
                                                        >
                                                            {contactStatus === 'sending' ? 'SENDING...' : (
                                                                <>
                                                                    SEND MESSAGE <FaPaperPlane className="ms-2" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </>
                )
            }
        </div >
    );
};

export default Home;