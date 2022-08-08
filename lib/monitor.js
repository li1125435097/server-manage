const {Udp} = require("./udp")
const EventEmitter = require('events')
const event = new EventEmitter()

/**
 * 
 * @param {number} serverPort 
 * @param {string} serverIp 
 * @param {string} protocol 
 * @returns 
 */
function monitor(serverPort,serverIp,protocol='udp4'){
  
  const client = new Udp(
    (body,header) => { event.emit('come',body,header) }
    ,0,protocol
  )
  l('server-mange检测客户端启动成功')
  
  
  /**
   * 
   * @param {string} type  text in [cmd,gc,close]
   * @param {string} data  cmd
   * @param {number} timeout 
   * @returns 
   */
  function getData(type,data,ip,port,timeout=1000){
    if(type === 'cmd') client.send({action:'query',body:{cmd:data,ip,port}},serverPort,serverIp)
    else if(type === 'cmdl') client.send({action:'cmdlocal',body:data},serverPort,serverIp)
    else if(type === 'gc') client.send({action:'getclients'},serverPort,serverIp)
    else if(type === 'close') client.close()
  
    return new Promise((resolve,reject)=>{
      let timer = setTimeout(() => { reject(new Error('Request timeout: '+timeout+'mm')) }, timeout);
      event.on('come',function(body,header){
        clearTimeout(timer)
        resolve({body,header})
      })
    })
   
  }

  return getData
}




module.exports = { monitor }

