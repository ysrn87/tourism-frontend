'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { userAPI } from '@/lib/api';
import { UserStats, Request } from '@/types';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  } else if (user && user.role !== 'user') {
    // Redirect if not a regular user
    if (user.role === 'admin') router.push('/admin/dashboard');
    if (user.role === 'tour_guide') router.push('/tour-guide/dashboard');  // Changed
  }
}, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        userAPI.getStats(),
        userAPI.getRequests({ limit: 5 })
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
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your travel requests and track their progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Requests"
            value={stats?.total || 0}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Pending"
            value={stats?.pending || 0}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Completed"
            value={stats?.completed || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Cancelled"
            value={stats?.cancelled || 0}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link href="/requests/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
              <Plus size={20} />
              Create New Request
            </button>
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Requests
            </h2>
            <Link 
              href="/requests" 
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
                No requests yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first travel request to get started!
              </p>
              <Link href="/requests/new">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Create Request
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/requests/${request.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {request.destination}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.message || 'No message provided'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.tour_guide_name && (
                          <span className="flex items-center gap-1">
                            Agent: <span className="font-medium">{request.tour_guide_name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}