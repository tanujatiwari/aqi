"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDatabaseQueries = void 0;
const mockQuery_1 = __importDefault(require("./mockQuery"));
class MockDatabaseQueries {
    constructor() { }
    checkInDelhi(coordinates) {
        return mockQuery_1.default.checkInDelhi(coordinates.lat, coordinates.lon);
    }
    getNearestStation(coordinates) {
        return mockQuery_1.default.getNearestStation(coordinates.lat, coordinates.lon);
    }
    getAqi(date, stationId) {
        return mockQuery_1.default.getAqi(date, stationId);
    }
    insertAqi(stationId, aqi, date) {
        return mockQuery_1.default.insertAqi(stationId, aqi, date);
    }
    getAllStations() {
        return mockQuery_1.default.getAllStations();
    }
}
exports.MockDatabaseQueries = MockDatabaseQueries;
