// This file represents the 5 day outlook used on the national page.
// It uses the MapContainer

(function (window, flood) {
  const ol = window.ol
  const maps = flood.maps
  const MapContainer = maps.MapContainer
  const forEach = flood.utils.forEach
  const getParameterByName = flood.utils.getParameterByName

  function OutlookMap () {
    // Container element
    var elementId = 'map-outlook'
    var containerEl = document.getElementById(elementId)

    var center = ol.proj.transform(maps.center, 'EPSG:4326', 'EPSG:3857')

    // options = options || {}

    var road = maps.layers.road()

    var view = new ol.View({
      zoom: 6,
      minZoom: 6,
      maxZoom: 7,
      center: center
    })

    var geoJson = new window.ol.format.GeoJSON()
    var outlookGeoJson = flood.model.outlook._geoJson

    var areasOfConcernFeatures = geoJson.readFeatures(outlookGeoJson, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })

    function styleFeature (feature) {
      // var strokeColour = '#6f777b'
      // var strokeWidth = 2
      var zIndex = feature.get('z-index')
      var lineDash = [2, 3]
      var fillColour = 'rgba(133,153,75, 0.8)' // '#85994b'

      if (feature.get('risk-level') === 2) {
        fillColour = 'rgba(255,191,71, 0.8)' // '#ffbf47'
      } else if (feature.get('risk-level') === 3) {
        fillColour = 'rgba(244,119,56, 0.8)' // '#F47738'
      } else if (feature.get('risk-level') === 4) {
        fillColour = 'rgba(223,48,52, 0.8)' // '#df3034'
      }

      return new ol.style.Style({
        fill: new ol.style.Fill({ color: fillColour }),
        /*
        stroke: new ol.style.Stroke({
          color: strokeColour,
          width: strokeWidth,
          miterLimit: 2,
          lineJoin: 'round',
          lineDash: lineDash
        }),
        */
        lineDash: lineDash,
        zIndex: zIndex
      })
    }

    var areasOfConcern = new window.ol.layer.Vector({
      zIndex: 200,
      source: new window.ol.source.Vector({
        format: geoJson,
        features: areasOfConcernFeatures
      }),
      style: styleFeature
    })

    // MapContainer options
    var mapOptions = {
      keyTemplate: 'map-key-outlook.html',
      view: view,
      layers: [
        road,
        areasOfConcern
      ]
    }

    // Create MapContainer
    var container = new MapContainer(containerEl, mapOptions)
    var map = container.map

    // Add outlook day controls
    var outlookControl = document.createElement('div')
    outlookControl.className = 'map__outlook-control'
    outlookControl.innerHTML = '<div class="map__outlook-control__inner"></div>'
    flood.model.outlook._days.forEach(function (day) {
      var div = document.createElement('div')
      div.className = 'map__outlook-control__day'
      var button = document.createElement('button')
      button.className = 'map__outlook-control__button'
      button.setAttribute('aria-selected', !!day.idx)
      button.setAttribute('data-day', day.idx)
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      var d = new Date(day.date)
      button.innerHTML = `
        ${days[d.getDay()] + ' ' + d.getDate()}
        <span class="map__outlook-control__icon map__outlook-control__icon--risk-level-${day.level}"></span>`
      button.addEventListener('click', function (e) {
        var day = +button.getAttribute('data-day')
        setDay(day)
      })
      div.append(button)
      outlookControl.childNodes[0].append(div)
    })
    container.mapElement.append(outlookControl)

    // Outlook set day function
    function setDay (day) {
      areasOfConcern.getSource().forEachFeature(function (feature) {
        var featureDay = feature.get('day')
        var visible = featureDay === day
        feature.setStyle(visible ? null : new ol.style.Style({}))
      })
      forEach(outlookControl.querySelectorAll('button'), function (btn, i) {
        btn.setAttribute('aria-selected', i + 1 === day ? 'true' : 'false')
      })
    }

    // Outlook set first day
    setDay(1)

    //
    // Events
    //

    // Precompose - setup view and features first
    map.once('precompose', function (e) {
      // Set map extent to intial extent
      const extent = getParameterByName('e') ? getParameterByName('e').split(',').map(Number) : maps.extent
      map.getView().fit(extent, { constrainResolution: false, padding: [0, 0, 0, 0] })
    })

    // Toggle fullscreen view on browser history change
    function popStateListener (e) {
      if (e && e.state && getParameterByName('v') === elementId) {
        window.removeEventListener('popstate', popStateListener)
        maps.createOutlookMap()
        window.flood.historyAdvanced = true
      } else {
        var el = document.getElementById(elementId)
        if (el.firstChild) {
          el.removeChild(el.firstChild)
        }
      }
    }
    window.addEventListener('popstate', popStateListener)
  }

  // Export a helper factory to create this map
  // onto the `maps` object.
  // (This is done mainly to avoid the rule
  // "do not use 'new' for side effects. (no-new)")
  maps.createOutlookMap = function () {
    return new OutlookMap()
  }
})(window, window.flood)
