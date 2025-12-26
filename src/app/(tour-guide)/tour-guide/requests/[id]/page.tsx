'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/common/Button';
import { tourGuideAPI } from '@/lib/api';
import { Request } from '@/types';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function TourGuideRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params.id);

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await tourGuideAPI.getRequestById(requestId);
      setRequest(response.data);
    } catch (error) {
      console.error('Failed to fetch request:', error);
      alert('Request not found');
      router.push('/tour-guide/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!request) return;

    const confirmMessage = `Are you sure you want to update status to "${formatStatus(newStatus)}"?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setUpdating(true);
    try {
      await tourGuideAPI.updateStatus(requestId, { 
        status: newStatus,
        note: note.trim() || undefined
      });
      
      alert('Status updated successfully!');
      setNote('');
      fetchRequest(); // Refresh data
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const transitions: Record<string, string> = {
      assigned: 'in_progress',
      in_progress: 'completed',
    };
    return transitions[currentStatus];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const labels: Record<string, string> = {
      assigned: 'Start Working',
      in_progress: 'Mark as Completed',
    };
    return labels[currentStatus];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'in_progress': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
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

  const nextStatus = getNextStatus(request.status);
  const canUpdate = nextStatus && request.status !== 'completed';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tour-guide/requests" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Requests
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Request Details
              </h1>
              <p className="text-gray-600">
                Request ID: #{request.id}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
              {formatStatus(request.status)}
            </span>
          </div>
        </div>

        {/* Request Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Travel Request Information
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
                  <span className="text-sm font-medium">Request Date</span>
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

        {/* Customer Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{request.user_name}</p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            {request.user_email && (
              <div className="flex items-center gap-2 text-gray-700 ml-15">
                <Mail size={18} className="text-gray-400" />
                <a 
                  href={`mailto:${request.user_email}`}
                  className="text-blue-600 hover:underline"
                >
                  {request.user_email}
                </a>
              </div>
            )}
            {request.user_phone && (
              <div className="flex items-center gap-2 text-gray-700 ml-15">
                <Phone size={18} className="text-gray-400" />
                <a 
                  href={`tel:${request.user_phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {request.user_phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Section */}
        {canUpdate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Update Status
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any notes about this status update..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                {note.length} / 500 characters
              </p>
            </div>

            <Button
              onClick={() => handleStatusUpdate(nextStatus)}
              isLoading={updating}
              className="flex items-center gap-2"
            >
              {request.status === 'assigned' ? <Play size={20} /> : <CheckCircle size={20} />}
              {getNextStatusLabel(request.status)}
            </Button>
          </div>
        )}

        {/* Completed Status */}
        {request.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  Request Completed
                </h3>
                <p className="text-sm text-green-800">
                  Great job! This request has been successfully completed. The customer has been notified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Request Workflow
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full font-medium">
              Assigned
            </span>
            <span className="text-blue-600">→</span>
            <span className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full font-medium">
              In Progress
            </span>
            <span className="text-blue-600">→</span>
            <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full font-medium">
              Completed
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}