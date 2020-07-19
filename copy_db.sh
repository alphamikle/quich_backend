#!/usr/bin/env bash

oldProd=89.223.95.172
prod=217.171.147.117
curDir=$(pwd)
oldHost=root@${oldProd}
host=root@${prod}
backupFile="${curDir}/quichx_backup.sql"
remoteBackupFile="/quichx_backup.sql"
user="alphamikle"
db="quich"

ssh ${oldHost} "pg_dump -U ${user} ${db} > ${remoteBackupFile}"
echo "BACKUP FROM OLD SERVER CREATED"
scp ${oldHost}:${remoteBackupFile} ${backupFile}
echo "BACKUP COPIED TO LOCAL MACHINE"
scp ${backupFile} ${host}:${remoteBackupFile}
echo "BACKUP COPIED TO NEW SERVER"
ssh ${host} "docker exec -t pg psql -U ${user} -d ${db} -c \"drop schema public cascade; create schema public\""
echo "SCHEMA REFRESHED ON NEW SERVER"
ssh ${host} "docker cp ${remoteBackupFile} pg:${remoteBackupFile}"
echo "BACKUP COPIED TO DOCKER AT NEW SERVER"
ssh ${host} "docker exec -t pg psql -U ${user} -d ${db} -f \"${remoteBackupFile}\""
echo "BACKUP RESTORED AT NEW SERVER"