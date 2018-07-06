import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: remove these
            sites: [
	        {
		    "name": "yandex",
		    "domain": "yandex.ru",
		    "message": "Hello %username%! My name is Yandex!"
	        },
	        {
		    "name": "google",
		    "domain": "google.ru",
		    "message": "Hello %username%! My name is Google!"
	        },
	        {
		    "name": "bing",
		    "domain": "bing.com",
		    "message": "Hello %username%! My name is Bing!"
	        }
            ]
        };
    }
    render() {
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
