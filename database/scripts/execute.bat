for %%G in (*.sql) do sqlcmd /S servername /d reeve -E -i"%%G"
pause