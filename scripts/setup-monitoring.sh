#!/bin/bash

echo "🚀 Setting up Happy Hour Monitoring System..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p logs/archived

# Make monitoring daemon executable
echo "⚙️ Making monitoring daemon executable..."
chmod +x scripts/monitoring-daemon.js

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if required dependencies are available
echo "📦 Checking dependencies..."
if [ -f "package.json" ]; then
    echo "✅ Package.json found"
else
    echo "❌ Package.json not found"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Create database migration for error logging
echo "🗄️ Setting up error logging database..."
if npx prisma migrate status | grep -q "Database schema is up to date"; then
    echo "✅ Database schema is up to date"
else
    echo "⚠️  Database schema needs migration. Run 'npx prisma migrate dev' to update."
fi

# Create systemd service file (optional)
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service file..."
    cat > /tmp/happy-hour-monitoring.service << EOF
[Unit]
Description=Happy Hour Monitoring Daemon
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(which node) $(pwd)/scripts/monitoring-daemon.js start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    echo "📄 Systemd service file created at /tmp/happy-hour-monitoring.service"
    echo "   To install: sudo cp /tmp/happy-hour-monitoring.service /etc/systemd/system/"
    echo "   To enable:  sudo systemctl enable happy-hour-monitoring"
    echo "   To start:   sudo systemctl start happy-hour-monitoring"
fi

# Create environment check
echo "🔍 Checking environment variables..."
required_vars=("DATABASE_URL" "NEXTAUTH_URL" "NEXTAUTH_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required environment variables are set"
else
    echo "⚠️  Missing environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo "   Please set these variables before starting the monitoring daemon."
fi

# Test basic functionality
echo "🧪 Testing basic functionality..."

# Test health endpoint (if app is running)
if curl -s http://localhost:3000/api/admin/health > /dev/null; then
    echo "✅ Health endpoint accessible"
else
    echo "⚠️  Health endpoint not accessible (app may not be running)"
fi

echo ""
echo "🎉 Monitoring system setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start your Next.js application: npm run dev"
echo "   2. Start the monitoring daemon: npm run monitor:start"
echo "   3. Check daemon status: npm run monitor:status"
echo "   4. View logs: tail -f logs/monitoring.log"
echo "   5. Access monitoring dashboard: http://localhost:3000/admin (with admin access)"
echo ""
echo "🔧 Available commands:"
echo "   - npm run monitor:start   # Start monitoring daemon"
echo "   - npm run monitor:stop    # Stop monitoring daemon"
echo "   - npm run monitor:status  # Check daemon status"
echo "   - npm run health:check    # Run one-time health check"
echo ""
echo "📚 For more information, see the monitoring documentation."