echo "Welcome to the project initialization script!"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Ask for package manager preference
echo "Which package manager do you want to use?"
select manager in "npm" "pnpm" "yarn" "bun"
do
    case $manager in
        "npm")
            if ! command_exists npm; then
                echo "npm is not installed. Please install it and try again."
                exit 1
            fi
            install_cmd="npm install"
            break
            ;;
        "pnpm")
            if ! command_exists pnpm; then
                echo "pnpm is not installed. Please install it and try again."
                exit 1
            fi
            install_cmd="pnpm install"
            break
            ;;
        "yarn")
            if ! command_exists yarn; then
                echo "yarn is not installed. Please install it and try again."
                exit 1
            fi
            install_cmd="yarn install"
            break
            ;;
        "bun")
            if ! command_exists bun; then
                echo "bun is not installed. Please install it and try again."
                exit 1
            fi
            install_cmd="bun install"
            break
            ;;
        *) echo "Invalid option $REPLY";;
    esac
done

# Function to install dependencies
install_dependencies() {
    echo "Installing dependencies in $1..."
    cd "$1" || exit
    $install_cmd
    cd - || exit
}

# Install dependencies in each relevant directory
install_dependencies "extension"
install_dependencies "my-hls-app"

echo "Setting up the project..."

echo "Project initialization complete!"
echo "You can now start developing your HLS application and browser extension."