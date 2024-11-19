/*
 * Tags edit panel
 * 
 * 04.02.2023  01   Initial Thomas Jakober
 *  
 */
import { HandleManyToManyRelations } from './labmgr_classes.js';
import { Field } from './labmgr_classes.js';
import { Input } from './labmgr_classes.js';
import { Button } from './labmgr_classes.js';
import { identify } from './labmgr_classes.js';
import { jqSort } from './labmgr_classes.js';

const tedit = {
    ds: true,   //disabled
    ts: 0,      //timestamp of last keyup
    rd: false,  //card reader input
    tag: {},
    magglass: '<svg aria-hidden="true" class="s-input-icon s-input-icon__search \\n\
    svg-icon iconSearch" width="18" height="18" viewBox="0 0 18 18">\\n\
    <path d="m18 16.5-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5ZM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0Z"></path></svg>',
    
    init() {
        tedit.ds = false;           //tbd  check for admin or labmanager rights
        tedit.showFramework();
        tedit.listTags();
        setTimeout(() => {
            $('.search').trigger('focus');
        },100);
    },
    
    showFramework() {
        $('<div>')
                .attr('id', 'search')
                .appendTo('.content');
        $(tedit.magglass).appendTo('#search');
        $('<input>')
                .attr('type', 'search')
                .attr('name', 'search')
                .attr('placeholder', 'Search...')
                .addClass('search')
                .keyup(tedit.search)
                .appendTo('#search')
                .on('focus', function() {
                    $(this).select();
                });
        $('<form>')
                .attr('id', 'tags')
                .attr('name', 'tags')
                .change(this, tedit.saveTag)
                .appendTo('.content');
        
        new Field({title: 'RFID Tags', main: '#tags', master: 'tagList'});
        $('<ul>')
                .attr('id', 'tagList')
                .appendTo('.tagList');
        
        new Field({title: 'RFID Tag', main: '#tags', master: 'tag'});
        new Button({name: 'add', label: 'Add', title: 'add a new Tag', master: '.tag', click: this.newTag});
        new Button({name: 'delete', label: 'Del', title: 'delete this tag', master: '.tag', click: this.deleteTag});
        $('.button[name="delete"]').disable();
        
        new Input({label: 'Card RFID:', name: 'uid', type: 'text', class: 'rfid', attrs: {
                required: true, pattern: '[0-9]+', minlength: 10, maxlength: 10
            }, appendTo: '.tag'}, tedit.ds);
        new Input({label: 'replaced by:', name: 'repl_by_uid', type: 'number', class: 'rfid', divcl: 'secondCol', attrs: {
                pattern: '\d{10}', minlength: 10, maxlength: 10
            }, appendTo: '.tag'}, tedit.ds);
        $('input[name="repl_by_uid"]').parent().hide();
        new Input({label: 'Full Name:', name: 'name', class: 'text', attrs: {required: false}, appendTo: '.tag'}, tedit.ds);
        let oFrom = new Input({label: 'Valid from:', name: 'valid_from', type: 'date', class: 'date', appendTo: '.tag'}, tedit.ds);
        new Input({label: 'Valid until:', name: 'valid_until', type: 'date', class: 'date', divcl: 'secondCol', appendTo: '.tag'}, tedit.ds);
        new Button({name: 'cardRepl', label: 'Card Replacement', title: 'Assign a replacement for a lost card', master: '.tag', click: this.replaceCard});
        new Input({label: 'Repl. for:', name: 'repl_for_uid', type: 'number', class: 'rfid', attrs: {
            pattern: '\d{10}', minlength: 10, maxlength: 10
        }, appendTo: '.tag'}, tedit.ds);
        $('input[name="repl_for_uid"]').parent().hide();
        new Button({name: 'retRepl', label: 'Return', title: 'Return Replacement Card', master: '.tag', click: this.returnCard});
        $('.button[name="retRepl"]').hide();
        $('.button[name="cardRepl"]').disable();
        
        new Field({title: 'Rights', main: '#tags', master: 'rights'});
        new Field({title: 'Has Rights', main: '.rights', master: 'hasRights'});
        new Field({title: 'Available Rights', main: '.rights', master: 'availableRights'});
        
        tedit.manageTagRights();

    },
    
    manageTagRights() {
        let par = {
            manyTable: 'rights',
            addQuery: 'addRight',
            remQuery: 'removeRight',
            left: {
                table: 'tags',
                keyName: 'tid',
                curKey: () => { return $('#tagList li.selected').attr('tid'); },
                query: 'getTag_rights',
                class: 'hasRights'
            },
            right: {
                table: 'machines',
                keyName: 'mid',
                query: 'getMachines',
                name: 'name',
                class: 'availableRights'
            }
        };
        tedit.oTagRights = new HandleManyToManyRelations(par, tedit.ds, identify);
    },

    search(event) {
        if (event.key === 'Enter') {
           return; 
        } 
        $('.mark').removeClass('mark');
        var s = event.target.value;
        if (s === '') return;
        let el;
        if (Number.parseInt(s)) {
            el = $('#tagList li span').filter(function(ix) {
                return this.textContent.startsWith(s);
            });
        } else {
            let exp = new RegExp(s, "i");
            el = $('#tagList li').filter(function() {
                return exp.test($(this).text());
            });
        }
        if (el.length === 1) {
            // found only one entry, go show card
            tedit.showTag(el[0]);
            setTimeout(() => {
                $('.search').select();
            }, 100);
            return;
        } else {
            $(el).addClass('mark'); 
        }
    },
    
    listTags(selId) {
        $('#tagList').empty();
        $.post('/labmgr', {qName: 'getTags'}, (data) => {
            for (let oTag of data) {
                let t = $('<li>')
                        .addClass('tg')
                        .attr('tid', oTag.tid)
                        .html('<span>'+oTag.uid+'</span>'+oTag.name)
                        .click(function(event) {
                            event.stopPropagation();
                            tedit.showTag(event.target);
                        })
                        .appendTo('#tagList');
                if (oTag.blocked > 0) {
                    t.addClass('blocked');
                }
            }
            if (selId) {
                let oEl = $(`#tagList li[tid="${selId}"]`)
                        .addClass("selected")
                        .click();
                oEl.get(0).scrollIntoView();
            }
        });
    },
    
    showTag(el) {
        if ($('.tagList li.selected span').text() === $(el).text()) {
            return;
        }
        $('.tagList li.selected').removeClass('selected');
        var oSel = $(el);
        if (oSel[0].nodeName === 'SPAN') {
            oSel = oSel.parent();
        }
        oSel.addClass('selected');
        $.post('/labmgr', {qName: 'getTag', '§1': oSel.attr('tid')}, (data) => {
            tedit.tag = data[0];
            for (let field in tedit.tag) {
                let value = tedit.tag[field];
                switch (field) {
                    case 'repl_by_uid':
                        if (tedit.tag[field] > 0) {
                            $(`input[name='${field}']`)
                                    .val(value)
                                    .parent().show();
                        } else {
                            $(`input[name='${field}']`).parent().hide();
                        }
                        break;
                    case 'valid_from':
                    case 'valid_until':
                        if (value) {
                            let x = value.substr(0, 10);
                            $(`input[name='${field}']`).val(x);
                        } else {
                            $(`input[name='${field}']`).val('');
                        }
                        break;
                    case 'repl_for_uid':
                        if (tedit.tag[field] > 0) {
                            $(`input[name='${field}']`)
                                    .val(value)
                                    .parent().show();
                            $('.button[name="retRepl"]').show();
                        } else {
                            $(`input[name='${field}']`).parent().hide();
                            $('.button[name="retRepl"]').hide();
                        }
                        break;
                    default:
                        $(`input[name='${field}']`).val(tedit.tag[field]);
                }

            }
            if (tedit.tag.blocked > 0) {
                $('.tag input').disable();
                $('.button[name="cardRepl"]').disable();
                $('.button[name="delete"]').disable();
            } else {
                $('.tag input').enable();
                $('.button[name="cardRepl"]').enable();
                $('.button[name="delete"]').enable();
            }
            let oFrom = $('INPUT[name="valid_from"]');
            let oTo = $('INPUT[name="valid_until"]');
            oFrom.on('change', () => {
                if (oTo.val() < oFrom.val()) {
                    oTo.val(oFrom.val());
                }
            });
            oTo.on('change', () => {
                if (oTo.val() < oFrom.val()) {
                    oTo[0].setCustomValidity('Valid until must be later as Valid from');
                } else {
                    oTo[0].setCustomValidity('');
                };
            });
            tedit.oTagRights.initLeft();   
        });
    },

    saveTag(event) {
        var refresh = false;
        let el = event.target;
        // check whether this Tag already exists
        let oFnd = $('.tagList span:contains("' + el.value + '")');
        if (oFnd.length > 0) {
            oFnd.parent()[0].click();
            return;
        }
        if (el.form.checkValidity()) {
            let self = event.data;
            let name = event.target.name;
            let tid = $('.tg.selected').attr('tid');
            let value = event.target.value;
            switch (name) {
                case 'uid':
                case 'name':
                    refresh = true;     //uid needs also to be refreshed
            }
            self.tag[name] = value;      // update memory-copy
            $('.tag legend').css('background-color', 'red');
            if (name === 'uid' && tid === undefined) {
                // create new tag
                $.post('/labmgr', {qName: 'createTag', '§1': $(el).val()}, (data) => {
                    tedit.tag.tid = data.insertId;
                    $('.tag legend').css('background-color', '');
                    tedit.listTags(tedit.tag.tid);
                });
            } else {
                $.post('/labmgr', {qName: 'saveTag', '§1': name, '§2': value, '§3': tid}, data => {
                    $('.tag legend').css('background-color', '');
                    if (refresh) {
                        tedit.listTags(tid);
                    }
                });
            }
        }
    },
    
    newTag(event) {
        $('.tag input').val('');
        $('.tg.selected').removeClass('selected');
        $('.button[name="cardRepl"]').disable();
        $('.button[name="delete"]').disable();
        tedit.oTagRights.initLeft();
        $('.rfid').focus();
    },
    
    deleteTag(event){
        if (window.confirm(`Delete Tag #:${$('#tagList li.selected span').text()} ?`)) {
            $.post('/labmgr', {qName: 'deleteTag', '§1': $('#tagList li.selected').attr('tid')}, (data) => {
                tedit.listTags();
                tedit.newTag();
            });
        }
        
    },
    
    replaceCard(event) {
        $.post('/labmgr', {qName: 'findFreeTag'}, (data) => {
            if (data.length === 0) {
                window.alert('No free tag available');
                return;
            }
            let oReplacement = data[0];
            let selId = $('#tagList li.selected').attr('tid');
            $.post('/labmgr', {
                qName: 'replaceTag', 
                '§1': oReplacement.tid, 
                '§2': selId, 
                '§3': oReplacement.uid,
                '§4': $('.tag input[name="uid"]').val(),
                '§5': $('.tag input[name="name"]').val()
            }, (data) => {
                tedit.listTags(selId);
            });
        });
    },
    
    returnCard(event) {
        let replacedRfid = $('input[name="repl_for_uid"]').val();
        let el =  $('#tagList li').find(`span:contains(${replacedRfid})`);
        $.post('/labmgr', {qName: 'getTagFromId', '§1': replacedRfid}, (data) => {
            let qEl = el;
            if (data.length === 0) {
                window.alert('Original Card not found in Database');
                return;
            }
            let oReplaced = data[0];
            let selId = $('#tagList li.selected').attr('tid');
            $.post('/labmgr', {
                qName: 'returnTag', 
                '§1': oReplaced.tid, 
                '§2': $('#tagList li.selected').attr('tid'), 
                '§3': oReplaced.uid,
                '§4': $('.tag input[name="uid"]').val(),
                '§5': $('.tag input[name="name"]').val()
            }, (data) => {
                tedit.listTags(selId);
            });
        });
    }
};


$(document).ready(function() {
    tedit.init();
});

