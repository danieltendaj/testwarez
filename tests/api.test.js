import { expect} from "chai";
import pkg from 'pactum';
const { spec } = pkg;
import {baseUrl, password, user, userId} from "../helpers/data.js";

let token_response;
let books = [];
describe('Api tests', () => {
    it("Get books", async () => {
        const response = await spec()
            .get(`${baseUrl}/BookStore/v1/Books`)
            .inspect();
        books = response.body;
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
                "userName": `${user}`,
                "password": `${password}`,
            })
            .inspect();
        expect(response.statusCode).to.eql(201);
        expect(response.body.username).to.eql("testfasfsfs1");
        console.log(response.body);
    });

    it("Generate token", async () => {
        const response = await spec()
            .post(`${baseUrl}/Account/v1/GenerateToken`)
            .withBody({
                "userName": `${user}`,
                "password": `${password}`,
            })
            .inspect();
        token_response = response.body.token;
        expect(response.statusCode).to.eql(200);
        expect(response.body.token).to.not.be.empty;
        console.log(token_response);
    });

    it("Get a token", async () => {
        console.log(token_response)
    });

    it("Add books", async () => {
        const isbnArray = JSON.stringify(books.books.map(book => ({ isbn: book.isbn })));
        console.log(isbnArray);
        const response = await spec()
            .post(`${baseUrl}/BookStore/v1/Books`)
            .withBearerToken(token_response)
            .withBody({
                "userId": `${userId}`,
                "collectionOfIsbns": `${isbnArray}`
            })
            .inspect();
        expect(response.statusCode).to.eql(201);
        console.log(response.body);
    });

    it("Delete books", async () => {
        const response = await spec()
            .delete(`${baseUrl}/BookStore/v1/Books`)
            .withBearerToken(token_response)
            .withQueryParams('UserId', `${userId}`)
            .inspect();
        expect(response.statusCode).to.eql(204);
        console.log(response.body);
    });

    it("Get the user", async () => {
        const response = await spec()
            .get(`${baseUrl}/Account/v1/User/${userId}`)
            .withBearerToken(token_response)
            .inspect();
        expect(response.statusCode).to.eql(200);
        expect(response.body.books).is.empty;
        console.log(response.body);
    });

});

