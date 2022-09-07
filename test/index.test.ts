import request from 'supertest'
import app from '../index'

describe('GET /', function () {
    it('responds with aqi data', async () => {
        const res = await request(app)
            .get('/')
            .send({
                "date": "2022-08-25",
                "lat": 28.7041,
                "lon": 77.055
            })
            .expect("Content-Type", /json/)
        expect(res.status).toEqual(200);
        expect((Object.keys(res.body.data[0]))[0]).toBe('aqi')
        expect((Object.keys(res.body.data[0]))[1]).toBe('aqi_measure_time')
        expect((Object.keys(res.body.data[0]))[2]).toBe('station_id')
        expect((Object.keys(res.body.data[0]))[3]).toBe('stationName')
    });
});