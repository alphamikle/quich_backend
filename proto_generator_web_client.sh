#!/usr/bin/env bash
path=$(pwd)
protoPath="$path/proto"
gen="$path/proto_js_client"
rm -rf ${gen}
mkdir ${gen}

for proto in ${protoPath}/*.proto; do
    echo ${proto}
    protoc -I=${protoPath} ${proto} --js_out=import_style=commonjs+dts:${gen} --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:${gen}
done