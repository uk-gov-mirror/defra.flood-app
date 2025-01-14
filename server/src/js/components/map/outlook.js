'use strict'
// This file represents the 5 day outlook used on the national page.
// It uses the MapContainer
// TODO: needs refactoring into layers and styles
// ALSO need to fix the functionality, I don't think the tickets have been developed as of 31/01/2020
import { View } from 'ol'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { defaults as defaultInteractions } from 'ol/interaction'
import { GeoJSON } from 'ol/format'
import { Style, Fill, Stroke } from 'ol/style'
import { unByKey } from 'ol/Observable'
import { Control } from 'ol/control'

const { addOrUpdateParameter, getParameterByName, forEach } = window.flood.utils
const maps = window.flood.maps
const { setExtentFromLonLat, getLonLatFromExtent } = window.flood.maps
const MapContainer = maps.MapContainer

function OutlookMap (mapId, options) {
  // State
  const state = {
    visibleRiskLevels: [1, 2, 3, 4],
    day: 1
  }

  // View
  const view = new View({
    zoom: 6,
    minZoom: 6,
    maxZoom: 7,
    center: maps.center,
    extent: maps.extentLarge
  })

  // Fill patterns
  const pattern = (style) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 8 * dpr
    canvas.height = 8 * dpr
    ctx.scale(dpr, dpr)
    switch (style) {
      case 'high':
        ctx.fillStyle = '#D4351C'
        ctx.fillRect(0, 0, 8, 8)
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.moveTo(0, 3.3)
        ctx.lineTo(4.7, 8)
        ctx.lineTo(3.3, 8)
        ctx.lineTo(0, 4.7)
        ctx.closePath()
        ctx.moveTo(3.3, 0)
        ctx.lineTo(4.7, 0)
        ctx.lineTo(8, 3.3)
        ctx.lineTo(8, 4.7)
        ctx.closePath()
        ctx.fill()
        break
      case 'medium':
        ctx.fillStyle = '#F47738'
        ctx.fillRect(0, 0, 8, 8)
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.moveTo(3.3, 0)
        ctx.lineTo(4.7, 0)
        ctx.lineTo(0, 4.7)
        ctx.lineTo(0, 3.3)
        ctx.closePath()
        ctx.moveTo(3.3, 8)
        ctx.lineTo(4.7, 8)
        ctx.lineTo(8, 4.7)
        ctx.lineTo(8, 3.3)
        ctx.closePath()
        ctx.moveTo(4.7, 0)
        ctx.lineTo(8, 3.3)
        ctx.lineTo(7.3, 4)
        ctx.lineTo(4, 0.7)
        ctx.closePath()
        ctx.moveTo(0, 4.7)
        ctx.lineTo(3.3, 8)
        ctx.lineTo(4, 7.3)
        ctx.lineTo(0.7, 4)
        ctx.closePath()
        ctx.fill()
        break
      case 'low':
        ctx.fillStyle = '#ffdd00'
        ctx.fillRect(0, 0, 8, 8)
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.moveTo(0, 3.3)
        ctx.lineTo(0, 4.7)
        ctx.lineTo(4.7, 0)
        ctx.lineTo(3.3, 0)
        ctx.closePath()
        ctx.moveTo(3.3, 8)
        ctx.lineTo(4.7, 8)
        ctx.lineTo(8, 4.7)
        ctx.lineTo(8, 3.3)
        ctx.closePath()
        ctx.fill()
        break
      case 'veryLow':
        ctx.fillStyle = '#85994b'
        ctx.fillRect(0, 0, 8, 8)
        ctx.beginPath()
        ctx.fillStyle = '#ffffff'
        ctx.arc(4, 4, 1, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        break
    }
    ctx.restore()
    return ctx.createPattern(canvas, 'repeat')
  }

  // Styles
  const style = (feature) => {
    if (!feature.get('isVisible')) {
      return
    }
    const zIndex = feature.get('z-index')
    const lineDash = [2, 3]
    let strokeColour = '#85994b'
    let fillColour = pattern('veryLow')
    if (feature.get('risk-level') === 2) {
      strokeColour = '#ffdd00'
      fillColour = pattern('low')
    } else if (feature.get('risk-level') === 3) {
      strokeColour = '#F47738'
      fillColour = pattern('medium')
    } else if (feature.get('risk-level') === 4) {
      strokeColour = '#D4351C'
      fillColour = pattern('high')
    }
    return new Style({
      stroke: new Stroke({ color: strokeColour, width: 1 }),
      fill: new Fill({ color: fillColour }),
      lineDash: lineDash,
      zIndex: zIndex
    })
  }

  // Layers
  const road = maps.layers.road()
  const areasOfConcern = new VectorLayer({
    ref: 'areasOfConcern',
    source: new VectorSource({
      format: new GeoJSON(),
      projection: 'EPSG:3857',
      url: '/api/outlook.geojson'
    }),
    renderMode: 'hybrid',
    style: style,
    opacity: 0.6,
    zIndex: 200
  })

  // Configure default interactions
  const interactions = defaultInteractions({
    pinchRotate: false
  })

  // Format date Today, Yesterday, Tomorrow or 'Monday/Tuesday etc'
  const formatDay = (date) => {
    // date.setDate(date.getDate() + 256)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0, 0)
    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0, 0)
    if (date.getTime() === now.getTime()) {
      return 'Today'
    } else if (date.getTime() + 86400000 === now.getTime()) {
      return 'Yesterday'
    } else if (date.getTime() - 86400000 === now.getTime()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleString('en-GB', { weekday: 'short' })
    }
  }

  const formatDate = (date) => {
    const number = date.getDate()
    const nth = (number) => {
      if (number > 3 && number < 21) return 'th'
      switch (number % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th' }
    }
    const month = date.toLocaleString('en-GB', { month: 'short' })
    return `<span class="defra-map-days__month">${month} </span>${number}${nth(number)}`
  }

  // Create day control
  const dayControlsElement = document.createElement('div')
  const dayControlsContainer = document.createElement('div')
  dayControlsElement.className = 'defra-map-days'
  dayControlsContainer.className = 'defra-map-days__container'
  options.days.forEach(function (day) {
    const dayButtonElement = document.createElement('button')
    dayButtonElement.className = 'defra-map-days__button'
    dayButtonElement.setAttribute('data-risk-level', day.level)
    dayButtonElement.setAttribute('data-day', day.idx)
    dayButtonElement.setAttribute('aria-selected', false)
    const dayName = formatDay(new Date(day.date))
    const date = formatDate(new Date(day.date))
    const dayButtonContainer = document.createElement('div')
    dayButtonContainer.className = 'defra-map-days__button-container'
    dayButtonContainer.innerHTML = `<strong>${dayName}</strong><br/>${date}<span class="defra-map-days__icon defra-map-days__icon--risk-level-${day.level}"></span>`
    dayButtonElement.appendChild(dayButtonContainer)
    dayControlsContainer.appendChild(dayButtonElement)
  })
  dayControlsElement.appendChild(dayControlsContainer)
  const dayControl = new Control({
    element: dayControlsElement
  })

  // Options to pass to the MapContainer constructor
  const containerOptions = {
    view: view,
    layers: [road, areasOfConcern],
    controls: [dayControl],
    queryParamKeys: ['v'],
    interactions: interactions,
    originalTitle: options.originalTitle,
    title: options.title,
    heading: options.heading,
    keyTemplate: 'key-outlook.html',
    isBack: options.isBack
  }

  // Create MapContainer
  const container = new MapContainer(mapId, containerOptions)
  const keyElement = container.keyElement
  const map = container.map

  //
  // Private methods
  //

  // Set feature visiblity
  const setFeatureVisibility = () => {
    areasOfConcern.getSource().forEachFeature((feature) => {
      const riskLevel = parseInt(feature.get('risk-level'), 10)
      const day = parseInt(feature.get('day'), 10)
      const isVisible = state.visibleRiskLevels.includes(riskLevel) && day === state.day
      feature.set('isVisible', isVisible)
    })
  }

  // Set day control current day
  const setDaysButton = () => {
    forEach(document.querySelectorAll('.defra-map-days__button'), (button, i) => {
      button.setAttribute('aria-selected', i + 1 === state.day)
    })
  }

  //
  // Setup
  //

  // Define map extent
  let extent
  if (getParameterByName('ext')) {
    extent = getParameterByName('ext').split(',').map(Number)
  } else {
    extent = getLonLatFromExtent(maps.extent)
  }

  // Set map viewport
  setExtentFromLonLat(map, extent)

  // Show layers
  road.setVisible(true)

  //
  // Events
  //

  // Set first day when features have loaded
  const change = areasOfConcern.getSource().on('change', (e) => {
    if (e.target.getState() === 'ready') {
      unByKey(change) // Remove ready event when layer is ready
      setFeatureVisibility()
      setDaysButton()
    }
  })

  // Day control button
  forEach(document.querySelectorAll('.defra-map-days__button'), (button) => {
    button.addEventListener('click', (e) => {
      e.currentTarget.focus()
      state.day = parseInt(e.currentTarget.getAttribute('data-day'), 10)
      setFeatureVisibility()
      setDaysButton()
    })
  })

  // Key checkbox click
  keyElement.addEventListener('click', (e) => {
    if (e.target.nodeName === 'INPUT') {
      state.visibleRiskLevels = [...keyElement.querySelectorAll('input:checked')].map(e => parseInt(e.getAttribute('data-risk-level'), 10))
      setFeatureVisibility()
    }
  })
}

