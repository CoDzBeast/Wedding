#!/bin/bash

# Deployment script for GitHub Pages
echo "Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "To deploy to GitHub Pages:"
    echo "1. Commit and push the changes to your repository"
    echo "2. GitHub Actions will automatically deploy the site"
    echo ""
    echo "For manual deployment:"
    echo "1. Navigate to the dist/public directory"
    echo "2. Deploy the contents to your hosting provider"
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi