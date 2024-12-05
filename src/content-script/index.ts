import './index.scss'
// src/content-script/agoda/index.ts
import './styles/index.css'
import { AgodaEnhancer } from './agoda/main'


console.log('Content script initializing...')
const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  document.body?.append(iframe)
}

// Initialize when the page loads
window.addEventListener('load', () => {
  console.log('Window loaded, initializing AgodaEnhancer')
  new AgodaEnhancer()
})

// Also initialize immediately in case the page is already loaded
if (document.readyState === 'complete') {
  console.log('Page already loaded, initializing AgodaEnhancer')
  new AgodaEnhancer()
}


self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
