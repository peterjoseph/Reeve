## MySQL Database Setup

The folder ./scripts contains all the sql scripts required to build the MySQL database tables.

All files should be run sequentially from the earliest to most recent date.

### First time Setup:

**Windows:**

Modify and execute the .bat file 'execute.bat' in the scripts folder.

for %%G in (*.sql) do sqlcmd /S *servername* /d reeve -E -i"%%G"
pause

**Other:**

Alternatively, the scripts/compiled folder contains a file called 'compiled.sql,' which is a single sql file of every database script.