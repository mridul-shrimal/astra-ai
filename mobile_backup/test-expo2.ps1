$env:REACT_NATIVE_PACKAGER_HOSTNAME = '10.114.102.152'
Write-Host "Env var set: $env:REACT_NATIVE_PACKAGER_HOSTNAME"
npx expo start --lan 2>&1 | Tee-Object -Variable output | Select-String -Pattern 'Waiting on|LAN|10\.114\.102\.152|QR|exp://' -Context 0,3
Write-Host "--- OUTPUT END ---"
$output