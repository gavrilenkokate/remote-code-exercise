## Questions

Given this spec:

1. What kind of tests would you conduct to make sure it was well built

Answer:

- Acceptance criteria testing (based on the spec)
- Performance tests (Response Time)

2. In your opinion what would be the 3 more important things to test here?

- check the http response code
- data returned by the service is in valid format
- data (users points) is regenerated every 60 sec

3. What would you improve in this spec?

   3.1 Define a logic to break a tie for users that have the same points value.

Example:

```json
[
  {
    "id": 1,
    "points": 10
  },
  {
    "id": 5,
    "points": 10
  },
  {
    "id": 20,
    "points": 10
  }
]
```

What would be the right order of the first two users ?
Possible options:

- break the tie by user `id`, i.e. data returned is sorted by user id in ascending order:

Valid output : `[ {"id": 1, "points" : 10}, {"id":5, "points": 10} ]`
Invalid output: `[ {"id":5, "points":10}, {"id":1, "points": 10}]`

- Return `users` in random order, i.e. all two variants are correct.

  3.2 In the case if we want to verify that points are randomly generated how can we test a scenario when a newly generated data
  have exactly the same top users (i.e. same users have old points). Although, the possibility of such case is extremely low,
  it should be clearly stated in the spec.

  3.3 Performance/Load testing.

There no requirements for response time and throughput (requests/sec) for the given REST service.

## Used tools and framefworks: Node.js, Axios(HTTP client for the browser and node.js), Mocha.js, Mochawesome.

## Test reports

Test reports can be found in `remote-code-exercise/mochawesome-report`

## How to run

1. Install Node.js
2. Clone github repo: `git clone ...`
3. From the project folder run `npm install`
4. From the project folder run `npm test`
