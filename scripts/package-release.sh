#!/usr/bin/env bash

# ==========================================================
# 🎁 LoyaltyHub Release Packaging Script
# Creates a clean distribution archive ready for vendor sale
# ==========================================================

set -e

RELEASE_VERSION="v1.0.0"
BUILD_DIR="dist_release/loyalty-hub-${RELEASE_VERSION}"
ARCHIVE_NAME="loyalty-hub-${RELEASE_VERSION}-vendor-package.tar.gz"

echo "🚀 Packaging LoyaltyHub ${RELEASE_VERSION} for Vendor Sale..."

# 1. Clean previous build directory
rm -rf dist_release
mkdir -p "${BUILD_DIR}"

# 2. Copy core project files
echo "📦 Copying source code and configuration..."
cp -R backend "${BUILD_DIR}/"
cp -R frontend "${BUILD_DIR}/"
cp docker-compose.yml "${BUILD_DIR}/"
cp .env.example "${BUILD_DIR}/"
cp Makefile "${BUILD_DIR}/"
cp README.md "${BUILD_DIR}/"
if [ -f VENDOR_HOSTING_GUIDE.md ]; then
  cp VENDOR_HOSTING_GUIDE.md "${BUILD_DIR}/"
fi

# 3. Cleanup development artifacts in build folder
echo "🧹 Removing node_modules, temp files, and local databases..."
rm -rf "${BUILD_DIR}/frontend/node_modules"
rm -rf "${BUILD_DIR}/frontend/dist"
rm -rf "${BUILD_DIR}/backend/loyaltyhub.db"
rm -rf "${BUILD_DIR}/backend/loyaltyhub-api"
rm -f "${BUILD_DIR}/backend/.env"

# 4. Create tarball archive
echo "🗜 Creating compressed archive: ${ARCHIVE_NAME}..."
cd dist_release
tar -czf "${ARCHIVE_NAME}" "loyalty-hub-${RELEASE_VERSION}"
cd ..

echo "✅ SUCCESS! Release package generated at: dist_release/${ARCHIVE_NAME}"
echo "🎉 LoyaltyHub is ready to be delivered, hosted, or sold to clients!"
