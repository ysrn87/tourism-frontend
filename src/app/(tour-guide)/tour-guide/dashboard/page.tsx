'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { tourGuideAPI } from '@/lib/api';
import { TourGuideStats, Request } from '@/types';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  Play,
  ArrowRight,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function TourGuideDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TourGuideStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'tour_guide') {
      if (user.role === 'admin') router.push('/admin/dashboard');
      if (user.role === 'user') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'tour_guide') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        tourGuideAPI.getStats(),
        tourGuideAPI.getRequests({ limit: 5 })
      ]);

      setStats(statsRes.data);
      setRecentRequests(requestsRes.data.requests || requestsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tour Guide Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your assigned travel requests.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Assigned"
            value={stats?.total || 0}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="New Assignments"
            value={stats?.assigned || 0}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="In Progress"
            value={stats?.in_progress || 0}
            icon={Play}
            color="purple"
          />
          <StatsCard
            title="Completed"
            value={stats?.completed || 0}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Active Workload</h3>
            <p className="text-4xl font-bold mb-1">
              {(stats?.assigned || 0) + (stats?.in_progress || 0)}
            </p>
            <p className="text-blue-100">Requests need your attention</p>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-4xl font-bold mb-1">
              {stats?.total ? Math.round(((stats?.completed || 0) / stats.total) * 100) : 0}%
            </p>
            <p className="text-green-100">Completed requests</p>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Assignments
            </h2>
            <Link 
              href="/tour-guide/requests" 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assignments yet
              </h3>
              <p className="text-gray-600">
                You'll see your assigned travel requests here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/tour-guide/requests/${request.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.destination}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {formatStatus(request.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {request.message || 'No message provided'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {request.user_name}
                        </span>
                        <span>
                          Assigned: {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tour Guide Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Respond to new assignments within 24 hours for best customer satisfaction</li>
            <li>• Update request status regularly to keep customers informed</li>
            <li>• Use the customer's contact information to discuss travel details</li>
            <li>• Mark requests as "Completed" once all arrangements are finalized</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}