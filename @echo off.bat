@echo off
echo .....
echo Open a new window with a custom title - 04-Aug-2025

set "local_url=http://localhost:8787"
echo Opening ''%local_url%'' - default browser.
start "wrangler dev" "%local_url%"
echo .....
 

npm run dev "%
echo The main script continues to run.
pause