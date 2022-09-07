import { Pool } from 'pg'
import poolConfig from '../database.json'
const pool = new Pool(poolConfig['dev'])

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

export default query;