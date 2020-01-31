dt=$(date '+%d%m%Y%H%M%S')
filename="backup_$dt.sql"
cd /usr/quich
pg_dump -U alphamikle quich > "$filename"
rclone copy "$filename" gd:
rm "$filename"