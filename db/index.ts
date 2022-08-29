import { Pool } from 'pg'
import poolConfig from '../database.json'
const pool = new Pool(poolConfig['dev'])

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

const query = {
    insertAqi: async (stationId: string, aqi: Number, currTime: string) => {
        return await pool.query(`
            insert into aqis(station_id, aqi, aqi_measure_time)
            values ($1, $2,$3);
        `, [stationId, aqi, currTime])
    },

    getAqi: async (date: string, stationId: string) => {
        const allAqis = await pool.query(`
            select aqi, aqi_measure_time, station_name from aqis
            join aqi_stations on id=station_id
            where station_id=$2 and aqi_measure_time>=$1 and aqi_measure_time<($1 + '1 day'::interval)
        `, [date, stationId])
        return allAqis.rows
    },

    getAllStations: async () => {
        const allStations = await pool.query(`
            select id, geopoint, station_name from aqi_stations
        `)
        return allStations.rows
    },

    getNearestStation: async (lat: number, lon: number) => {
        const nearestStationId = await pool.query(`
            select id, geopoint <@> point($1,$2) as dist from aqi_stations
            order by dist asc limit 1;
        `, [lat, lon])
        return nearestStationId.rows[0].id
    },

    checkInDelhi: async (lat: number, lon: number) => {
        const inDelhi = await pool.query(`
            select point(28.644800,77.216721) <@> point($1,$2) as distance;
        `, [lat, lon])
        return inDelhi.rows[0].distance
    }
}

export { DatabaseService, DatabaseQueries };
