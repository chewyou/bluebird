## Setup

`npm i`

`amplify configure`

Sign into root AWS account, return to the terminal and press Enter

Run through the configuration script:
- region
- new IAM user name

Complete user creation in browser (give admin permissions)

You may want to download the .csv file with the Access key ID and Secret access key

When you are on the Success page, press enter in the terminal and continue the configuration.
- access key id
- secret access key
- profile name (use default)

`amplify init`

Run through this configuration script
- choose default editor
- type of app - javascript
- javascript framework - react
- source directory path - src
- distribution directory path - build
- build command - default
- start command - default
- use an AWS profile - yes
- choose profile - default

Amplify will then go and set up the project in the cloud


`amplify add hosting`

- environment - DEV
- s3 bucket name
- index doc for the website - index.html
- error doc for the website - index.html

`amplify add auth`

Select default configuration

`amplify add analytics`

Select the default options

`amplify add storage`

- Select Content
- resource name - bluebird
- s3 bucket name - bluebird-storage
- access to Auth and guest users
- Auth users have Read/Write access
- Guest users have read access


`amplify push`

Continue = yes


## To run locally
`npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.


## To remove amplify feature

`amplify remove [hosting|storage|auth|analytics]`


## To push amplify changes to AWS

`amplify push`


## To publish to AWS

`amplify publish`