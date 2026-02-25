import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PlanTrip from './pages/PlanTrip';
import TripDetails from './pages/TripDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingsList from './pages/BookingsList';
import BookServices from './pages/BookServices';
import FlightResults from './pages/FlightResults';
import HotelResults from "./pages/HotelResults";
import TrainResults from './pages/TrainResults';
import BusResults from './pages/BusResults';
import HotelBooking from './pages/HotelBooking';
import TrainBooking from './pages/TrainBooking';
import BusBooking from './pages/BusBooking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="my-trips" element={<Dashboard />} />
          <Route path="plan" element={<PlanTrip />} />
          <Route path="trip/:id" element={<TripDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="hotel-booking" element={<HotelBooking />} />
          <Route path="train-booking" element={<TrainBooking />} />
          <Route path="bus-booking" element={<BusBooking />} />
          <Route path="booking-confirmation/:id" element={<BookingConfirmation />} />
          <Route path="bookings" element={<BookingsList />} />
          <Route path="flights" element={<FlightResults />} />
          <Route path="hotels" element={<HotelResults />} />
          <Route path="trains" element={<TrainResults />} />
          <Route path="buses" element={<BusResults/>} />
        </Route>
          <Route path="admin" element={<AdminLogin/>} />
          <Route path="admin-dashboard" element={<AdminDashboard/>} />

      </Routes>
    </Router>
  );
}

export default App;
