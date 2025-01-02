'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const ViewModel = require('../../server/models/views/station')
const data = require('../data')
const moment = require('moment-timezone')

const logRelevantresult = (result) => {
  const relevantData = {
    floodRiskUrl: result.floodRiskUrl,
    trend: result.trend,
    banner: result.banner,
    severityLevel: result.severityLevel,
    warningsBanner: result.warningsBanner,
    warningsLink: result.warningsLink,
    isWarningLinkRendered: result.isWarningLinkRendered,
    severeBanner: result.severeBanner,
    severeLink: result.severeLink,
    isSevereLinkRenedered: result.isSevereLinkRenedered,
    isAlertLinkRendered: result.isAlertLinkRendered
  }
  console.log('Relevant result:', relevantData)
}

lab.experiment('Station model test', () => {
  let sandbox

  lab.beforeEach(async () => {
    sandbox = await sinon.createSandbox()
  })
  lab.afterEach(async () => {
    await sandbox.restore()
  })
  lab.test('Test station viewModel river station 1001, no alerts or warnings', async () => {
    const stationData = data.stationRiver
    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.station.hasPercentiles).to.equal(true)
    Code.expect(result.station.isSingle).to.equal(true)
    Code.expect(result.station.state).to.equal('Normal')
    Code.expect(result.station.stateInformation).to.equal('0.35m to 2.84m')
    Code.expect(result.station.status).to.equal('active')
    Code.expect(result.trend).to.equal('steady')
    Code.expect(result.banner).to.equal(0)
    Code.expect(result.pageTitle).to.equal('River Adur level at Beeding Bridge')
    Code.expect(result.dataOverHourOld).to.equal(true)
    Code.expect(result.postTitle).to.equal('Latest river level information for the River Adur at Beeding Bridge ')
    Code.expect(result.thresholds[0].values).to.equal([
      {
        id: 'warningThreshold',
        description: 'Property flooding is possible above this level',
        shortname: 'Possible flood warnings',
        value: '3.64'
      }
    ])
    Code.expect(result.thresholds[2].values).to.equal([
      {
        id: 'alertThreshold',
        description: 'Low-lying land flooding possible above this level. One or more flood alerts may be issued.',
        shortname: 'Possible flood alerts',
        value: '3.22'
      }
    ])
    Code.expect(result.thresholds[4].values).to.equal([
      {
        id: 'latest',
        value: '0.81',
        description: 'Latest level',
        shortname: ''
      }
    ])
  })
  lab.test('Test station viewModel river station 1001 only has FW ATCON thresholds', async () => {
    const stationData = data.stationRiverACTCON
    const viewModel = new ViewModel(stationData)

    const result = viewModel
    Code.expect(result.thresholds[1].values).to.equal([
      {
        id: 'warningThreshold',
        description: 'Property flooding is possible above this level',
        shortname: 'Possible flood warnings',
        value: '3.22'
      }
    ])
    Code.expect(result.thresholds[2].values).to.equal([
      {
        id: 'alertThreshold',
        description: 'Top of normal range. Low-lying land flooding possible above this level. One or more flood alerts may be issued.',
        shortname: 'Top of normal range',
        value: '2.84'
      }
    ])
  })
  lab.test('Test station viewModel dataOverHourOld to be false', async () => {
    const stationData = data.stationRiver
    stationData.telemetry[0].ts = new Date().toJSON()

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.dataOverHourOld).to.equal(false)
  })
  lab.test('Test station viewModel one warning in force', async () => {
    const stationData = data.stationActiveWarning

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('warning')
    Code.expect(result.warningsBanner).to.equal('There is a flood warning within 5 miles of this measuring station')
    Code.expect(result.warningsLink).to.equal('/alerts-and-warnings?station=1001#warnings')
  })
  lab.test('Test station viewModel one alert in force', async () => {
    const stationData = data.stationActiveAlert

    const viewModel = new ViewModel(stationData)

    const result = viewModel
    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('alert')
    Code.expect(result.alertsBanner).to.equal('There is a flood alert within 5 miles of this measuring station')
    Code.expect(result.alertsLink).to.equal('/alerts-and-warnings?station=1001#alerts')
  })
  lab.test('Test station viewModel one Severe Warning in force', async () => {
    const stationData = data.stationSevereWarning

    const viewModel = new ViewModel(stationData)

    const result = viewModel
    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
    Code.expect(result.severeLink).to.equal('/alerts-and-warnings?station=1001#severe')
  })
  lab.test('Test station viewModel multiple Warnings and Alerts in force', async () => {
    const stationData = data.stationMultipleAW

    const viewModel = new ViewModel(stationData)

    const result = viewModel
    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(2)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There are severe flood warnings within 5 miles of this measuring station')
    Code.expect(result.severeLink).to.equal('/alerts-and-warnings?station=1001#severe')
  })
  lab.test('Test station viewModel groundwater station', async () => {
    const stationData = data.stationGroudwater

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.station.id).to.equal(9302)
    Code.expect(result.station.river).to.equal('Groundwater Level')
    Code.expect(result.station.hasPercentiles).to.equal(true)
    Code.expect(result.station.hasImpacts).to.equal(false)
  })
  lab.test('Test station viewModel plotNegativeValues should be true for groundwater station', async () => {
    const viewModel = new ViewModel(data.stationGroudwater)
    Code.expect(viewModel.station.plotNegativeValues).to.equal(true)
  })
  lab.test('Test station viewModel plotNegativeValues should be false for river station', async () => {
    const viewModel = new ViewModel(data.stationRiver)
    Code.expect(viewModel.station.plotNegativeValues).to.equal(false)
  })
  lab.test('Test station viewModel plotNegativeValues should be true for coastal station', async () => {
    const viewModel = new ViewModel(data.stationCoastal)
    Code.expect(viewModel.station.plotNegativeValues).to.equal(true)
  })
  lab.test('Test station viewModel FFOI station with Impacts ', async () => {
    const stationData = data.stationForecastData

    const today = moment().format('YYYY-MM-DD')
    const latestTime = moment().add(30, 'minutes').format('HH:mm:ss')
    const forecastBegining = moment().add(45, 'minutes').format('HH:mm:ss')

    const tommorowDate = moment().add(1, 'day').format('YYYY-MM-DD')
    const tommorowForecast = moment().add(1, 'day').format('HH:mm:ss')

    const outsideOfForecast = moment().add(37, 'hours').format('YYYY-MM-DD')
    const timeOutsideOfForecast = moment().add(37, 'hours').format('HH:mm:ss')

    stationData.values.$.date = today
    stationData.values.$.time = moment().format('HH:mm:ss')

    stationData.values.SetofValues[0].$.startDate = today
    stationData.values.SetofValues[0].$.startTime = moment().format('HH:mm:ss')

    stationData.values.SetofValues[0].$.endDate = moment().add(36, 'hours').format('YYYY-MM-DD')
    stationData.values.SetofValues[0].$.startTime = moment().add(36, 'hours').format('HH:mm:ss')

    stationData.values.SetofValues[0].Value[0].$.date = today
    stationData.values.SetofValues[0].Value[0].$.time = latestTime

    stationData.values.SetofValues[0].Value[1].$.date = today
    stationData.values.SetofValues[0].Value[1].$.time = forecastBegining

    stationData.values.SetofValues[0].Value[2].$.date = tommorowDate
    stationData.values.SetofValues[0].Value[2].$.time = tommorowForecast

    stationData.values.SetofValues[0].Value[3].$.date = outsideOfForecast
    stationData.values.SetofValues[0].Value[3].$.time = timeOutsideOfForecast

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.station.id).to.equal(7177)
    Code.expect(result.station.hasImpacts).to.equal(true)
    Code.expect(result.station.formattedPorMaxDate).to.equal('10/02/09')

    // Should have FW ACT FAL 3.88 and FW ACT FW 4.20 thresholds as the are no FW RES FAL and FW RES FW in imtdThresholds
    Code.expect(result.thresholds[0].values).to.equal(
      [
        {
          description: 'Property flooding is possible above this level',
          id: 'warningThreshold',
          shortname: 'Possible flood warnings',
          value: '4.20'
        }
      ]
    )
    Code.expect(result.thresholds[1].values).to.equal(
      [
        {
          id: 'alertThreshold',
          description: 'Low-lying land flooding possible above this level. One or more flood alerts may be issued.',
          shortname: 'Possible flood alerts',
          value: '3.88'
        }
      ]
    )
    Code.expect(result.isUpstream).to.equal(true)
    Code.expect(result.isDownstream).to.equal(false)
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
  })
  lab.test('Test station viewModel 1 alert 1 warning 1 severe', async () => {
    const stationData = data.stationAWSW

    const viewModel = new ViewModel(stationData)

    const result = viewModel
    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
  })
  lab.test('Test station viewModel removes spike in telemetry', async () => {
    const stationData = data.stationRiverSpike
    const viewModel = new ViewModel(stationData)

    const result = viewModel

    // 480 telemetry values went in to the model, should be one less
    Code.expect(result.telemetry.length).to.equal(479)
  })
  lab.test('Test station viewModel returns Sea Level Height ToggleTip', async () => {
    const stationData = data.toggleTipSeaLevelStation

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.infoHeight).to.equal('This station measures height from sea level.')
    Code.expect(result.infoTrend).to.equal('The trend is based on the last 5 readings.')
    Code.expect(result.infoState).to.equal('There are 3 states: low, normal and high. The latest level is within the normal range. We calculate the normal range using an average of past measurements and other local factors.')
  })
  lab.test('Test station viewModel returns Below Zero Height ToggleTip', async () => {
    const stationData = data.toggleTipBelowZeroStation

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.infoHeight).to.equal('This station measures height from a fixed point on or close to the riverbed. A reading of 0 metres can be normal for some stations because of natural changes to the riverbed.')
    Code.expect(result.infoTrend).to.equal('The trend is based on the last 5 readings.')
    Code.expect(result.infoState).to.equal('There are 3 states: low, normal and high. The latest level is below the normal range. We calculate the normal range using an average of past measurements and other local factors.')
  })
  lab.test('Test station viewModel returns River Bed Height ToggleTip', async () => {
    const stationData = data.toggleTipRiverBedStation

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.infoHeight).to.equal('This station measures height from a fixed point on or close to the riverbed. This point is 5.63m above sea level.')
    Code.expect(result.infoTrend).to.equal('The trend is based on the last 5 readings.')
    Code.expect(result.infoState).to.equal('There are 3 states: low, normal and high. The latest level is above the normal range. We calculate the normal range using an average of past measurements and other local factors.')
  })

  lab.test('Test null telemetry values are removed', async () => {
    const stationData = data.nullTelemetry

    const viewModel = new ViewModel(stationData)

    const result = viewModel

    Code.expect(result.telemetryRefined.observed.length).to.equal(4)
  })

  // 19) No alerts/warnings/severe
  lab.test('Test station with no warnings, alerts, or severe warnings', async () => {
    const stationData = data.stationIconBanner.stationNoWarningsAlertsSevere
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    logRelevantresult(result)
    Code.expect(result.station.id).to.equal(1002)
    Code.expect(result.banner).to.equal(0)
  })

  // 20) One alert in force (Only Alerts, A=1)
  lab.test('Test station with one alert in force', async () => {
    const stationData = data.stationActiveAlert
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('alert')
    Code.expect(result.alertsBanner).to.equal('There is a flood alert within 5 miles of this measuring station')
    Code.expect(result.alertsLink).to.equal('/alerts-and-warnings?station=1001#alerts')
  })

  // 21) Multiple alerts, no warnings (Only Alerts, A>1)
  lab.test('Test station with multiple alerts and no warnings', async () => {
    const stationData = data.stationIconBanner.stationMultipleAlerts
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1005)
    Code.expect(result.banner).to.equal(2)
    Code.expect(result.severityLevel).to.equal('alert')
    Code.expect(result.alertsBanner).to.equal('There are flood alerts within 5 miles of this measuring station')
    Code.expect(result.alertsLink).to.equal('/alerts-and-warnings?station=1005#alerts')
  })

  // 22) One warning in force (Only Warnings, W=1)
  lab.test('Test station with one warning in force', async () => {
    const stationData = data.stationActiveWarning
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('warning')
    Code.expect(result.warningsBanner).to.equal('There is a flood warning within 5 miles of this measuring station')
    Code.expect(result.warningsLink).to.equal('/alerts-and-warnings?station=1001#warnings')
  })

  // 23) Multiple warnings, no alerts (Only Warnings, W>1)
  lab.test('Test station with multiple warnings and no alerts', async () => {
    const stationData = data.stationIconBanner.stationMultipleWarnings
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1003)
    Code.expect(result.banner).to.equal(2)
    Code.expect(result.severityLevel).to.equal('warning')
    Code.expect(result.warningsBanner).to.equal('There are flood warnings within 5 miles of this measuring station')
    Code.expect(result.warningsLink).to.equal('/alerts-and-warnings?station=1003#warnings')
  })

  // 24) One severe warning in force (Only Severe, S=1)
  lab.test('Test station with one severe warning in force', async () => {
    const stationData = data.stationSevereWarning
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
    Code.expect(result.severeLink).to.equal('/alerts-and-warnings?station=1001#severe')
  })

  // 25) Multiple severe warnings only (Only Severe, S>1)
  lab.test('Test station with multiple severe warnings only', async () => {
    const stationData = data.stationIconBanner.stationMultipleSevere
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1008)
    Code.expect(result.banner).to.equal(2)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There are severe flood warnings within 5 miles of this measuring station')
    Code.expect(result.severeLink).to.equal('/alerts-and-warnings?station=1008#severe')
  })

  // 26) Alerts + Severe, no warnings (A>0, W=0, S>0)
  lab.test('Test station with alerts and severe in force (no warnings)', async () => {
    const stationData = data.stationIconBanner.stationAlertsAndSevereNoWarnings
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1009)
    Code.expect(result.banner).to.equal(1)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
  })

  // 27) Warnings + Severe, no alerts (A=0, W>0, S>0)
  lab.test('Test station with severe warnings and multiple warnings', async () => {
    const stationData = data.stationIconBanner.stationSevereWithWarnings
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1007)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There is a severe flood warning within 5 miles of this measuring station')
  })

  // 28) Alerts + Warnings + Severe (A>0, W>0, S>0)
  lab.test('Test station with multiple warnings and alerts in force', async () => {
    const stationData = data.stationMultipleAW
    const viewModel = new ViewModel(stationData)
    const result = viewModel

    Code.expect(result.station.id).to.equal(1001)
    Code.expect(result.banner).to.equal(2)
    Code.expect(result.severityLevel).to.equal('severe')
    Code.expect(result.severeBanner).to.equal('There are severe flood warnings within 5 miles of this measuring station')
    Code.expect(result.severeLink).to.equal('/alerts-and-warnings?station=1001#severe')
  })
})
