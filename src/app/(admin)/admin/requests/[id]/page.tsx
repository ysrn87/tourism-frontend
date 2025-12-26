'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/common/Button';
import { adminAPI } from '@/lib/api';
import { Request, TourGuideWithWorkload } from '@/types';
import { 
  ArrowLeft, MapPin, Calendar, User, Mail, Phone, MessageSquare, 
  Clock, UserCheck, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params.id);

  const [request, setRequest] = useState<Request | null>(null);
  const [tourGuides, setTourGuides] = useState<TourGuideWithWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedTourGuide, setSelectedTourGuide] = useState<number | null>(null);

  useEffect(() => {
    if (requestId) {
      fetchData();
    }
  }, [requestId]);

  const fetchData = async () => {
    try {
      const [requestRes, tourGuidesRes] = await Promise.all([
        adminAPI.getRequestById(requestId),
        adminAPI.getTourGuides()
      ]);
      setRequest(requestRes.data.request || requestRes.data);
      setTourGuides(tourGuidesRes.data.tourGuides || tourGuidesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Request not found');
      router.push('/admin/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTourGuide) {
      alert('Please select a tour guide');
      return;
    }

    setAssigning(true);
    try {
      if (request?.tour_guide_id) {
        await adminAPI.reassignRequest(requestId, selectedTourGuide);
        alert('Request reassigned successfully!');
      } else {
        await adminAPI.assignRequest(requestId, selectedTourGuide);
        alert('Request assigned successfully!');
      }
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to assign request');
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'assigned': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'in_progress': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Request not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const activeTourGuides = tourGuides.filter(a => a.active);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/requests" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Requests
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Request Management
              </h1>
              <p className="text-gray-600">Request ID: #{request.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
              {formatStatus(request.status)}
            </span>
          </div>
        </div>

        {/* Request Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Request Information
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin size={20} />
                <span className="text-sm font-medium">Destination</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 ml-7">
                {request.destination}
              </p>
            </div>

            {request.message && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MessageSquare size={20} />
                  <span className="text-sm font-medium">Customer Message</span>
                </div>
                <p className="text-gray-700 ml-7 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {request.message}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar size={20} />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-gray-900 ml-7">
                  {new Date(request.created_at).toLocaleString()}
                </p>
              </div>
              {request.updated_at && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={20} />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <p className="text-gray-900 ml-7">
                    {new Date(request.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{request.user_name}</p>
              <p className="text-sm text-gray-500">Customer</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {request.user_email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${request.user_email}`} className="text-blue-600 hover:underline">
                  {request.user_email}
                </a>
              </div>
            )}
            {request.user_phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${request.user_phone}`} className="text-blue-600 hover:underline">
                  {request.user_phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tour Guide Assignment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {request.tour_guide_id ? 'Reassign Tour Guide' : 'Assign Tour Guide'}
            </h2>
            {request.tour_guide_id && (
              <span className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw size={16} />
                Currently: {request.tour_guide_name}
              </span>
            )}
          </div>

          {activeTourGuides.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">No active tour guides available</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tour Guide
                </label>
                <select
                  value={selectedTourGuide || ''}
                  onChange={(e) => setSelectedTourGuide(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose an TourGuide...</option>
                  {activeTourGuides.map((tourGuide) => (
                    <option key={tourGuide.id} value={tourGuide.id}>
                      {tourGuide.name} - {tourGuide.active_requests} active requests
                    </option>
                  ))}
                </select>
              </div>

              {/* Tour Guide Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {activeTourGuides.map((tourGuide) => (
                  <div
                    key={tourGuide.id}
                    onClick={() => setSelectedTourGuide(tourGuide.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTourGuide === tourGuide.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tourGuide.name}</p>
                        <p className="text-xs text-gray-500">{tourGuide.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-gray-100 rounded p-2">
                        <p className="font-bold text-gray-900">{tourGuide.total_requests}</p>
                        <p className="text-gray-600">Total</p>
                      </div>
                      <div className="bg-yellow-100 rounded p-2">
                        <p className="font-bold text-yellow-700">{tourGuide.active_requests}</p>
                        <p className="text-yellow-600">Active</p>
                      </div>
                      <div className="bg-green-100 rounded p-2">
                        <p className="font-bold text-green-700">{tourGuide.completed_requests}</p>
                        <p className="text-green-600">Done</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAssign}
                isLoading={assigning}
                disabled={!selectedTourGuide}
              >
                {request.tour_guide_id ? 'Reassign to Selected Tour Guide' : 'Assign to Selected Tour Guide'}
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Assignment Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Distribute requests evenly among tour guides</li>
            <li>• Consider tour guide expertise for specific destinations</li>
            <li>• Check active workload before assignment</li>
            <li>• Pending requests should be assigned within 24 hours</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}