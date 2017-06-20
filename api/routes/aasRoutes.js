'use strict';

module.exports = function(app) {
    var aas = require('../controllers/aasController');

    // machine Routes
    app.route('/machines')
    .get(aas.list_all_machines)
    .post(aas.create_a_machine);

    app.route('/machines/:mid')
    .get(aas.read_a_machine)
    .put(aas.update_a_machine)
    .delete(aas.delete_a_machine);

    app.route('/machines/:mid/tags')
    .get(aas.list_all_machine_tags);

    app.route('/machines/:mid/logs')
    .get(aas.list_all_machine_logs);

    
    // tags Routes
    app.route('/tags')
    .get(aas.list_all_tags)
    .post(aas.create_a_tag);

    app.route('/tags/:tid')
    .get(aas.read_a_tag)
    .put(aas.update_a_tag)
    .delete(aas.delete_a_tag);

    
    // rights Routes
    app.route('/rights')
    .get(aas.list_all_rights)
    .post(aas.create_a_right);

    app.route('/rights/:rid')
    .get(aas.read_a_right)
    .put(aas.update_a_right)
    .delete(aas.delete_a_right);

    
    // logs Routes
    app.route('/logs')
    .get(aas.list_all_logs)
    .post(aas.create_a_log);

    app.route('/logs/:tid')
    .get(aas.read_a_log)
    .put(aas.update_a_log)
    .delete(aas.delete_a_log);

};