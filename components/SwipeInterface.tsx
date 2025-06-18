'use client'

import { useState, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import type { Flyer } from '@/lib/types'
import { FlyerCard } from './FlyerCard'
import { Button } from './ui/Button'
import { Heart, X, RotateCcw } from 'lucide-react'

interface SwipeInterfaceProps {
  initialFlyers?: Flyer[]
}

export function SwipeInterface({ initialFlyers = [] }: SwipeInterfaceProps) {
  const [flyers, setFlyers] = useState<Flyer[]>(initialFlyers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastDirection, setLastDirection] = useState<string>('')
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (initialFlyers.length === 0) {
      loadFlyers()
    }
  }, [])

  const loadFlyers = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('flyers')
        .select(`
          *,
          categories (*)
        `)
        .eq('is_approved', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      
      // Check which flyers are already saved
      const { data: savedFlyers } = await supabase
        .from('saved_flyers')
        .select('flyer_id')
        .eq('user_id', user.id)

      const savedFlyerIds = new Set(savedFlyers?.map(sf => sf.flyer_id) || [])
      
      const flyersWithSavedStatus = data?.map(flyer => ({
        ...flyer,
        is_saved: savedFlyerIds.has(flyer.id)
      })) || []

      setFlyers(flyersWithSavedStatus)
      setCurrentIndex(0)
    } catch (error) {
      console.error('Error loading flyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: string, flyerId: string) => {
    setLastDirection(direction)
    
    if (direction === 'right' && user) {
      // Save the flyer
      try {
        await supabase
          .from('saved_flyers')
          .insert({
            user_id: user.id,
            flyer_id: flyerId
          })
      } catch (error) {
        console.error('Error saving flyer:', error)
      }
    }
    
    // Move to next flyer
    setCurrentIndex(prev => prev + 1)
    
    // Load more flyers if we're near the end
    if (currentIndex >= flyers.length - 3) {
      loadMoreFlyers()
    }
  }

  const loadMoreFlyers = async () => {
    if (!user || loading) return
    
    try {
      const { data, error } = await supabase
        .from('flyers')
        .select(`
          *,
          categories (*)
        `)
        .eq('is_approved', true)
        .eq('is_active', true)
        .lt('created_at', flyers[flyers.length - 1]?.created_at)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      if (data && data.length > 0) {
        const { data: savedFlyers } = await supabase
          .from('saved_flyers')
          .select('flyer_id')
          .eq('user_id', user.id)

        const savedFlyerIds = new Set(savedFlyers?.map(sf => sf.flyer_id) || [])
        
        const newFlyers = data.map(flyer => ({
          ...flyer,
          is_saved: savedFlyerIds.has(flyer.id)
        }))
        
        setFlyers(prev => [...prev, ...newFlyers])
      }
    } catch (error) {
      console.error('Error loading more flyers:', error)
    }
  }

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= flyers.length) return
    
    const currentFlyer = flyers[currentIndex]
    handleSwipe(direction, currentFlyer.id)
  }

  const resetStack = () => {
    setCurrentIndex(0)
    setLastDirection('')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to swipe</h2>
          <p className="text-gray-600">Create an account to use The Pole swipe interface</p>
        </div>
      </div>
    )
  }

  if (loading && flyers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flyers...</p>
        </div>
      </div>
    )
  }

  if (currentIndex >= flyers.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">That's all for now!</h2>
          <p className="text-gray-600 mb-4">Check back later for more events</p>
          <Button onClick={resetStack}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Swipe Cards Container */}
      <div className="relative h-[600px] mb-6">
        {flyers.slice(currentIndex, currentIndex + 3).map((flyer, index) => (
          <TinderCard
            key={flyer.id}
            onSwipe={(direction) => handleSwipe(direction, flyer.id)}
            preventSwipe={['up', 'down']}
            className="absolute inset-0"
          >
            <div 
              className="w-full h-full"
              style={{
                zIndex: flyers.length - index,
                transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              }}
            >
              <FlyerCard flyer={flyer} variant="swipe" />
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mb-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleButtonSwipe('left')}
          className="rounded-full w-16 h-16 p-0"
        >
          <X className="w-8 h-8 text-red-500" />
        </Button>
        
        <Button
          size="lg"
          onClick={() => handleButtonSwipe('right')}
          className="rounded-full w-16 h-16 p-0 bg-green-500 hover:bg-green-600"
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>

      {/* Last Action Feedback */}
      {lastDirection && (
        <div className="text-center text-sm text-gray-500">
          {lastDirection === 'right' ? '💚 Saved!' : '👋 Passed'}
        </div>
      )}
    </div>
  )
}
