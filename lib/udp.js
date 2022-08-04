const dgram = require('dgram')
let callbackStack = {}

/**
 * 
 * @param {function} msgcb    callback after receive data
 * @param {number} port       init port
 * @param {string} protocol   udp4 or udp6
 */
function Udp( msgcb, port=12345, protocol){

  this.port = port
  this.protocol = protocol
  this.socket = dgram.createSocket(protocol)

  this.socket.on('error', (err) => { l(`server error:\n${err.stack}`); socket.close(); })
  this.socket.on('listening', () => { l(`server listening ${this.socket.address().address}:${this.socket.address().port}`) })
  
  this.socket.on('message', (body, header) => {
    // l(`server got: ${body} from ${header.address}:${header.port}`)
    body = JSON.parse(body)
    let callback = callbackStack[body.requestId]
    // l(body,callback,callbackStack,header,'**************')
    // l(this.port,'接收了信息')
    if(callback){ callback.func(body,header); delete callbackStack[body.requestId] }
    else if(typeof msgcb === 'function') msgcb(body, header)
    // l(this.port,'接收了信息处理完毕')
  })
  
  this.socket.bind(this.port)

  garbageClear(callbackStack)    // Recycle useless connections
  
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
  
  // define dataId
  let isResponse = obj.requestId
  obj.requestId = isResponse ? isResponse : Math.random().toString(36).slice(2)
  
  // send payload
  let buffer = Buffer.from(JSON.stringify(obj))
  let target_port = tport || this.port
  this.socket.send(buffer, target_port, tip, (err) => {
    if(err) console.error(err)
    if(typeof cb === 'function' && !isResponse) callbackStack[obj.requestId] = {func:cb,ts:Date.now()}
    // l(callbackStack,'发送信息到：',target_port)
  });
}

// close socket
Udp.prototype.close = function(){
  this.socket.close()
}


function garbageClear(callbackStack){
  setInterval(()=>{
    let value,time=Date.now()
    for (const key in callbackStack) {
      value = callbackStack[key]
      if(time-value.ts > 6e4) delete callbackStack[key]
    }
  },3e5)
}


module.exports = { Udp }
