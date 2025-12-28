'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userAPI } from '@/lib/api';
import { Booking } from '@/types';
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = Number(params.id);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await userAPI.getBookingById(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      alert('Booking not found');
      router.push('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(true);
    try {
      await userAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      router.push('/bookings');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/bookings" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Bookings
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">Booking ID: #{booking.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Package Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Package Information</h2>
          <div className="flex gap-4">
            {booking.package_image_url && (
              <img
                src={booking.package_image_url}
                alt={booking.package_title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {booking.package_title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin size={16} />
                <span>{booking.package_destination}</span>
              </div>
              <p className="text-sm text-gray-600">
                {booking.package_duration_days}D/{booking.package_duration_nights}N
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={20} />
                <span className="text-sm font-medium">Departure Date</span>
              </div>
              <p className="text-lg font-semibold ml-7">
                {new Date(booking.departure_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users size={20} />
                <span className="text-sm font-medium">Number of Travelers</span>
              </div>
              <p className="text-lg font-semibold ml-7">
                {booking.num_travelers} person(s)
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign size={20} />
                <span className="text-sm font-medium">Total Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 ml-7">
                ${booking.total_price}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock size={20} />
                <span className="text-sm font-medium">Booked On</span>
              </div>
              <p className="text-lg font-semibold ml-7">
                {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        {/* What's Included */}
        {booking.package_includes && booking.package_includes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What's Included</h2>
            <div className="space-y-2">
              {booking.package_includes.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <div className="flex gap-4">
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={cancelling}
              className="flex items-center gap-2"
            >
              <XCircle size={20} />
              Cancel Booking
            </Button>
          </div>
        )}

        {booking.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              This booking has been cancelled. Your seats have been released back to the package.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}