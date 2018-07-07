import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* global chrome */
/* global Date */

function log(tag, object) {
    console.log(`${tag}: ${JSON.stringify(object)}`);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: []
        };

        chrome.runtime.sendMessage(
            { action: "site_list" },
            response => {
                log("RESPONSE", response);
                this.setState({ sites: response.sites });
            }
        );
    }

    componentDidMount() {
    }

    render() {
        log("STATE ON RENDER", this.state);
        return (
            <div className="App">
              <h1>Sites list</h1>
              <ul>
                {
                    this.state.sites
                        .map(site => <li>{site.name}</li>)
                }
              </ul>
            </div>
        );
    }
}

export default App;
