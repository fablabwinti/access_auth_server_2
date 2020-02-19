# FabLab RFID Server install on a Raspberry Pi Zero W


Note: In case something goes wrong: use uart console, connect it like shown on google searches,
beforehand you need to enable it by editing the config.txt on the sd card, adding ´enable_uart=1´ at the end of the file.
Connect through ssh (using putty or mobaxterm for example).


## Install git:

´sudp apt-get install git´


## Install apache2 webserver for use with phpmyadmin (web interface for mysql database)

´sudo apt-get install apache2 apache2-doc apache2-utils´


## Install php7

´sudo apt-get install libapache2-mod-php7.0 php7.0 php-pear php7.0-opcache´


## Install mySQL Server and phpMyAdmin

´sudo apt-get install php7.0-mysql´

´sudo apt-get install mysql-server mysql-client´

´sudo apt-get install phpmyadmin´

During installation, select apache2 option, later in the installation choose^'no' on automatically configuring the database, we do that below.

Configure apache2:

´sudo nano /etc/apache2/apache2.conf´

The configuration file will load in Nano. Navigate to the bottom of the file (keep pressing CTRL + V to jump page by page until you’re at the bottom of the file) and add the following new line to the file:

Include /etc/phpmyadmin/apache.conf

Save (crtl+x & enter)

Restart apache2:

´sudo /etc/init.d/apache2 restart´

Add the default user 'pi' to the mysql database so it can be used for phpmyadmin:

´sudo su
mysql -u root -p   (password is not set by default, you can set it with 'sudo passwd root' I set it to 'root' as well.)
create new user with full access:
CREATE USER 'pi'@'localhost' IDENTIFIED BY 'raspberry';
GRANT ALL PRIVILEGES ON * . * TO 'pi'@'localhost';´

Type 'exit' to exit mySQL.

Now go to ´your.Raspi.IP/phpmyadmin´ and login as pi with passwort raspberry.
Create a new database named ´flauth´.
Select this databese (left side) and click on import.
Import ´flauth.sql´ which you can download from the git repository (download it to your machine, not the raspberry pi).
Now the flauth database will have several tables.

## Install nodejs:
First run:
´wget -O - https://raw.githubusercontent.com/audstanley/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash
node -v
exit´

This will install the latest version of nodejs. But we need NodeJS v6, so run:

´sudo node-install -v 6;´

Select version 6.9.5 (latest version).

Go to your home folder and clone access-auth-server repo:
´cd ~
git clone https://github.com/fablabwinti/access_auth_server.git´

Set the configuration:
´cd access_auth_server
nano config.js´

- Change the dbHost to 'localhost' (or the ip of the host where the database is running if not run locally)
- Change the dbUser to pi
- Change the dbPass to raspberry
- Press ctrl+x to exit and save

Install all required node modules:
´sudo npm install´

Run the server from the access_auth_server directory:
´node server.js´

## Preliminary: get ssl certificate

´sudo apt-get install openssl

Go to the access_auth_server/ directory.
´cd ~/access_auth_server
mkdir keys
cd keys
sudo openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout privkey.pem -out cert.pem´

Fill in the form with your info; then the keys will be generated.

