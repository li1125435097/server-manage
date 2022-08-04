const { exec } = require("./common")


async function defaultExtend(data,header){
  const {action, body} = data
  if(action === 'cmd'){
    const result = await exec(body).catch(err=>{throw err})
    return result
  }
  return false
}



module.exports = { defaultExtend }