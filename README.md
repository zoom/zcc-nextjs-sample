
# Zoom Contact Center app Next.js sample app

## Overview

This repository contains a sample Zoom Contact Center app built with a Next.js project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) the Zoom Apps SDK.

**Key features:**

* **Next.js frontend**: A boilerplate web application for buiding Zoom apps.  

## Prerequisites
* Node
* Zoom credentials (Client ID, Client Secret)
* Zoom Contact Center lience and global phone number

## Tech Stack
* Next.js
* Supabase
* ShadCN
* Tailwind CSS

# Setup developement envirnoment 

## Create Zoom Marketplace app 

The Zoom Marketplace build flow for a Zoom App is available [here](https://marketplace.zoom.us/develop/create). You will need a developer account with Zoom Apps enabled.

Use the following App manifest JSON object to configure the app:

* [App manifest](./AppManifest.md)

## Setup .env files
Please see the .env.local.example file in the repository.

* Create a .env.local file by copying the example and filling in the values
  * If you are in development, use the Client ID and Client secret under Development

## Start ngrok tunnel endpoints

To run ngrok http tunnel

```bash
ngrok http 3000
```

You should the tunnel traffic: 

![HTTPS tunnel](assets/ngrok-https-tunnel.png)


# Start developing

## Set up the project

1. **Clone the repository and install dependencies**:

   ```bash
   git clone https://github.com/just-zoomit/zcc-nextjs-sample.git
   cd zcc-nextjs-sample
   npm install
   ```

## Run the app locally

1. **Start both services from the root directory**:

   ```bash
   npm run dev
   ```

   * The frontend (Next.js) will be available at `http://localhost:3000` and at ngrok url endpoint.

## Additional Resources
* [Getting started with Zoom Contact Center Apps codelab](https://just-zoomit.github.io/zcc-get-started-codelab/#0)
  
## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/just-zoomit/zoomapps-nextjs-sample/tree/main?tab=License-1-ov-file) file for details.

