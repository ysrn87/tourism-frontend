'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import { TourPackage } from '@/types';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { X, Calendar, Users, DollarSign } from 'lucide-react';

interface BookingModalProps {
  pkg: TourPackage;
  onClose: () => void;
}

export default function BookingModal({ pkg, onClose }: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    departure_date: '',
    num_travelers: 1,
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    special_requests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.departure_date) {
      newErrors.departure_date = 'Please select a departure date';
    } else {
      const selectedDate = new Date(formData.departure_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.departure_date = 'Departure date must be in the future';
      }
    }

    if (formData.num_travelers < 1) {
      newErrors.num_travelers = 'At least 1 traveler required';
    }

    if (formData.num_travelers > pkg.seats_available) {
      newErrors.num_travelers = `Only ${pkg.seats_available} seats available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contact_name.trim()) {
      newErrors.contact_name = 'Name is required';
    }

    if (!formData.contact_email || !/^\S+@\S+\.\S+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Valid email is required';
    }

    if (!formData.contact_phone || !/^\d{9,15}$/.test(formData.contact_phone.replace(/\D/g, ''))) {
      newErrors.contact_phone = 'Valid phone number is required (9-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const bookingData = {
        package_id: pkg.id,
        ...formData,
        contact_phone: formData.contact_phone.replace(/\D/g, ''),
      };

      const response = await bookingAPI.createBooking(bookingData);
      alert('Booking created successfully!');
      router.push('/bookings');
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Please login to make a booking');
        router.push('/login');
      } else {
        alert(error.response?.data?.error || 'Failed to create booking');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = pkg.price * formData.num_travelers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book Your Trip</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              1. Trip Details
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              2. Contact Info
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Package Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{pkg.title}</h3>
            <p className="text-sm text-gray-600">{pkg.destination}</p>
            <p className="text-sm text-gray-600">
              {pkg.duration_days}D/{pkg.duration_nights}N
            </p>
          </div>

          {/* Step 1: Trip Details */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Departure Date"
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                error={errors.departure_date}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="num_travelers"
                  value={formData.num_travelers}
                  onChange={handleChange}
                  min="1"
                  max={pkg.seats_available}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
                    errors.num_travelers
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.num_travelers && (
                  <p className="mt-1 text-sm text-red-600">{errors.num_travelers}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Available seats: {pkg.seats_available}
                </p>
              </div>

              {/* Price Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Price per person:</span>
                  <span className="font-semibold">${pkg.price}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Number of travelers:</span>
                  <span className="font-semibold">{formData.num_travelers}</span>
                </div>
                <div className="border-t border-blue-300 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleNext} fullWidth>
                Continue to Contact Info
              </Button>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                error={errors.contact_name}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                error={errors.contact_email}
                placeholder="john@example.com"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                error={errors.contact_phone}
                placeholder="081234567890"
                helperText="9-15 digits"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any special requirements or requests..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Final Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium">{pkg.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">
                      {new Date(formData.departure_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers:</span>
                    <span className="font-medium">{formData.num_travelers}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total Price:</span>
                    <span className="text-xl font-bold text-blue-600">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="secondary"
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}