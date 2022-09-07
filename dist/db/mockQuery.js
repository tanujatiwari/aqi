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
const data_json_1 = __importDefault(require("../data.json"));
const helpers_1 = __importDefault(require("../helpers"));
const mockQueries = {
    insertAqi: (stationId, aqi, currTime) => __awaiter(void 0, void 0, void 0, function* () {
        const newAqiData = { "aqi": aqi, "aqi_measure_time": currTime, "station_id": stationId };
        data_json_1.default.aqis.push(newAqiData);
    }),
    getAqi: (date, stationId) => __awaiter(void 0, void 0, void 0, function* () {
        let stationName;
        let searchAqiForDate = new Date(date);
        let nextDay = new Date(date);
        nextDay.setDate(searchAqiForDate.getDate() + 1);
        for (let i = 0; i < data_json_1.default.stations.length; i++) {
            if (stationId === data_json_1.default.stations[i].id) {
                stationName = data_json_1.default.stations[i].station_name;
                break;
            }
        }
        const aqiData = [];
        for (let i = 0; i < data_json_1.default.aqis.length; i++) {
            const aqiMeasureTime = new Date(data_json_1.default.aqis[i].aqi_measure_time);
            if (data_json_1.default.aqis[i].station_id === stationId && aqiMeasureTime >= searchAqiForDate && aqiMeasureTime < nextDay) {
                const eachAqiData = Object.assign(Object.assign({}, data_json_1.default.aqis[i]), { stationName: stationName });
                aqiData.push(eachAqiData);
            }
        }
        return aqiData;
    }),
    getAllStations: () => __awaiter(void 0, void 0, void 0, function* () {
        const allStations = data_json_1.default.stations;
        return allStations;
    }),
    getNearestStation: (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
        let minDistance = Number.MAX_VALUE;
        let minDistanceStationId;
        for (let i = 0; i < data_json_1.default.stations.length; i++) {
            const stationLat = data_json_1.default.stations[i].geopoint.x;
            const stationLon = data_json_1.default.stations[i].geopoint.y;
            const earthDistance = (0, helpers_1.default)(lat, lon, stationLat, stationLon);
            if (minDistance > earthDistance) {
                minDistance = earthDistance;
                minDistanceStationId = data_json_1.default.stations[i].id;
            }
        }
        return minDistanceStationId;
    }),
    checkInDelhi: (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, helpers_1.default)(lat, lon, 28.644800, 77.216721);
    })
};
exports.default = mockQueries;
