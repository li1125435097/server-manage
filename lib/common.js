const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)


module.exports = { exec }
