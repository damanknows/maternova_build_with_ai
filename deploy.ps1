$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = "my-gcp-project-477309"
$REGION = "asia-south2"

# You can update these variables to match your preferences
$REPO_NAME = "maternova-repo"
$IMAGE_NAME = "maternova-img"
$SERVICE_NAME = "maternova-service"

# Construct the Artifact Registry image path
$IMAGE_PATH = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Starting deployment to Google Cloud Run" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Region: $REGION" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Set the active project
Write-Host "--> Setting gcloud project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Note: Ensure the Artifact Registry repository exists before running this.
# If it doesn't exist, you can create it by uncommenting the following command:
# gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Docker repository"

# Step 1 & 2: Build the Docker image using Cloud Build and push to Artifact Registry
Write-Host "--> Building and pushing Docker image to Artifact Registry..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_PATH .

# Step 3: Deploy to Cloud Run
Write-Host "--> Deploying to Cloud Run..." -ForegroundColor Yellow

# Extract GOOGLE_API_KEY from .env
$envFilePath = Join-Path $PSScriptRoot ".env"
$googleApiKey = ""
if (Test-Path $envFilePath) {
    $envContent = Get-Content $envFilePath
    foreach ($line in $envContent) {
        if ($line -match '^GOOGLE_API_KEY="(.*)"$') {
            $googleApiKey = $matches[1]
            break
        }
    }
}

if ($googleApiKey) {
    Write-Host "Found GOOGLE_API_KEY, injecting into Cloud Run..." -ForegroundColor Green
    $SERVICE_URL = gcloud run deploy $SERVICE_NAME `
      --image $IMAGE_PATH `
      --region $REGION `
      --allow-unauthenticated `
      --set-env-vars="GOOGLE_API_KEY=$googleApiKey" `
      --format="value(status.url)"
} else {
    Write-Host "Warning: GOOGLE_API_KEY not found in .env. Service might fail to start." -ForegroundColor Red
    $SERVICE_URL = gcloud run deploy $SERVICE_NAME `
      --image $IMAGE_PATH `
      --region $REGION `
      --allow-unauthenticated `
      --format="value(status.url)"
}


# Step 4: Output the final public URL
Write-Host "=================================================" -ForegroundColor Green
Write-Host "✅ Deployment Successful!" -ForegroundColor Green
Write-Host "🚀 Public URL: $SERVICE_URL" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
