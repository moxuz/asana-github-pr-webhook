const github = require('./github');

test('webhook id in name 4 chars or longer', () => {

  var baseData = {
    "action": "closed",
    "number": 1,
    "pull_request": {
      "url": "https://api.github.com/repos/Codertocat/Hello-World/pulls/1",
      "title": "Update the README with new information"
    },
    "changes": { "title": { "from": 'something' } }
  }

  baseData.pull_request.title = "1234 something";
  expect(github.getAsanaId(baseData)).toEqual('1234');

  baseData.pull_request.title = "1234 something";
  expect(github.getAsanaId(baseData)).toEqual('1234');

  baseData.pull_request.title = "something 1234";
  expect(github.getAsanaId(baseData)).toEqual(null);

  baseData.pull_request.title = "12345 something";
  expect(github.getAsanaId(baseData)).toEqual("12345");

  baseData.pull_request.title = "123 something";
  expect(github.getAsanaId(baseData)).toEqual(null);
});

test('should process', () => {
  var baseData = {
    "action": "edited",
    "number": 1,
    "pull_request": {
      "url": "https://api.github.com/repos/Codertocat/Hello-World/pulls/1",
      "title": "Update the README with new information"
    },
    "changes": { "title": { "from": 'something' } }
  }

  baseData.pull_request.title = "1234 something";
  expect(github.shouldProcess(baseData)).toEqual(true);

  baseData.pull_request.title = "1234 something";
  baseData.changes.title.from = "1234 xxoc";
  expect(github.shouldProcess(baseData)).toEqual(false);

  baseData.pull_request.title = "1234 somethin";
  baseData.changes.title.from = "1234 something";
  expect(github.shouldProcess(baseData)).toEqual(false);

  baseData.pull_request.title = "1234 something";
  baseData.changes.title.from = "1235 xxoc";
  expect(github.shouldProcess(baseData)).toEqual(true);

  baseData.changes.title.from = null;
  expect(github.shouldProcess(baseData)).toEqual(false);

  baseData.pull_request.title = "1234 something";
  baseData.changes.title.from = "1235 xxoc";
  baseData.action = "edited";
  expect(github.shouldProcess(baseData)).toEqual(true);

  baseData.action = "closed";
  expect(github.shouldProcess(baseData)).toEqual(false);

  baseData.action = "processed";
  baseData.pull_request.title = "1234 something";
  baseData.changes.title.from = "1235 xxoc";
  expect(github.shouldProcess(baseData)).toEqual(false);

  baseData.action = "opened";
  baseData.pull_request.title = "1234 something";
  baseData.changes =  null;
  expect(github.shouldProcess(baseData)).toEqual(true);
});
