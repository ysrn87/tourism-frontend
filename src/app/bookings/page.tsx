'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import { TourBooking } from '@/types';
import { 
  Calendar, 
  Users, 
  DollarSign,
  MapPin,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
  Ban
} from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.cancelBooking(id);
      alert('Booking cancelled successfully!');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: Ban },
      completed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    };
    const { color, icon: Icon } = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${color}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <h1 className="text-2xl font-bold text-gray-900">Meet & Go</h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your travel bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start planning your next adventure!
            </p>
            <Link href="/packages">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                Browse Packages
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto bg-gray-200">
                    {booking.image_url ? (
                      <img
                        src={booking.image_url}
                        alt={booking.package_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="text-gray-400" size={48} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.package_title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                          <MapPin size={16} />
                          <span>{booking.destination}</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="font-medium">
                            {new Date(booking.departure_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={16} className="text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Travelers</p>
                          <p className="font-medium">{booking.num_travelers}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign size={16} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="font-medium">${booking.total_price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/bookings/${booking.id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                          <Eye size={16} />
                          View Details
                        </button>
                      </Link>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-sm"
                        >
                          <XCircle size={16} />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}