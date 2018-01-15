'use strict';
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'flauth',
    password : 'FabLab',
    database : 'flauth',
    debug    :  false
});

var menues = Array(
    {id: 'home', text: 'Invoices', link: '/'},
    {id: 'logs', text: 'Logs', link: '/logs'},    
    {id: 'machines', text: 'Machines', link: '/machines'},
    {id: 'tags', text: 'Tags', link: '/tags'},
    {id: 'events', text: 'Events', link: '/events'},    
    {id: 'rights', text: 'Rights', link: '/rights'},    
    {id: 7, text: 'Logout', link: '/logout'}    
);


// Frontend Forms ///////////
exports.frontend = function(req, res) {
    //res.send('FabLab Machine Access Authentication Server');
    res.render('error', { title: 'FabLab Access Auth', message: 'Hello there!'});
};

exports.tag_summary = function(req, res) {
    if (req.body.uid) {
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            console.log('connected as id ' + connection.threadId);

            var tag;
            var logs = Array();
            connection.query('SELECT * FROM tags WHERE uid=?', req.body.uid, function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    if (rows[0]) {
                        tag = rows[0];
                        connection.query('SELECT date_format(l.timestamp, \'%d.%m.%Y %h:%i:%s\') timestamp, m.name machine, e.name event, l.remarks FROM logs l LEFT JOIN machines m ON l.mid=m.mid LEFT JOIN events e ON l.eid=e.eid WHERE tid=? ORDER BY timestamp', tag.tid, function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                logs = rows;
                                res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', menues: menues, tag: tag, logs: logs});
                            }            
                        });
                    } else {
                        res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', menues: menues, tag: tag, logs: logs});
                    }
                }            
            });
            connection.release();
        });
    } else {
        // show empty form to scan RFID
        var tag;
        var logs = Array();
        res.render('tag_summary', {title: 'FabLab Access Auth', message: 'Tag Summary', menues: menues, tag: tag, logs: logs});
    }
};

exports.tags = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        console.log('connected as id ' + connection.threadId);

        var tags = Array();
        connection.query('SELECT * FROM tags', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                tags = rows;
                res.render('tags', {title: 'FabLab Access Auth', message: 'Tags', menues: menues, tags: tags});
            }            
        });
        connection.release();
    });
};

exports.logs = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        console.log('connected as id ' + connection.threadId);

        var logs = Array();
        connection.query('SELECT l.lid, l.timestamp, m.name machine, t.name tag, e.name event, l.remarks FROM logs l LEFT JOIN machines m ON m.mid=l.mid LEFT JOIN tags t ON t.tid=l.tid LEFT JOIN events e ON e.eid=l.eid', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                logs = rows;
                res.render('logs', {title: 'FabLab Access Auth', message: 'Logs', menues: menues, logs: logs});
            }            
        });
        connection.release();
    });
};

exports.machines = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        console.log('connected as id ' + connection.threadId);

        var machines = Array();
        connection.query('SELECT * FROM machines', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                machines = rows;
                res.render('machines', {title: 'FabLab Access Auth', message: 'Machines', menues: menues, machines: machines});
            }            
        });
        connection.release();
    });
};

exports.events = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        console.log('connected as id ' + connection.threadId);

        var events = Array();
        connection.query('SELECT * FROM events', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                events = rows;
                res.render('events', {title: 'FabLab Access Auth', message: 'Events', menues: menues, events: events});
            }            
        });
        connection.release();
    });
};

exports.rights = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        console.log('connected as id ' + connection.threadId);

        var rights = Array();
        connection.query('SELECT r.rid, t.name tag, m.name machine, r.start, r.end FROM rights r LEFT JOIN tags t ON t.tid=r.tid LEFT JOIN machines m ON m.mid=r.mid', function(error, rows, fields) {
        //connection.query('SELECT * FROM rights', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                rights = rows;
                res.render('rights', {title: 'FabLab Access Auth', message: 'Rights', menues: menues, rights: rights});
            }            
        });
        connection.release();
    });
};

exports.tag_edit = function(req, res) {
    if (req.query.tid){
        if (!req.body.uid){
            // not post data -> load tag with given tid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var tag;
                connection.query('SELECT * FROM tags WHERE tid=?', req.query.tid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        tag = rows[0];
                        res.render('tag_edit', {title: 'FabLab Access Auth', message: 'Edit Tag', menues: menues, tag: tag});
                    }            
                });
            });
        } else {
            // update data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE tags SET uid="' + req.body.uid + '", name="' + req.body.name + '" WHERE tid=' + req.query.tid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        tag = rows[0];
                        res.redirect('/tags');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.uid){
            // no tid -> load empfty form to add new tag
            var tag;
            res.render('tag_edit', {title: 'FabLab Access Auth', message: 'Add Tag', menues: menues, tag: tag});
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('INSERT tags SET uid="' + req.body.uid + '", name="' + req.body.name + '"', function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        tag = rows[0];
                        res.redirect('/tags');
                    }            
                });
            });
        }
    }
};

