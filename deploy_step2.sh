#!/usr/bin/env bash
cd /usr/server
git clone git@github.com:alphamikle/quich_backend.git backend -y
cd backend
echo "You must switch branch to needed"
echo "You must start docker postgres image"