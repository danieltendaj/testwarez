import { expect} from "chai";
import pkg from 'pactum';
const { spec } = pkg;
import 'dotenv/config';
import {baseUrl, userId} from "../helpers/data.js";

describe('Api tests', () => {
    it("get request", async () => {
        const response = await spec()
            .get(`${baseUrl}/BookStore/v1/Books`)
            .inspect();
        const responseJSON = JSON.stringify(response.body);
        expect(response.statusCode).to.eql(200);
        expect(response.body.books[0].title).to.eql("Git Pocket Guide");
        expect(response.body.books[0].author).to.eql("Richard E. Silverman");
        expect(responseJSON).to.include("9781449325862");
    });

    it.skip("Create a user", async () => {
        const response = await spec()
            .post(`${baseUrl}/Account/v1/User`)
            .withBody({
                "userName": "testfasfsfs1",
                "password": process.env.SECRET_PASSWORD,
            })
            .inspect();
        expect(response.statusCode).to.eql(201);
        expect(response.body.username).to.eql("testfasfsfs1");
        console.log(response.body);
    });

    it.only("Get a token", async () => {
        const response = await spec()
            .post(`${baseUrl}/Account/v1/GenerateToken`)
            .withBody({
                "userName": `${userId}`,
                "password": process.env.SECRET_PASSWORD,
            })
            .inspect();
        const token = response.body.token;
        expect(response.statusCode).to.eql(200);
        expect(response.body.token).to.not.be.empty;
        console.log(token);
    });

});

