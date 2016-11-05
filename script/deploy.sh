#!/bin/sh

rsync -avr --exclude='.bundle/' --exclude='vendor/' --exclude='node_modules' ./htdocs/ rindo@rindo.me:/home/rindo/html/