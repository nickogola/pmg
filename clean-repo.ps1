#!/usr/bin/env pwsh
# Repository cleaning script
# Run this script to clean up your repository

# Display current status
Write-Host "Current repository status:" -ForegroundColor Cyan
git status

# Add and commit the .gitignore and .gitattributes files if they've been modified
Write-Host "`nCommitting .gitignore and .gitattributes changes:" -ForegroundColor Cyan
git add .gitignore .gitattributes
git commit -m "Update repository configuration files"

# Clean tracked files that should now be ignored
Write-Host "`nCleaning tracked files that should be ignored:" -ForegroundColor Cyan
git rm --cached -r .
git add .
git status

Write-Host "`nReady to commit changes? (y/n)" -ForegroundColor Yellow
$confirmation = Read-Host
if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    git commit -m "Clean repository according to .gitignore rules"
    Write-Host "Changes committed." -ForegroundColor Green
} else {
    git reset
    Write-Host "Changes have been reset. No changes were committed." -ForegroundColor Yellow
}

# Clean any remaining untracked files and directories
Write-Host "`nWould you like to clean untracked files? (y/n)" -ForegroundColor Yellow
$cleanConfirmation = Read-Host
if ($cleanConfirmation -eq 'y' -or $cleanConfirmation -eq 'Y') {
    Write-Host "The following files/directories would be removed:" -ForegroundColor Cyan
    git clean -fd -n
    
    Write-Host "`nProceed with removal? (y/n)" -ForegroundColor Red
    $finalConfirmation = Read-Host
    if ($finalConfirmation -eq 'y' -or $finalConfirmation -eq 'Y') {
        git clean -fd
        Write-Host "Untracked files removed." -ForegroundColor Green
    }
}

Write-Host "`nRepository cleaning complete!" -ForegroundColor Green