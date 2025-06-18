'use client'

import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { MapPin, Clock, Heart, Calendar, ExternalLink } from 'lucide-react'
import type { Flyer, ContactInfo } from '@/lib/types'
import { Button } from './ui/Button'
import { generateICSFile } from '@/lib/utils'

interface FlyerCardProps {
  flyer: Flyer
  variant?: 'grid' | 'swipe' | 'saved'
  onSave?: (flyerId: string) => void
  onUnsave?: (flyerId: string) => void
}

export function FlyerCard({ flyer, variant = 'grid', onSave, onUnsave }: FlyerCardProps) {
  const contactInfo = flyer.contact_info as ContactInfo | null

  const handleSaveToggle = () => {
    if (flyer.is_saved) {
      onUnsave?.(flyer.id)
    } else {
      onSave?.(flyer.id)
    }
  }

  const handleAddToCalendar = () => {
    const icsContent = generateICSFile(flyer)
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${flyer.title}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const cardClasses = {
    grid: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow',
    swipe: 'bg-white rounded-2xl shadow-xl overflow-hidden h-full',
    saved: 'bg-white rounded-lg shadow-md overflow-hidden'
  }

  return (
    <div className={cardClasses[variant]}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <Image
          src={flyer.image_url}
          alt={flyer.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            flyer.is_21_plus 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {flyer.categories.name}
            {flyer.is_21_plus && ' (21+)'}
          </span>
        </div>

        {/* Save Button - only show in grid/saved variants */}
        {(variant === 'grid' || variant === 'saved') && (
          <button
            onClick={handleSaveToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${
                flyer.is_saved ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {flyer.title}
        </h3>
        
        {flyer.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {flyer.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {flyer.event_date && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {format(parseISO(flyer.event_date), 'MMM d, yyyy')}
                {flyer.event_time && ` at ${flyer.event_time}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {flyer.location_address 
                ? `${flyer.location_address}, ${flyer.location_city}, ${flyer.location_state}`
                : `${flyer.location_city}, ${flyer.location_state}`
              }
            </span>
          </div>
        </div>

        {/* Contact Info */}
        {contactInfo && (
          <div className="border-t pt-3 mb-4">
            <div className="space-y-1">
              {contactInfo.email && (
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm text-blue-600 hover:underline block"
                >
                  {contactInfo.email}
                </a>
              )}
              {contactInfo.phone && (
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-sm text-blue-600 hover:underline block"
                >
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo.website && (
                <a 
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {variant !== 'swipe' && (
          <div className="flex space-x-2">
            {flyer.event_date && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCalendar}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
