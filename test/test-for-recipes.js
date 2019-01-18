const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function () {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it("should list items on GET", function() {
        return chai
            .request(app)
            .get('/recipes')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);

                const expectKeys = ["id", "name", "ingredients"];
                res.body.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectKeys);
                });
            });
    });

    it("shold add an item on POST", function() {
        const newItem = { name: "milk shake", ingredients: "milk, cream"};
        return chai
            .request(app)
            .post("/recipes")
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("name", "ingredients");
            });
    });

    it("should update items on PUT", function () {
        const updateData = {
            name: "nut",
            ingredients: "milk, cream"
        };

        return(
            chai
            .request(app)
            .get("/recipes")
            .then(function(res) {
                updateData.id = res.body[0].id;

                return chai
                .request(app)
                .put(`/recipes/${updateData.id}`)   
                .send(updateData);

            })

            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res,body).to.be.a("object");
                expect(res.body).to.deep.euqal(updateData);
            })
        );
    });

    it("should DELETE item", function() {
        return(
            chai
            .request(app)
            .get("/recipes")
            .then(function(res) {
                return chai.request(app).delete(`/recipes/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
        )
    })
});