#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
PROJECT_ID="[YOUR-PROJECT-ID]"
REGION="us-central1"

# You can update these variables to match your preferences
REPO_NAME="my-docker-repo" 
IMAGE_NAME="my-app"
SERVICE_NAME="my-cloud-run-service"

# Construct the Artifact Registry image path
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest"

echo "================================================="
echo "Starting deployment to Google Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "================================================="

# Set the active project
gcloud config set project $PROJECT_ID

# Note: Ensure the Artifact Registry repository exists before running this.
# If it doesn't exist, you can create it by uncommenting the following line:
# gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Docker repository"

# Step 1 & 2: Build the Docker image using Cloud Build and push to Artifact Registry
echo "--> Building and pushing Docker image to Artifact Registry..."
gcloud builds submit --tag $IMAGE_PATH .

# Step 3: Deploy to Cloud Run
echo "--> Deploying to Cloud Run..."
SERVICE_URL=$(gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_PATH \
  --region $REGION \
  --allow-unauthenticated \
  --format="value(status.url)")

# Step 4: Output the final public URL
echo "================================================="
echo "✅ Deployment Successful!"
echo "🚀 Public URL: $SERVICE_URL"
echo "================================================="
