'use strict'

const joi = require('@hapi/joi')
const util = require('../util')

module.exports = [{
  method: 'GET',
  path: '/find-location',
  handler: async (request, h) => {
    if (typeof request.yar === 'undefined' ||
    request.yar.get('displayError') === null ||
    request.yar.get('displayError') === {}) {
      return h.view('find-location')
    } else {
      if (request.yar.get('displayError').view) {
        const view = request.yar.get('displayError').view
        request.yar.set('displayError', {})
        return h.view(view)
      } else {
        const err = request.yar.get('displayError')
        request.yar.set('displayError', {})
        return h.view('find-location', err)
      }
    }
  }
}, {
  method: 'POST',
  path: '/find-location',
  handler: async (request, h) => {
    const { location } = request.payload
    return h.redirect(`/location?q=${encodeURIComponent(util.cleanseLocation(location))}`)
  },
  options: {
    validate: {
      payload: joi.object({
        location: joi.string().required()
      }),
      failAction: (request, h, err) => {
        return h.view('find-location', { errorMessage: 'Enter a valid location' }).takeover()
      }
    }
  }
}]