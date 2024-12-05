// src/content-script/agoda/index.ts
// import '../styles/index.scss'

console.log('Agoda content script initializing...')

// Create and inject the iframe
const injectIframe = () => {
  const src = chrome.runtime.getURL(
    'src/content-script/agoda/iframe/index.html'
  )
  console.log('Injecting iframe with src:', src)

  const iframe = document.createElement('iframe')
  iframe.className = 'crx-iframe'
  iframe.src = src

  document.body.appendChild(iframe)
  return iframe
}

// Initialize the content script
const init = () => {
  console.log('Initializing Agoda content script')
  const iframe = injectIframe()

  // Wait for iframe to load
  iframe.onload = () => {
    console.log('Iframe loaded')
    // Start observing hotel listings
    observeHotelListings()
  }
}

// Observe hotel listings
const observeHotelListings = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        const hotels = document.querySelectorAll('[data-selenium="hotel-item"]')
        hotels.forEach(processHotelListing)
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Process existing hotels
  const hotels = document.querySelectorAll('[data-selenium="hotel-item"]')
  hotels.forEach(processHotelListing)
}

// Process each hotel listing
const processHotelListing = (hotel: Element) => {
  if (hotel.hasAttribute('data-comparison-added')) return

  const hotelData = {
    name:
      hotel.querySelector('[data-selenium="hotel-name"]')?.textContent || '',
    price: parseFloat(
      hotel.querySelector('[data-selenium="display-price"]')?.textContent || '0'
    ),
    rating: parseFloat(
      hotel.querySelector('[data-testid="rating-container"]')?.textContent ||
        '0'
    ),
    amenities: Array.from(
      hotel.querySelectorAll('[data-element-name="pill-each-item"]')
    ).map((el) => el.textContent || ''),
  }

  // Send data to iframe
  const iframe = document.querySelector('.crx-iframe') as HTMLIFrameElement
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      {
        type: 'UPDATE_COMPARISON',
        hotelData: {
          name: 'Your Hotel',
          averageRate: 150,
          occupancy: 85,
          rating: 8.5,
          reviewCount: 250,
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
        },
        listingData: hotelData,
        comparison: {
          price: {
            difference: 150 - hotelData.price,
            formatted: `${150 - hotelData.price > 0 ? '+' : ''}${(150 - hotelData.price).toFixed(2)}`,
          },
          rating: {
            difference: 8.5 - hotelData.rating,
            formatted: `${8.5 - hotelData.rating > 0 ? '+' : ''}${(8.5 - hotelData.rating).toFixed(1)}`,
          },
          amenities: {
            missing: hotelData.amenities.filter(
              (a) => !['WiFi', 'Pool', 'Spa', 'Restaurant'].includes(a)
            ),
            additional: ['WiFi', 'Pool', 'Spa', 'Restaurant'].filter(
              (a) => !hotelData.amenities.includes(a)
            ),
          },
        },
      },
      '*'
    )
  }

  hotel.setAttribute('data-comparison-added', 'true')
}

// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
