#!/bin/bash
##
# 前端编译脚本文件
# 
# @author  Yang,junlong at 2016-07-07 18:18:11 build.
# @version $Id$

set -e
set -x

hostname

export PATH=~/nodejs/bin:$PATH

if hash jello 2>/dev/null; then
    echo 'jello installed'
else
    npm config set prefix ~/nodejs
    npm install jello -g --registry=http://registry.npm.pt.mi.com
fi

npm install fis-postpackager-modjs -g

SCRIPT_DIR=`cd $(dirname $0); pwd -P`
cd $SCRIPT_DIR
rm -rf release/
mkdir -p release/

jello --version --no-color

if [ "staging" = "$1" ]; then
    jello release -cd output
else 
    jello release -copmuDd output
fi

cp -r deploy output/* release/
rm -rf output/
