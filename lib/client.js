const {Udp} = require("./udp")
const { defaultExtend } = require("./default_extend")


function client(serverPort,serverIp,protocol='udp4'){
  let callback = async (body,header) => {
    let result = await defaultExtend(body,header)           // Inplement cmd function of server
    if(body.requestId) result.requestId = body.requestId   
    if(result) client.send(result,serverPort,serverIp)
  }
  
  const client = new Udp(callback,0,protocol)
  l('server-mange客户端启动成功')
  client.send({action:'pod'},serverPort,serverIp)   // As pod send ip to server
}


module.exports = { client }

