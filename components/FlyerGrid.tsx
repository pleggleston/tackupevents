'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import type { Flyer } from '@/lib/types'
import { FlyerCard } from './FlyerCard'

interface FlyerGridProps {
  flyers: Flyer[]
}

export function FlyerGrid({ flyers: initialFlyers }: FlyerGridProps) {
  const [flyers, setFlyers] = useState(initialFlyers)
  const { user } = useAuth()
  const supabase = createClient()

  const handleSave = async (flyerId: string) => {
    if (!user) return

    try {
      await supabase
        .from('saved_flyers')
        .insert({
          user_id: user.id,
          flyer_id: flyerId
        })

      // Update local state
      setFlyers(prev => prev.map(flyer => 
        flyer.id === flyerId 
          ? { ...flyer, is_saved: true }
          : flyer
      ))
    } catch (error) {
      console.error('Error saving flyer:', error)
    }
  }

  const handleUnsave = async (flyerId: string) => {
    if (!user) return

    try {
      await supabase
        .from('saved_flyers')
        .delete()
        .eq('user_id', user.id)
        .eq('flyer_id', flyerId)

      // Update local state
      setFlyers(prev => prev.map(flyer => 
        flyer.id === flyerId 
          ? { ...flyer, is_saved: false }
          : flyer
      ))
    } catch (error) {
      console.error('Error unsaving flyer:', error)
    }
  }

  if (flyers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later for new events.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flyers.map((flyer) => (
        <FlyerCard
          key={flyer.id}
          flyer={flyer}
          variant="grid"
          onSave={handleSave}
          onUnsave={handleUnsave}
        />
      ))}
    </div>
  )
}
