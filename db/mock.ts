import mockQueries from './mockQuery'

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

export { MockDatabaseService, MockDatabaseQueries };
