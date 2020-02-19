'use strict';
const config = require('../../config');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : config.dbHost,   //'localhost',
    database : config.dbName,   //'flauth',
    user     : config.dbUser,   //'flauth',
    password : config.dbPass,   //'FabLab',
    port     : config.dbPort,   //'3307',
    debug    : false,
    checkExpirationInterval: 900000, // = 15 Min. How frequently expired sessions will be cleared; milliseconds:
    expiration: 1800000,             // = 30 Min. The maximum age of a valid session; milliseconds:
    createDatabaseTable: true        // Whether or not to create the sessions database table, if one does not already exist:
});
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, pool);
var salt = "FLW@tpw";

var menues_admin = Array(
    {id: 'home', text: 'Create Invoice', link: '/'},
    {id: 'invoices', text: 'Invoices', link: '/invoices'},    
    {id: 'logs', text: 'Logs', link: '/logs'},    
    {id: 'tags', text: 'Tags', link: '/tags'},
    {id: 'machines', text: 'Machines', link: '/machines'},
    {id: 'articles', text: 'Articles', link: '/articles'},
    {id: 'events', text: 'Events', link: '/events'},    
    {id: 'rights', text: 'Rights', link: '/rights'},    
    {id: 'users', text: 'Users', link: '/users'},    
    {id: 'logout', text: 'Logout', link: '/logout'}    
);

var menues_lm = Array(
    {id: 'home', text: 'Create Invoice', link: '/'},
    {id: 'invoices', text: 'Invoices', link: '/invoices'},    
    {id: 'logs', text: 'Logs', link: '/logs'},    
    {id: 'tags', text: 'Tags', link: '/tags'},
    {id: 'rights', text: 'Rights', link: '/rights'},    
    {id: 'user', text: 'User', link: '/user_edit'},    
    {id: 'logout', text: 'Logout', link: '/logout'}    
);
var menues = Array();


function setMenues(req, res){
    if (req.session.role == 1){
        return menues_admin;
    } else {
        return menues_lm;
    }
}

// Frontend Forms ///////////
exports.frontend = function(req, res) {
    //res.send('FabLab Machine Access Authentication Server');
    res.render('error', { title: 'FabLab Access Auth', message: 'Hello there!'});
};

exports.tag_summary = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.body.uid) {
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            //console.log('connected as id ' + connection.threadId);

            var tag;
            var logs = Array();
            connection.query('SELECT * FROM tags WHERE uid=?', req.body.uid, function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    if (rows[0]) {
                        tag = rows[0];
                        connection.query('SELECT l.lid lid, date_format(l.timestamp, \'%Y-%m-%d %h:%i:%s\') timestamp, m.name machine, a.description article, e.name event, l.remarks FROM logs l LEFT JOIN machines m ON l.mid=m.mid LEFT JOIN articles a ON l.aid=a.aid LEFT JOIN events e ON l.eid=e.eid WHERE tid=? AND ISNULL(iid) ORDER BY l.lid', tag.tid, function(error, rows, fields) {
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

exports.invoices = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

        var invoices = Array();
        connection.query('SELECT iid, tid, i.name, total, date_format(createdAt, \'%Y-%m-%d %h:%i:%s\') createdAt, date_format(payedAt, \'%Y-%m-%d %h:%i:%s\') payedAt, u.name collectedBy FROM invoices i LEFT JOIN users u ON u.uid=i.uid', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                invoices = rows;
                res.render('invoices', {title: 'FabLab Access Auth', message: 'Invoices', menues: menues, invoices: invoices});
            }            
        });
        connection.release();
    });
};

exports.logs = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.task == 'del'){
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/logs');
            return;
        }
        if (req.query.lid){
            // delete the record with lid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                connection.query('DELETE FROM logs WHERE lid=?', req.query.lid, function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/logs');
                    }            
                });
                connection.release();
            });
        } else {
            // user is not allowed to delete logs
            res.redirect('/logs');
        }
    } else {
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            //console.log('connected as id ' + connection.threadId);

            var logs = Array();
            connection.query('SELECT l.lid lid, date_format(l.timestamp, \'%Y-%m-%d %h:%i:%s.000\') timestamp, t.name tag, e.name event, m.name machine, a.title article, l.remarks remarks, l.iid iid FROM logs l LEFT JOIN machines m ON m.mid=l.mid LEFT JOIN articles a ON a.aid=l.aid LEFT JOIN tags t ON t.tid=l.tid LEFT JOIN events e ON e.eid=l.eid ORDER BY l.lid', function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    logs = rows;
                    res.render('logs', {title: 'FabLab Access Auth', message: 'Logs', menues: menues, logs: logs});
                }            
            });
            connection.release();
        });
    }
};

