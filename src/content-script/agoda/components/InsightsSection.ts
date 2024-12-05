export class InsightsSection {
  static create(insights: string[]): HTMLElement {
    const container = document.createElement('div')
    container.className = 'comparison-insights'

    insights.forEach((insight) => {
      container.appendChild(this.createInsight(insight))
    })

    return container
  }

  private static createInsight(text: string): HTMLElement {
    const insight = document.createElement('div')
    insight.className = 'insight'
    insight.textContent = text
    return insight
  }
}
