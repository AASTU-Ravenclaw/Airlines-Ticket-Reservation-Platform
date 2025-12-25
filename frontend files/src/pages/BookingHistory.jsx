import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const BookingHistory = () => {
  const { auth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null);

  const fetchBookings = async () => {
    const res = await api.get(`/bookings/`);
    setBookings(res.data);
  };

  const fetchFlightDetails = async (flightId) => {
    try {
      const res = await api.get(`/flights/${flightId}/`);
      setFlightDetails(res.data);
    } catch (err) {
      console.error("Error fetching flight details:", err);
      setFlightDetails(null);
    }
  };

  useEffect(() => {
    if(auth.user) fetchBookings();
  }, [auth.user]);

  const cancelBooking = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/bookings/${id}/`);
      
      alert("Booking cancelled successfully");
      setSelectedBooking(null);
      setFlightDetails(null);
      fetchBookings();
    } catch (err) {
      alert("Error cancelling booking");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your flight reservations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Booking List</h2>
          <div className="space-y-3">
            {bookings.map(b => (
              <div
                key={b.booking_id}
                onClick={() => {
                  setSelectedBooking(b);
                  fetchFlightDetails(b.flight_id);
                }}
                className={`cursor-pointer p-4 rounded-lg border-2 transition duration-300 ${
                  selectedBooking?.booking_id === b.booking_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-gray-800">Flight {b.flight_id.slice(0, 8)}...</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(b.booking_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {selectedBooking ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Booking ID:</span>
                <span className="font-mono text-sm ml-2">{selectedBooking.booking_id.slice(0, 8)}...</span>
              </div>
              
              {flightDetails && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800">Flight Information:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
                    <p><strong>From:</strong> {flightDetails.departure_location.city} ({flightDetails.departure_location.airport_code})</p>
                    <p><strong>To:</strong> {flightDetails.arrival_location.city} ({flightDetails.arrival_location.airport_code})</p>
                    <p><strong>Departure:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>
                    <p><strong>Price:</strong> <span className="text-green-600 font-semibold">${flightDetails.price}</span></p>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedBooking.status}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="text-sm text-gray-500">Booking Date:</span>
                <span className="ml-2">{new Date(selectedBooking.booking_date).toLocaleDateString()}</span>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-800">Passengers:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedBooking.passengers_details.map((p, i) => (
                    <li key={i} className="text-gray-700">{p.first_name} {p.last_name}</li>
                  ))}
                </ul>
              </div>
              
              {selectedBooking.status !== 'CANCELLED' && (
                <button
                  onClick={() => cancelBooking(selectedBooking.booking_id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Cancel Booking
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Select a booking to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
