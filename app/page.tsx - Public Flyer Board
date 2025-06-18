import { createServerClient } from '@/lib/supabase'
import { FlyerGrid } from '@/components/FlyerGrid'
import { FilterBar } from '@/components/FilterBar'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()
  
  // Get current user to determine what content they can see
  const { data: { user } } = await supabase.auth.getUser()
  
  let userAge = null
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('date_of_birth')
      .eq('id', user.id)
      .single()
    
    if (profile) {
      const today = new Date()
      const birthDate = new Date(profile.date_of_birth)
      userAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        userAge--
      }
    }
  }

  // Build query based on filters and user permissions
  let query = supabase
    .from('flyers')
    .select(`
      *,
      categories (*)
    `)
    .eq('is_approved', true)
    .eq('is_active', true)

  // Apply age restrictions
  if (!user || (userAge && userAge < 21)) {
    query = query.eq('is_21_plus', false)
  }

  // Apply filters from search params
  const category = searchParams.category
  const city = searchParams.city
  const dateFrom = searchParams.dateFrom
  const dateTo = searchParams.dateTo

  if (category && category !== 'all') {
    query = query.eq('category_id', parseInt(category as string))
  }

  if (city) {
    query = query.ilike('location_city', `%${city}%`)
  }

  if (dateFrom) {
    query = query.gte('event_date', dateFrom)
  }

  if (dateTo) {
    query = query.lte('event_date', dateTo)
  }

  const { data: flyers, error } = await query
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching flyers:', error)
  }

  // Get categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Get saved flyers for logged-in user
  let savedFlyerIds = new Set<string>()
  if (user && flyers) {
    const { data: savedFlyers } = await supabase
      .from('saved_flyers')
      .select('flyer_id')
      .eq('user_id', user.id)
      .in('flyer_id', flyers.map(f => f.id))
    
    savedFlyerIds = new Set(savedFlyers?.map(sf => sf.flyer_id) || [])
  }

  const flyersWithSavedStatus = flyers?.map(flyer => ({
    ...flyer,
    is_saved: savedFlyerIds.has(flyer.id)
  })) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Community Events & Activities
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover local events, activities, and community happenings in your area. 
          {!user && " Sign up to save events and access the swipe interface."}
        </p>
      </div>

      {/* Filters */}
      <FilterBar 
        categories={categories || []} 
        userCanSeeAdultContent={!user ? false : (userAge ? userAge >= 21 : false)}
      />

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {flyersWithSavedStatus.length} events found
        </p>
      </div>

      {/* Flyer Grid */}
      <FlyerGrid flyers={flyersWithSavedStatus} />
    </div>
  )
}
