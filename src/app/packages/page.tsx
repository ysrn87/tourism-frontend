'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { packageAPI } from '@/lib/api';
import PackageCard from '@/components/packages/PackageCard';
import { Search, Filter, Plane, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [destinationFilter, setDestinationFilter] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [destinationFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (destinationFilter) {
        params.destination = destinationFilter;
      }
      const response = await packageAPI.getAll(params);
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Meet & Go</h1>
            </Link>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tour Packages
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing destinations with our curated tour packages
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Destination Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
              >
                <option value="">All Destinations</option>
                <option value="Bali">Bali, Indonesia</option>
                <option value="Tokyo">Tokyo, Japan</option>
                <option value="Paris">Paris, France</option>
                <option value="New York">New York, USA</option>
                <option value="Dubai">Dubai, UAE</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <Plane className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No packages found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDestinationFilter('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredPackages.length} {filteredPackages.length === 1 ? 'package' : 'packages'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}