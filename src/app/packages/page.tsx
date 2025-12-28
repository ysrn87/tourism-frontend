'use client';

import { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';
import { TourPackage } from '@/types';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Search,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await publicAPI.getAllPackages();
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Hero */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explore Tour Packages</h1>
          <p className="text-xl text-blue-100">
            Find your perfect adventure from our curated selection
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by destination or package name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No packages found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <Link key={pkg.id} href={`/packages/${pkg.slug}`}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {/* Image */}
                  <div className="relative h-56">
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
                    {pkg.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="white" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin size={14} />
                      <span className="text-sm">{pkg.destination}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-blue-600" />
                        <span>{pkg.duration_days}D/{pkg.duration_nights}N</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-purple-600" />
                        <span>{pkg.seats_available} left</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="text-2xl font-bold text-blue-600">${pkg.price}</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}