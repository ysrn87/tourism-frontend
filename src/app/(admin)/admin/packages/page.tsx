'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/common/Button';
import { packageAPI } from '@/lib/api';
import api from '@/lib/api';
import { 
  Plus, Search, Edit, Trash2, Star, Eye, MapPin, Calendar, Users, DollarSign
} from 'lucide-react';

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
  seats_total: number;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages', { params: { active: 'false' } });
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await api.patch(`/packages/${id}/toggle-featured`);
      fetchPackages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update package');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/packages/${id}`);
      alert('Package deleted successfully');
      fetchPackages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete package');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tour Packages
              </h1>
              <p className="text-gray-600">
                Manage all tour packages and offerings
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Package
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No matching packages' : 'No packages yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Create your first tour package to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddModal(true)}>
                Add First Package
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  {pkg.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Featured
                    </div>
                  )}
                  {!pkg.active && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Inactive
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
                    <MapPin size={16} />
                    <span className="font-medium">{pkg.destination}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {pkg.title}
                  </h3>

                  {pkg.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Calendar size={16} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{pkg.duration_days}D</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Users size={16} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{pkg.seats_available}/{pkg.seats_total}</p>
                    </div>
                    <div className="text-center col-span-2">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <DollarSign size={16} />
                      </div>
                      <p className="text-lg font-bold text-blue-600">${pkg.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/packages/${pkg.slug}`, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(pkg.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        pkg.featured
                          ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={16} fill={pkg.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => alert('Edit functionality coming soon!')}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.title)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Package Modal */}
        {showAddModal && (
          <AddPackageModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchPackages();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Add Package Modal Component
function AddPackageModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    image_url: '',
    price: '',
    duration_days: '',
    duration_nights: '',
    departure_days: '',
    seats_total: '',
    itinerary: '',
    includes: '',
    excludes: '',
    highlights: '',
    featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        duration_nights: parseInt(formData.duration_nights || '0'),
        seats_total: parseInt(formData.seats_total),
        itinerary: formData.itinerary ? formData.itinerary.split('\n').filter(Boolean) : [],
        includes: formData.includes ? formData.includes.split('\n').filter(Boolean) : [],
        excludes: formData.excludes ? formData.excludes.split('\n').filter(Boolean) : [],
        highlights: formData.highlights ? formData.highlights.split('\n').filter(Boolean) : [],
      };

      await api.post('/packages', payload);
      alert('Package created successfully!');
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Add New Tour Package</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Bali Paradise 5D4N"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Bali, Indonesia"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Brief description of the package..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nights
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration_nights}
                onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Seats *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.seats_total}
                onChange={(e) => setFormData({ ...formData, seats_total: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Days
            </label>
            <input
              type="text"
              value={formData.departure_days}
              onChange={(e) => setFormData({ ...formData, departure_days: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Monday, Wednesday, Friday"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Includes (one per line)
              </label>
              <textarea
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Hotel accommodation&#10;Daily breakfast&#10;Airport transfers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excludes (one per line)
              </label>
              <textarea
                value={formData.excludes}
                onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="International flights&#10;Travel insurance&#10;Personal expenses"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlights (one per line)
            </label>
            <textarea
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Visit Uluwatu Temple&#10;Snorkeling at Nusa Penida&#10;Traditional Balinese dinner"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Feature this package on homepage</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button type="submit" isLoading={loading} className="flex-1">
              Create Package
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}