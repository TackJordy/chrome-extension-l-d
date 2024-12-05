import type { ComparisonData, HotelData } from '../types/agoda.types'
import { MetricsDisplay } from './MetricsDisplay'
import { InsightsSection } from './InsightsSection'

export class ComparisonPanel {
  static create(comparison: ComparisonData, hotelData: HotelData): HTMLElement {
    const panel = document.createElement('div')
    panel.className = 'hotel-comparison-panel'

    panel.appendChild(this.createHeader())
    panel.appendChild(this.createMetrics(comparison, hotelData))
    panel.appendChild(this.createInsights(comparison))

    return panel
  }

  private static createHeader(): HTMLElement {
    const header = document.createElement('div')
    header.className = 'comparison-header'
    header.innerHTML = '<h4>Comparison with Your Hotel</h4>'
    return header
  }

  private static createMetrics(
    comparison: ComparisonData,
    hotelData: HotelData
  ): HTMLElement {
    const metrics = [
      {
        label: 'Price Difference',
        value: comparison.price.formatted,
        type: comparison.price.difference < 0 ? 'positive' : 'negative',
      },
      {
        label: 'Your Occupancy',
        value: `${hotelData.occupancy}%`,
        type: 'neutral',
      },
      {
        label: 'Rating Comparison',
        value: comparison.rating.formatted,
        type: comparison.rating.difference > 0 ? 'positive' : 'negative',
      },
    ]

    return MetricsDisplay.create(metrics)
  }

  private static createInsights(comparison: ComparisonData): HTMLElement {
    const insights = this.generateInsights(comparison)
    return InsightsSection.create(insights)
  }

  private static generateInsights(comparison: ComparisonData): string[] {
    const insights = []

    if (comparison.price.difference < 0) {
      insights.push('Your rates are more competitive')
    }
    if (comparison.rating.difference > 0) {
      insights.push('Your rating is higher')
    }
    if (comparison.amenities.additional.length > 0) {
      insights.push(
        `You offer ${comparison.amenities.additional.length} unique amenities`
      )
    }

    return insights
  }
}
