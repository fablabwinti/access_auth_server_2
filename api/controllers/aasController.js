'use strict';
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '192.168.14.21',
    user     : 'flauth',
    password : 'FabLab',
    database : 'flauth',
    debug    :  false
});


// Frontend Forms ///////////
exports.frontend = function(req, res) {
    //res.send('FabLab Machine Access Authentication Server');
    res.render('welcome', { title: 'FabLab Access Auth', message: 'Hello there!'});
}

exports.tag_summary = function(req, res) {
    if (req.body.uid) {
        pool.getConnection(function(err,connection){
            if (err) {
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }  
            console.log('connected as id ' + connection.threadId);

            var tag;
            var logs = Array();
            connection.query('SELECT * FROM tags WHERE uid=' + req.body.uid, function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    if (rows[0]) {
                        tag = rows[0];
                        connection.query('SELECT date_format(l.timestamp, \'%d.%m.%Y %h:%i:%s\') timestamp, m.name machine, e.name event, l.remarks FROM logs l LEFT JOIN machines m ON l.mid=m.mid LEFT JOIN events e ON l.eid=e.eid WHERE tid=' + tag.tid + ' ORDER BY timestamp', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                logs = rows;
                                res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', tag: tag, logs: logs});
                            }            
                        });
                    } else {
                        res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', tag: tag, logs: logs});
                    }
                }            
            });
            connection.release();

            connection.on('error', function(err) {      
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            });
        });
    } else {
        // show empty form to scan RFID
        var tag;
        var logs = Array();
        res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', tag: tag, logs: logs});
    }
}

exports.add_tag = function(req, res) {
    if (req.body.tid) {
        pool.getConnection(function(err,connection){
            if (err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
            }  
            console.log('connected as id ' + connection.threadId);

            connection.query('SELECT * FROM tags WHERE tid=' + req.body.tid, function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    res.render('add_tag', {title: 'FabLab Access Auth', message: 'Add Tag Entry', tag: rows[0]});
                }            
            });
            connection.release();

            connection.on('error', function(err) {      
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            });
        });
    } else {
        res.render('add_tag', {title: 'FabLab Access Auth', message: 'Add Tag Entry'});
    }
}

exports.add_log = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var machines = Array();
        var tags = Array();
        var events = Array();
        connection.query('SELECT * FROM machines', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                machines = rows;
                connection.query('SELECT * FROM tags', function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        tags = rows;
                        connection.query('SELECT * FROM events', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                events = rows;
                                res.render('add_log', {title: 'FabLab Access Auth', message: 'Add Log Entry', machines: machines, tags: tags, events: events});
                            }            
                        });
                    }            
                });
            }            
        });
        connection.release();

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}


// RestAPI //////////////////

// MACHINES
exports.list_all_machines = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT * FROM machines' + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
};

exports.list_all_machine_tags = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT t.*, UNIX_TIMESTAMP(r.start) start, UNIX_TIMESTAMP(r.end) end FROM tags t LEFT JOIN rights r ON t.tid=r.tid WHERE r.end>=now() AND r.mid=' + req.params.mid + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.list_all_machine_logs = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks FROM logs WHERE mid=' + req.params.mid + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.create_a_machine = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('INSERT INTO machines SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.read_a_machine = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM machines WHERE mid=?', req.params.mid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.update_a_machine = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('UPDATE machines SET ? WHERE mid=?', req.body, req.params.mid, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.delete_a_machine = function(req, res) {
};


// TAGS
exports.list_all_tags = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT * FROM tags' + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.create_a_tag = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('INSERT INTO tags SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.read_a_tag = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM tags WHERE tid=' + req.params.tid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.update_a_tag = function(req, res) {
};

exports.delete_a_tag = function(req, res) {
};


// RIGHTS
exports.list_all_rights = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT rid, tid, mid, UNIX_TIMESTAMP(start) start, UNIX_TIMESTAMP(end) end FROM rights' + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.create_a_right = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('INSERT INTO rights SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.read_a_right = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT rid, tid, mid, UNIX_TIMESTAMP(start) start, UNIX_TIMESTAMP(end) end FROM rights WHERE rid=' + req.params.rid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.update_a_right = function(req, res) {
};

exports.delete_a_right = function(req, res) {
};


// EVENTS
exports.list_all_events = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT * FROM events' + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.create_a_event = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('INSERT INTO events SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.read_a_event = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM events WHERE eid=' + req.params.eid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.update_a_event = function(req, res) {
};

exports.delete_a_event = function(req, res) {
};


// LOGS
exports.list_all_logs = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + req.query.limit;
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + req.query.offset;
        }
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks FROM logs' + limit + offset, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.create_a_log = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('INSERT INTO logs SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
            // Neat!
        });
        
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.read_a_log = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks FROM logs WHERE lid=' + req.params.lid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};

exports.update_a_log = function(req, res) {
};

exports.delete_a_log = function(req, res) {
};


// TIMESTAMP
exports.get_timestamp = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT UNIX_TIMESTAMP() timestamp', function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                res.json(rows);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
};