exports.tags = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

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

exports.machines = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

        var machines = Array();
        connection.query('SELECT mid, m.name, config, price, period, u.name units, min_periods, offdelay, watchdog FROM machines m LEFT JOIN price_units u ON m.uid=u.uid', function(error, rows, fields) {
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


exports.articles = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

        var articles = Array();
        connection.query('SELECT aid, title, description, price, u.name units FROM articles a LEFT JOIN price_units u ON a.uid=u.uid', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                articles = rows;
                res.render('articles', {title: 'FabLab Access Auth', message: 'Articles', menues: menues, articles: articles});
            }            
        });
        connection.release();
    });
};

exports.events = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

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
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);
        var rights = Array();
        connection.query('SELECT r.rid, t.name tag, m.name machine, date_format(r.start, \'%Y-%m-%d\') start, date_format(r.end, \'%Y-%m-%d\') end FROM rights r LEFT JOIN tags t ON t.tid=r.tid LEFT JOIN machines m ON m.mid=r.mid', function(error, rows, fields) {
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

exports.users = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    pool.getConnection(function(err,connection){
        if (err) {
            res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
            return;
        }  
        //console.log('connected as id ' + connection.threadId);

        var users = Array();
        connection.query('SELECT uid, username, name, role FROM users', function(error, rows, fields) {
            if (error) {
                res.send(error);
            } else {
                users = rows;
                res.render('users', {title: 'FabLab Access Auth', message: 'Users', menues: menues, users: users});
            }            
        });
        connection.release();
    });
};


exports.invoice_create = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.tid) {
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            //console.log('connected as id ' + connection.threadId);

            var logs = Array();
            connection.query('SELECT lid, timestamp, l.tid, t.name, l.mid, m.price, m.period, m.min_periods, l.aid, a.price a_price, a.min_periods a_min_periods, eid FROM logs l LEFT JOIN machines m ON l.mid=m.mid LEFT JOIN articles a ON l.aid=a.aid LEFT JOIN tags t ON l.tid=t.tid WHERE l.tid=? AND ISNULL(iid) ORDER BY l.mid, l.aid, l.timestamp', req.query.tid, function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
					if (rows !== undefined && rows.length >= 1) {
						logs = rows;
                        //Create new invoice
                        var iid;
                        connection.query('INSERT invoices SET tid=?, name=?, uid=?', [req.query.tid, logs[0].name, req.session.uid], function(error, result) {
                            if (error) {
                                res.send(error);
                            } else {
                                //res.send(result);
                                iid = result.insertId;
                                console.log('iid:' + iid);

                                var lidStart, lidEnd, start, end, machine, article, price, period, min_perionds, minutes, periods, minPeriods, sum;
                                var total = 0;
                                for (var i=0; i<logs.length; i++){
                                    if (logs[i].eid == 8){  //is product sale
                                        lidStart = logs[i].lid;
                                        article = logs[i].aid;
                                        price = logs[i].a_price;
                                        periods = logs[i].a_min_periods;
                                        sum = periods * price;
                                        console.log('Sum: ' + sum);
                                        total = total + sum;
                                        console.log('Total: ' + total);
                                        connection.query('UPDATE logs SET iid=? WHERE lid=?', [iid, lidStart], function(error, result) {
                                            if (error) {
                                                res.send(error);
                                            } else {
                                                //console.log(result);
                                            }            
                                        });
                                    } else {
                                        if (logs[i].eid == 4){  //is tag login
                                            lidStart = logs[i].lid;
                                            start = logs[i].timestamp;
                                            machine = logs[i].mid;
                                            price = logs[i].price;
                                            period = logs[i].period;
                                            minPeriods = logs[i].min_periods;
											// check next log
											i++; 
											if (logs[i] !== undefined){
												if (logs[i].mid !== undefined && machine == logs[i].mid) {
													//still the same machine
													if (logs[i].eid == 5){  //is tag logout
														lidEnd = logs[i].lid;
														end = logs[i].timestamp;
														minutes = (end - start) / 1000/ 60;
														periods = Math.ceil(minutes / period);
														if (periods < minPeriods) periods = minPeriods;
														sum = periods * price;
														total = total + sum;
														connection.query('UPDATE logs SET iid=? WHERE lid=? OR lid=?', [iid, lidStart, lidEnd], function(error, result) {
															if (error) {
																res.send(error);
															} else {
																//console.log(result);
															}            
														});
													} else {
														//is not a logout!
														i--;
													}
												} else {
													//different machine, missing end
													i--;
												}
											} else {
												//no machine log - drop entry
												i--;
											}
                                        }
                                    }
                                }
                                
                                console.log('Total:' + total);
                                console.log('IID:' + iid);
                                connection.query('UPDATE invoices SET total=? WHERE iid=?', [total, iid], function(error, result) {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        res.redirect('/invoice_edit?iid=' + iid);
                                    }            
                                });

                            }            
                        });
                    }
                }            
            });
            connection.release();
        });
    } else {
        res.redirect('/tag-summary');
    }
};

