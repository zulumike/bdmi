# Member registration for BDMI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


Requirements:
    - VSCode
        - Azure Static Web Apps extension for Visual Studio Code
        - Azure Functions extension for Visual Studio Code
        - Node.js to run the frontend app and API

Recommend running npm audit fix --force and test before further development


VSCode:
- Azure Create Static Web App
    Build preset: React
    App location: /
    Build location: build

- Azure Static Web App: Create HTTP Function

- Application settings: (Azure portal and local.settings.json)
    - bdmiDBConnectionString
    - SendGridApiKey

Local development: 
    - npm install
    - npm run build
    Start application and api (in swa)
    - swa start build --api-location api