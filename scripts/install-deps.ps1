param(
    [switch]$Force = $false
)

Write-Host "Checking for Node.js and npm..."

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $node -or -not $npm) {
    Write-Host "Node.js or npm not found in PATH." -ForegroundColor Yellow
    Write-Host "Please install Node.js (recommended version in .nvmrc) or use nvm/nvm-windows, then re-run this script."
    if (-not $Force) { exit 1 }
}

Write-Host "Installing project dependencies (npm ci)..."
npm ci

Write-Host "Done."