exports.invoice_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.iid){
        if (!req.body.hidden_iid){
            // not post data -> load tag with given tid
            console.log('show');
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var invoice;
                connection.query('SELECT iid, date_format(createdAt, \'%Y-%m-%d %h:%i:%s\') createdAt, tid, name, total, date_format(payedAt, \'%Y-%m-%d %h:%i:%s\') payedAt, uid FROM invoices WHERE iid=?', req.query.iid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        invoice = rows[0];
                        var tags = Array();
                        connection.query('SELECT * FROM tags', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                tags = rows;
                                res.render('invoice_edit', {title: 'FabLab Access Auth', message: 'Edit Invoice', menues: menues, invoice: invoice, tags: tags});
                            }
                        });
                    }            
                });
            });
        } else {
            // update data and redirect to list
            console.log('update');
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);
                
                var total = 0;
                if (req.body.total > 0) total = req.body.total;
                connection.query('UPDATE invoices SET total=?, uid=? WHERE iid=?', [total, req.session.uid, req.query.iid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/invoices');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.hidden_iid){
            // no tid -> load empfty form to add new tag
            console.log('add new');
            var tag;
            res.render('invoice_edit', {title: 'FabLab Access Auth', message: 'Add Invoice', menues: menues, tag: invoice});
        } else {
            // insert data and redirect to list
            console.log('insert');
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT invoices SET tid=?, name=?, total=?, payedAt=?, uid=?', [req.body.tid, req.body.name, req.body.total, req.body.payedAt, req.session.uid], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/invoices');
                    }            
                });
            });
        }
    }
};

exports.invoice_payed = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.iid){
        // update data and redirect to list
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            //console.log('connected as id ' + connection.threadId);

            var invoice;
            connection.query('UPDATE invoices SET payedAt=CURRENT_TIMESTAMP, uid=? WHERE iid=?', [req.session.uid, req.query.iid], function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    invoice = rows[0];
                    res.redirect('/invoices');
                }            
            });
            connection.release();
        });
    } else {
        res.redirect('/invoices');
    }
};

exports.invoice_delete = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.iid){
        // update data and redirect to list
        pool.getConnection(function(err,connection){
            if (err) {
                res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                return;
            }  
            //console.log('connected as id ' + connection.threadId);

            var invoice;
            //first, unlink all logs of this invoice
            connection.query('UPDATE logs SET iid=null WHERE iid=?', [req.query.iid], function(error, rows, fields) {
                if (error) {
                    res.send(error);
                } else {
                    //second, delete the invoice
                    connection.query('DELETE FROM invoices WHERE iid=?', [req.query.iid], function(error, rows, fields) {
                        if (error) {
                            res.send(error);
                        } else {
                            res.redirect('/invoices');
                        }            
                    });
                }            
            });
            connection.release();
        });
    } else {
        res.redirect('/invoices');
    }
};

