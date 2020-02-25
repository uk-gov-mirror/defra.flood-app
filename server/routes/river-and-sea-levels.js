const joi = require('@hapi/joi')
const ViewModel = require('../models/views/river-and-sea-levels')
const floodService = require('../services/flood')
const locationService = require('../services/location')

module.exports = [{
  method: 'GET',
  path: '/river-and-sea-levels',
  handler: async (request, h) => {
    const { q: location } = request.query
    var model, place, stations
    place = await locationService.find(location)

    // This is to allow the opening of the page via the river-id taken from rivers.json
    if (request.query['river-id']) {
      const stations = floodService.stations.getStationsByRiverClone(request.query['river-id'])
      model = new ViewModel({ location, place, stations })
      model.referer = request.headers.referer
      return h.view('river-and-sea-levels', { model })
    }

    if (typeof place === 'undefined' || place === '') {
      // TODO: Deep clone the stations object, as we don't want to update the cache object in the model
      stations = floodService.stations.stationsClone
      model = new ViewModel({ location, place, stations })
      model.referer = request.headers.referer
      return h.view('river-and-sea-levels', { model })
    }
    if (!place.isEngland.is_england) {
      return h.view('location-not-england')
    }
    stations = floodService.stations.processStations(await floodService.getStationsWithin(place.bbox))
    model = new ViewModel({ location, place, stations })
    model.referer = request.headers.referer
    return h.view('river-and-sea-levels', { model })
  },
  options: {
    validate: {
      query: joi.object({
        q: joi.string(),
        'river-id': joi.string(),
        btn: joi.string(),
        ext: joi.string(),
        fid: joi.string(),
        lyr: joi.string(),
        v: joi.string()
      }),
      failAction: (request, h, err) => {
        return h.view('404').code(404).takeover()
      }
    }
  }
}, {
  method: 'POST',
  path: '/river-and-sea-levels',
  handler: async (request, h) => {
    const { location } = request.payload
    if (typeof location === 'undefined' || location === '') {
      return h.redirect('/river-and-sea-levels')
    }
    return h.redirect(`/river-and-sea-levels?q=${location}`)
  }
}]
