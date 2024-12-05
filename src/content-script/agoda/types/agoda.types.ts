// src/content-scripts/agoda/types/agoda.types.ts
export interface HotelData {
  name: string
  averageRate: number
  occupancy: number
  rating: number
  reviewCount: number
  amenities: string[]
}

export interface ListingData {
  name: string
  price: number
  rating: number
  amenities: string[]
}

export interface ComparisonData {
  price: {
    difference: number
    formatted: string
  }
  rating: {
    difference: number
    formatted: string
  }
  amenities: {
    missing: string[]
    additional: string[]
  }
}

export interface MetricDisplay {
  label: string
  value: string
  type: 'positive' | 'negative' | 'neutral'
}
