// src/content-scripts/agoda/main.ts
import { DataExtractor } from './utils/dataExtractor'
import { Comparator } from './utils/comparator'
import { ComparisonPanel } from './components/ComparisonPanel'
import { AGODA_SELECTORS } from './constants/selectors'
import type { HotelData } from './types/agoda.types'

export class AgodaEnhancer {
  private observer: MutationObserver | null = null
  private yourHotelData: HotelData | null = null

  constructor() {
    console.log('AgodaEnhancer initializing...')
    this.init()
  }

  private async init() {
    try {
      await this.loadYourHotelData()
      this.initObserver()
      // Initial scan for existing listings
      this.processNewListings()
    } catch (error) {
      console.error('Failed to initialize AgodaEnhancer:', error)
    }
  }

  private async loadYourHotelData(): Promise<void> {
    // Temporary mock data until API is ready
    this.yourHotelData = {
      name: 'Your Hotel',
      averageRate: 150,
      occupancy: 85,
      rating: 8.5,
      reviewCount: 250,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    }
  }

  private initObserver() {
    console.log('Initializing observer...')
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.processNewListings()
        }
      })
    })

    // Observe the entire document body for hotel listings
    const targetNode = document.body
    if (targetNode) {
      this.observer.observe(targetNode, {
        childList: true,
        subtree: true,
      })
      console.log('Observer attached to document body')
    }
  }

  private processNewListings() {
    console.log('Processing new listings...')
    const listings = document.querySelectorAll(AGODA_SELECTORS.hotelCard)
    console.log(`Found ${listings.length} listings`)

    listings.forEach((listing) => {
      if (!listing.hasAttribute('data-enhanced')) {
        this.enhanceListingWithComparison(listing)
        listing.setAttribute('data-enhanced', 'true')
      }
    })
  }

  private enhanceListingWithComparison(listing: Element) {
    if (!this.yourHotelData) return

    const listingData = DataExtractor.extractListingData(listing)
    const comparison = Comparator.compare(this.yourHotelData, listingData)
    const panel = ComparisonPanel.create(comparison, this.yourHotelData)

    listing.appendChild(panel)
  }
}