exports.log_edit = function(req, res) {
    if (req.query.lid){
        if (!req.body.timestamp){
            // not post data -> load log with given lid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var log;
                var machines = Array();
                var tags = Array();
                var events = Array();
                connection.query('SELECT * FROM logs WHERE lid=?', req.query.lid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        log = rows[0];
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
                                                res.render('log_edit', {title: 'FabLab Access Auth', message: 'Add Edit', menues: menues, machines: machines, tags: tags, events: events, log: log});
                                            }            
                                        });
                                    }            
                                });
                            }            
                        });
                    }            
                });
                connection.release();
            });
        } else {
            // update data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE logs SET timestamp="' + req.body.timestamp + '", mid=' + req.body.mid + ', tid=' + req.body.tid + ', eid=' + req.body.eid + ', remarks="' + req.body.remarks + '" WHERE lid=' + req.query.lid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        tag = rows[0];
                        res.redirect('/logs');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.timestamp){
            // no lid -> load empfty form to add new log
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var log;
                var machines = Array();
                var tags = Array();
                var events = Array();
                connection.query('SELECT mid, name FROM machines', function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        machines = rows;
                        connection.query('SELECT tid, name FROM tags', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                tags = rows;
                                connection.query('SELECT eid, name FROM events', function(error, rows, fields) {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        events = rows;
                                        res.render('log_edit', {title: 'FabLab Access Auth', message: 'Add Log', menues: menues, machines: machines, tags: tags, events: events, log: log});
                                    }            
                                });
                            }            
                        });
                    }            
                });
                connection.release();
            });
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('INSERT logs SET timestamp="' + req.body.timestamp + '", mid=' + req.body.mid + ', tid=' + req.body.tid + ', eid=' + req.body.eid + ', remarks="' + req.body.remarks + '"', function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        tag = rows[0];
                        res.redirect('/logs');
                    }            
                });
            });
        }
    }
};

exports.machine_edit = function(req, res) {
    if (req.query.mid){
        if (!req.body.name){
            // not post data -> load machine with given mid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var machine;
                connection.query('SELECT * FROM machines WHERE mid=?', req.query.mid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        machine = rows[0];
                        res.render('machine_edit', {title: 'FabLab Access Auth', message: 'Edit Machine', menues: menues, machine: machine});
                    }            
                });
            });
        } else {
            // update data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE machines SET name="' + req.body.name + '", config="' + req.body.config + '" WHERE mid=' + req.query.mid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/machines');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.name){
            // no mid -> load empfty form to add new machine
            var machine;
            res.render('machine_edit', {title: 'FabLab Access Auth', message: 'Add Machine', menues: menues, machine: machine});
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('INSERT machines SET name="' + req.body.name + '", config="' + req.body.config + '"', function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/machines');
                    }            
                });
            });
        }
    }
};

exports.event_edit = function(req, res) {
    if (req.query.eid){
        if (!req.body.name){
            // not post data -> load event with given eid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var event;
                connection.query('SELECT * FROM events WHERE eid=?', req.query.eid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        event = rows[0];
                        res.render('event_edit', {title: 'FabLab Access Auth', message: 'Edit Event', menues: menues, event: event});
                    }            
                });
            });
        } else {
            // update data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE events SET name="' + req.body.name + '" WHERE eid=' + req.query.eid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/events');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.name){
            // no eid -> load empfty form to add new event
            var event;
            res.render('event_edit', {title: 'FabLab Access Auth', message: 'Add Event', menues: menues, event: event});
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('INSERT events SET name="' + req.body.name + '"', function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/events');
                    }            
                });
            });
        }
    }
};

exports.right_edit = function(req, res) {
    if (req.query.rid){
        if (!req.body.tid){
            // not post data -> load right with given rid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var right;
                var tags = Array();
                var machines = Array();
                connection.query('SELECT * FROM rights WHERE rid=?', req.query.rid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        right = rows[0];
                        connection.query('SELECT * FROM tags', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                tags = rows;
                                connection.query('SELECT * FROM machines', function(error, rows, fields) {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        machines = rows;
                                        res.render('right_edit', {title: 'FabLab Access Auth', message: 'Edit Right', menues: menues, right: right, tags: tags, machines: machines});
                                    }
                                });
                            }
                        });
                    }    
                });
            });
        } else {
            // update data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE rights SET tid=' + req.body.tid + ', mid=' + req.body.mid + ', start="' + req.body.start + '", end="' + req.body.end + '" WHERE rid=' + req.query.rid, function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/events');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.tid){
            // no tid -> load empfty form to add new right
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                var right;
                var tags = Array();
                var machines = Array();
                connection.query('SELECT * FROM tags', function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        tags = rows;
                        connection.query('SELECT * FROM machines', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                machines = rows;
                                res.render('right_edit', {title: 'FabLab Access Auth', message: 'Add Right', menues: menues, right: right, tags: tags, machines: machines});
                            }
                        });
                    }
                });
            });
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                console.log('connected as id ' + connection.threadId);

                connection.query('INSERT rights SET tid=' + req.body.tid + ', mid=' + req.body.mid + ', start="' + req.body.start + '", end="' + req.body.end + '"', function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/events');
                    }            
                });
            });
        }
    }
};

exports.login = function(req, res) {
    res.render('error', { title: 'FabLab Access Auth', message: 'Authentication not implemented yet!', menues: menues });
};

exports.logout = function(req, res) {
    res.render('error', { title: 'FabLab Access Auth', message: 'Authentication not implemented yet!', menues: menues });
};


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
