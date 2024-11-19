var config = {};

config.wsPort = 3001;
config.httpPort = 3002;
config.httpsPort = 3003;
config.serverVersion = '0.1.2';
config.apiVersion = '0.1.2';
config.dbHost = 'localhost';    //for testing
//config.dbHost = '192.168.1.5' 
//config.dbHost = 'mysql';        // for docker
config.dbPort = '3306';  // inside container or db is on localhost
//config.dbPort = '3308';  // outside container
config.dbName = 'flauth';
config.dbUser = 'flauth';
config.dbPass = 'FabLab';

config.verboseLevel = 1;
config.logLevel = 2;

module.exports = config;