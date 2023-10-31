# 汽车借用系统



## 如何运行

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
3. 在`./contracts/hardhat.config.ts`中修改自己的ganache的url以及对应账户的私钥。

4. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```
5. 编译成功后在`./contracts`中部署合约，运行如下的命令：
   ```bash
   npx hardhat run ./scripts/deploy.ts --network ganache
   ```
部署成功后将`./frontend/src/utils/contract-address.json`中合约的地址修改为刚刚部署成功后显示的地址。
6. 在 `./frontend` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
7. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm run start
    ```
   接下来可以使用Chrome浏览器进入"http://localhost:3000"来访问此系统了

## 功能实现分析

### 1. 发行NFT
在部署合约时将合约的部署者设置为管理员，使用一个`mapping(address=>bool)`来记录一个用户是否有资格获得carNFT。管理员可以添加validuser来向这些用户分发NFT。
在发行carNFT时，合约中会记录当前已经发行的carNFT的数量，以及各个NFT的owner，相对应也有各个用户所拥有的所有carNFT。

**提示** :当前库中存放汽车的图片仅有"car0"~"car5"，如果发行其他model的车则不会显示图片。

### 2.查看当前用户所拥有的汽车
用户在连接钱包后即可实时地看到自己所拥有的汽车，该记录由一个`mapping(address=>uint256[])`来记录,可以通过其直接返回对应的结果。

### 3. 查看当前可借用的汽车
用户在连接到钱包后可以实时看到可借用的汽车列表，通过查看借用记录（由一个struct数组维护）来返回结果：
```solidity
struct Car {
   address owner;
   address borrower;
   uint256 borrowUntil;
}
```
如果没有borrower或者borrowUntil小于当前的时间，则认为该汽车是可借用的。
### 4. 查找一辆汽车的主人和借用者
用户可以在网页中输入CarToken(相当于车牌号)来对一辆车的信息进行查询，包括它的主人和借用者。主人的信息在发行CarNFT时已经记录，借用者也可以通过查询上面的结构体数组来获得，如果borrower不为0且borrowUntil大于当前时间，则有借用者，否则没有。

### 5. 借用车辆

用户可以输入CarToken和要借用的天数来借用一辆车，这辆车必须在上面的可借用汽车列表中，否则会失败。通过调用ERC721的`approval`函数，持有人将 NFT 的所有权授权给借用者。
为了与用户交互方便，在用户输入时输入天数，但我们在solidity中使用时间戳记录时间，因此需要将该时间换算为秒。


## 项目运行截图

连接钱包
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194522.png)
非管理员调用addvaliduser函数
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194540.png)
管理员调用addvaliduser函数
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194547.png)
非管理员发行CarNFT
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031195331.png)
管理员发行CarNFT
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194554.png)
发行后显示可借用的汽车型号（因为不是发行给当前用户的，所有当前用户拥有的为空）
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194559.png)
更换为拥有汽车的账户：
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194603.png)
查找汽车主人和借用者

![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194607.png)
再更换一个用户借用这辆车
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031195140.png)
借用后显示无可借用的车：
![Alt text](screenshot/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20231031194611.png)
## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- ERC-4907 [参考实现](https://eips.ethereum.org/EIPS/eip-4907)

