#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

npm ci --ignore-scripts
export NODE_ENV=production
npm run clean
npm run webpack
