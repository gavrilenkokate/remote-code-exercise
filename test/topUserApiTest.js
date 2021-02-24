const config = require("./config");
const assert = require("assert");
const axios = require("axios");
const httpClient = axios.create({
  baseURL: "http://" + config.serverHost + "/",
  timeout: config.httpReqTimeout, // specifies the number of milliseconds before the request times out
});
const updateDelay = 60000; // 1 minute

function assertInt(value) {
  assert.ok(
    !isNaN(parseInt(value)),
    `expected a valid int number, actual: ${value}`
  );
}

function compareUser(user1, user2) {
  return user1["id"] - user2["id"];
}

describe("/GET top users", () => {
  it("it should verify response status", (done) => {
    httpClient.get("/").then(function (response) {
      try {
        assert.strictEqual(response.status, 200);
        done();
      } catch (err) {
        done(err);
      }
    });
  }).timeout(config.httpReqTimeout);

  it("it should verify that returned timestamp format is valid", (done) => {
    httpClient.get("/").then(function (response) {
      try {
        var data = response.data;
        assertInt(Date.parse(data["timestamp"]));
        done();
      } catch (err) {
        done(err);
      }
    });
  }).timeout(config.httpReqTimeout);

  it("it should verify that endpoint returns a list of the 2 users", (done) => {
    httpClient.get("/").then(function (response) {
      try {
        var data = response.data;
        var users = data["users"];
        assert.strictEqual(users.length, 2);
        for (i = 0; i < users.length; i++) {
          assertInt(users[i]["id"]);
          assertInt(users[i]["points"]);
        }
        done();
      } catch (err) {
        done(err);
      }
    });
  }).timeout(config.httpReqTimeout);

  it("it should verify that timestamp from the response is set to a time when a query was issued", (done) => {
    httpClient.get("/").then(function (response1) {
      httpClient.get("/").then(function (response2) {
        try {
          var oldDate = new Date(response1.data["timestamp"]);
          var currDate = new Date(response2.data["timestamp"]);
          assert.ok(
            currDate >= oldDate,
            `${currDate.getTime()} should be >= ${oldDate.getTime()}`
          );
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  }).timeout(config.httpReqTimeout * 2);

  it("it should verify that points regenerated after 1 minute", (done) => {
    httpClient.get("/").then(function (response1) {
      setTimeout(
        () =>
          httpClient.get("/").then(function (response2) {
            try {
              var prevUsers = response1.data["users"];
              var currUsers = response2.data["users"];
              prevUsers.sort(compareUser);
              currUsers.sort(compareUser);
              assert.notDeepStrictEqual(prevUsers, currUsers);
              done();
            } catch (err) {
              done(err);
            }
          }),
        updateDelay
      );
    });
  }).timeout(config.httpReqTimeout * 2 + updateDelay);
});
