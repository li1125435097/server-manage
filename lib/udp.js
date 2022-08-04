const dgram = require('dgram')
global.l = new Function()

/**
 * 
 * @param {function} msgcb    callback after send success 
 * @param {number} port       init port
 * @param {string} protocol   udp4 or udp6
 */
function Udp( msgcb, port=12345, protocol='udp6', log=true){

  this.port = port
  this.protocol = protocol
  this.socket = dgram.createSocket(protocol)
  l = log ? console.log : l

  this.socket.on('error', (err) => {
    l(`server error:\n${err.stack}`)
    socket.close();
  })

  this.socket.on('message', (msg, rinfo) => {
    l(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    if(typeof msgcb === 'function') msgcb(msg, rinfo)
  })

  this.socket.on('listening', () => {
    const address = this.socket.address();
    l(`server listening ${address.address}:${address.port}`);
  })
  this.socket.bind(this.port)
  
}


/**
 * 
 * @param {object} obj    payload
 * @param {number} tport  target port 
 * @param {string} tip    target ip address
 * @param {function} cb   callback
 * @returns 
 */
Udp.prototype.send = function(obj,tport,tip,cb){
  if(typeof obj !== 'object') return false
  let buffer = Buffer.from(JSON.stringify(obj))
  let target_port = tport || this.port
  this.socket.send(buffer, target_port, tip, (err) => {
    if(err) throw err
    if(typeof cb === 'function') cb()
  });
}

// close socket
Udp.prototype.close = function(){
  this.socket.close()
}

module.exports = { Udp }
