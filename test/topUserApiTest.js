const config = require("./config");
const assert = require("assert");
const axios = require("axios");
const httpClient = axios.create({
  baseURL: "http://" + config.serverHost + "/",
  timeout: 10000, // specifies the number of milliseconds before the request times out
});

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
  it("it should GET a two top users with most points", (done) => {
    httpClient.get("/").then(function (response) {
      try {
        var data = response.data;
        assert.strictEqual(response.status, 200);
        assertInt(Date.parse(data["timestamp"]));
        assert.ok(data["users"], "data doesn't have 'users' field");
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
});

describe("/GET top users", () => {
  it("timestamp from the response is set to a time when a query was issued", (done) => {
    httpClient.get("/").then(function (response1) {
      httpClient.get("/").then(function (response2) {
        try {
          console.log(response1.data["timestamp"]);
          console.log(response2.data["timestamp"]);
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
});

describe("/GET top users", () => {
  var updateDelay = 60000; // 1 minute
  it("points regenerated after 1 minute", (done) => {
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
