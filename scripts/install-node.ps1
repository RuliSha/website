<#
  install-node.ps1

  Attempts to install Node.js using winget (Windows Package Manager) if available.
  If winget is not present, opens the Node.js download page and the nvm-windows releases page
  to let the user install manually or via nvm.

  Run as: .\scripts\install-node.ps1
#>

Write-Host "Checking for existing Node installation..."

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host "Node is already installed at: $($node.Path)" -ForegroundColor Green
    exit 0
}

Write-Host "Node not found. Checking for winget (Windows Package Manager)..."

$winget = Get-Command winget -ErrorAction SilentlyContinue
if ($winget) {
    Write-Host "winget found. Will attempt to install Node.js LTS (OpenJS.NodeJS.LTS) using winget..." -ForegroundColor Cyan
    Write-Host "You may be prompted by UAC to allow the installer to run." -ForegroundColor Yellow
    try {
        # Use the official OpenJS package id for LTS. winget may ask for confirmation.
        winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        Write-Host "winget install finished. Verifying installation..."
        Start-Sleep -Seconds 1
        $node = Get-Command node -ErrorAction SilentlyContinue
        if ($node) {
            Write-Host "Node installed successfully at: $($node.Path)" -ForegroundColor Green
            exit 0
        }
        else {
            Write-Host "Installation finished but Node not found on PATH. Please restart your shell or sign out/in and try again." -ForegroundColor Yellow
            exit 2
        }
    }
    catch {
        Write-Host "winget install failed: $_" -ForegroundColor Red
        Write-Host "Falling back to manual install instructions..." -ForegroundColor Yellow
    }
}

Write-Host "winget not available or automatic install failed." -ForegroundColor Yellow
Write-Host "Two recommended options: 1) Install nvm-windows and use it to install Node; 2) Download and run the Node.js installer (LTS)." -ForegroundColor Cyan

Write-Host "Opening download pages in your browser..." -ForegroundColor Cyan
Start-Process "https://nodejs.org/en/download/"
Start-Process "https://github.com/coreybutler/nvm-windows/releases"

Write-Host "If you choose nvm-windows, install it, then run in PowerShell (example):" -ForegroundColor Cyan
Write-Host "    nvm install 20.0.0" -ForegroundColor White
Write-Host "    nvm use 20.0.0" -ForegroundColor White
Write-Host "If you installed Node with the official installer, re-open PowerShell and verify with: node -v; npm -v" -ForegroundColor Cyan

exit 0
