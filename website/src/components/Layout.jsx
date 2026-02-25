import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar expand="lg" variant="dark" className="glass-panel sticky-top py-1" style={{ zIndex: 1050 }}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-2">
                        <span className="text-gradient">Tripease</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>

                            {user && <Nav.Link as={Link} to="/my-trips" active={location.pathname === '/my-trips'}>My Trips</Nav.Link>}
                            {user && <Nav.Link as={Link} to="/bookings" active={location.pathname === '/bookings'}>My Bookings</Nav.Link>}

                            {user ? (
                                <Dropdown className="ms-lg-3">
                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="rounded-pill px-4 d-flex align-items-center gap-2">
                                        <FaUserCircle /> {user.name}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="glass-panel border-0 shadow mt-2">
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="d-flex gap-2 ms-lg-3">
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="outline-primary"
                                        className="rounded-pill px-4"
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/signup"
                                        variant="primary"
                                        className="rounded-pill px-4"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <main className="flex-grow-1">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
