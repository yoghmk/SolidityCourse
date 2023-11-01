import web3 from "./web3";
import CPath from './build/Contract.json';

const instance = new web3.eth.Contract(
    CPath,
    '0xfea5a4341b7ede30de9d039b5ff42292c2a187e1'
);

export default instance;