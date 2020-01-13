const severity = require('../models/severity')
const { groupBy } = require('../util')

class Floods {
  constructor (data, national = true) {
    this._floods = data
    const grouped = groupBy(data.floods, 'severity')
    this._groups = severity.map(item => {
      const group = grouped[item.id]
      const count = group ? group.length : 0
      return {
        name: item.id,
        severity: item,
        title: `${count} ${count === 1 ? item.title : item.pluralisedTitle}`,
        floods: group,
        description: item.subTitle
      }
    })

    this._geojson = {
      type: 'FeatureCollection',
      totalFeatures: this._floods.floods.length,
      features: []
    }
    this._geojson.features = this._floods.floods.map(item => {
      return {
        type: 'Feature',
        id: 'flood_warning_alert.' + item.key,
        geometry: item.geometry ? JSON.parse(item.geometry) : null,
        properties: {
          fwa_key: item.key,
          fwa_code: item.code,
          description: item.description,
          severity: item.severity,
          severity_description: item.severitydescription
        }
      }
    })

    this._count = data.floods.length
  }

  get floods () {
    return this._floods.floods
  }

  get timestamp () {
    return this._floods.timestamp
  }

  get groups () {
    return this._groups
  }

  get geojson () {
    return this._geojson
  }
}
module.exports = Floods
