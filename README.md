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

### 2. Deploy Application

1. Clone the repository on the server:
```bash
cd /var/www
sudo git clone <repository-url>
cd <repository-name>
```

2. Install dependencies and build:
```bash
sudo npm install
sudo npm run build
```

### 3. Configure Nginx

1. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/currency-exchange
```

2. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    root /var/www/<repository-name>/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/currency-exchange /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Configuration (Optional but Recommended)

Install Certbot and obtain SSL certificate:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

The application uses the following environment variables:
- None required for basic functionality
- API calls are made to `exchangerate-api.com` which is free and doesn't require authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
