const { exec } = require("./common")

/**
 * Default process, regard it as router
 * @param {object} data  payload
 * @param {object} header requestHeader
 * @param {object} clients  pod of server
 * @param {pointer} _this context pointer
 * @returns any
 */
async function defaultExtend(data,header,clients,_this){
  const {action, body} = data
  if(action === 'cmd'){
    const result = await exec(body).catch(err=>{console.error(err)})
    return result
  }
  if(action === 'cmdlocal'){
    const result = await exec(body).catch(err=>{console.error(err)})
    _this.server.send({data:result.stdout},header.port,header.address)
  }
  else if(action === 'pod'){
    clients[header.address] = header.port
    l(`${header.address}:${header.port} pod connect success`)
  }
  else if(action === 'getclients'){
    _this.server.send({data:clients},header.port,header.address)
  }
  else if(action === 'query'){
    let { cmd, ip, port } = body
    if(!ip || !port){
      const client = Object.keys(clients)[0]
      ip = clients[client]
      port = client
    }
    l(header,' request come: query')
    _this.server.send({action:'cmd',body:cmd},ip,port,(body,headerin) => {
      // l(234,body,header)
      _this.server.send({data:body.stdout,header:{ip,port}},header.port,header.address)
    })
  }
  return false
}



module.exports = { defaultExtend }