var githubator = require('./githubator')
var xmlescape = require('xml-escape')
const log = require('./log')('agpw:github')

/**
 * Find possible asana ids in various parts of the pull request webhook body.
 * @param {string} data a PR event body from github
 */
module.exports.getAsanaId = function (data) {
  var toMatch = data['pull_request']['title']
  return match(toMatch)
}

module.exports.addAsanaTaskToGithubPr = async function (githubData, asanaData, replacementGithubator) {
  log.trace('addAsanaTaskToGithubPr')
  if (replacementGithubator) {
    githubator = replacementGithubator
  }
  var url = 'https://app.asana.com/0/0/' + asanaData.gid
  var comment = '<strong>Linked Asana:</strong> ' + xmlescape(asanaData.name) + '\n<a href="' + url + '">' + url + '</a>'
  await githubator.addComment(githubData.apiUrl, comment)
}

module.exports.shouldProcess = function (data) {
  log.trace('shouldProcess')
  var action = data.action
  if (action !== 'edited' && action !== 'opened') {
    return false
  }

  var title = data.pull_request.title
  var change = data.changes && data.changes.title && data.changes.title.from ? data.changes.title.from : null
  var titleId = match(title)

  if (action === 'opened' && titleId !== null) {
    return true
  }
  if (change === null) {
    return false
  }
  var changeId = match(change)
  return titleId != null && titleId !== changeId && change !== null
}

function match (toMatch) {
  var match = /^([0-9]{4,10})\s+.*/.exec(toMatch)
  return match != null ? match[1] : null
}
