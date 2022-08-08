const { Udp } = require("./udp")
const { defaultExtend } = require("./default_extend")
let clients = {}

/**
 * 
 * @param {number} port 
 */
function Server(port,protocol){
  let _this = this
  this.callback = async (msg,rinfo) => {
    await defaultExtend(msg,rinfo,clients,_this)    // register client-side
  }
  
  this.server = new Udp( this.callback, port, protocol )
  l('server-mange服务端启动成功**********')
}

Server.prototype.getClients = function(){
  return clients
}

Server.prototype.cmd = function(cmd,port,ip,cb){
  this.server.send({action:'cmd',body:cmd},port,ip,cb)
}

Server.prototype.cmda = function(cmd,clientLs,cb){
  clients = clientLs || clients
  for(let k in clients){
    this.server.send({action:'cmd',body:cmd},clients[k],k,cb)
  }
}

module.exports = { Server }
