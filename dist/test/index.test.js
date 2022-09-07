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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
describe('GET /', function () {
    it('responds with aqi data', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .get('/')
            .send({
            "date": "2022-08-25",
            "lat": 28.7041,
            "lon": 77.055
        })
            .expect("Content-Type", /json/);
        expect(res.status).toEqual(200);
        expect((Object.keys(res.body.data[0]))[0]).toBe('aqi');
        expect((Object.keys(res.body.data[0]))[1]).toBe('aqi_measure_time');
        expect((Object.keys(res.body.data[0]))[2]).toBe('station_id');
        expect((Object.keys(res.body.data[0]))[3]).toBe('stationName');
    }));
});