exports.log_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    if (req.query.lid){
        if (!req.body.timestamp){
            // not post data -> load log with given lid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var log;
                var machines = Array();
                var tags = Array();
                var events = Array();
                var articles = Array();
                connection.query('SELECT lid, date_format(timestamp, \'%Y-%m-d %h:%i:%s\') timestamp, tid, eid, mid, aid, remarks FROM logs WHERE lid=?', req.query.lid, function(error, rows, fields) {
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
                                                connection.query('SELECT * FROM articles', function(error, rows, fields) {
                                                    if (error) {
                                                        res.send(error);
                                                    } else {
                                                        articles = rows;
                                                        res.render('log_edit', {title: 'FabLab Access Auth', message: 'Add Edit', menues: menues, machines: machines, tags: tags, events: events, articles: articles, log: log});
                                                    }            
                                                });
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE logs SET timestamp=?, mid=?, tid=?, eid=?, remarks=? WHERE lid=?', [req.body.timestamp, req.body.mid, req.body.tid, req.body.eid, req.body.remarks, req.query.lid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/logs');
                    }            
                });
                connection.release();
            });
        }
    } else {
        // no lid -> load empfty form to add new log
        if (!req.body.timestamp){
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var log;
                var machines = Array();
                var tags = Array();
                var events = Array();
                var articles = Array();
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
                                        connection.query('SELECT * FROM articles', function(error, rows, fields) {
                                            if (error) {
                                                res.send(error);
                                            } else {
                                                articles = rows;
                                                res.render('log_edit', {title: 'FabLab Access Auth', message: 'Add Edit', menues: menues, machines: machines, tags: tags, events: events, articles: articles, log: log});
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
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT logs SET timestamp=?, mid=?, tid=?, eid=?, remarks=?', [req.body.timestamp, req.body.mid, req.body.tid, req.body.eid, req.body.remarks], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/logs');
                    }            
                });
            });
        }
    }
};

exports.tag_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.tid){
        if (!req.body.uid){
            // not post data -> load tag with given tid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE tags SET uid=?, name=? WHERE tid=?', [req.body.uid, req.body.name, req.query.tid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT tags SET uid=?, name=?', [req.body.uid, req.body.name], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/tags');
                    }            
                });
            });
        }
    }
};

exports.machine_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    if (req.query.mid){
        if (!req.body.name){
            // not post data -> load machine with given mid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var machine;
                connection.query('SELECT * FROM machines WHERE mid=?', req.query.mid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        machine = rows[0];
                        var units = Array();
                        connection.query('SELECT * FROM price_units', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                units = rows;
                                res.render('machine_edit', {title: 'FabLab Access Auth', message: 'Edit Machine', menues: menues, machine: machine, units: units});
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE machines SET name=?, config=?, price=?, period=?, uid=?, min_periods=?, offdelay=?, watchdog=? WHERE mid=?', [req.body.name, req.body.config, req.body.price, req.body.period, req.body.uid, req.body.min_periods, req.body.offdelay, req.body.watchdog, req.query.mid], function(error, result) {
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT machines SET name=?, config=?, price=?, period=?, uid=?, min_periods=?, offdelay=?, watchdog=?', [req.body.name, req.body.config, req.body.price, req.body.period, req.body.uid, req.body.min_periods, req.body.offdelay, req.body.watchdog], function(error, result) {
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

exports.article_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    if (req.query.aid){
        if (!req.body.title){
            // not post data -> load article with given aid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var article;
                connection.query('SELECT * FROM articles WHERE aid=?', req.query.aid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        article = rows[0];
                        var units = Array();
                        connection.query('SELECT * FROM price_units', function(error, rows, fields) {
                            if (error) {
                                res.send(error);
                            } else {
                                units = rows;
                                res.render('article_edit', {title: 'FabLab Access Auth', message: 'Edit Article', menues: menues, article: article, units: units});
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE articles SET title=?, description=?, url=?, price=?, uid=? WHERE aid=?', [req.body.title, req.body.description, req.body.url, req.body.price, req.body.uid, req.query.aid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/articles');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.title){
            // no aid -> load empfty form to add new article
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var article;
                var units = Array();
                connection.query('SELECT * FROM price_units', function(error, rows, fields) {
                    if (error) {
                        res.send(error);
                    } else {
                        units = rows;
                        res.render('article_edit', {title: 'FabLab Access Auth', message: 'Add Article', menues: menues, article: article, units: units});
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT articles SET title=?, description=?, url=?, price=?, uid=?', [req.body.title, req.body.description, req.body.url, req.body.price, req.body.uid], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/articles');
                    }            
                });
            });
        }
    }
};

exports.event_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //only for admins
            res.redirect('/');
            return;
        }
        menues = setMenues(req);
    }

    if (req.query.eid){
        if (!req.body.name){
            // not post data -> load event with given eid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE events SET name=? WHERE eid=?', [req.body.name, req.query.eid], function(error, result) {
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT events SET name=?', req.body.name, function(error, result) {
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
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        menues = setMenues(req);
    }

    if (req.query.rid){
        if (!req.body.tid){
            // not post data -> load right with given rid
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);
                var right;
                var tags = Array();
                var machines = Array();
                connection.query('SELECT rid, tid, mid, date_format(start, \'%Y-%m-%d\') start, date_format(end, \'%Y-%m.%d\') end FROM rights WHERE rid=?', req.query.rid, function(error, rows, fields) {
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE rights SET tid=?, mid=?, start=?, end=? WHERE rid=?', [req.body.tid, req.body.mid, req.body.start, req.body.end, req.query.rid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/rights');
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
                //console.log('connected as id ' + connection.threadId);

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
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT rights SET tid=?, mid=?, start=?, end=?', [req.body.tid, req.body.mid, req.body.start, req.body.end], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/rights');
                    }            
                });
            });
        }
    }
};

