import data from '../data.json'

interface geopoint {
    lat: number,
    lon: number
}

interface MockDatabaseService {
    checkInDelhi(coordinates: geopoint): Promise<any>;
    getNearestStation(coordinates: geopoint): Promise<any>;
    getAqi(date: string, stationId: string): Promise<any>;
    insertAqi(stationId: string, aqi: number, date: string): Promise<any>;
    getAllStations(): Promise<any>
}

class MockDatabaseQueries implements MockDatabaseService {
    constructor() { }
    checkInDelhi(coordinates: geopoint): Promise<any> {
        return mockQueries.checkInDelhi(coordinates.lat, coordinates.lon);
    }
    getNearestStation(coordinates: geopoint): Promise<any> {
        return mockQueries.getNearestStation(coordinates.lat, coordinates.lon)
    }
    getAqi(date: string, stationId: string): Promise<any> {
        return mockQueries.getAqi(date, stationId)
    }
    insertAqi(stationId: string, aqi: number, date: string): Promise<any> {
        return mockQueries.insertAqi(stationId, aqi, date)
    }
    getAllStations(): Promise<any> {
        return mockQueries.getAllStations()
    }
}

function findEarthDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 3956;
    return (c * r)
}

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
        let minDistance = 0;
        let minDistanceStationId;
        for (let i = 0; i < data.stations.length; i++) {
            const stationLat = data.stations[i].geopoint.x
            const stationLon = data.stations[i].geopoint.y
            const earthDistance = findEarthDistance(lat, lon, stationLat, stationLon)
            if (minDistance < earthDistance) {
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

export { MockDatabaseService, MockDatabaseQueries };
