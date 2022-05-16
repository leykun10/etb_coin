const EIP712DomainType = [

    {"name":"name","type":"string"}
    ,
    {"name":"version","type":"string"}
    ,
    {"name":"chainId","type":"uint256"}
    ,
    {"name":"verifyingContract","type":"address"}
]


const ForwardRequestType = [
  
    {"name":"from","type":"address"}
    ,
    {"name":"to","type":"address"}
    ,
    {"name":"value","type":"uint256"}
    ,
    {"name":"gas","type":"uint256"},

    {"name":"nonce","type":"uint256"}
    ,
    {"name":"data","type":"bytes"}
]




const composeDomain = (chainId,verifyingContract)=>{
    const domain = {name:"MinimalForwarder",version:"0.0.1","chainId":chainId,"verifyingContract":verifyingContract}
    
    return domain


}

const composeMessage =(from,to,value,data,nonce,gas)=>{

    const message = {"from":from,"to":to,"value":value,"gas":gas,"nonce":nonce,"data":data}
    
    return message

}


const getEIP712Message = (verifyingContract,chainId,from,to,value,data,nonce,gas,primaryType)=>{


    const eip712Message = {
        
         types:{EIP712Domain:EIP712DomainType,
          ForwardRequest:ForwardRequestType},
         primaryType:primaryType,
         domain:composeDomain(chainId,verifyingContract),
         message:composeMessage(from,to,value,data,nonce,gas)
    }

    return eip712Message


}


const signEIP712Message = async (verifyingContract,chainId,from,to,value,data,nonce,gas,primaryType)=>{
    const msgParam = getEIP712Message(verifyingContract,chainId,from,to,value,data,nonce,gas,primaryType)
    return new Promise((resolve,reject)=>{
      web3.currentProvider.send({
        method: 'eth_signTypedData',
        params: [from,msgParam],
        from: from,
    },(error,signature)=>{
        if(error){
            console.log(error)
            reject(error)
        }
        resolve(signature.result)
    })
   })


}
    


module.exports=signEIP712Message 
