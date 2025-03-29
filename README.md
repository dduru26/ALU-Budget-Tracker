# Currency Exchange Calculator

A React-based currency exchange calculator that allows users to convert between different currencies and maintain a conversion history. Built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time currency conversion
- Conversion history tracking
- Advanced filtering options
- Responsive design
- Local storage persistence

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Git

## Local Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will generate a `dist` directory with the production-ready files.

## Deployment to Ubuntu Server

### 1. Server Prerequisites

First, connect to your Ubuntu server and install the required dependencies:

```bash
# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
sudo apt install nginx

# Verify installations
node --version
npm --version
nginx -v
```

### 2. Server Setup and Deployment

#### Basic Server Setup

1. Connect to your server:
   ```bash
   ssh root@<SERVER_IP>
   ```

2. Install and configure Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

3. Set proper permissions for the web directory:
   ```bash
   sudo chown -R "$USER":"$USER" /var/www/html
   sudo chmod -R 755 /var/www
   ```

#### Application Deployment

1. On your local machine, zip the build files:
   ```bash
   zip -r dist.zip dist/
   ```

2. Transfer the zip file to the server:
   ```bash
   scp -i ~/.ssh/id_ed25519 dist.zip ubuntu@<SERVER_IP>:/var/www/html/
   ```

3. On the server, unzip and deploy the files:
   ```bash
   sudo apt-get install unzip
   cd /var/www/html
   unzip dist.zip
   sudo mv dist/* .
   ```

4. Configure firewall:
   ```bash
   sudo apt install ufw
   sudo ufw allow 'Nginx HTTP'
   ```

### 3. Load Balancer Setup (Optional)

If you need to set up load balancing across multiple servers, follow these steps:

1. Access the load balancer server:
   ```bash
   ssh root@<LOAD_BALANCER_IP>
   ```

2. Install required tools:
   ```bash
   sudo apt-get install nano nginx -y
   ```

3. Configure Nginx for load balancing:
   ```bash
   sudo nano /etc/nginx/conf.d/load-balancer.conf
   ```

4. Add the following configuration:
   ```nginx
   upstream webservers {
       server <WEB_SERVER_1_IP>;
       server <WEB_SERVER_2_IP>;
   }

   server {
       listen 80;
       server_name <LOAD_BALANCER_IP>;

       location / {
           proxy_pass http://webservers;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

5. Test and apply the configuration:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

> **Note:** Replace `<SERVER_IP>`, `<LOAD_BALANCER_IP>`, `<WEB_SERVER_1_IP>`, and `<WEB_SERVER_2_IP>` with your actual server IP addresses.

> **Security Tip:** It's recommended to use SSH keys instead of password authentication for server access. Make sure your firewall rules are properly configured before exposing services to the internet.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
