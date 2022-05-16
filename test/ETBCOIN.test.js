var BigNumber = require('bignumber.js');
const ETBCOIN = artifacts.require('ETBCOIN')
const Forwarder = artifacts.require('MinimalForwarder')
const signEIP712Message = require('./signature_helper_funs')



contract("ETBCOIN",async(accounts)=>{
  let etbCoin,forwarder,chainId,verifyingContract,etbContractAddress
  const [owner,sender,recipient,relayer,other] = accounts.slice(0,5)
  const value = 0
  const defaultGas  = 1000000
  const oneETBCOIN = BigNumber(1e+6)
  beforeEach(async()=>{
       etbCoin =await ETBCOIN.deployed()
       forwarder =await Forwarder.deployed()
       chainId=await web3.eth.getChainId();
       verifyingContract= forwarder.address
       etbContractAddress=etbCoin.address
  })


  // access functions
        const getMinterRole = async() => {
            return await etbCoin.MINTER_ROLE.call();
        }

        const getPauserRole = async() => {

            return await etbCoin.PAUSER_ROLE.call();
        }

         
        const grantMinterRole = async(_accountFrom,_minterAccount) => {
         
            const minterRole = await getMinterRole();
           
            await etbCoin.grantRole(minterRole,_minterAccount,{from: _accountFrom});
        }

        const grantpauserRole = async(_accountFrom, _pauserAccount) => {

            const pauserRole = await getPauserRole();

            await etbCoin.grantRole(pauserRole, _pauserAccount, { from: _accountFrom });

        }
        
        const revokeMinterRole = async(_accountFrom,_minterAccount) =>{

            const minterRole = await getMinterRole();
            await etbCoin.revokeRole(minterRole,_minterAccount,{from: _accountFrom});
        }


        const revokePauserRole = async(_accountFrom, _pauserAccount) => {
            const pauserRole = await getPauserRole();

            await etbCoin.revokeRole(pauserRole, _pauserAccount, { from: _accountFrom });
           
        }

        const renounceMinterRole = async(_accountFrom)=>{

            const minterRole = await getMinterRole();

            await etbCoin.renounceRole(minterRole,_accountFrom,{from: _accountFrom})
        }


        const renouncePauserRole = async(_accountFrom) => {
            const pauserRole = await getPauserRole();

            await etbCoin.renounceRole(pauserRole, _accountFrom, { from: _accountFrom });
        }


        
      const approveAndVerfy = async(_accountFrom,_accountTo,_amount) =>{

            const allowanceB = await etbCoin.allowance(_accountFrom, _accountTo)
            await etbCoin.approve(_accountTo, _amount, { from: _accountFrom })
            const allowanceA = await etbCoin.allowance(_accountFrom, _accountTo)
            assert.equal(_amount.plus(allowanceB).toString(), BigNumber(allowanceA).toString()) 


  }
  
  
   const mintAndVerify = async(_accountFrom,_accountTo,_amount)=>{
      
        const totalSupplyB = await etbCoin.totalSupply();

        const balanceOfMinterB = (await etbCoin.balanceOf(_accountTo));

        await etbCoin.mint(_accountTo, _amount, { from: _accountFrom });

        const balanceOfMinterA = (await etbCoin.balanceOf(_accountTo));

        const totalSupplyA = await etbCoin.totalSupply()

        assert.equal(_amount.plus(totalSupplyB).toString(), BigNumber(totalSupplyA).toString());

        assert.equal(_amount.plus(balanceOfMinterB).toString(), BigNumber(balanceOfMinterA).toString());

  }




  const transferAndVerify = async()=>{

   
  }

  const transferFromAndVerify = async()=>{

  }

  const pauseAndVerify = async()=>{


  }

  const unpauseAndVerify = async()=>{

}


/// tests with metatx


 const approveAndVerfyWithMetaTx = async(_accountFrom,_accountTo,_amount) =>{

 
            const allowanceB = await etbCoin.allowance(_accountFrom, _accountTo)
            const data = etbCoin.contract.methods.approve(_accountTo, _amount).encodeABI()

            const nonce = await forwarder.getNonce(_accountFrom)
            const signature = await signEIP712Message(verifyingContract,chainId,_accountFrom,etbContractAddress,value,data,parseInt(nonce.toString()),defaultGas,'ForwardRequest')     

            await forwarder.execute([_accountFrom,etbContractAddress,value,defaultGas,parseInt(nonce.toString()),data],signature,{from:_accountFrom,gas:defaultGas})
            const allowanceA = await etbCoin.allowance(_accountFrom, _accountTo)
            assert.equal(_amount.plus(allowanceB).toString(), BigNumber(allowanceA).toString()) 


  }
  
  
   const mintAndVerifyWithMetaTx = async(_accountFrom,_accountTo,_amount)=>{
       const totalSupplyB = await etbCoin.totalSupply();

        const balanceOfMinterB = (await etbCoin.balanceOf(_accountTo));

        const data =  etbCoin.contract.methods.mint(_accountTo, _amount).encodeABI();

        const nonce = await forwarder.getNonce(_accountFrom)
        const signature = await signEIP712Message(verifyingContract,chainId,_accountFrom,etbContractAddress,value,data,parseInt(nonce.toString()),defaultGas,'ForwardRequest')      
        await forwarder.execute([_accountFrom,etbContractAddress,value,defaultGas,parseInt(nonce.toString()),data],signature,{from:_accountFrom,gas:defaultGas})
        
        const balanceOfMinterA = (await etbCoin.balanceOf(_accountTo));

        const totalSupplyA = await etbCoin.totalSupply()

        assert.equal(_amount.plus(totalSupplyB).toString(), BigNumber(totalSupplyA).toString());

        assert.equal(_amount.plus(balanceOfMinterB).toString(), BigNumber(balanceOfMinterA).toString());
     

  }

   const transferAndVerifyWithMetaTx = async()=>{

   
  }

   const transferFromAndVerifyWithMetaTx = async()=>{

  }

  const pauseAndVerifyWithMetaTx = async()=>{


  }

  const unpauseAndVerifyWithMetaTx = async()=>{

  
  }







  it("1. approve token and verify",async()=>{
  
   await approveAndVerfy(owner,sender,oneETBCOIN)


  })


  it("2. approve token with metatx and verify",async()=>{
  
   await approveAndVerfyWithMetaTx(sender,recipient,oneETBCOIN) 
   
  })


  it("3. mint and verify",async()=>{

   await mintAndVerify(owner,recipient,oneETBCOIN)
  })

  it("4. mint and verify with MetaTX",async()=>{

   await mintAndVerifyWithMetaTx(owner,other,oneETBCOIN)
  
})



})
