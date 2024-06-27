# Asana-Integration

## Overview

This service integrates GitHub with Asana. When a new issue is created on GitHub, a corresponding task is automatically created in Asana.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set your Asana Access Token, Project ID, and GitHub Webhook Secret in `app.js`.
4. Run the service: `npm start`
5. Configure a webhook in your GitHub repository to point to `http://your_server:3000/webhook`.

## Usage

- Create a new issue in GitHub repository and submit the issue.
- A task will be created in Asana with the issue details.

## Configuration

- Set the following environment variables:
  - `ASANA_ACCESS_TOKEN`: Your Asana access token.
  - `ASANA_PROJECT_ID`: Your Asana project ID.
  - `ASANA_WORKSPACE_ID `: Your Asana workspace ID.
  - `GITHUB_SECRET`: Your GitHub webhook secret.

## Running the service
 - Deploy the service on Render.com (cloud based platform to run your websites).
 - Setup the Environment variables as mentioned above 
