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
    // Debug: Log all elements with data-selenium attribute
    console.log(
      'All data-selenium elements:',
      Array.from(document.querySelectorAll('[data-selenium]')).map((el) => ({
        attr: el.getAttribute('data-selenium'),
        element: el,
      }))
    )

    // Debug: Try different selector variations
    const selectors = [
      '[data-selenium="hotel-item"]',
      'div[data-selenium="hotel-item"]',
      '*[data-selenium="hotel-item"]',
    ]

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      console.log(`Selector "${selector}" found:`, {
        count: elements.length,
        elements: Array.from(elements),
      })
    })

    const listings = document.querySelectorAll(AGODA_SELECTORS.hotelCard)
    console.log('Found listings:', {
      selector: AGODA_SELECTORS.hotelCard,
      count: listings.length,
      listings: Array.from(listings),
    })

    listings.forEach((listing) => {
      if (!listing.hasAttribute('data-enhanced')) {
        console.log('Processing listing:', {
          element: listing,
          attributes: this.getElementAttributes(listing),
          html: `${listing.outerHTML.substring(0, 200)}...`, // First 200 chars
        })
        this.enhanceListingWithComparison(listing)
        listing.setAttribute('data-enhanced', 'true')
      }
    })
  }

  private getElementAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {}
    Array.from(element.attributes).forEach((attr) => {
      attrs[attr.name] = attr.value
    })
    return attrs
  }

  private enhanceListingWithComparison(listing: Element) {
    if (!this.yourHotelData) return

    const listingData = DataExtractor.extractListingData(listing)
    const comparison = Comparator.compare(this.yourHotelData, listingData)
    const panel = ComparisonPanel.create(comparison, this.yourHotelData)

    listing.appendChild(panel)
  }
}
