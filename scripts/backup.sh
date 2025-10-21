#!/bin/bash

# Happy Hour App Backup Script
# This script handles database backups and data recovery

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="happy_hour_backup_${TIMESTAMP}"
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Create backup directory
create_backup_dir() {
    log "Creating backup directory..."
    mkdir -p "$BACKUP_DIR"
    success "Backup directory created"
}

# Backup database
backup_database() {
    log "Backing up database..."
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL environment variable is not set"
    fi
    
    # Extract database connection details
    if [[ $DATABASE_URL == postgresql://* ]]; then
        # PostgreSQL backup
        pg_dump "$DATABASE_URL" > "$BACKUP_DIR/${BACKUP_NAME}_database.sql"
        success "PostgreSQL database backed up"
    elif [[ $DATABASE_URL == file:* ]]; then
        # SQLite backup
        DB_FILE=$(echo "$DATABASE_URL" | sed 's/file://')
        cp "$DB_FILE" "$BACKUP_DIR/${BACKUP_NAME}_database.db"
        success "SQLite database backed up"
    else
        error "Unsupported database type"
    fi
}

# Backup Redis data
backup_redis() {
    log "Backing up Redis data..."
    
    if [ -z "$REDIS_URL" ]; then
        warning "REDIS_URL not set, skipping Redis backup"
        return
    fi
    
    # Extract Redis connection details
    REDIS_HOST=$(echo "$REDIS_URL" | sed 's/redis:\/\/\([^:]*\):.*/\1/')
    REDIS_PORT=$(echo "$REDIS_URL" | sed 's/redis:\/\/[^:]*:\([^/]*\).*/\1/')
    REDIS_PASSWORD=$(echo "$REDIS_URL" | sed 's/redis:\/\/[^:]*:[^@]*@\([^:]*\):.*/\1/')
    
    # Create Redis backup
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --rdb "$BACKUP_DIR/${BACKUP_NAME}_redis.rdb"
    success "Redis data backed up"
}

# Backup application files
backup_files() {
    log "Backing up application files..."
    
    # Create tar archive of important files
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_files.tar.gz" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=backups \
        --exclude=*.log \
        --exclude=.env.local \
        .
    
    success "Application files backed up"
}

# Backup environment configuration
backup_env() {
    log "Backing up environment configuration..."
    
    if [ -f ".env.local" ]; then
        cp .env.local "$BACKUP_DIR/${BACKUP_NAME}_env.local"
        success "Environment configuration backed up"
    else
        warning "No .env.local file found"
    fi
}

# Create backup manifest
create_manifest() {
    log "Creating backup manifest..."
    
    cat > "$BACKUP_DIR/${BACKUP_NAME}_manifest.json" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "$(node -p "require('./package.json').version")",
  "environment": "$NODE_ENV",
  "files": [
    "${BACKUP_NAME}_database.sql",
    "${BACKUP_NAME}_redis.rdb",
    "${BACKUP_NAME}_files.tar.gz",
    "${BACKUP_NAME}_env.local"
  ],
  "checksums": {
    "database": "$(md5sum "$BACKUP_DIR/${BACKUP_NAME}_database.sql" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')",
    "redis": "$(md5sum "$BACKUP_DIR/${BACKUP_NAME}_redis.rdb" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')",
    "files": "$(md5sum "$BACKUP_DIR/${BACKUP_NAME}_files.tar.gz" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')",
    "env": "$(md5sum "$BACKUP_DIR/${BACKUP_NAME}_env.local" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')"
  }
}
EOF
    
    success "Backup manifest created"
}

# Compress backup
compress_backup() {
    log "Compressing backup..."
    
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}_complete.tar.gz" "${BACKUP_NAME}"*
    cd ..
    
    success "Backup compressed"
}

# Clean old backups
clean_old_backups() {
    log "Cleaning old backups..."
    
    # Keep only last 7 days of backups
    find "$BACKUP_DIR" -name "happy_hour_backup_*" -type f -mtime +7 -delete
    
    success "Old backups cleaned"
}

# Restore database
restore_database() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "Backup file not specified"
    fi
    
    log "Restoring database from $backup_file..."
    
    if [[ $backup_file == *.sql ]]; then
        # PostgreSQL restore
        psql "$DATABASE_URL" < "$backup_file"
        success "PostgreSQL database restored"
    elif [[ $backup_file == *.db ]]; then
        # SQLite restore
        DB_FILE=$(echo "$DATABASE_URL" | sed 's/file://')
        cp "$backup_file" "$DB_FILE"
        success "SQLite database restored"
    else
        error "Unsupported backup file format"
    fi
}

# Restore Redis data
restore_redis() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        warning "Redis backup file not specified, skipping Redis restore"
        return
    fi
    
    log "Restoring Redis data from $backup_file..."
    
    # Extract Redis connection details
    REDIS_HOST=$(echo "$REDIS_URL" | sed 's/redis:\/\/\([^:]*\):.*/\1/')
    REDIS_PORT=$(echo "$REDIS_URL" | sed 's/redis:\/\/[^:]*:\([^/]*\).*/\1/')
    REDIS_PASSWORD=$(echo "$REDIS_URL" | sed 's/redis:\/\/[^:]*:[^@]*@\([^:]*\):.*/\1/')
    
    # Restore Redis data
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --rdb "$backup_file"
    success "Redis data restored"
}

# List available backups
list_backups() {
    log "Available backups:"
    
    if [ -d "$BACKUP_DIR" ]; then
        ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    else
        warning "No backup directory found"
    fi
}

# Main backup function
backup() {
    log "Starting backup process..."
    
    create_backup_dir
    backup_database
    backup_redis
    backup_files
    backup_env
    create_manifest
    compress_backup
    clean_old_backups
    
    success "Backup completed successfully! 🎉"
    log "Backup location: $BACKUP_DIR/${BACKUP_NAME}_complete.tar.gz"
}

# Main restore function
restore() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "Backup file not specified. Usage: $0 restore <backup_file>"
    fi
    
    log "Starting restore process from $backup_file..."
    
    # Extract backup
    tar -xzf "$backup_file" -C "$BACKUP_DIR"
    
    # Restore components
    restore_database "$BACKUP_DIR/${BACKUP_NAME}_database.sql"
    restore_redis "$BACKUP_DIR/${BACKUP_NAME}_redis.rdb"
    
    success "Restore completed successfully! 🎉"
}

# Main function
main() {
    case "${1:-backup}" in
        "backup")
            backup
            ;;
        "restore")
            restore "$2"
            ;;
        "list")
            list_backups
            ;;
        *)
            echo "Usage: $0 {backup|restore|list}"
            echo "  backup  - Create a new backup"
            echo "  restore - Restore from a backup file"
            echo "  list    - List available backups"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
