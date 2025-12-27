'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { publicAPI } from '@/lib/api';
import { TourPackage } from '@/types';
import { 
  Plane, 
  Users, 
  Shield, 
  ArrowRight,
  MapPin,
  Calendar,
  DollarSign,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [featuredPackages, setFeaturedPackages] = useState<TourPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'tour_guide') {
        router.push('/tour_guide/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const response = await publicAPI.getFeaturedPackages();
      setFeaturedPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-blue-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="text-primary-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Meet & Go</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Dream Destination
            <span className="text-primary-600"> Awaits</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Connect with professional travel tour guides who will help you plan the perfect journey. 
            From exotic beaches to mountain adventures, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
                Start Your Journey
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/packages">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg px-8 py-3 rounded-lg transition-colors">
                Browse Packages
              </button>
            </Link>
          </div>
        </div>

        {/* Featured Packages */}
        {!loadingPackages && featuredPackages.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Tour Packages
              </h3>
              <p className="text-gray-600">
                Handpicked destinations for your next adventure
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 6).map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-64">
                    {pkg.image_url ? (
                      <img
                        src={pkg.image_url}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <MapPin className="text-gray-400" size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={14} fill="white" />
                      Featured
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin size={16} />
                      <span className="text-sm">{pkg.destination}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Details */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar size={16} className="text-blue-600" />
                        <span>{pkg.duration_days}D/{pkg.duration_nights}N</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Users size={16} className="text-purple-600" />
                        <span>{pkg.seats_available} seats left</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-primary-600">
                          ${pkg.price}
                        </p>
                      </div>
                      <Link href={`/packages/${pkg.slug}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/packages">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
                  View All Packages
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Tour Guides</h3>
            <p className="text-gray-600">
              Connect with experienced travel professionals who know your destination inside out.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
            <p className="text-gray-600">
              Get custom travel itineraries tailored to your preferences and budget.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Trusted</h3>
            <p className="text-gray-600">
              Your information is safe with us. All tour guides are verified professionals.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Meet & Go. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}