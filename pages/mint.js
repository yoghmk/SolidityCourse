import React, { Component } from 'react';
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";

class Nftinter extends Component {
    state = {
        web3token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgxMmE4MmMxQjQ1RDljODhFNThCMzQ5RTI3YmE3NWUxRTQ0OGM5MzYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTg2NzY4ODcxNjMsIm5hbWUiOiJuZnQtbWludGUtZGFwcCJ9.7sky9ZQq_QIv1zQ74nyR4_ponXhxzddhwCUfAYegisM",
        fileName: "",
        filePath: "",
        cid: "",
        name: "",
        items: [],
        newItem: { key: "", value: "" },
        amount: 0,
        cidJSON: "",
        errorMessage: "",
        disabled: false,
        transactionHash: "",
    };

    async handleNewItemChange(event) {
        const { name, value } = event.target;

        await this.setState(prevState => ({
            newItem: { ...prevState.newItem, [name]: value }
        }));
    }

    async handleAddItem(e) {
        e.preventDefault();
        const { key, value } = this.state.newItem;
        await this.setState(prevState => ({
            items: [...prevState.items, { key, value }],
            newItem: { key: '', value: '' }
        }));
    }

    async uploadWeb3() {
        try {
            this.setState({ disabled: true });
            const storage = new Web3Storage({ token: this.state.web3token });
            const file = await fetch(this.state.filePath).then((r) => r.blob());
            const cid = await storage.put([file]);
            await this.setState({ cid: cid });

            const metaData = {
                Name: this.state.name,
                DocumentCid: this.state.cid,
                MetaData: this.state.items.map(item => ({ Key: item.key, Value: item.value })),
                Amount: this.state.amount
            };

            console.log(JSON.stringify(metaData));
            const fileJSON = new File([JSON.stringify(metaData)], cid + '.json', { type: 'application/json' });
            const cidJSON = await storage.put([fileJSON]);
            await this.setState({ cidJSON: cidJSON });
            await this.mint();
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
            this.setState({ disabled: false });
        }
    }



    async mint() {
        try {
            const accounts = await web3.eth.getAccounts();
            const valueInEther = parseFloat(this.state.amount);
            const valueInWei = web3.utils.toWei(valueInEther.toString(), 'ether');
            const gasEstimate = await factory.methods
                .mint(accounts[0], this.state.cidJSON)
                .estimateGas({
                    from: accounts[0],
                    value: valueInWei
                });
            console.log(factory.to);
            const tx = await factory.methods
                .mint(accounts[0], this.state.cidJSON)
                .send({
                    from: accounts[0],
                    value: valueInWei,
                    gas: gasEstimate,
                })

            await this.setState({ transactionHash: tx });
        } catch (err) {

            this.setState({ errorMessage: err.message });
        }
        this.setState({ disabled: false });
    }

    onChange = async (event) => {
        console.log(event.target.files);
        if (event.target.files.length > 0) {

            await this.setState({ fileName: event.target.files[0].name, filePath: URL.createObjectURL(event.target.files[0]) })
        }
        else {
            await this.setState({ fileName: "", filePath: "" })
        }

    }

    render() {
        return (
            <div>
                <h2 align="center">NFT Minter Dapp</h2>


                <div align="center">
                    <form >
                        <table border="1">
                            <tbody>
                                <tr>
                                    <td style={{ padding: "10px" }}>
                                        <h4> General Info</h4>
                                        <label id="name">Name:</label>
                                        <input type="text" id="filename" name="name" style={{ margin: "5px" }} onChange={(event) => this.setState({ name: event.target.value })} />
                                        <br />
                                        <input type="file" id="Upload" text={this.state.fileName} onChange={this.onChange.bind(this)} />
                                    </td>
                                    <td>
                                        <img src={this.state.filePath} width="300" height="300" style={{ margin: "5px" }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style={{ padding: "10px" }}>
                                        <h4> Meta Data</h4>

                                        <ul>
                                            {this.state.items.map((item, index) => (
                                                <li key={index}>
                                                    <p>{item.key}: {item.value}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <input type="text" name="key" value={this.state.newItem.key} onChange={this.handleNewItemChange.bind(this)} style={{ padding: "5px" }}/>
                                        <input type="text" name="value" value={this.state.newItem.value} onChange={this.handleNewItemChange.bind(this)} style={{ padding: "5px" }} />
                                        <button onClick={this.handleAddItem.bind(this)}>Add</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td  style={{ padding: "10px" }}>

                                        <h4> Price</h4>
                                        <label for="amount">Amount (gwei):</label>
                                        <input type="text" id="amaunt" name="amaunt" onChange={(event) => this.setState({ amount: event.target.value })} /><br />
                                    </td>
                                    <td align="center" style={{ padding: "10px" }}>
                                    <button  onClick={this.uploadWeb3.bind(this)} disabled={this.state.disabled}>Mint</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />

                    </form>


                </div>
            </div>
        );
    }
}

export default Nftinter;