import { AGODA_SELECTORS } from '../constants/selectors'
import type { ListingData } from '../types/agoda.types'

export class DataExtractor {
  static extractListingData(listing: Element): ListingData {
    return {
      name: this.extractText(listing, AGODA_SELECTORS.hotelName),
      price: this.extractPrice(listing),
      rating: this.extractRating(listing),
      amenities: this.extractAmenities(listing),
    }
  }

  private static extractText(element: Element, selector: string): string {
    return element.querySelector(selector)?.textContent?.trim() || ''
  }

  private static extractPrice(element: Element): number {
    const priceText = this.extractText(element, AGODA_SELECTORS.price)
    return this.parsePrice(priceText)
  }

  private static extractRating(element: Element): number {
    const ratingText = this.extractText(element, AGODA_SELECTORS.rating)
    return parseFloat(ratingText) || 0
  }

  private static extractAmenities(element: Element): string[] {
    const amenitiesElements = element.querySelectorAll(
      AGODA_SELECTORS.amenities
    )
    return Array.from(amenitiesElements).map(
      (el) => el.textContent?.trim() || ''
    )
  }

  private static parsePrice(priceText: string): number {
    return parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0
  }
}
