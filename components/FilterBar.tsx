'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/Button'
import type { Category } from '@/lib/types'

interface FilterBarProps {
  categories: Category[]
  userCanSeeAdultContent: boolean
}

export function FilterBar({ categories, userCanSeeAdultContent }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState('all')
  const [city, setCity] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showAdult, setShowAdult] = useState(userCanSeeAdultContent)

  useEffect(() => {
    setCategory(searchParams.get('category') ?? 'all')
    setCity(searchParams.get('city') ?? '')
    setDateFrom(searchParams.get('dateFrom') ?? '')
    setDateTo(searchParams.get('dateTo') ?? '')
    if (userCanSeeAdultContent) {
      setShowAdult(searchParams.get('adult') === '1')
    }
  }, [searchParams, userCanSeeAdultContent])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category && category !== 'all') params.set('category', category)
    if (city) params.set('city', city)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (userCanSeeAdultContent && showAdult) params.set('adult', '1')

    const query = params.toString()
    router.push(query ? `/?${query}` : '/')
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-gray-300 rounded-md h-10"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-gray-300 rounded-md h-10 px-2"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border-gray-300 rounded-md h-10 px-2"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border-gray-300 rounded-md h-10 px-2"
        />
        <Button onClick={applyFilters}>Apply</Button>
      </div>
      {userCanSeeAdultContent && (
        <div className="flex items-center mt-3">
          <input
            id="adult"
            type="checkbox"
            className="mr-2"
            checked={showAdult}
            onChange={(e) => setShowAdult(e.target.checked)}
          />
          <label htmlFor="adult" className="text-sm">Show 21+ events</label>
        </div>
      )}
    </div>
  )
}
