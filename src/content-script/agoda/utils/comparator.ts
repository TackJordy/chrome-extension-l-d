// src/content-scripts/agoda/utils/comparator.ts
import type {
  HotelData,
  ListingData,
  ComparisonData,
} from '../types/agoda.types'

export class Comparator {
  static compare(yourHotel: HotelData, listing: ListingData): ComparisonData {
    return {
      price: this.comparePrice(yourHotel.averageRate, listing.price),
      rating: this.compareRating(yourHotel.rating, listing.rating),
      amenities: this.compareAmenities(yourHotel.amenities, listing.amenities),
    }
  }

  private static comparePrice(yourPrice: number, listingPrice: number) {
    const difference = yourPrice - listingPrice
    return {
      difference,
      formatted: this.formatPriceDifference(difference),
    }
  }

  private static compareRating(yourRating: number, listingRating: number) {
    const difference = yourRating - listingRating
    return {
      difference,
      formatted: this.formatRatingDifference(difference),
    }
  }

  private static compareAmenities(
    yourAmenities: string[],
    listingAmenities: string[]
  ) {
    return {
      missing: listingAmenities.filter((a) => !yourAmenities.includes(a)),
      additional: yourAmenities.filter((a) => !listingAmenities.includes(a)),
    }
  }

  private static formatPriceDifference(difference: number): string {
    return `${difference > 0 ? '+' : ''}${difference.toFixed(2)}`
  }

  private static formatRatingDifference(difference: number): string {
    return `${difference > 0 ? '+' : ''}${difference.toFixed(1)}`
  }
}
