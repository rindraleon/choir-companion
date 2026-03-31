#!/bin/bash

# Exit on error
set -e

# Install Cordova if it's not installed
if ! command -v cordova &> /dev/null
then
    echo "Installing Cordova..."
    npm install -g cordova
fi

# Add Android platform
cordova platform add android

# Install necessary plugins
cordova plugin add cordova-plugin-androidx
cordova plugin add cordova-plugin-androidx-adapter
