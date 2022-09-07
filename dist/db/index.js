"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseQueries = void 0;
const query_1 = __importDefault(require("./query"));
class DatabaseQueries {
    constructor() { }
    checkInDelhi(coordinates) {
        return query_1.default.checkInDelhi(coordinates.lat, coordinates.lon);
    }
    getNearestStation(coordinates) {
        return query_1.default.getNearestStation(coordinates.lat, coordinates.lon);
    }
    getAqi(date, stationId) {
        return query_1.default.getAqi(date, stationId);
    }
    insertAqi(stationId, aqi, date) {
        return query_1.default.insertAqi(stationId, aqi, date);
    }
    getAllStations() {
        return query_1.default.getAllStations();
    }
}
exports.DatabaseQueries = DatabaseQueries;
