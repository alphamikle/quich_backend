#!/usr/bin/env bash
path=$(pwd)
proto="$path/proto"
gen="$path/src/proto-generated"
rm -rf ${gen}
mkdir ${gen}
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false -I ${proto} --ts_proto_out=${gen} ${proto}/main.proto
echo "\
"
node --require ts-node/register optional-proto-fixer.ts