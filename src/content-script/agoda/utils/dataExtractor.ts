import { AGODA_SELECTORS } from '../constants/selectors'
import type { ListingData } from '../types/agoda.types'

export class DataExtractor {
  static extractListingData(listing: Element): ListingData {
    console.log('Extracting data from listing:', listing)

    const data = {
      name: this.extractText(listing, AGODA_SELECTORS.hotelName),
      price: this.extractPrice(listing),
      rating: this.extractRating(listing),
      reviewCount: this.extractReviewCount(listing),
      amenities: this.extractAmenities(listing),
      location: this.extractText(listing, AGODA_SELECTORS.location),
    }

    console.log('Extracted data:', data)
    return data
  }

  private static extractText(element: Element, selector: string): string {
    const found = element.querySelector(selector)
    const text = found?.textContent?.trim() || ''
    console.log(`Extracting text for "${selector}":`, { found: !!found, text })
    return text
  }

  private static extractPrice(element: Element): number {
    const priceElement = element.querySelector(AGODA_SELECTORS.price)
    const priceText = priceElement?.textContent?.trim() || '0'

    // Remove currency symbols and commas, keep numbers and decimal points
    const numericText = priceText.replace(/[^0-9.]/g, '')
    const price = parseFloat(numericText) || 0

    console.log('Extracted price:', {
      element: priceElement,
      text: priceText,
      numeric: numericText,
      final: price,
    })

    return price
  }

  private static extractRating(element: Element): number {
    const ratingElement = element.querySelector(AGODA_SELECTORS.rating)
    const ratingText = ratingElement?.textContent?.trim() || ''

    // Extract number from formats like "8.5", "8.5/10", "Rating 8.5"
    const match = ratingText.match(/(\d+\.?\d*)/)
    const rating = match ? parseFloat(match[1]) : 0

    console.log('Extracted rating:', {
      element: ratingElement,
      text: ratingText,
      match,
      final: rating,
    })

    return rating
  }

  private static extractReviewCount(element: Element): number {
    const reviewElement = element.querySelector(AGODA_SELECTORS.reviewCount)
    const reviewText = reviewElement?.textContent?.trim() || ''

    // Extract number from formats like "1,234", "(1234 reviews)", "1234"
    const match = reviewText.match(/(\d+[,\d]*)/)
    const count = match ? parseInt(match[1].replace(/,/g, '')) : 0

    console.log('Extracted review count:', {
      element: reviewElement,
      text: reviewText,
      match,
      final: count,
    })

    return count
  }

  private static extractAmenities(element: Element): string[] {
    const amenityElements = element.querySelectorAll(AGODA_SELECTORS.amenities)
    const amenities = Array.from(amenityElements)
      .map((el) => el.textContent?.trim() || '')
      .filter(Boolean)

    console.log('Extracted amenities:', {
      elements: amenityElements.length,
      amenities,
    })

    return amenities
  }
}
