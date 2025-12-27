'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Plus, Trash2 } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface PackageFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function PackageForm({ initialData, onSubmit, isLoading }: PackageFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    price: initialData?.price || '',
    duration_days: initialData?.duration_days || '',
    duration_nights: initialData?.duration_nights || '',
    departure_days: initialData?.departure_days || '',
    seats_total: initialData?.seats_total || '',
    featured: initialData?.featured || false,
    active: initialData?.active !== undefined ? initialData.active : true,
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(initialData?.itinerary || []);
  const [includes, setIncludes] = useState<string[]>(initialData?.includes || ['']);
  const [excludes, setExcludes] = useState<string[]>(initialData?.excludes || ['']);
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || ['']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      duration_days: parseInt(formData.duration_days),
      duration_nights: parseInt(formData.duration_nights),
      seats_total: parseInt(formData.seats_total),
      itinerary: itinerary.filter((day) => day.title && day.description),
      includes: includes.filter((item) => item.trim()),
      excludes: excludes.filter((item) => item.trim()),
      highlights: highlights.filter((item) => item.trim()),
    };

    await onSubmit(data);
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const updateItinerary = (index: number, field: string, value: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItinerary = (index: number) => {
    setItinerary(itinerary.filter((_: ItineraryDay, i: number) => i !== index));
  };

  const addArrayItem = (setter: Function, arr: string[]) => {
    setter([...arr, '']);
  };

  const updateArrayItem = (setter: Function, arr: string[], index: number, value: string) => {
    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const removeArrayItem = (setter: Function, arr: string[], index: number) => {
    setter(arr.filter((_: string, i: number) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Package Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Bali Paradise 5D4N"
              required
            />
          </div>
          <Input
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Bali, Indonesia"
            required
          />
          <Input
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe the tour package..."
            />
          </div>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Pricing & Duration</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Price (USD)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="999"
            required
          />
          <Input
            label="Duration (Days)"
            type="number"
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            placeholder="5"
            required
          />
          <Input
            label="Duration (Nights)"
            type="number"
            name="duration_nights"
            value={formData.duration_nights}
            onChange={handleChange}
            placeholder="4"
          />
          <Input
            label="Total Seats"
            type="number"
            name="seats_total"
            value={formData.seats_total}
            onChange={handleChange}
            placeholder="20"
            required
          />
          <Input
            label="Departure Days"
            name="departure_days"
            value={formData.departure_days}
            onChange={handleChange}
            placeholder="Mon, Wed, Fri"
          />
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <button
            type="button"
            onClick={() => addArrayItem(setHighlights, highlights)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateArrayItem(setHighlights, highlights, index, e.target.value)}
                placeholder="e.g., Visit Tanah Lot Temple"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(setHighlights, highlights, index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Includes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">What's Included</h2>
          <button
            type="button"
            onClick={() => addArrayItem(setIncludes, includes)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {includes.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayItem(setIncludes, includes, index, e.target.value)}
                placeholder="e.g., Hotel accommodation"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(setIncludes, includes, index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Excludes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">What's Not Included</h2>
          <button
            type="button"
            onClick={() => addArrayItem(setExcludes, excludes)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {excludes.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayItem(setExcludes, excludes, index, e.target.value)}
                placeholder="e.g., Flight tickets"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(setExcludes, excludes, index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-gray-700">Featured package (show on homepage)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-gray-700">Active (visible to customers)</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Package' : 'Create Package'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}