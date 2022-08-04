global.l = console.log
const { Server } = require('./server')
const { client } = require('./client')
const { getIp:_getIp } = require('./common')

async function server_manage(serverIP,serverPort,protocol='udp6',getIp=_getIp){
  let ip = 0
  if(protocol === 'udp6') ip = await getIp(6)
  else ip = await getIp()

  if(!ip) console.error(new Error('本机IP获取失败！！！'))
    
  if(ip = serverIP) return new Server(serverPort,protocol)
  client(serverPort,serverIP,protocol)
  
}


module.exports = { server_manage, Server, client }

