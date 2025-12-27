import Link from 'next/link';
import { MapPin, Calendar, Users, Star } from 'lucide-react';

interface PackageCardProps {
  id: number;
  title: string;
  slug: string;
  destination: string;
  description?: string;
  image_url?: string;
  price: number;
  duration_days: number;
  duration_nights: number;
  seats_available: number;
  featured: boolean;
}

export default function PackageCard({
  title,
  slug,
  destination,
  description,
  image_url,
  price,
  duration_days,
  duration_nights,
  seats_available,
  featured
}: PackageCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop';
  
  return (
    <Link href={`/packages/${slug}`}>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={image_url || defaultImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star size={14} fill="currentColor" />
              Featured
            </div>
          )}
          {seats_available <= 3 && seats_available > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Only {seats_available} seats left!
            </div>
          )}
          {seats_available === 0 && (
            <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Sold Out
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Destination */}
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
            <MapPin size={16} />
            <span className="font-medium">{destination}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{duration_days}D/{duration_nights}N</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{seats_available} seats</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-2xl font-bold text-blue-600">
                ${price.toLocaleString()}
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}