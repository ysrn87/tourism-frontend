'use client';

import { useEffect, useState } from 'react';
import BookingModal from '@/components/bookings/BookingModal';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import { TourPackage } from '@/types';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await publicAPI.getPackageBySlug(slug);
      setPkg(response.data);
    } catch (error) {
      console.error('Failed to fetch package:', error);
      alert('Package not found');
      router.push('/packages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pkg) return null;

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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Packages
        </Link>
      </div>

      {/* Hero Image */}
      <div className="container mx-auto px-4 mb-8">
        <div className="relative h-96 rounded-2xl overflow-hidden">
          {pkg.image_url ? (
            <img
              src={pkg.image_url}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <MapPin className="text-gray-500" size={64} />
            </div>
          )}
          {pkg.featured && (
            <div className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <Star size={18} fill="white" />
              Featured Package
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pkg.title}
              </h1>
              <div className="flex items-center gap-2 text-xl text-gray-600">
                <MapPin size={24} className="text-blue-600" />
                <span>{pkg.destination}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {pkg.duration_days}D/{pkg.duration_nights}N
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Seats Available</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {pkg.seats_available}/{pkg.seats_total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departure Days</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {pkg.departure_days || 'Flexible'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {pkg.description && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Package
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Package Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Star className="text-yellow-500 shrink-0 mt-1" size={18} fill="currentColor" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-6">
              {pkg.includes && pkg.includes.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What's Included
                  </h3>
                  <div className="space-y-3">
                    {pkg.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pkg.excludes && pkg.excludes.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What's Not Included
                  </h3>
                  <div className="space-y-3">
                    {pkg.excludes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <XCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((day, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {day.title}
                        </h4>
                        <p className="text-gray-700">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-600">/ person</span>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className={`text-sm font-semibold ${pkg.seats_available > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {pkg.seats_available > 0
                      ? `${pkg.seats_available} seats left`
                      : 'Sold Out'
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(pkg.seats_available / pkg.seats_total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {pkg.seats_available > 0 ? (
                  <>
                    {user ? (
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Book Now
                      </button>
                    ) : (
                      <Link href="/login">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                          Login to Book
                        </button>
                      </Link>
                    )}
                    <Link href="/register">
                      <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors">
                        Request Custom Plan
                      </button>
                    </Link>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>

              {/* Booking Modal */}
              {showBookingModal && (
                <BookingModal
                  pkg={pkg} 
                  onClose={() => setShowBookingModal(false)} 
                />
              )}

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Free cancellation up to 48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Meet & Go. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}