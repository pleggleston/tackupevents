import { createServerClient } from '@/lib/supabase'
import { SwipeInterface } from '@/components/SwipeInterface'
import { redirect } from 'next/navigation'

export default async function PolePage() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirectTo=/pole')
  }

  // Get initial flyers for the swipe interface
  const { data: flyers } = await supabase
    .from('flyers')
    .select(`
      *,
      categories (*)
    `)
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10)

  // Check which flyers are already saved
  const { data: savedFlyers } = await supabase
    .from('saved_flyers')
    .select('flyer_id')
    .eq('user_id', user.id)

  const savedFlyerIds = new Set(savedFlyers?.map(sf => sf.flyer_id) || [])
  
  const flyersWithSavedStatus = flyers?.map(flyer => ({
    ...flyer,
    is_saved: savedFlyerIds.has(flyer.id)
  })) || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Pole
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Swipe through local events and activities. Swipe right to save events you're interested in, 
          or swipe left to pass. Just like finding events on a telephone pole, but digital!
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-blue-900 mb-2">How it works:</h2>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Swipe right (or tap 💚) to save events you're interested in</li>
          <li>• Swipe left (or tap ❌) to pass on events</li>
          <li>• Saved events appear in your "Saved" section</li>
          <li>• Add saved events directly to your calendar</li>
        </ul>
      </div>

      {/* Swipe Interface */}
      <SwipeInterface initialFlyers={flyersWithSavedStatus} />
    </div>
  )
}
