$env:EXPO_PACKAGER_HOSTNAME = '10.114.102.152'
Write-Host "EXPO_PACKAGER_HOSTNAME set: $env:EXPO_PACKAGER_HOSTNAME"
npx expo start --lan 2>&1 | Tee-Object -Variable output
$output