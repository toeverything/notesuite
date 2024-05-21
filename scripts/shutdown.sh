#!/bin/bash

killport() {
  if [ -z "$1" ]; then
    echo "Usage: killport <port>"
    return 1
  fi
  kill $(lsof -i :$1 | grep node | awk '{print $2}')
}

killport 5173
killport 3000
