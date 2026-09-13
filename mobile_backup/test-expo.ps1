$env:REACT_NATIVE_PACKAGER_HOSTNAME = '10.114.102.152'
Write-Host "Before npx: $env:REACT_NATIVE_PACKAGER_HOSTNAME"
npx expo start --lan 2>&1 | Select-String -Pattern 'Waiting on|Metro|LAN|10.114.102.152' -Context 0,2