import React, {Component} from 'react';
import './App.css';
import Amplify, {Analytics, Storage} from 'aws-amplify';
import {withAuthenticator, S3Image} from 'aws-amplify-react';
import aws_exports from './aws-exports';

// Configurations
Amplify.configure(aws_exports);
Storage.configure({level: 'private'});


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
         Storage.list('', {level: 'private'})
            .then(result => {
                console.log(result);
                this.setState({
                    data: Array.from(result)
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="s3album">
                <ul>
                    {this.state.data.map(item =>
                        <li key={item.key}>
                            <S3Image level="private" imgKey={item.key} />
                            <p>{item.key.replace('.jpg', '').replace('.jpeg', '').replace('-', ' ')}</p>
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
                <div className="small-title">Your Images</div>
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
