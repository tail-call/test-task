#!/bin/bash

function die () {
    echo "FATAL ERROR: $@"
    exit 1
}

pushd reactpopup/
npm run build || die "popup build failed"
popd

cp -r reactpopup/build/* src/* build
