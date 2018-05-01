'use strict';

module.exports = function(app) {
    var aas = require('../controllers/aasController');

    /*------------ Frontend routes -------------*/
    app.route('/')
    .get(aas.tag_summary);
    
    app.route('/tag_summary')
    .get(aas.tag_summary)
    .post(aas.tag_summary);

    app.route('/invoices')
    .get(aas.invoices);

    app.route('/invoice_create')
    .get(aas.invoice_create)
    
    app.route('/invoice_edit')
    .get(aas.invoice_edit)
    .post(aas.invoice_edit);

    app.route('/invoice_payed')
    .get(aas.invoice_payed)

    app.route('/logs')
    .get(aas.logs);
    
    app.route('/log_edit')
    .get(aas.log_edit)
    .post(aas.log_edit);

    app.route('/tags')
    .get(aas.tags);

    app.route('/tag_edit')
    .get(aas.tag_edit)
    .post(aas.tag_edit);
    
    app.route('/machines')
    .get(aas.machines);

    app.route('/machine_edit')
    .get(aas.machine_edit)
    .post(aas.machine_edit);
    
    app.route('/articles')
    .get(aas.articles);

    app.route('/article_edit')
    .get(aas.article_edit)
    .post(aas.article_edit);

    app.route('/events')
    .get(aas.events);

    app.route('/event_edit')
    .get(aas.event_edit)
    .post(aas.event_edit);
    
    app.route('/rights')
    .get(aas.rights);

    app.route('/right_edit')
    .get(aas.right_edit)
    .post(aas.right_edit);
    
    app.route('/users')
    .get(aas.users);

    app.route('/user_edit')
    .get(aas.user_edit)
    .post(aas.user_edit);

    app.route('/login')
    .get(aas.login)
    .post(aas.login);
        
    app.route('/logout')
    .get(aas.logout);

    
    /*------------ API routes -------------*/
    // machines
    app.route('/api/machines')
    .get(aas.list_all_machines)
    .post(aas.create_a_machine);

    app.route('/api/machines/:mid')
    .get(aas.read_a_machine)
    .put(aas.update_a_machine)
    .delete(aas.delete_a_machine);

    app.route('/api/machines/:mid/tags')
    .get(aas.list_all_machine_tags);

    app.route('/api/machines/:mid/logs')
    .get(aas.list_all_machine_logs);

    
    // tags
    app.route('/api/tags')
    .get(aas.list_all_tags)
    .post(aas.create_a_tag);

    app.route('/api/tags/:tid')
    .get(aas.read_a_tag)
    .put(aas.update_a_tag)
    .delete(aas.delete_a_tag);

    
    // rights
    app.route('/api/rights')
    .get(aas.list_all_rights)
    .post(aas.create_a_right);

    app.route('/api/rights/:rid')
    .get(aas.read_a_right)
    .put(aas.update_a_right)
    .delete(aas.delete_a_right);

    
    // events
    app.route('/api/events')
    .get(aas.list_all_events)
    .post(aas.create_a_event);

    app.route('/api/events/:eid')
    .get(aas.read_a_event)
    .put(aas.update_a_event)
    .delete(aas.delete_a_event);

    
    // logs
    app.route('/api/logs')
    .get(aas.list_all_logs)
    .post(aas.create_a_log);

    app.route('/api/logs/:lid')
    .get(aas.read_a_log)
    .put(aas.update_a_log)
    .delete(aas.delete_a_log);

        
    // timestamp
    app.route('/api/timestamp')
    .get(aas.get_timestamp)

};