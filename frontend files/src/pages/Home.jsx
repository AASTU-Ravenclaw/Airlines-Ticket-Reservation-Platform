import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });

  const fetchFlights = async () => {
    const res = await api.get("/flights/", { params: filters });
    setFlights(res.data);
  };

  useEffect(() => {
    if (auth?.user?.role === 'ADMIN') {
      navigate('/admin');
      return;
    }
    fetchFlights();
  }, [auth, navigate]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Flights</h1>
        <p className="text-gray-600">Find and book your perfect flight</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From (City or Airport Code)"
            onChange={e => setFilters({...filters, from: e.target.value})}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="To (City or Airport Code)"
            onChange={e => setFilters({...filters, to: e.target.value})}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setFilters({...filters, date: e.target.value})}
          />
          <button
            onClick={fetchFlights}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Search Flights
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {flights.map(f => (
          <div key={f.flight_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {f.flight_number}: {f.departure_location.airport_code} → {f.arrival_location.airport_code}
                </h3>
                <p className="text-gray-600">{f.departure_location.city} to {f.arrival_location.city}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${f.price}</p>
                <p className="text-sm text-gray-500">per person</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="font-semibold">{new Date(f.departure_time).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="font-semibold">{new Date(f.arrival_time).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Available Seats: <span className="font-semibold">{f.available_seats}/{f.total_seats}</span>
              </p>
              <Link to={`/flight/${f.flight_id}`}>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
