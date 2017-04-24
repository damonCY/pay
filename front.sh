#!/bin/bash
##
# 前端编译脚本文件
# 请将此脚本放置到upay-admin-new项目目录下
# 
# sh front.sh
# sh front.sh local
# 
# @author  Yang,junlong at 2016-07-07 18:18:11 build.
# @version $Id$

# check node env
if hash node 2>/dev/null;then
    echo 'node env installed, continue'
else
    echo 'please install node'
    exit
fi

CUR_DIR=`cd $(dirname $0); pwd -P`
DEP_DIR="$CUR_DIR/upay-admin-front"
WEB_APP_DIR="$CUR_DIR/src/main/webapp"

if [ -e "$DEP_DIR" ]; then
    rm -rf "$DEP_DIR"
fi

if [ ! -e "$WEB_APP_DIR" ]; then
    echo 'please check your webapp path:' $WEB_APP_DIR
    exit
fi

git clone http://git.n.xiaomi.com/mix/upay-admin-front.git && cd $DEP_DIR && git checkout master

cd $CUR_DIR

pushd $DEP_DIR
bash build.sh $1
popd

cp -r $DEP_DIR/output/* $WEB_APP_DIR
