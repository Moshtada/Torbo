# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

JSON Server API Project

This project demonstrates the use of JSON Server to create a simple RESTful API for managing data. Below, you'll find the details on how to set up, run, and use the project.

Features

Simulated RESTful API with support for GET, POST, PUT, PATCH, and DELETE requests.

Automatic data persistence using the db.json file.

Real-time updates to the API as the db.json file is modified.

Two separate JSON Server instances (products and memory) running on port 3005.

Frontend application running on http://localhost:3000.

Prerequisites

Node.js installed on your system.

Basic knowledge of REST APIs and JavaScript.

Installation

Clone the repository or download the project files.

git clone <repository-url>
cd <project-directory>

Install JSON Server globally (optional):

npm install -g json-server

Or use npx to run JSON Server locally without installing it globally.

Usage

Start the Servers

Run the following commands to start the JSON Servers:

Start the products server:

npx json-server --watch products.json --port 3005

Start the memory server:

npx json-server --watch memory.json --port 3005

Start the Frontend Application

Make sure your frontend application is running on http://localhost:3000.

Example Endpoints (Products)

GET all products:

GET http://localhost:3005/products

GET a single product:

GET http://localhost:3005/products/:id

POST a new product:

POST http://localhost:3005/products
Body: {
  "name": "New Product",
  "price": 100
}

Example Endpoints (Memory)

GET all memory data:

GET http://localhost:3005/memory

POST new memory data:

POST http://localhost:3005/memory
Body: {
  "title": "New Memory",
  "description": "Memory description"
}


Notes

Make sure the port (3005) is not used by another application. If it is, you can specify a different port for each server.

You can edit the products.json and memory.json files to add or modify data directly.

Troubleshooting

Error: ERR_CONNECTION_REFUSED: Ensure the server is running and the port matches your request.

CORS Issues: If accessing the API from a frontend app, ensure you handle CORS appropriately.

License

This project is licensed under the MIT License.
