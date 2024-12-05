// src/content-script/agoda/index.ts
import { AgodaEnhancer } from './main'

console.log('Agoda content script initializing...')

// Initialize the hotel comparison functionality
new AgodaEnhancer()

// Error handling
self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