exports.user_edit = function(req, res) {
    if (!req.session.uid) {
        res.redirect('/login');
        return;
    } else {
        if (req.session.role > 1) {
            //non admins can only edit own user
            req.query.uid = req.session.uid;
        }
        menues = setMenues(req);
    }

    if (req.query.uid){
        if (!req.body.username){
            // not post data -> load user with given id
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                var user;
                connection.query('SELECT uid, username, name, role FROM users WHERE uid=?', req.query.uid, function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        user = rows[0];
                        res.render('user_edit', {title: 'FabLab Access Auth', message: 'Edit User', menues: menues, user: user, role: req.session.role});
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
                //console.log('connected as id ' + connection.threadId);

                connection.query('UPDATE users SET username=?' + (req.body.password ? ', password_hash=MD5("' + salt + req.body.password + '")' : '') + ', name=?, role=? WHERE uid=?', [req.body.username, req.body.name, req.body.role, req.query.uid], function(error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/users');
                    }            
                });
                connection.release();
            });
        }
    } else {
        if (!req.body.username){
            // no eid -> load empfty form to add new event
            var user;
            res.render('user_edit', {title: 'FabLab Access Auth', message: 'Add User', menues: menues, user: user});
        } else {
            // insert data and redirect to list
            pool.getConnection(function(err,connection){
                if (err) {
                    res.render('error', {title: 'FabLab Access Auth', message: 'Error connecting database', menues: menues});
                    return;
                }  
                //console.log('connected as id ' + connection.threadId);

                connection.query('INSERT users SET username=?, password_hash=MD5("' + salt + req.body.password + '"), name=?, role=?', [req.body.username, req.body.name, req.body.role], function(error, result) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect('/users');
                    }            
                });
            });
        }
    }
};

exports.login = function(req, res) {
    if (!req.body.username){
        // get empty form
        res.render('login', { title: 'FabLab Access Auth', message: 'Login', menues: menues });
    } else {
        // check form data
        if (req.body.password){
            pool.getConnection(function(err,connection){
                if (err) {
                  res.json({"code" : 100, "status" : err}); //."Error connecting database (login 1)"
                  return;
                }  
                //console.log('connected as id ' + connection.threadId);

//                connection.query('SELECT uid, role FROM users WHERE username=? AND password_hash=MD5("' + salt + req.body.password + '")', req.body.username, function(error, rows, fields) {
                connection.query('SELECT uid, role FROM users WHERE username=? AND password_hash=MD5(?)', [req.body.username, salt+req.body.password], function(error, rows, fields) {
                    connection.release();
                    if (error) {
                        res.send(error);
                    } else {
                        if (rows.length > 0){
                            var uid = rows[0].uid;
                            var role = rows[0].role;
                            if (role == 1 || role == 2){
                                req.session.uid = uid;
                                req.session.role = role;
                                res.redirect('/tag_summary');
                            } else {
                                req.session.uid = null;
                                req.session.role = null;
                                res.redirect('/login');
                            }
                        } else {
                            req.session.uid = null;
                            req.session.role = null;
                            res.redirect('/login');
                        }
                    }            
                });

                connection.on('error', function(err) {      
                    res.json({"code" : 100, "status" : "Error connecting database (login 2)"});
                    return;    
                });
            });
        }
    }
};

