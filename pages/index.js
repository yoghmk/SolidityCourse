import React from "react";
import web3 from "../ethereum/web3";
import { Router } from "../routes";


class App extends React.Component {
  state = {
    accounts: [],
    selectedAccount: "",
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts });
  }

  onClick = async () => {
    //await this.setState({ selectedAccount: e.target.value });
    
    if (this.state.selectedAccount === ""){
      await this.setState({ selectedAccount: this.state.accounts[0] });
    }
    console.log(this.state.selectedAccount);

    Router.pushRoute('/mint');
  };
 

  render() {
    //web3.eth.getAccounts().then(console.log);

    return (
      <div align="center">
        <hr />
        <select align="center" onChange={(event) => this.setState({ selectedAccount: event.target.value })} >
          {this.state.accounts.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
        <button onClick={this.onClick.bind(this)}>Select Account</button>
      </div>
    );
  }

}

export default App;
