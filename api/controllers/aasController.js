'use strict';
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.14.21',
    user: 'flauth',
    password: 'FabLab',
    database: 'flauth'    
});

connection.connect(function(error) {
    if(!!error){
        console.log(error);
    } else {
        console.log('Connected');
    }
});


// MACHINES
exports.list_all_machines = function(req, res) {
    connection.query('SELECT * FROM machines', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.list_all_machine_tags = function(req, res) {
    connection.query('SELECT t.*, r.start, r.end FROM tags t LEFT JOIN rights r ON t.tid=r.tid WHERE r.end>=now() AND r.mid=' + req.params.mid, function(error, rows, fields) {
    //connection.query('SELECT t.*, r.end FROM tags t LEFT JOIN rights r ON r.tid=t.tid WHERE tid IN (SELECT tid FROM rights WHERE start<=now() AND end>=now() AND mid=' + req.params.mid + ')', function(error, rows, fields) {
    //connection.query('SELECT * FROM machines', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.list_all_machine_logs = function(req, res) {
    connection.query('SELECT * FROM logs WHERE mid=' + req.params.mid, function(error, rows, fields) {
//    connection.query('SELECT * FROM machines', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.create_a_machine = function(req, res) {
    res.json(req.body);
};

exports.read_a_machine = function(req, res) {
    connection.query('SELECT * FROM machines WHERE mid=' + req.params.mid, function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.update_a_machine = function(req, res) {
};

exports.delete_a_machine = function(req, res) {
};


// TAGS
exports.list_all_tags = function(req, res) {
    connection.query('SELECT * FROM tags', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.create_a_tag = function(req, res) {
    res.json(req.body);
};

exports.read_a_tag = function(req, res) {
    connection.query('SELECT * FROM tags WHERE tid=' + req.params.tid, function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.update_a_tag = function(req, res) {
};

exports.delete_a_tag = function(req, res) {
};


// RIGHTS
exports.list_all_rights = function(req, res) {
    connection.query('SELECT * FROM rights', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.create_a_right = function(req, res) {
    res.json(req.body);
};

exports.read_a_right = function(req, res) {
    connection.query('SELECT * FROM rights WHERE rid=' + req.params.rid, function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.update_a_right = function(req, res) {
};

exports.delete_a_right = function(req, res) {
};


// LOGS
exports.list_all_logs = function(req, res) {
    connection.query('SELECT * FROM logs', function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.create_a_log = function(req, res) {
    res.json(req.body);
};

exports.read_a_log = function(req, res) {
    connection.query('SELECT * FROM logs WHERE lid=' + req.params.lid, function(error, rows, fields) {
        if (error) {
            res.send(error);
        } else {
            res.json(rows);
        }            
    });
};

exports.update_a_log = function(req, res) {
};

exports.delete_a_log = function(req, res) {
};
