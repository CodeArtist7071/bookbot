import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { db } from '../../services/supabase/database';
import { Loader2, Calendar, Clock, User, Scissors } from 'lucide-react';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const data = await db.bookings.getAll();
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500 shadow-sm">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking: any) => (
            <button
              type="button"
              key={booking.id}
              aria-label="View booking details"
              onClick={() => navigate(`/dashboard/bookings/${booking.id}`)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status}
                    </span>
                    <h3 className="font-bold text-slate-900">{booking.customer_name}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                      <Scissors size={14} />
                      <span>{booking.services?.name || 'Service'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Price</p>
                    <p className="text-xl font-black text-slate-900">${booking.total_price}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

