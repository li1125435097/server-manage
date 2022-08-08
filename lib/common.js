const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)

const getIp = async function(index){
  let cmd = index === 6 ? 'ifconfig | grep inet'+index+'| grep scopeid' : 'ifconfig | grep "inet "'
  let ip = await exec(cmd)
  ip = ip.stdout.split('\n')
  ip = ip.map(v=>v.split(" ")[1]).filter(v=>{return v && v != '127.0.0.1' && v != '::1'})
  return ip[0] || ''
}

const getUuid = () => { return Math.random().toString(36).slice(2) }

module.exports = { exec, getIp, getUuid }
