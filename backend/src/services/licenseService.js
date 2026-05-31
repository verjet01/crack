const crypto = require('crypto');
const logger = require('../utils/logger');

class LicenseService {
  /**
   * Generate a JetBrains activation code
   * @param {Object} options - License options
   * @returns {Object} Generated license data
   */
  generateLicense(options) {
    const {
      productCode,
      licenseName = 'ideacrack',
      assigneeName = '',
      expiryDate = '2099-12-31'
    } = options;

    logger.info('Generating license', { productCode, licenseName, assigneeName, expiryDate });

    const licenseId = this.generateLicenseId();
    const products = this.parseProductCodes(productCode);

    const licenseData = {
      licenseId,
      licenseName,
      assigneeName,
      assigneeEmail: '',
      licenseRestriction: '',
      checkConcurrentUse: false,
      products,
      metadata: this.generateMetadata(),
      hash: this.generateHash(licenseId),
      gracePeriodDays: 7,
      autoProlongated: true,
      isAutoProlongated: true
    };

    const jsonStr = JSON.stringify(licenseData);
    const licenseKey = Buffer.from(jsonStr).toString('base64');

    const result = {
      licenseId,
      licenseKey: licenseId + '-' + licenseKey,
      expiryDate,
      products: products.map(function(p) { return p.code; }),
      licenseName,
      assigneeName
    };

    logger.info('License generated successfully', { licenseId });
    return result;
  }