// Export a helper factory to create this map
// onto the `maps` object.
// (This is done mainly to avoid the rule
// "do not use 'new' for side effects. (no-new)")
maps.createOutlookMap = (mapId, options = {}) => {
  // Set meta title and page heading
  options.originalTitle = document.title
  options.heading = 'Flood outlook map'
  options.title = options.heading + ' - Check for flooding - GOV.UK' // `Map view: ${document.title}`

  // Set initial history state
  if (!window.history.state) {
    const data = {}
    const title = options.title
    const uri = window.location.href
    window.history.replaceState(data, title, uri)
  }

  // Create map button
  const btnContainer = document.getElementById(mapId)
  const button = document.createElement('button')
  button.id = mapId + '-btn'
  button.innerHTML = options.btnText || 'View map'
  button.innerHTML += '<span class="govuk-visually-hidden">(Visual only)</span>'
  button.className = options.btnClasses || 'defra-button-map'
  btnContainer.parentNode.replaceChild(button, btnContainer)

  // Detect keyboard interaction
  if (maps.isKeyboard !== false && maps.isKeyboard !== true) {
    window.addEventListener('keydown', (e) => {
      maps.isKeyboard = true
    })
    window.addEventListener('pointerdown', (e) => {
      maps.isKeyboard = false
    })
    window.addEventListener('focusin', (e) => {
      if (maps.isKeyboard) {
        e.target.setAttribute('keyboard-focus', '')
      }
    })
    window.addEventListener('focusout', (e) => {
      forEach(document.querySelectorAll('[keyboard-focus]'), (element) => {
        element.removeAttribute('keyboard-focus')
      })
    })
  }

  // Manage scroll position
  if (!maps.hasScrollListener) {
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`)
    })
    maps.hasScrollListener = true
  }

  // Create map on button press
  button.addEventListener('click', (e) => {
    // Advance history
    const data = { v: mapId, isBack: true }
    const title = options.title
    let uri = window.location.href
    uri = addOrUpdateParameter(uri, 'v', mapId)
    window.history.pushState(data, title, uri)
    options.isBack = true
    return new OutlookMap(mapId, options)
  })

  // Recreate map on browser history change
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.v === mapId) {
      options.isBack = window.history.state.isBack
      return new OutlookMap(e.state.v, options)
    }
  })

  // Recreate map on page refresh
  if (window.flood.utils.getParameterByName('v') === mapId) {
    options.isBack = window.history.state.isBack
    return new OutlookMap(mapId, options)
  }
}
