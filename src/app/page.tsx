'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Plane, Users, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (!loading && user) {
    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'tour_guide') {  // Changed from 'tour guide'
      router.push('/tour-guide/dashboard');
    } else {
      router.push('/dashboard');
    }
  }
}, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linier-to-br from-primary-50 to-blue-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="text-primary-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Meet<span color='red'> andGo</span>
              </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-primary">
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
            Your Dream Journey
            <span className="text-primary-600"> Awaits</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Connect with professional travel tour guides who will help you plan the perfect journey. 
            From exotic beaches to mountain adventures, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                Start Your Journey
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/destinations">
              <button className="btn-secondary text-lg px-8 py-3">
                Browse Destinations
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Tour Guides</h3>
            <p className="text-gray-600">
              Connect with experienced travel professionals who know your destination inside out.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
            <p className="text-gray-600">
              Get custom travel itineraries tailored to your preferences and budget.
            </p>
          </div>

          <div className="card text-center">
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
          <p>&copy; 2026 MeetandGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}