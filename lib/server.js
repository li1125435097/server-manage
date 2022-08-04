const { Udp } = require("./udp")
const { defaultExtend } = require("./default_extend")
let clients = {}

/**
 * 
 * @param {number} port 
 * @param {function} callback 
 */
function Server(port,callback){
  this.cb = function(msg,rinfo){
    const { address, port } = rinfo
    if(!clients[address]) clients[address]=port
    msg = JSON.parse(msg.toString())

    if(defaultExtend(msg,rinfo)) return
    callback(msg,rinfo)
  }
  
  this.server = new Udp( this.cb, port )
}

Server.prototype.getClients = function(){
  return clients
}

Server.prototype.cmd = function(cmd,port,ip,cb){
  this.server.send({action:'cmd',body:cmd},port,ip,cb)
}

Server.prototype.cmda = function(cmd,cb){
  for(let k in clients){
    this.server.send({action:'cmd',body:cmd},clients[k],k,cb)
  }
}

let server = new Server(12346,new Function())
setTimeout(() => {
  server.cmda('ls')
}, 10e3);

module.exports = { Server }
