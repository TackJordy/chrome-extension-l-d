import type { ComparisonData, HotelData, MetricDisplay } from '../types/agoda.types'

export class ComparisonPanel {
  static create(comparison: ComparisonData, hotelData: HotelData): HTMLElement {
    const panel = document.createElement('div')
    panel.className = 'hotel-comparison-panel'

    panel.innerHTML = `
      <div class="comparison-header">
        <h4>Compare with ${hotelData.name}</h4>
        <span class="badge">${hotelData.occupancy}% Occupancy</span>
      </div>
      
      <div class="metrics-section">
        ${this.createMetric({
          label: 'Price Difference',
          value: comparison.price.formatted,
          type: comparison.price.difference < 0 ? 'positive' : 'negative',
          trend: comparison.price.difference < 0 ? 'down' : 'up',
          subtext: `${Math.abs(comparison.price.difference).toFixed(2)} ${
            comparison.price.difference < 0 ? 'cheaper' : 'more expensive'
          }`
        })}
        ${this.createMetric({
          label: 'Your Occupancy',
          value: `${hotelData.occupancy}%`,
          type: 'neutral',
          subtext: 'Current occupancy rate'
        })}
        ${this.createMetric({
          label: 'Rating Comparison',
          value: comparison.rating.formatted,
          type: comparison.rating.difference > 0 ? 'positive' : 'negative',
          trend: comparison.rating.difference > 0 ? 'up' : 'down',
          subtext: `Your rating: ${hotelData.rating}/10`
        })}
      </div>`

    //   <div class="amenities-list">
    //     <h5>Amenities Comparison</h5>
    //     ${this.createAmenitiesTags(comparison.amenities)}
    //   </div>

    //   <div class="insights-section">
    //     ${this.createInsights(comparison)}
    //   </div>
    // `

    return panel
  }

  private static createMetric(metric: MetricDisplay): string {
    return `
      <div class="metric ${metric.type}">
        <div class="label">${metric.label}</div>
        <div class="value">
          ${metric.value}
          ${metric.trend ? `<span class="trend ${metric.trend}"></span>` : ''}
        </div>
        ${metric.subtext ? `<div class="subtext">${metric.subtext}</div>` : ''}
      </div>
    `
  }

  private static createAmenitiesTags({
    missing,
    additional,
  }: ComparisonData['amenities']): string {
    const createTags = (amenities: string[], className: string, label: string) =>
      amenities.length ? `
        <div class="amenity-group">
          <span class="group-label">${label}</span>
          ${amenities
            .map(amenity => `<span class="amenity-tag ${className}">${amenity}</span>`)
            .join('')}
        </div>
      ` : ''

    return `
      ${createTags(additional, 'additional', 'Your unique amenities')}
      ${createTags(missing, 'missing', 'Their unique amenities')}
    `
  }

  private static createInsights(comparison: ComparisonData): string {
    const insights = []

    // Price insights
    if (comparison.price.difference < 0) {
      insights.push(`Your rates are more competitive (${Math.abs(comparison.price.difference).toFixed(2)} lower)`)
    } else if (comparison.price.difference > 0) {
      insights.push(`Your rates are ${comparison.price.difference.toFixed(2)} higher - consider adjusting`)
    }

    // Rating insights
    if (comparison.rating.difference > 0) {
      insights.push(`Your rating is ${comparison.rating.difference.toFixed(1)} points higher`)
    } else if (comparison.rating.difference < 0) {
      insights.push(`Your rating is ${Math.abs(comparison.rating.difference).toFixed(1)} points lower`)
    }

    // Amenities insights
    if (comparison.amenities.additional.length > 0) {
      insights.push(
        `You offer ${comparison.amenities.additional.length} unique amenities`
      )
    }
    if (comparison.amenities.missing.length > 0) {
      insights.push(
        `They offer ${comparison.amenities.missing.length} amenities you don't have`
      )
    }

    return insights
      .map(insight => `<div class="insight-item">${insight}</div>`)
      .join('')
  }
}
