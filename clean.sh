#!/bin/bash

echo "Starting cleanup process..."

# Function to remove node_modules
remove_node_modules() {
    local dir="$1"
    if [ -d "$dir/node_modules" ]; then
        echo "Removing node_modules from $dir"
        rm -rf "$dir/node_modules"
    else
        echo "No node_modules found in $dir"
    fi
}

# Function to remove package lock files
remove_lock_files() {
    local dir="$1"
    echo "Removing package lock files from $dir"
    rm -f "$dir/package-lock.json" "$dir/yarn.lock" "$dir/pnpm-lock.yaml" "$dir/bun.lockb"
}

# Clean extension directory
remove_node_modules "extension"
remove_lock_files "extension"

# Clean my-hls-app directory
remove_node_modules "my-hls-app"
remove_lock_files "my-hls-app"

# Clean root directory (if applicable)
remove_node_modules "."
remove_lock_files "."

echo "Cleanup complete!"