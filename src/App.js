// https://devhints.io/react

import React, {Component} from 'react';
import './App.css';
import Amplify, {Analytics, Storage} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import aws_exports from './aws-exports';
import ReactDOM from 'react-dom';

// Configurations
Amplify.configure(aws_exports);
Storage.configure({level: 'public'});


class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="title">Bluebird</div>
            </div>
        )
    }
}

class Album extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        Storage.list('', {level: 'public'})
            .then(result => {

                let list = Array.from(result);

                this.setState({
                    data: list
                });
            })
            .catch(err => console.log(err));
    }

    getURL(key) {
        Storage.get(key)
            .then(result => {
                const element = (
                    <div>
                        <div>{result}</div>
                        <a href={result}>(Download)</a>
                    </div>
                );
                ReactDOM.render(element, document.getElementById(key))
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="s3album">
                <ul>
                    {this.state.data.map(item =>
                        <li key={item.key}>
                            <div className='file'>
                                {item.key.replace('.jpg', '').replace('.jpeg', '').replace('-', ' ')}
                                <p id={item.key} onLoad={this.getURL(item.key)}> </p>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

class Body extends Component {
    uploadFile = (evt) => {
        const file = evt.target.files[0];
        const name = file.name;

        Storage.put(name, file).then(() => {
            this.setState({file: name});
        })
    };

    componentDidMount() {
        Analytics.record('Amplify_CLI');
    };

    render() {
        return (
            <div className="body">
                <div className="small-title">Files</div>
                <label htmlFor="file-upload" className="file-upload">
                    Upload a file
                </label>
                <input id="file-upload" type="file" onChange={this.uploadFile}/>
                <Album/>
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="bluebird">
                <Header/>
                <Body/>
            </div>
        );
    }
}

export default withAuthenticator(App, true);
