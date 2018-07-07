import React, { Component } from 'react';
import './App.css';

/* global chrome */

function makeCurrentTabRedirecter(url) {
    return function (event) {
        event.preventDefault();
        chrome.tabs.getCurrent(tab => {
        });
    };
}

function makeSiteListItem(site) {
    return <a href={`https://${site.domain}/`} target="_blank"
              className="App-site-list-item">
             {site.name}
           </a>;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: []
        };

        chrome.runtime.sendMessage(
            { action: "listSites" },
            response => {
                this.setState({ sites: response.sites });
            }
        );
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="App">
              <div className="App-header">
                <h1>Список сайтов</h1>
              </div>
              <div className="App-site-list">
                { this.state.sites.map(makeSiteListItem) }
              </div>
            </div>
        );
    }
}

export default App;
