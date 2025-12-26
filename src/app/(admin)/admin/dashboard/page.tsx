'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { adminAPI } from '@/lib/api';
import { AdminStats } from '@/types';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      if (user.role === 'tour_guide') router.push('/tour-guide/dashboard');
      if (user.role === 'user') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionRate = stats?.total_requests 
    ? Math.round((stats.completed_requests / stats.total_requests) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            System overview and management
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Requests"
            value={stats?.total_requests || 0}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Total Users"
            value={stats?.total_users || 0}
            icon={Users}
            color="purple"
          />
          <StatsCard
            title="Total Tour Guides"
            value={stats?.total_tour_guides || 0}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Active Tour Guides"
            value={stats?.active_tour_guides || 0}
            icon={Activity}
            color="yellow"
          />
        </div>

        {/* Request Status Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Request Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-yellow-600" size={20} />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">
                  {stats?.pending_requests || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-700">Assigned</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {stats?.assigned_requests || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="text-purple-600" size={20} />
                  <span className="text-gray-700">In Progress</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {stats?.in_progress_requests || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-700">Completed</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {stats?.completed_requests || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="text-red-600" size={20} />
                  <span className="text-gray-700">Cancelled</span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  {stats?.cancelled_requests || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">System Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100">Completion Rate</span>
                  <span className="text-2xl font-bold">{completionRate}%</span>
                </div>
                <div className="w-full bg-green-700 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-green-400">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span className="font-semibold">Quick Stats</span>
                </div>
                <ul className="text-sm text-green-100 space-y-1">
                  <li>• {stats?.active_tour_guides || 0} of {stats?.total_tour_guides || 0} tour guides active</li>
                  <li>• {stats?.pending_requests || 0} requests need assignment</li>
                  <li>• {(stats?.assigned_requests || 0) + (stats?.in_progress_requests || 0)} requests in progress</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/requests?status=pending">
            <div className="bg-white rounded-lg shadow-sm border-2 border-yellow-200 hover:border-yellow-400 p-6 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <Clock className="text-yellow-600" size={32} />
                <span className="text-3xl font-bold text-yellow-600">
                  {stats?.pending_requests || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Pending Requests
              </h3>
              <p className="text-sm text-gray-600">
                Needs tour guide assignment
              </p>
            </div>
          </Link>

          <Link href="/admin/tour-guides">
            <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200 hover:border-blue-400 p-6 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <Users className="text-blue-600" size={32} />
                <span className="text-3xl font-bold text-blue-600">
                  {stats?.total_tour_guides || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Manage Tour Guides
              </h3>
              <p className="text-sm text-gray-600">
                View and manage all tour guides
              </p>
            </div>
          </Link>

          <Link href="/admin/requests">
            <div className="bg-white rounded-lg shadow-sm border-2 border-purple-200 hover:border-purple-400 p-6 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <FileText className="text-purple-600" size={32} />
                <span className="text-3xl font-bold text-purple-600">
                  {stats?.total_requests || 0}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                All Requests
              </h3>
              <p className="text-sm text-gray-600">
                View and manage all requests
              </p>
            </div>
          </Link>
        </div>

        {/* Admin Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Admin Dashboard Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Assign pending requests to available tour guides promptly</li>
            <li>• Monitor tour guide workload to ensure balanced distribution</li>
            <li>• Check completion rates to identify system bottlenecks</li>
            <li>• Review cancelled requests for improvement opportunities</li>
            <li>• Ensure active tour guides are sufficient for current demand</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}