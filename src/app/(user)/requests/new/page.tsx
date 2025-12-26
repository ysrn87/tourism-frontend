'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { userAPI } from '@/lib/api';
import { ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const popularDestinations = [
    'Bali, Indonesia',
    'Tokyo, Japan',
    'Paris, France',
    'New York, USA',
    'Dubai, UAE',
    'Singapore',
    'Seoul, South Korea',
    'London, UK',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const selectDestination = (destination: string) => {
    setFormData({ ...formData, destination });
    if (errors.destination) {
      setErrors({ ...errors, destination: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    } else if (formData.destination.length > 200) {
      newErrors.destination = 'Destination is too long (max 200 characters)';
    }

    if (formData.message && formData.message.length > 1000) {
      newErrors.message = 'Message is too long (max 1000 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await userAPI.createRequest({
        destination: formData.destination.trim(),
        message: formData.message.trim() || undefined,
      });

      setSuccess(true);
      
      // Redirect to requests page after 2 seconds
      setTimeout(() => {
        router.push('/requests');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create request. Please try again.';
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Request Created Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your travel request has been submitted. A tour guide will be assigned to help you soon.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Travel Request
          </h1>
          <p className="text-gray-600">
            Tell us where you want to go and we'll connect you with an expert tour guide.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination Input */}
            <div>
              <Input
                label="Destination"
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Bali, Indonesia"
                error={errors.destination}
                helperText="Where would you like to travel?"
                required
              />
            </div>

            {/* Popular Destinations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or select a popular destination:
              </label>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((destination) => (
                  <button
                    key={destination}
                    type="button"
                    onClick={() => selectDestination(destination)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.destination === destination
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {destination}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your travel preferences, budget, dates, or any special requirements..."
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all resize-none ${
                  errors.message
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.message.length} / 1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <Send size={20} />
                Submit Request
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your request will be reviewed by our admin team</li>
            <li>• An experienced tour guide will be assigned to help you</li>
            <li>• The tour guide will contact you to discuss your travel plans</li>
            <li>• You can track your request status in your dashboard</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}