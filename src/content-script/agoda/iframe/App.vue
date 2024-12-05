// src/content-script/agoda/iframe/App.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { HotelData, ListingData, ComparisonData } from '../types/agoda.types'

const hotelData = ref<HotelData | null>(null)
const listingData = ref<ListingData | null>(null)
const comparison = ref<ComparisonData | null>(null)

// Listen for messages from the parent window
onMounted(() => {
  console.log('Iframe App mounted')
  window.addEventListener('message', (event) => {
    console.log('Received message:', event.data)
    if (event.data.type === 'UPDATE_COMPARISON') {
      hotelData.value = event.data.hotelData
      listingData.value = event.data.listingData
      comparison.value = event.data.comparison
    }
  })
})
</script>

<template>
  <div class="iframe-app">
    <div class="debug-info">
      Iframe Loaded
      <div class="timestamp">{{ new Date().toLocaleTimeString() }}</div>
    </div>
    
    <div v-if="hotelData && listingData && comparison" class="hotel-comparison-panel">
      <div class="comparison-header">
        <h4>Comparison with {{ hotelData.name }}</h4>
      </div>
      
      <div class="comparison-metrics">
        <div 
          class="metric" 
          :class="{ 
            'positive': comparison.price.difference < 0,
            'negative': comparison.price.difference > 0 
          }"
        >
          <span class="label">Price Difference:</span>
          <span class="value">{{ comparison.price.formatted }}</span>
        </div>
        
        <div class="metric">
          <span class="label">Your Occupancy:</span>
          <span class="value">{{ hotelData.occupancy }}%</span>
        </div>
        
        <div 
          class="metric"
          :class="{ 
            'positive': comparison.rating.difference > 0,
            'negative': comparison.rating.difference < 0 
          }"
        >
          <span class="label">Rating Comparison:</span>
          <span class="value">{{ comparison.rating.formatted }}</span>
        </div>
      </div>

      <div v-if="comparison.amenities" class="comparison-insights">
        <div v-if="comparison.amenities.additional.length > 0" class="insight">
          You offer {{ comparison.amenities.additional.length }} unique amenities
        </div>
        <div v-if="comparison.price.difference < 0" class="insight">
          Your rates are more competitive
        </div>
        <div v-if="comparison.rating.difference > 0" class="insight">
          Your rating is higher
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iframe-app {
  min-height: 100vh;
  background: rgba(0, 128, 255, 0.1); /* Light blue background */
  padding: 1rem;
  box-sizing: border-box;
}

.debug-info {
  background: #2563eb;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.timestamp {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}
</style>