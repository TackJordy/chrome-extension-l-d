import type { MetricDisplay } from '../types/agoda.types'

export class MetricsDisplay {
  static create(metrics: MetricDisplay[]): HTMLElement {
    const container = document.createElement('div')
    container.className = 'comparison-metrics'

    metrics.forEach((metric) => {
      container.appendChild(this.createMetric(metric))
    })

    return container
  }

  private static createMetric({
    label,
    value,
    type,
  }: MetricDisplay): HTMLElement {
    const metric = document.createElement('div')
    metric.className = `metric ${type}`
    metric.innerHTML = `
      <span class="label">${label}</span>
      <span class="value">${value}</span>
    `
    return metric
  }
}
