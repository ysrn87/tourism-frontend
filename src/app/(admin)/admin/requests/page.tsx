'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Request } from '@/types';
import { 
  FileText, 
  Search,
  Filter,
  Eye,
  User,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminRequestsPage() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Always fetch all requests for accurate counts
      const allResponse = await adminAPI.getRequests({});
      setAllRequests(allResponse.data.requests || allResponse.data);
      
      // Fetch filtered requests for display
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adminAPI.getRequests(params);
      setRequests(response.data.requests || response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
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

  const filteredRequests = requests.filter(request =>
    request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Requests
          </h1>
          <p className="text-gray-600">
            View, assign, and manage all travel requests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by destination, customer, agent, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All ({statusCounts.all})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="assigned">Assigned ({statusCounts.assigned})</option>
                <option value="in_progress">In Progress ({statusCounts.in_progress})</option>
                <option value="completed">Completed ({statusCounts.completed})</option>
                <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching requests found' : 'No requests yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Requests will appear here when users submit them.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {request.destination}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                      {request.status === 'pending' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Needs Assignment
                        </span>
                      )}
                    </div>

                    {request.message && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {request.message}
                      </p>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">Customer:</span>
                        <span>{request.user_name}</span>
                      </div>
                      {request.agent_name ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserCheck size={16} className="text-blue-600" />
                          <span className="font-medium">Agent:</span>
                          <span>{request.agent_name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <UserCheck size={16} className="text-gray-400" />
                          <span>No agent assigned</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>
                        Created: {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      {request.updated_at && request.updated_at !== request.created_at && (
                        <span>
                          Updated: {new Date(request.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link href={`/admin/requests/${request.id}`}>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Eye size={18} />
                    View & Manage
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}