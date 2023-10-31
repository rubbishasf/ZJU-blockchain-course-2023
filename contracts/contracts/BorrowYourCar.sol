// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BorrowYourCar is ERC721{

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information

    uint256 private tokenid;
    address public owner;

    mapping(uint256 => string) private carmodel;//汽车型号
    mapping(address => bool) private validuser;//用户是否有资格领取汽车
    mapping(address => uint256[]) private ownerCar;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC721("CarNFT", "CAR"){
        tokenid = 0;
        owner = msg.sender;
    }

//    function helloworld() pure external returns(string memory) {
//        return "hello world";
//    }

    // ...
    // TODO add any logic if you want

    // 获取当前还没有借用的汽车列表
    function getAvailableCars() public view returns (uint256[] memory) {
        uint256 totalCars = tokenid;
        uint256[] memory availableCars = new uint256[](totalCars);
        uint256 availableCarCount = 0;

        for (uint256 i = 0; i < totalCars; i++) {
            if (cars[i].borrower == address(0) || cars[i].borrowUntil < block.timestamp) {
                availableCars[availableCarCount] = i;
                availableCarCount++;
            }
        }

        uint256[] memory result = new uint256[](availableCarCount);
        for (uint256 j = 0; j < availableCarCount; j++) {
            result[j] = availableCars[j];
        }

        return result;
    }


    function getCarBorrower(uint32 carTokenId) public view returns (address) { // return the car token ID of the current borrower of a car.

        if(carTokenId < tokenid && cars[carTokenId].borrowUntil > block.timestamp)
            return cars[carTokenId].borrower; // return the borrower of the specified car.
        return address(0);
    }

    function borrowCar(uint256 carTokenId, uint256 duration) public returns (bool){
        uint256 startTime = block.timestamp;
        if(carTokenId < tokenid && cars[carTokenId].borrowUntil > startTime) return false;
        cars[carTokenId].borrower = msg.sender;
        cars[carTokenId].borrowUntil = startTime + duration;
        emit Approval(cars[carTokenId].owner, msg.sender, carTokenId);

        emit CarBorrowed(carTokenId, msg.sender, startTime ,duration);
        return true;
    }

    function mintCarNFT(address recipient, string memory model) onlyOwner public returns (uint256) {
        require(validuser[recipient], "The recipient is not valid to have Car NFTs");


        uint256 newtokenid = tokenid;
        tokenid++;
        ownerCar[recipient].push(newtokenid);
        _mint(recipient, newtokenid);

        cars[newtokenid].owner = recipient;

        setCarModel(newtokenid, model);

        return newtokenid;
    }
//将汽车型号与token关联起来
    function setCarModel(uint256 token, string memory model) internal virtual {
        carmodel[token] = model;
    }

    function getCarModel(uint256 token) public view returns (string memory) {
        require(token < tokenid, "Car NFT does not exist");
        return carmodel[token];
    }

    function getCarOwner(uint256 token) public view returns (address){
        require(token < tokenid, "this car doesn't have an owner");
        return cars[token].owner;
    }

    function addValidUser(address user) onlyOwner public {
        require(!validuser[user], "User is already eligible");
        validuser[user] = true;
    }

    function removeValidUser(address user) onlyOwner public {
        require(validuser[user], "User is not eligible");
        validuser[user] = false;
    }

//    function getCarAmounts() public view returns (uint){
//        return carmodel.length;
//    }

    function getOwnedCars(address user) public view returns (uint256[] memory) {
       // uint256 balance = balanceOf(msg.sender);
        uint256 balance = ownerCar[user].length;
        uint256[] memory carIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            carIds[i] = ownerCar[user][i];
        }
        return carIds;
    }
}
