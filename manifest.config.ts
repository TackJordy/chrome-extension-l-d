import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { version, name, description, displayName } = packageJson
// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default {
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : displayName || name,
  description,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  // key: '',
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'src/assets/logo.png',
      48: 'src/assets/logo.png',
      128: 'src/assets/logo.png',
    },
  },
  background: {
    service_worker: 'src/background/badge.ts',
    type: 'module',
  },
  content_scripts: [
    {
      all_frames: true,
      js: ['src/content-script/index.ts'],
      matches: ['*://*/*'],
      run_at: 'document_end',
    },
    {
      matches: ['*://*.agoda.com/*'],
      js: ['src/content-script/agoda/index.ts'],
      css: ['src/content-script/agoda/styles/comparison-panel.css'],
      run_at: 'document_end',
    },
  ],
  // Full options page
  options_page: 'src/options/index.html',
  // Embedded options page
  // options_ui: {
  //   page: 'src/options/index.html',
  // },
  offline_enabled: true,
  // host_permissions: [],
  permissions: ['storage', 'tabs', 'background', 'storage', 'notifications'],
  host_permissions: [
    'https://your-api-endpoint/*', // Replace with your actual API domain
  ],
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/index.ts'],
    },
    {
      matches: ['*://*/*'],
      resources: ['src/content-script/iframe/index.html'],
    },
    {
      resources: ['src/assets/*'],
      matches: ['<all_urls>'],
    },
    {
      resources: ['content-scripts/agoda/styles/*'],
      matches: ['*://*.agoda.com/*'],
    },
    {
      matches: ['*://*/*'],
      resources: [
        'src/content-script/agoda/iframe/index.html',
        'src/content-script/agoda/styles/*',
      ],
    },
  ],
  icons: {
    16: 'src/assets/logo.png',
    24: 'src/assets/logo.png',
    32: 'src/assets/logo.png',
    48: 'src/assets/logo.png',
    128: 'src/assets/logo.png',
  },
} as ManifestV3Export
