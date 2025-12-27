'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PackageForm from '@/components/admin/PackageForm';
import { adminAPI } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPackagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await adminAPI.createPackage(data);
      alert('Package created successfully!');
      router.push('/admin/packages');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create package');
    } finally {
      setIsLoading(false);
    }
  };

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
            Create New Tour Package
          </h1>
          <p className="text-gray-600">
            Add a new tour package with pricing, itinerary, and details
          </p>
        </div>

        <PackageForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}