# mobile_backup/scripts/start-expo.ps1
# Automatically detects LAN IPv4 and starts Expo in LAN mode with correct API URL

# Detect active Wi-Fi/LAN IPv4 (exclude loopback, Docker, VPN, etc.)
$ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.InterfaceAlias -match "Wi-Fi|Ethernet|Wireless" -and
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    } |
    Sort-Object { if ($_.InterfaceAlias -match "Wi-Fi") { 0 } else { 1 } } |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Error "Could not find a suitable LAN IPv4 address."
    exit 1
}

Write-Host "Detected LAN IP: $ip"

# Update .env with current LAN IP for API URL
$envPath = "$PSScriptRoot\..\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    # Simple line-by-line replacement
    $lines = $envContent -split "`r?`n"
    $updated = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match '^EXPO_PUBLIC_API_URL=http://[\d.]+:5000/api$') {
            $lines[$i] = "EXPO_PUBLIC_API_URL=http://$($ip):5000/api"
            $updated = $true
        }
    }
    if ($updated) {
        $newEnvContent = $lines -join "`n"
        Set-Content -Path $envPath -Value $newEnvContent -NoNewline
        Write-Host "Updated EXPO_PUBLIC_API_URL to http://$($ip):5000/api"
    } else {
        Write-Host "EXPO_PUBLIC_API_URL already set to current IP"
    }
} else {
    Write-Warning ".env file not found at $envPath"
}

# Set Metro/Expo LAN hostname
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip

# Start Expo in LAN mode
npx expo start --lan