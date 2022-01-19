import "./styles.css";

import Web3 from "web3";
import { ethers } from "ethers";
import MarketABI from "./Market.json";
import CollectionABI from "./Collection.json";

var wallet = "0x7C6Dd350362a5C78419f3a580634EAc12B90d6c0";
var address = "0x06f9bFcc077499D7EFA4c613D2FFcC9a13641FAC";
var collectionAddress = "0x2D0F526aA9869C0B51E96416340d78519df941A6";
var chainId;
var web3;
var voucher = {
  endTime: 20,
  price: 10000,
  royal: 10,
  saleType: 1,
  signature:
    "0xc4f05144df1c90e0254c038e6cdc26a0ac23e2c27183eec8aa74ea00c98c605c3a5ba2fd1616bef18e2f621764cb7d85f7b8eeff75061cd8ead1e689c4239b451b",
  tokenAddress: "0x2D0F526aA9869C0B51E96416340d78519df941A6",
  uri: "m4v.me"
};
var signer;

async function test() {
  await connectWallet();
  voucher = await createVoucher("m4v.me", collectionAddress, 10, 10000, 1, 20);
  console.log(voucher);
}

async function buyToken() {
  await connectWallet();
  const contract = new ethers.Contract(address, MarketABI, signer);

  const x = await buy(contract, voucher);
  console.log(x, "sssss");
}

async function buy(contract, voucher) {
  console.log("BUYING>>>>");
  const options = { value: voucher.price, gasLimit: 250000 };
  return contract.mintAndBuyItem(voucher, options);
}

async function getContract(address) {
  console.log("Geting... contract");
  web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(MarketABI, address);
  return contract;
}

async function connectWallet() {
  console.log("connecting ....");

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider", provider);
    await provider.send("eth_requestAccounts");
    signer = provider.getSigner();
    console.log(signer, "connected");

    return true;
  }
  console.log("cannot connect");
  return false;
}

async function createVoucher(
  uri,
  tokenAddress,
  royal,
  price,
  saleType,
  endTime
) {
  const voucher = { uri, tokenAddress, royal, price, saleType, endTime };
  const domain = await signingDomain();
  const types = {
    NFTVoucher: [
      { name: "uri", type: "string" },
      { name: "tokenAddress", type: "address" },
      { name: "royal", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "saleType", type: "uint256" },
      { name: "endTime", type: "uint256" }
    ]
  };

  const signature = await signer._signTypedData(domain, types, voucher);

  return {
    ...voucher,
    signature
  };
}

async function signingDomain() {
  const domain = {
    name: "name",
    version: "1",
    verifyingContract: address,
    chainId: 3
  };
  return domain;
}

document.getElementById("test").onclick = () => test();
document.getElementById("buy").onclick = () => buyToken();
