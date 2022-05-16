const ETBCOIN = artifacts.require('ETBCOIN')
const Forwarder = artifacts.require('MinimalForwarder')

module.exports = async (deployer)=>{


    deployer.deploy(Forwarder).then((forwarder)=>

         deployer.deploy(ETBCOIN,"ETBCOIN","ETB",forwarder.address,{ overwrite: false, gas: 6721975 }).then((etb)=>{
             
            console.log("deployed ETBCOIN address:", etb.address)
         }).catch((error)=>{
             console.log(error)
         })
    )
}