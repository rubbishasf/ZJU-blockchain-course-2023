import {Button, Image} from 'antd';
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {BorrowYourCarContract, web3} from "../utils/contract";
import './index.css';
import {Simulate} from "react-dom/test-utils";
import {BrowserRouter as Router,Link,Route} from 'react-router-dom'
//import {car0,car1,car2,car3,car4,car5} from '../asset'
//import car0 from '../asset/car0.jpg'

import error = Simulate.error;
import {car0} from "../asset";

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const MainPage = () => {
    //账户信息
    const [account, setAccount] = useState('')
    const [managerAccount, setManagerAccount] = useState('')
    //添加可以领车的用户
    const [validuser, setValidUser] = useState('')
    //发行NFT
    const [recipient, setRecipient] = useState('')
    const [model, setModel] = useState('')
    //拥有的车
    const [ownCar, setOwnCar] = useState([])
    const [ownCarModel, setOwnCarModel] = useState([])
    //可借的车
    const [availableCar, setAvailableCar] = useState([])
    const [availableCarModel, setAvailableCarModel] = useState([])
    //查询车辆信息
    const [carToken, setCarToken] = useState('')
    const [carOwner, setCarOwner] = useState('')
    const [carBorrower, setCarBorrower] = useState('')
    //借车
    const [duration, setDuration] = useState('')
    const [car, setCar] = useState('')

    const zeroAddress = '0x0000000000000000000000000000000000000000'
    const p = "gw"



    const handleCarTokenChange = (event:any)=>{
        setCarToken(event.target.value)
    }
    const handleValidUserChange = (event: any) => {
        setValidUser(event.target.value);
    };
    const handleRecipientChange = (event: any) => {
        setRecipient(event.target.value);
    }
    const handleModelChange = (event: any) => {
        setModel(event.target.value);
    }
    const handleDurationChange = (event :any)=>{
        setDuration(event.target.value)
    }
    const handleCarChange = (event:any)=>{
    setCar(event.target.value)
    }

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
                    setAccount(accounts[0])
                } else
                    console.log("no accounts")
            } else
                console.log("no metamask")
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
            const getBorrowYourCarContractInfo = async () => {
                if (BorrowYourCarContract) {
                    try {
                        const ma = await BorrowYourCarContract.methods.owner().call()
                        setManagerAccount(ma)
                        // const oc = await BorrowYourCarContract.methods.getOwnedCars(account).call()
                        // console.log(oc)
                        // setOwnCar(oc)
                        const ac = await BorrowYourCarContract.methods.getAvailableCars().call()
                        //console.log(ac)
                        setAvailableCar(ac)
                        const acm = await BorrowYourCarContract.methods.getAvailableCarModels().call()
                        setAvailableCarModel(acm)
                    }catch (error:any){
                        alert(error.message)
                    }


                } else {
                    alert('Contract not exists.')
                }
            }
            getBorrowYourCarContractInfo()
        }
        , [])
    useEffect(() => {
        const getAccountInfo = async () => {


            if (BorrowYourCarContract) {
                try {
                    const ab = await BorrowYourCarContract.methods.getOwnedCars(account).call()
                    setOwnCar(ab)

                    const ocm = await BorrowYourCarContract.methods.getOwnedCarModels(account).call()
                    setOwnCarModel(ocm)
                } catch (error: any) {
                    alert(error.message)
                }
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    // const getOwnedCars = async (event :any) => {
    //     event.preventDefault()
    //     if (account === '') {
    //         alert('You have not connected wallet yet.')
    //         return;
    //     }
    //     if (BorrowYourCarContract) {
    //         try {
    //             const result = await BorrowYourCarContract.methods.getOwnedCars().call({from: account})
    //             console.log(result)
    //         } catch (error: any) {
    //             alert(error.message)
    //         }
    //     }
    // }
    const addValidUser = async (event:any) => {
        event.preventDefault()

        if (account === '') {
            alert('You have not connected wallet yet.')
            return;
        } else if (account !== managerAccount) {
            alert('Only manager can invoke this method.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                console.log(validuser)
                await BorrowYourCarContract.methods.addValidUser(validuser).send({
                    from: account
                })
                console.log("add valid user successfully")
                alert("add valid user successfully");
            } catch (error: any) {
                alert(error.message)
            }
        } else{
            alert("contract not exists")
        }
    }

    const mintCarNFT = async (event : any) => {
        event.preventDefault()

        if (account === '') {
            alert('You have not connected wallet yet.')
            return;
        } else if (account !== managerAccount) {
            alert('Only manager can invoke this method.')
            return
        }
        if (BorrowYourCarContract) {
            try {
                console.log(recipient)
                console.log(model)
                const result = await BorrowYourCarContract.methods.mintCarNFT(recipient, model).send({from: account})
                console.log(result)
                alert("add successfully")
            } catch (error: any) {
                alert(error.message)
            }
        }

    }
    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{chainId: chain.chainId}]
                    })
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    const getCarOwner = async (event:any)=>{
        event.preventDefault()

        if (account === '') {
            alert('You have not connected wallet yet.')
            return;
        }

        if (BorrowYourCarContract) {
            try {
                const co = await BorrowYourCarContract.methods.getCarOwner(carToken).call({from: account})
                const cb = await BorrowYourCarContract.methods.getCarBorrower(carToken).call({from:account})
                setCarOwner(co)
                setCarBorrower(cb)
            } catch (error: any) {
                alert(error.message)
            }
        }




    }

    const borrowCar = async (event:any)=> {
        event.preventDefault()

        if (account === '') {
            alert('You have not connected wallet yet.')
            return;
        }

        if (BorrowYourCarContract) {
            try {
                const days = parseInt(duration, 10)
                if(days < 0) {
                    alert("please input a positive number")
                    return
                }
                const seconds = days * 24 * 60 * 60;
                await BorrowYourCarContract.methods.borrowCar(car,seconds).send({from:account})
            } catch (error: any) {
                alert(error.message)
            }
        }
    }

    return (
        <div className='container'>

            <div className='main'>
                <h1>汽车借用系统</h1>
                <div>管理员地址：{managerAccount}</div>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                </div>

                <div className='owncar'>
                    <div>当前用户所拥有的汽车token：</div>
                    <ul>
                        {ownCar.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <div>当前用户所拥有的汽车型号：</div>
                    <div>
                        {ownCarModel.map((item, index) => (
                            <img key={index} src={require(`../asset/${item}.jpg`)} alt={item}/>
                        ))}
                    </div>
                </div>
                <div className='avilablecar'>
                    <div>当前可借用的汽车token：</div>
                        <ul>
                        {availableCar.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <div>当前可借用的汽车型号：</div>
                    <div>
                        {availableCarModel.map((item, index) => (
                            <img key={index} src={require(`../asset/${item}.jpg`)} alt={item}/>
                        ))}
                    </div>
                </div>

                <div className='operation'>
                    <div className='buttons'>
                        <form onSubmit={addValidUser}>
                            <label>添加可以领取车辆的用户：</label>
                            <div>
                                <label htmlFor="validuser">Useraddress:</label>
                                <input
                                    type="text"
                                    id="validuser"
                                    value={validuser}
                                    onChange={handleValidUserChange}
                                />
                            </div>

                            <button type="submit">addvaliduser</button>
                        </form>
                        <form onSubmit={mintCarNFT}>
                            <label>发行车辆NFT：</label>
                            <div>
                                <label htmlFor="Recipient">Recipientaddress:</label>
                                <input
                                    type="text"
                                    id="Recipient"
                                    value={recipient}
                                    onChange={handleRecipientChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="model">model:</label>
                                <input
                                    type="text"
                                    id="model"
                                    value={model}
                                    onChange={handleModelChange}
                                />
                            </div>
                            <button type="submit">mintCarNFT</button>
                        </form>

                        <form onSubmit={getCarOwner}>
                            <label>查找汽车主人和借用者</label>
                            <div>
                                <label htmlFor="validuser">carToken:</label>
                                <input
                                    type="text"
                                    id="carToken"
                                    value={carToken}
                                    onChange={handleCarTokenChange}
                                />
                            </div>
                            <button type="submit">getOwner</button>
                            <div>
                                {`The owner is: ${carOwner}`}
                            </div>
                            <div>
                                {carBorrower == zeroAddress ? `当前无借用者` : `The borrower is ${carBorrower}`}
                            </div>

                        </form>


                        <form onSubmit={borrowCar}>
                            <label>借用车辆</label>
                            <div>
                                <label htmlFor="car">carToken:</label>
                                <input
                                    type="text"
                                    id="borrower"
                                    value={car}
                                    onChange={handleCarChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="duration">duration:</label>
                                <input
                                    type="number"
                                    id="time"
                                    value={duration}
                                    onChange={handleDurationChange}
                                />
                                {duration == '' ? <p>请在上面输入要借用的天数</p> :null}
                            </div>
                            <button type="submit">borrow</button>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    )

}
export default MainPage
