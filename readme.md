
## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local web server at localhost:5173
npm run dev

# Build for production in the dist/ directory
npm run build

# Run as Electron app (after installing dependencies)
npm run electron

# Run Electron app in development mode (with hot reload)
npm run electron:dev

# Build Electron app for distribution
npm run electron:build
```

## Electron App

This project can now run as a standalone Electron desktop application.

- **Development**: Run `npm run electron:dev` to launch with hot reload
- **Production**: Build with `npm run electron:build` and find the installer in the `release` folder
- **Distribution**: The built app supports Windows, macOS, and Linux
