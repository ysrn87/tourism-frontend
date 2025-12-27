'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { TourPackage } from '@/types';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  DollarSign,
  Users,
  Calendar,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await adminAPI.getAllPackages({ active: 'all' });
      setPackages(response.data.packages);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await adminAPI.deletePackage(id);
      alert('Package deleted successfully!');
      fetchPackages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete package');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await adminAPI.togglePackageFeatured(id);
      fetchPackages();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update package');
    }
  };

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
                Manage tour packages, pricing, and availability
              </p>
            </div>
            <Link href="/admin/packages/new">
              <Button className="flex items-center gap-2">
                <Plus size={20} />
                Add New Package
              </Button>
            </Link>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No packages yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first tour package to get started!
            </p>
            <Link href="/admin/packages/new">
              <Button>Add New Package</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {pkg.image_url ? (
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-gray-400" size={48} />
                    </div>
                  )}
                  {pkg.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={14} fill="white" />
                      Featured
                    </div>
                  )}
                  {!pkg.active && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Inactive
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {pkg.destination}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold">${pkg.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{pkg.duration_days}D/{pkg.duration_nights}N</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={16} className="text-purple-600" />
                      <span>{pkg.seats_available}/{pkg.seats_total} seats</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      pkg.seats_available === 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {pkg.seats_available === 0 ? 'Sold Out' : 'Available'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFeatured(pkg.id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pkg.featured
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={16} className="inline mr-1" />
                      {pkg.featured ? 'Featured' : 'Feature'}
                    </button>
                    <Link href={`/admin/packages/${pkg.id}/edit`}>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.title)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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