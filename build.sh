#!/bin/bash

mkdir -p build

function die () {
    echo "FATAL ERROR: $@"
    exit 1
}

if [ "$1" = "r" ]; then
    pushd reactpopup/
    npm run build || die "popup build failed"
    popd
fi;

cp -r reactpopup/build/* lib/* public/* build
