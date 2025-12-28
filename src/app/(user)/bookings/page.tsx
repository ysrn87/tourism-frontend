'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userAPI } from '@/lib/api';
import { Booking } from '@/types';
import { 
  ShoppingBag, 
  Calendar, 
  Users, 
  MapPin,
  Eye,
  XCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await userAPI.getBookings();
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await userAPI.cancelBooking(id);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'confirmed': return 'text-green-700 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      case 'completed': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and manage your tour package bookings
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our tour packages and book your next adventure!
            </p>
            <Link href="/packages/browse">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
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
                    {booking.package_image_url ? (
                      <img
                        src={booking.package_image_url}
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
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin size={16} />
                          <span className="text-sm">{booking.package_destination}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={18} className="text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="text-sm font-medium">
                            {new Date(booking.departure_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={18} className="text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Travelers</p>
                          <p className="text-sm font-medium">{booking.num_travelers} person(s)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="text-lg font-bold text-blue-600">${booking.total_price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t pt-4">
                      <Link href={`/bookings/${booking.id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                          <Eye size={16} />
                          View Details
                        </button>
                      </Link>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors text-sm"
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
    </DashboardLayout>
  );
}