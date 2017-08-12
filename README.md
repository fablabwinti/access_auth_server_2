# access_auth_server
Webserver part for the user access authorisation solution 

# installation
You need to install MySQSL and NodeJS V6 to run this server. 

- Get MySQL from https://dev.mysql.com/downloads/installer/
- Install it
- Open MySQL Workbench
- Import the **sql/flauth.sql** (this creates a new schema/database **flauth**)
- Create a new user **flauth** with password **FabLab** and all privileges for schema **flauth**
- Get Node JS V6 from https://nodejs.org/en/download/
- Install it
- Git clone the **access_auth_server** repository into a folder (or download zip and unpack)
- Run **node server.js**