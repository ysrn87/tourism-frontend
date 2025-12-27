'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PackageForm from '@/components/admin/PackageForm';
import { adminAPI } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const packageId = Number(params.id);

  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      const response = await adminAPI.getPackageById(packageId);
      setPackageData(response.data);
    } catch (error) {
      console.error('Failed to fetch package:', error);
      alert('Package not found');
      router.push('/admin/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await adminAPI.updatePackage(packageId, data);
      alert('Package updated successfully!');
      router.push('/admin/packages');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update package');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/packages" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Packages
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Tour Package
          </h1>
          <p className="text-gray-600">
            Update package details, pricing, and availability
          </p>
        </div>

        <PackageForm 
          initialData={packageData} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </DashboardLayout>
  );
}