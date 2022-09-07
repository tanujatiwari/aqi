import data from '../data.json'
import findEarthDistance from '../helpers'

const mockQueries = {
    insertAqi: async (stationId: string, aqi: number, currTime: string) => {
        const newAqiData = { "aqi": aqi, "aqi_measure_time": currTime, "station_id": stationId }
        data.aqis.push(newAqiData)
    },

    getAqi: async (date: string, stationId: string) => {
        let stationName;
        let searchAqiForDate = new Date(date);
        let nextDay = new Date(date);
        nextDay.setDate(searchAqiForDate.getDate() + 1);
        for (let i = 0; i < data.stations.length; i++) {
            if (stationId === data.stations[i].id) {
                stationName = data.stations[i].station_name
                break;
            }
        }
        const aqiData = []
        for (let i = 0; i < data.aqis.length; i++) {
            const aqiMeasureTime = new Date(data.aqis[i].aqi_measure_time)
            if (data.aqis[i].station_id === stationId && aqiMeasureTime>= searchAqiForDate && aqiMeasureTime<nextDay) {
                const eachAqiData = { ...data.aqis[i], stationName: stationName }
                aqiData.push(eachAqiData)
            }
        }
        return aqiData
    },

    getAllStations: async () => {
        const allStations = data.stations
        return allStations
    },

    getNearestStation: async (lat: number, lon: number) => {
        let minDistance = Number.MAX_VALUE;
        let minDistanceStationId;
        for (let i = 0; i < data.stations.length; i++) {
            const stationLat = data.stations[i].geopoint.x
            const stationLon = data.stations[i].geopoint.y
            const earthDistance = findEarthDistance(lat, lon, stationLat, stationLon)
            if (minDistance > earthDistance) {
                minDistance = earthDistance
                minDistanceStationId = data.stations[i].id
            }
        }
        return minDistanceStationId
    },

    checkInDelhi: async (lat: number, lon: number) => {
        return findEarthDistance(lat, lon, 28.644800, 77.216721)
    }
}

export default mockQueries