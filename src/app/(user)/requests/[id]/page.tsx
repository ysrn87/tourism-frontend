'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userAPI } from '@/lib/api';
import { Request } from '@/types';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = Number(params.id);

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await userAPI.getRequestById(requestId);
      setRequest(response.data);
    } catch (error) {
      console.error('Failed to fetch request:', error);
      alert('Request not found');
      router.push('/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    setCancelling(true);
    try {
      await userAPI.cancelRequest(requestId);
      alert('Request cancelled successfully');
      router.push('/requests');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel request');
    } finally {
      setCancelling(false);
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/requests" 
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

        {/* Main Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-6">
            {/* Destination */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin size={20} />
                <span className="text-sm font-medium">Destination</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 ml-7">
                {request.destination}
              </p>
            </div>

            {/* Message */}
            {request.message && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MessageSquare size={20} />
                  <span className="text-sm font-medium">Your Message</span>
                </div>
                <p className="text-gray-700 ml-7 whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>
            )}

            {/* Dates */}
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

        {/* Agent Info Card */}
        {request.agent_name ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Assigned Agent
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{request.agent_name}</p>
                  <p className="text-sm text-gray-500">Travel Agent</p>
                </div>
              </div>
              {request.agent_email && (
                <div className="flex items-center gap-2 text-gray-600 ml-13">
                  <Mail size={18} />
                  <a 
                    href={`mailto:${request.agent_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {request.agent_email}
                  </a>
                </div>
              )}
              {request.agent_phone && (
                <div className="flex items-center gap-2 text-gray-600 ml-13">
                  <Phone size={18} />
                  <a 
                    href={`tel:${request.agent_phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {request.agent_phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="text-yellow-600 shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                  Waiting for Agent Assignment
                </h3>
                <p className="text-sm text-yellow-800">
                  Your request is being reviewed by our admin team. An agent will be assigned soon to help you plan your trip.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {(request.status === 'pending' || request.status === 'assigned') && (
          <div className="flex gap-4">
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={cancelling}
              className="flex items-center gap-2"
            >
              <XCircle size={20} />
              Cancel Request
            </Button>
          </div>
        )}

        {/* Status Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Request Status Guide
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Pending:</strong> Waiting for admin review and agent assignment</li>
            <li>• <strong>Assigned:</strong> An agent has been assigned and will contact you soon</li>
            <li>• <strong>In Progress:</strong> Agent is working on your travel arrangements</li>
            <li>• <strong>Completed:</strong> Your travel request has been fulfilled</li>
            <li>• <strong>Cancelled:</strong> This request has been cancelled</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}