$ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.InterfaceAlias -eq "Wi-Fi" -and
        $_.IPAddress -notlike "127.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    } |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Error "Could not find a Wi-Fi IPv4 address."
    exit 1
}

Write-Host "Using Wi-Fi IP: $ip"

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip

npx expo start --lan