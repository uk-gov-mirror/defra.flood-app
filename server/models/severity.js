const severity = [{
  id: 1,
  title: 'Severe flood warning',
  pluralisedTitle: 'Severe flood warnings',
  hash: 'severe',
  pluralisedHash: 'severe',
  subTitle: 'Severe flooding',
  tagline: 'Danger to life',
  isActive: true
}, {
  id: 2,
  title: 'Flood warning',
  pluralisedTitle: 'Flood warnings',
  hash: 'warning',
  pluralisedHash: 'warnings',
  subTitle: 'Flooding is expected',
  tagline: 'Take action',
  isActive: true
}, {
  id: 3,
  title: 'Flood alert',
  pluralisedTitle: 'Flood alerts',
  hash: 'alert',
  pluralisedHash: 'alerts',
  subTitle: 'Flooding is possible',
  tagline: 'Be prepared',
  isActive: true
}, {
  id: 4,
  title: 'Flood warning removed',
  pluralisedTitle: 'Flood warnings removed',
  hash: 'removed',
  pluralisedHash: 'removed',
  subTitle: 'within the last 24 hours',
  tagline: '',
  isActive: false
}]

module.exports = severity
