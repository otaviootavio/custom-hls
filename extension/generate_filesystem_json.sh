#!/bin/bash

output_file="filesystem.json"

# Start JSON object
echo "{" > $output_file
echo '  "files": [' >> $output_file

# Function to escape special characters for JSON
escape_json() {
  echo "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

# Function to list files excluding dist, node_modules, and package-lock.json
list_files() {
  find . -type d \( -path ./dist -o -path ./node_modules \) -prune -false -o -type f ! -name "package-lock.json"
}

# Get list of files
files=$(list_files)

# Iterate over the files and append their content to the JSON file
for file in $files; do
  if [[ -f "$file" ]]; then
    content=$(cat "$file")
    escaped_content=$(escape_json "$content")
    echo '    {' >> $output_file
    echo '      "path": "'$file'",' >> $output_file
    echo '      "content": '"$escaped_content"'' >> $output_file
    echo '    },' >> $output_file
  fi
done

# End JSON object (removing the last comma and closing the array)
sed -i '$ s/,$//' $output_file
echo '  ]' >> $output_file
echo '}' >> $output_file

echo "Filesystem JSON has been generated in $output_file"
