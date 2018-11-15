// https://devhints.io/react

import React, {Component} from 'react';
import './App.css';
import Amplify, {Analytics, Storage} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import aws_exports from './aws-exports';
import ReactDOM from 'react-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';


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
                this.setState({
                    data: Array.from(result)
                });
            })
            .catch(err => console.log(err));
    }

    deleteFile(key, e) {
        console.log(key);
        Storage.remove(key)
            .then(result => {
                console.log(result);
                const refresh = (
                    <div>
                        <Header/>
                        <Body />
                    </div>
                );

                ReactDOM.render(refresh, document.getElementById('bluebirdbody'));
            })
            .catch(err => console.log(err));
    }

    getURL(key) {
        Storage.get(key)
            .then(result => {
                const element = (
                    <div>
                        <CopyToClipboard text={result} >
                            <div className='copyurl'>Copy URL</div>
                        </CopyToClipboard>
                        <a className='downloadfile' href={result}>Download File</a>
                        <a className='deletefile' onClick={e => this.deleteFile(key, e)}>Delete File</a>
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
                            <div className='filename'>{item.key}</div>
                            <div className='fileoptions' id={item.key} onLoad={this.getURL(item.key)}> </div>
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
        });

        const refresh = (
            <div>
                <Header/>
                <Body />
            </div>
        );

        ReactDOM.render(refresh, document.getElementById('bluebirdbody'));
    };

    componentDidMount() {
        Analytics.record('Amplify_CLI');
    };

    render() {
        return (
            <div className="body" id='bluebirdbody'>
                <div className="small-title">Files</div>
                <label htmlFor="file-upload" className="file-upload">
                    Upload a file
                </label>
                <input id="file-upload" type="file" onChange={this.uploadFile}/>
                <Album/>
                <div>
                    <p>To Do:</p>
                    <p>- User feedback for uploads so they know the progress of an upload</p>
                    <p>- Refresh Album after upload had finished</p>
                    <p>- Fix one or more delete refresh issue</p>
                    <p>- Public and private file uploads</p>
                    <p>- User feedback stating that a URL has been copied when CopyURL has been clicked</p>
                    <p>- An 'Are you sure?' message before deleting a file</p>
                </div>
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="bluebird" id='bluebirdbody'>
                <Header/>
                <Body />
            </div>
        );
    }
}

export default withAuthenticator(App, true);
