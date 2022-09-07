import query from './query'

interface geopoint {
    lat: number,
    lon: number
}

interface DatabaseService {
    checkInDelhi(coordinates: geopoint): Promise<any>;
    getNearestStation(coordinates: geopoint): Promise<any>;
    getAqi(date: string, stationId: string): Promise<any>;
    insertAqi(stationId: string, aqi: number, date: string): Promise<any>;
    getAllStations(): Promise<any>
}

class DatabaseQueries implements DatabaseService {
    constructor() { }
    checkInDelhi(coordinates: geopoint): Promise<any> {
        return query.checkInDelhi(coordinates.lat, coordinates.lon);
    }
    getNearestStation(coordinates: geopoint): Promise<any> {
        return query.getNearestStation(coordinates.lat, coordinates.lon)
    }
    getAqi(date: string, stationId: string): Promise<any> {
        return query.getAqi(date, stationId)
    }
    insertAqi(stationId: string, aqi: number, date: string): Promise<any> {
        return query.insertAqi(stationId, aqi, date)
    }
    getAllStations(): Promise<any> {
        return query.getAllStations()
    }
}

export { DatabaseService, DatabaseQueries };
