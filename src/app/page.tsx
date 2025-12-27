'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plane, Users, Shield, ArrowRight, Search, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { packageAPI } from '@/lib/api';
import PackageCard from '@/components/packages/PackageCard';

interface TourPackage {
  id: number;
  title: string;
  slug: string;
  destination: string;
  description?: string;
  image_url?: string;
  price: number;
  duration_days: number;
  duration_nights: number;
  seats_available: number;
  featured: boolean;
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'tour_guide') {
        router.push('/tour-guide/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAll({ featured: true });
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Meet & Go</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tour Packages
              </Link>
              <Link href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Destinations
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About Us
              </Link>
            </nav>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next
              <span className="block text-yellow-300">Adventure</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100">
              Explore curated tour packages with expert travel tour guides.
              Your journey begins here.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white rounded-xl p-2 shadow-2xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="text-gray-400" size={24} />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-gray-900 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <p className="text-4xl font-bold text-yellow-300">500+</p>
                <p className="text-blue-100 mt-2">Destinations</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-300">50K+</p>
                <p className="text-blue-100 mt-2">Happy Travelers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-300">4.9★</p>
                <p className="text-blue-100 mt-2">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star size={16} fill="currentColor" />
              Featured Tours
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Tour Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked experiences curated by our expert travel tour guides
            </p>
          </div>

          {loadingPackages ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No packages available yet
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for amazing tour packages!
              </p>
              <Link href="/requests/new">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Request Custom Tour
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.slice(0, 6).map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
              </div>
              
              {packages.length > 6 && (
                <div className="text-center mt-12">
                  <Link href="/packages">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                      View All Packages
                      <ArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Meet & Go?
            </h2>
            <p className="text-xl text-gray-600">
              Your trusted partner for unforgettable journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Expert Tour Guides</h3>
              <p className="text-gray-600 text-lg">
                Connect with experienced travel professionals who know your destination inside out.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Curated Packages</h3>
              <p className="text-gray-600 text-lg">
                Handpicked tour packages designed for maximum enjoyment and value.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Secure & Trusted</h3>
              <p className="text-gray-600 text-lg">
                Your information is safe with us. All tour guides are verified professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who found their perfect adventure with us
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/packages">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Browse Packages
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="text-blue-400" size={24} />
                <span className="text-xl font-bold text-white">Meet & Go</span>
              </div>
              <p className="text-sm">
                Your trusted travel companion for unforgettable adventures around the world.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/packages" className="hover:text-blue-400">Tour Packages</Link></li>
                <li><Link href="/destinations" className="hover:text-blue-400">Destinations</Link></li>
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-blue-400">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm mb-2">Email: info@meetandgo.com</p>
              <p className="text-sm">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Meet & Go. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}