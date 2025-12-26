'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { adminAPI } from '@/lib/api';
import { TourGuideWithWorkload } from '@/types';
import { 
  Users, UserPlus, Search, UserCheck, Activity, CheckCircle, Power
} from 'lucide-react';

export default function AdminTourGuidesPage() {
  const [tourGuides, setTourGuides] = useState<TourGuideWithWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: ''
  });
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchTourGuides();
  }, []);

  const fetchTourGuides = async () => {
    try {
      const response = await adminAPI.getTourGuides();
      setTourGuides(response.data.tourGuides || response.data);
    } catch (error) {
      console.error('Failed to fetch tour guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await adminAPI.registerTourGuide(formData);
      alert('Tour guide registered successfully!');
      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowRegisterForm(false);
      fetchTourGuides();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register tour guide');
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await adminAPI.toggleTourGuideActive(id);
      fetchTourGuides();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update tour guide');
    }
  };

  const filteredTourGuides = tourGuides.filter(tourGuide =>
    tourGuide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tourGuide.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Tour Guides</h1>
              <p className="text-gray-600">View and manage all travel tour guides</p>
            </div>
            <Button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className="flex items-center gap-2"
            >
              <UserPlus size={20} />
              Register New Tour Guide
            </Button>
          </div>
        </div>

        {showRegisterForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Register New Tour Guide</h2>
            <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <div className="md:col-span-2 flex gap-4">
                <Button type="submit" isLoading={registering}>Register Tour Guide</Button>
                <Button type="button" variant="secondary" onClick={() => setShowRegisterForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tour guides by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTourGuides.map((tourGuide) => (
              <div key={tourGuide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tourGuide.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <UserCheck className={tourGuide.active ? 'text-green-600' : 'text-gray-400'} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tourGuide.name}</h3>
                      <p className="text-sm text-gray-500">{tourGuide.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(tourGuide.id)}
                    className={`p-2 rounded-lg ${tourGuide.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <Power size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded p-3">
                    <Users className="mx-auto mb-1 text-gray-600" size={20} />
                    <p className="text-xl font-bold text-gray-900">{tourGuide.total_requests}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="bg-yellow-50 rounded p-3">
                    <Activity className="mx-auto mb-1 text-yellow-600" size={20} />
                    <p className="text-xl font-bold text-yellow-600">{tourGuide.active_requests}</p>
                    <p className="text-xs text-yellow-600">Active</p>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <CheckCircle className="mx-auto mb-1 text-green-600" size={20} />
                    <p className="text-xl font-bold text-green-600">{tourGuide.completed_requests}</p>
                    <p className="text-xs text-green-600">Done</p>
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