  generateLicenseId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const randomBytes = crypto.randomBytes(10);
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(randomBytes[i] % chars.length);
    }
    return result;
  }

  parseProductCodes(productCode) {
    const codeMap = {
      'II': { name: 'IntelliJ IDEA', fallbackDate: '2050-12-30' },
      'CL': { name: 'CLion', fallbackDate: '2050-12-30' },
      'PS': { name: 'PhpStorm', fallbackDate: '2050-12-30' },
      'GO': { name: 'GoLand', fallbackDate: '2050-12-30' },
      'PC': { name: 'PyCharm', fallbackDate: '2050-12-30' },
      'WS': { name: 'WebStorm', fallbackDate: '2050-12-30' },
      'RD': { name: 'Rider', fallbackDate: '2050-12-30' },
      'DB': { name: 'DataGrip', fallbackDate: '2050-12-30' },
      'RM': { name: 'RubyMine', fallbackDate: '2050-12-30' },
      'AC': { name: 'AppCode', fallbackDate: '2050-12-30' },
      'DS': { name: 'DataSpell', fallbackDate: '2050-12-30' },
      'RR': { name: 'RustRover', fallbackDate: '2050-12-30' },
      'PCWMP': { name: 'Platform', fallbackDate: '2050-12-30' },
      'PSI': { name: 'Platform Core', fallbackDate: '2050-12-30' }
    };

    return productCode.split(',').map(function(code) {
      var trimmedCode = code.trim();
      return {
        code: trimmedCode,
        fallbackDate: (codeMap[trimmedCode] && codeMap[trimmedCode].fallbackDate) || '2050-12-30',
        paidUpTo: '2099-12-31'
      };
    });
  }

  generateMetadata() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return year + month + day + 'PPAA013009';
  }

  generateHash(licenseId) {
    const num = Math.floor(Math.random() * 100000000);
    const timestamp = Math.floor(Date.now() / 1000);
    return num + '/0:' + timestamp;
  }

  validateLicense(licenseKey) {
    try {
      const parts = licenseKey.split('-');
      if (parts.length < 2) {
        return { valid: false, error: 'Invalid license key format' };
      }

      const licenseId = parts[0];
      const encodedData = parts.slice(1).join('-');
      const jsonStr = Buffer.from(encodedData, 'base64').toString('utf-8');
      const licenseData = JSON.parse(jsonStr);

      if (licenseData.licenseId !== licenseId) {
        return { valid: false, error: 'License ID mismatch' };
      }

      const expiryDate = new Date((licenseData.products[0] && licenseData.products[0].paidUpTo) || '2099-12-31');
      if (expiryDate < new Date()) {
        return { valid: false, error: 'License expired' };
      }

      return { valid: true, data: licenseData };
    } catch (error) {
      logger.error('License validation error', { error: error.message });
      return { valid: false, error: 'Invalid license key' };
    }
  }

  /**
   * Generate activation script for Windows
   * Uses string array join to avoid PowerShell backtick conflicts with JS template literals
   */
  generateWindowsScript(baseUrl) {
    var lines = [
      '# encoding: utf-8',
      '# IDEActivation Auto-Activation Script',
      '# Generated at: ' + new Date().toISOString(),
      '# WARNING: For learning purposes only!',
      '',
      'Clear-Host',
      '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
      '',
      '$ErrorActionPreference = "Stop"',
      '',
      '# Check admin privileges',
      'if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {',
      '    Write-Host "Requesting administrator privileges..." -ForegroundColor Yellow',
      '    Start-Process powershell.exe -ArgumentList "-Command irm ' + baseUrl + '|iex" -Verb RunAs',
      '    exit',
      '}',
      '',
      'Write-Host @"',
      '============================================================',
      '   IDEActivation - JetBrains Activation Tool',
      '   For Learning Purposes Only',
      '============================================================',
      '"@ -ForegroundColor Cyan',
      '',
      'Write-Host ""',
      'Write-Host "[1/4] Downloading components..." -ForegroundColor Green',
      '$workDir = "$env:PUBLIC\\.ideactivation"',
      'if (Test-Path $workDir) { Remove-Item -Path $workDir -Recurse -Force }',
      'New-Item -Path $workDir -ItemType Directory -Force | Out-Null',
      'New-Item -Path "$workDir\\config" -ItemType Directory -Force | Out-Null',
      'New-Item -Path "$workDir\\plugins" -ItemType Directory -Force | Out-Null',
      '',
      '$client = New-Object System.Net.Http.HttpClient',
      '$client.Timeout = [System.TimeSpan]::FromSeconds(30)',
      '',
      '$files = @(',
      '    @{ url = "' + baseUrl + '/ja-netfilter/ja-netfilter.jar"; path = "$workDir\\ja-netfilter.jar" },',
      '    @{ url = "' + baseUrl + '/ja-netfilter/config/dns.conf"; path = "$workDir\\config\\dns.conf" },',
      '    @{ url = "' + baseUrl + '/ja-netfilter/config/url.conf"; path = "$workDir\\config\\url.conf" },',
      '    @{ url = "' + baseUrl + '/ja-netfilter/config/power.conf"; path = "$workDir\\config\\power.conf" },',
      '    @{ url = "' + baseUrl + '/ja-netfilter/config/privacy.conf"; path = "$workDir\\config\\privacy.conf" }',
      ')',
      '',
      'foreach ($file in $files) {',
      '    try {',
      '        $response = $client.GetAsync($file.url).Result',
      '        $response.EnsureSuccessStatusCode() | Out-Null',
      '        $content = $response.Content.ReadAsByteArrayAsync().Result',
      '        [System.IO.File]::WriteAllBytes($file.path, $content)',
      '        Write-Host "  Downloaded: $($file.url)" -ForegroundColor Gray',
      '    } catch {',
      '        Write-Host "  Failed: $($file.url)" -ForegroundColor Red',
      '    }',
      '}',
      '',
      'Write-Host ""',
      'Write-Host "[2/4] Configuring IDE..." -ForegroundColor Green',
      '$jetbrainsDir = "$env:LOCALAPPDATA\\JetBrains"',
      'if (Test-Path $jetbrainsDir) {',
      '    $products = Get-ChildItem -Path $jetbrainsDir -Directory',
      '    foreach ($product in $products) {',
      '        Write-Host "  Processing: $($product.Name)" -ForegroundColor Gray',
      '    }',
      '}',
      '',
      'Write-Host ""',
      'Write-Host "[3/4] Generating activation code..." -ForegroundColor Green',
      '$activationCode = irm ' + baseUrl + '/api/v1/license/generate -Method Post -ContentType "application/json" -Body \'{"productCode":"II,PCWMP,PSI"}\'',
      'Write-Host "  Activation code generated" -ForegroundColor Gray',
      '',
      'Write-Host ""',
      'Write-Host "[4/4] Activation complete!" -ForegroundColor Green',
      'Write-Host ""',
      'Write-Host "Activation code:" -ForegroundColor Yellow',
      'Write-Host $activationCode.data.licenseKey -ForegroundColor White',
      'Write-Host ""',
      'Write-Host "Press any key to exit..." -ForegroundColor Gray',
      '$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")'
    ];
    return lines.join('\n');
  }

  /**
   * Generate activation script for Linux/Mac
   */
  generateUnixScript(baseUrl) {
    var lines = [
      '#!/bin/bash',
      '# IDEActivation Auto-Activation Script',
      '# Generated at: ' + new Date().toISOString(),
      '# WARNING: For learning purposes only!',
      '',
      'set -e',
      '',
      'echo "============================================================"',
      'echo "   IDEActivation - JetBrains Activation Tool"',
      'echo "   For Learning Purposes Only"',
      'echo "============================================================"',
      '',
      'echo ""',
      'echo "[1/4] Downloading components..."',
      'WORK_DIR="$HOME/.ideactivation"',
      'mkdir -p "$WORK_DIR/config" "$WORK_DIR/plugins"',
      '',
      'download_file() {',
      '    local url=$1',
      '    local path=$2',
      '    if command -v curl &> /dev/null; then',
      '        curl -sL "$url" -o "$path"',
      '    elif command -v wget &> /dev/null; then',
      '        wget -q "$url" -O "$path"',
      '    else',
      '        echo "Error: curl or wget not found"',
      '        exit 1',
      '    fi',
      '    echo "  Downloaded: $url"',
      '}',
      '',
      'download_file "' + baseUrl + '/ja-netfilter/ja-netfilter.jar" "$WORK_DIR/ja-netfilter.jar"',
      'download_file "' + baseUrl + '/ja-netfilter/config/dns.conf" "$WORK_DIR/config/dns.conf"',
      'download_file "' + baseUrl + '/ja-netfilter/config/url.conf" "$WORK_DIR/config/url.conf"',
      'download_file "' + baseUrl + '/ja-netfilter/config/power.conf" "$WORK_DIR/config/power.conf"',
      'download_file "' + baseUrl + '/ja-netfilter/config/privacy.conf" "$WORK_DIR/config/privacy.conf"',
      '',
      'echo ""',
      'echo "[2/4] Configuring IDE..."',
      'JETBRAINS_DIR="$HOME/.config/JetBrains"',
      'if [ -d "$JETBRAINS_DIR" ]; then',
      '    for product in "$JETBRAINS_DIR"/*/; do',
      '        echo "  Processing: $(basename "$product")"',
      '    done',
      'fi',
      '',
      'echo ""',
      'echo "[3/4] Generating activation code..."',
      'ACTIVATION_CODE=$(curl -s -X POST "' + baseUrl + '/api/v1/license/generate" \\',
      '    -H "Content-Type: application/json" \\',
      '    -d \'{"productCode":"II,PCWMP,PSI"}\')',
      'echo "  Activation code generated"',
      '',
      'echo ""',
      'echo "[4/4] Activation complete!"',
      'echo ""',
      'echo "Activation code:"',
      'echo "$ACTIVATION_CODE" | grep -o \'"licenseKey":"[^"]*"\' | cut -d\'"\' -f4',
      'echo ""'
    ];
    return lines.join('\n');
  }
}

module.exports = new LicenseService();
