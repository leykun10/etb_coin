const ETBCOIN = artifacts.require('ETBCOIN')
const Forwarder = artifacts.require('MinimalForwarder')
const signEIP712Message = require('./signature_helper_funs')



contract("ETBCOIN",async(accounts)=>{
  let etbCoin,forwarder,chainId,verifyingContract
  beforeEach(async()=>{
       etbCoin =await ETBCOIN.deployed()
       forwarder =await Forwarder.deployed()
       chainId=await web3.eth.getChainId();
       verifyingContract= forwarder.address
  })


  it("Transfer Tokens without MetaTx",async()=>{
     const balanceb =await etbCoin.balanceOf(accounts[0]) 
     const balanceReceiverb =await etbCoin.balanceOf(accounts[2])
 
     await etbCoin.transfer(accounts[2],1000000,{from:accounts[0]})

     const balanceA =await etbCoin.balanceOf(accounts[0])
     const balanceReceiverA = await etbCoin.balanceOf(accounts[2])
 
  })

  it("Transfer Tokens with MetaTx",async ()=> {
     
     const data = await etbCoin.contract.methods.transfer(accounts[1],1000000).encodeABI()
     const nonce = await forwarder.getNonce(accounts[0])
     
     const balanceb =await etbCoin.balanceOf(accounts[0]) 
     const balanceReceiverb =await etbCoin.balanceOf(accounts[1])
     const signature = await signEIP712Message(verifyingContract,chainId,accounts[0],etbCoin.address,0,data,parseInt(nonce.toString()),1000000,'ForwardRequest')     
     await forwarder.execute([accounts[0],etbCoin.address,0,1000000,parseInt(nonce.toString()),data],signature,{from:accounts[0],gas:1000000})

     const balanceA =await etbCoin.balanceOf(accounts[0])
     const balanceReceiverA = await etbCoin.balanceOf(accounts[1])
     
})

})
