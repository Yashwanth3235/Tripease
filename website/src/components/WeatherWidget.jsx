import React, { useState, useEffect } from 'react';
import { Card, Image, Spinner, Row, Col } from 'react-bootstrap';
import { FaTemperatureHigh, FaWind, FaTint } from 'react-icons/fa';

const WeatherWidget = ({ city }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = 'a9d5bda62bba7cb08c8c4878b88fd644';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    useEffect(() => {
        if (!city) return;

        const fetchWeather = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeather(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setWeather(null); // Clear weather data on error
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    if (loading) {
        return (
            <Card className="glass-panel border-0 p-3 h-100 d-flex align-items-center justify-content-center">
                <Spinner animation="border" variant="light" />
                <span className="ms-2">Loading weather...</span>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="glass-panel border-0 p-3 h-100 text-center">
                <p className="text-danger mb-0">Could not load weather for {city}.</p>
            </Card>
        );
    }

    if (!weather) return null;

    const { main, weather: w, wind } = weather;
    const weatherIcon = `https://openweathermap.org/img/wn/${w[0].icon}@2x.png`;

    return (
        <Card className="glass-panel border-0 p-3 h-100 text-white">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <h5 className="mb-0 fw-bold">{city}</h5>
                    <p className="text-capitalize text-info small mb-0">{w[0].description}</p>
                </div>
                <Image src={weatherIcon} alt="weather icon" width={50} height={50} />
            </div>

            <div className="d-flex align-items-center mb-3">
                <h2 className="display-4 fw-bold mb-0 me-2">{Math.round(main.temp)}°</h2>
            </div>

            <Row className="g-2 text-center small text-muted">
                <Col className="d-flex align-items-center gap-1">
                    <FaTint size={12} /> {main.humidity}%
                </Col>
                <Col className="d-flex align-items-center gap-1">
                    <FaWind size={12} /> {Math.round(wind.speed)} m/s
                </Col>
            </Row>
        </Card>
    );
};

export default WeatherWidget;
