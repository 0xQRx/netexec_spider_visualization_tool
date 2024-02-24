# NetExec Spider Visualization Tool

This tool is designed to visualize the output of CrackMapExec or NetExec Spider Plus module by allowing users to upload output JSON files and browse them through a web-based UI. It simplifies the process of analyzing network enumeration and exploitation results by providing an intuitive interface to navigate the structured output data.

## Features

- Upload JSON output files generated by CrackMapExec or NetExec Spider Plus module.
- Browse the hierarchical structure of output data in a web-based UI.

## Getting Started

These instructions will guide you on how to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Node.js (v18)

#### Installing Node.js on Kali Linux

To install Node.js (version 18) on Kali Linux, follow these steps:

```bash
# Add Node.js repository
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Update package list and install Node.js
sudo apt update
sudo apt install -y nodejs
```

#### Installing
Clone the repository to your local machine and install the necessary dependencies:

```
git clone https://github.com/0xQRx/netexec_spider_visualization_tool.git
cd netexec_spider_visualization_tool
npm install
```

#### Running the Application Locally

Start the server with the following command:

```
node server.js
```

Access the web-based UI by navigating to http://localhost:3000 in your web browser.

#### Docker

Installing Docker on Kali Linux
To install Docker, use the following one-liner:

```
sudo apt update && sudo apt install -y docker.io && sudo systemctl enable docker --now && sudo usermod -aG docker $USER
```

> Note: After running the Docker installation command, you may need to log out and log back in for the group change to take effect, or you can run `newgrp docker` in the terminal.

#### Building and Running with Docker

Containerize the application using Docker with the following steps:

Build the Docker Image

```
docker build -t netexec-spider-vis-tool .
```

Run the Docker Container

```
docker run -p 3000:3000 netexec-spider-vis-tool
The application will be accessible at http://localhost:3000.
```

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.




