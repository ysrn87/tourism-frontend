'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/common/Button';
import { bookingAPI } from '@/lib/api';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from 'lucide-react';
import Link from 'next/link';

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
      const response = await bookingAPI.getBookingById(bookingId);
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
    if (!confirm('Are you sure you want to cancel this booking? Your seats will be returned to availability.')) {
      return;
    }

    setCancelling(true);
    try {
      await bookingAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchBooking(); // Refresh
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

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/bookings" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to My Bookings
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">
                Booking ID: #{booking.id}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {formatStatus(booking.status)}
            </span>
          </div>
        </div>

        {/* Package Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Package Information
          </h2>
          <div className="flex gap-4">
            {booking.image_url && (
              <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
                <img
                  src={booking.image_url}
                  alt={booking.package_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {booking.package_title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={18} />
                <span>{booking.destination}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-blue-600" />
                  <span>{booking.duration_days}D/{booking.duration_nights}N</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Booking Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={20} />
                <span className="text-sm font-medium">Departure Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 ml-7">
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
              <p className="text-lg font-semibold text-gray-900 ml-7">
                {booking.num_travelers} {booking.num_travelers === 1 ? 'Person' : 'People'}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign size={20} />
                <span className="text-sm font-medium">Total Price</span>
              </div>
              <p className="text-lg font-semibold text-green-600 ml-7">
                ${booking.total_price}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock size={20} />
                <span className="text-sm font-medium">Booked On</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 ml-7">
                {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Contact Name</p>
                <p className="font-medium text-gray-900">{booking.contact_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a href={`mailto:${booking.contact_email}`} className="font-medium text-blue-600 hover:underline">
                  {booking.contact_email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <a href={`tel:${booking.contact_phone}`} className="font-medium text-blue-600 hover:underline">
                  {booking.contact_phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.special_requests && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 text-gray-900 mb-3">
              <MessageSquare size={20} />
              <h2 className="text-xl font-semibold">Special Requests</h2>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {booking.special_requests}
            </p>
          </div>
        )}

        {/* What's Included */}
        {booking.includes && booking.includes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What's Included in Your Package
            </h2>
            <div className="space-y-2">
              {booking.includes.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {booking.status === 'pending' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Manage Booking
            </h2>
            <p className="text-gray-600 mb-4">
              Your booking is pending confirmation. You can cancel it if your plans change.
            </p>
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

        {booking.status === 'confirmed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  Booking Confirmed!
                </h3>
                <p className="text-sm text-green-800">
                  Your booking has been confirmed. You will receive further details via email. Have a great trip!
                </p>
              </div>
            </div>
          </div>
        )}

        {booking.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <XCircle className="text-red-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Booking Cancelled
                </h3>
                <p className="text-sm text-red-800">
                  This booking has been cancelled. The seats have been returned to availability.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}