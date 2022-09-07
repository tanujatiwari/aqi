"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const database_json_1 = __importDefault(require("../database.json"));
const pool = new pg_1.Pool(database_json_1.default['dev']);
const query = {
    insertAqi: (stationId, aqi, currTime) => __awaiter(void 0, void 0, void 0, function* () {
        return yield pool.query(`
            insert into aqis(station_id, aqi, aqi_measure_time)
            values ($1, $2,$3);
        `, [stationId, aqi, currTime]);
    }),
    getAqi: (date, stationId) => __awaiter(void 0, void 0, void 0, function* () {
        const allAqis = yield pool.query(`
            select aqi, aqi_measure_time, station_name from aqis
            join aqi_stations on id=station_id
            where station_id=$2 and aqi_measure_time>=$1 and aqi_measure_time<($1 + '1 day'::interval)
        `, [date, stationId]);
        return allAqis.rows;
    }),
    getAllStations: () => __awaiter(void 0, void 0, void 0, function* () {
        const allStations = yield pool.query(`
            select id, geopoint, station_name from aqi_stations
        `);
        return allStations.rows;
    }),
    getNearestStation: (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
        const nearestStationId = yield pool.query(`
            select id, geopoint <@> point($1,$2) as dist from aqi_stations
            order by dist asc limit 1;
        `, [lat, lon]);
        return nearestStationId.rows[0].id;
    }),
    checkInDelhi: (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
        const inDelhi = yield pool.query(`
            select point(28.644800,77.216721) <@> point($1,$2) as distance;
        `, [lat, lon]);
        return inDelhi.rows[0].distance;
    })
};
exports.default = query;