exports.logout = function(req, res) {
    //res.render('error', { title: 'FabLab Access Auth', message: 'Authentication not implemented yet!', menues: menues });
    req.session.uid = null;
    req.session.role = null;
    menues = Array();
    res.redirect('/');
};


// RestAPI ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MACHINES
exports.list_all_machines = function(req, res) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
        }
        
        connection.query('SELECT t.*, UNIX_TIMESTAMP(r.start) start, UNIX_TIMESTAMP(r.end) end FROM tags t LEFT JOIN rights r ON t.tid=r.tid WHERE r.end>=now() AND r.mid=? ' + limit + offset,  req.params.mid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
        }
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks, iid FROM logs WHERE mid=?' + limit + offset, req.params.mid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
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
        //console.log('connected as id ' + connection.threadId);
        
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
        //console.log('connected as id ' + connection.threadId);
        
        //res.json(req.body);
        connection.query('UPDATE machines SET ? WHERE mid=?', [req.body, req.params.mid], function(error, results, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
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
        //console.log('connected as id ' + connection.threadId);
        
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
        //console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM tags WHERE tid=?', req.params.tid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
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
        //console.log('connected as id ' + connection.threadId);
        
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
        //console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT rid, tid, mid, UNIX_TIMESTAMP(start) start, UNIX_TIMESTAMP(end) end FROM rights WHERE rid=?', req.params.rid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
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
        //console.log('connected as id ' + connection.threadId);
        
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
        //console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT * FROM events WHERE eid=?', req.params.eid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        var limit = '';
        if (req.query.limit) {
            limit = ' LIMIT ' + mysql.escape(req.query.limit);
        }        
        var offset = '';
        if (req.query.offset) {
            offset = ' OFFSET ' + mysql.escape(req.query.offset);
        }
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks, iid FROM logs' + limit + offset, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
        if (req.body.eid == 3){     //event is tag login
            //-> check if previous event for same machine/tag was tag logout
            connection.query('SELECT * FROM logs WHERE mid=? AND tid=? ORDER BY lid DESC LIMIT 1', [req.body.mid, req.body.tid], function(error, results, fields) {
                if (error) throw error;
                if (results !== undefined && results.length > 0){
					if (results[0].eid == 4){ //previous was logout?
						//everthing is fine
					} else {
						//insert tag logout before new login
						connection.query('INSERT INTO logs SET timestamp=?, mid=?, tid=?, eid=4, remarks=?', [req.body.timestamp-1, req.body.mid, req.body.tid, 'Auto logout before new login!'], function(error, results, fields) {
							connection.release();
							if (error) throw error;
						});
					}
				} else {
					//no last log entry found -> ignore event
					return;
                }
            });
        }
        
        if (req.body.eid == 4){     //event is tag logout
            //-> check if previous event for same machine/tag was a login
            connection.query('SELECT * FROM logs WHERE mid=? AND tid=? ORDER BY lid DESC LIMIT 1', [req.body.mid, req.body.tid], function(error, results, fields) {
                if (error) throw error;
                if (results !== undefined && results.length > 0){
					if (results[0].eid == 3){
						//ok, last log was a login
					} else {
						//last was not a login -> ignore logout
						return;
					}
				} else {
					//no last log entry found -> ignore event
					return;
                }
            });
        }
        
        //res.json(req.body);
        connection.query('INSERT INTO logs SET ?', req.body, function(error, results, fields) {
            connection.release();
            if (error) throw error;
            res.json(results);
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
        //console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT lid, UNIX_TIMESTAMP(timestamp) timestamp, mid, tid, eid, remarks, iid FROM logs WHERE lid=?', req.params.lid, function(error, rows, fields) {
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
        //console.log('connected as id ' + connection.threadId);
        
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


function getUserRole(uid) {
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  
        //console.log('connected as id ' + connection.threadId);
        
        connection.query('SELECT role FROM users WHERE uid=?', uid, function(error, rows, fields) {
            connection.release();
            if (error) {
                res.send(error);
            } else {
                return(rows[0].role);
            }            
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
}