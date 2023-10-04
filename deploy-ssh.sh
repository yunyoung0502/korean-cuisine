#!/bin/bash

# Define the local directory where your repository exists.
LOCAL_REPO_DIR="."

# Function to perform a git pull.
git_pull() {
  echo "Attempting git pull..."
  git pull origin main
}

# Navigate to the local repository directory.
if [ -d "$LOCAL_REPO_DIR" ]; then
  cd "$LOCAL_REPO_DIR" || exit 1
  
  # Try to pull the latest changes from the remote repository.
  if git_pull; then
    echo "Git pull successful."
  else
    echo "Git pull failed. Discarding local changes and pulling anew."
    
    # Discard local changes and uncommitted files.
    git reset --hard HEAD
    git clean -fd
    
    # Perform a git pull again.
    git_pull
  fi
else
  echo "Local repository directory does not exist."
fi
