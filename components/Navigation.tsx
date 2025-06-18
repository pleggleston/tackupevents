'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { Button } from './ui/Button'
import { PlusCircle, Heart, User, LogOut, Grid3X3, Zap } from 'lucide-react'

export function Navigation() {
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">The Pole</span>
          </Link>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </Link>
                
                {user ? (
                  <>
                    <Link href="/pole">
                      <Button variant="ghost" size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        The Pole
                      </Button>
                    </Link>
                    
                    <Link href="/saved">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Saved
                      </Button>
                    </Link>
                    
                    <Link href="/upload">
                      <Button size="sm">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
