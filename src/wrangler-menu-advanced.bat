`
@echo off
title Wrangler Dev Menu
color 0A

:devlocal
cls

echo Starting Wrangler Dev in offline mode...
start "WRANGLER_DEV" cmd "wrangler dev --local"

:sendkey
echo Wrangler is READY. Sending 'b' key...
powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.AppActivate('WRANGLER_DEV'); $wshell.SendKeys('b')"
exit
quit

:end
echo.
echo Wrangler started. This window can be closed.
exit
`
