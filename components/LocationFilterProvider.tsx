"use client"

import React, { createContext, useContext, useState } from 'react'

type LocationFilterContextType = {
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  selectedFishType: string
  setSelectedFishType: (fish: string) => void
}

const LocationFilterContext = createContext<LocationFilterContextType | undefined>(undefined)

export function LocationFilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedFishType, setSelectedFishType] = useState<string>("")

  return (
    <LocationFilterContext.Provider value={{ selectedLocation, setSelectedLocation, selectedFishType, setSelectedFishType }}>
      {children}
    </LocationFilterContext.Provider>
  )
}

export function useLocationFilter() {
  const context = useContext(LocationFilterContext)
  if (context === undefined) {
    throw new Error('useLocationFilter must be used within a LocationFilterProvider')
  }
  return context
}
