/*
 * Labmanager edit panel
 * 
 * 03.02.2023  01   Initial Thomas Jakober
 *  
 */
import { HandleManyToManyRelations } from './labmgr_classes.js';
import { identify } from './labmgr_classes.js';

const ledit = {
    aUsers: [],
    labManager: {},
    ds: true,
    lUser: {},

    init: () => {
        ledit.showFramework();
        ledit.manageUserRoles();
        ledit.manageUserKnowledge();
        ledit.listManagers();
        $.post('/labmgr', {qName: 'getLuser'}, (data) => {
            ledit.lUser = data[0];
        });
    },
    
    showFramework: () => {
        $('<form>')
                .attr('id', 'labmgr')
                .attr('name', 'labmgr')
                .change(ledit.saveLabmanager)
                .appendTo('.content');
        
        $('<fieldset>')
                .addClass('labmgrList')
                .appendTo('#labmgr');
        $('<legend>')
                .text('Users')
                .appendTo('.labmgrList');
        $('<ul>')
                .attr('id', 'labmgrList')
                .appendTo('.labmgrList');
        
        $('<fieldset>')
                .addClass('labmgr')
                .appendTo('#labmgr');
        $('<legend>')
                .text('User')
                .appendTo('.labmgr');
        $('<div>')
                .addClass('button')
                .attr('id', 'delete')
                .attr('title', 'Delete this User')
                .text('Del')
                .click(ledit.deleteLabmanager)
                .appendTo('.labmgr');
        $('<div>')
                .addClass('button')
                .attr('id', 'new')
                .attr('title', 'Add a new User')
                .text('Add')
                .click(ledit.newLabmanager)
                .appendTo('.labmgr');
        $('<label>')
                .attr('for', 'name')
                .text('Full Name:')
                .appendTo('.labmgr');
        $('<input>')
                .attr('name', 'name')
                .attr('type', 'text')
                .appendTo('.labmgr');
        $('<label>')
                .attr('for', 'username')
                .text('e-mail:')
                .appendTo('.labmgr');
        $('<input>')
                .attr('type', 'email')
                .attr('name', 'username')
                .addClass('labmgrName')
                .appendTo('.labmgr');
        $('<label>')
                .attr('for', 'password_hash')
                .text('Password:')
                .appendTo('.labmgr');
        $('<input>')
                .attr('type', 'password')
                .attr('name', 'password_hash')
                .attr('size', 30)
                .appendTo('.labmgr');

        $('<fieldset>')
                .addClass('roles')
                .appendTo('#labmgr');
        $('<legend>')
                .text('Roles')
                .appendTo('.roles');
        $('<fieldset>')
                .addClass('hasRoles')
                .appendTo('.roles');
        $('<legend>')
                .text('Has Roles')
                .appendTo('.hasRoles');
        $('<fieldset>')
                .addClass('availableRoles')
                .appendTo('.roles');
        $('<legend>')
                .text('Available Roles')
                .appendTo('.availableRoles');
        
        $('<fieldset>')
                .addClass('knowledge')
                .appendTo('#labmgr');
        $('<legend>')
                .text('Knowledge')
                .appendTo('.knowledge');
        $('<fieldset>')
                .addClass('knowldgUser')
                .appendTo('.knowledge');
        $('<legend>')
                .text('Has Knowledge')
                .appendTo('.knowldgUser');
        $('<fieldset>')
                .addClass('knowldgAvailable')
                .appendTo('.knowledge');
        $('<legend>')
                .text('Available Knowledge')
                .appendTo('.knowldgAvailable');
        
        $('<form>')
                .attr('id', 'imageform')
                .appendTo('.content');
        $('<fieldset>')
                .addClass('photo')
                .appendTo('#imageform');
        $('<legend>')
                .text('Photo')
                .appendTo('.photo');
        $('<input>')
                .addClass('image')
                .attr('type', 'file')
                .attr('accept', 'image/*')
                .change(ledit.loadPhoto)
                .appendTo('.photo');
        $('<canvas>')
                .addClass('photocanvas')
                .attr('width', 300)
                .attr('height', 400)
                .appendTo('.photo');
        $(document).bind('paste', ledit.readFromClipboard);
    },
    
    lmColor: (oLm) => {
        return (oLm.did === null || oLm.did === 0) ? 'red' : (oLm.nKnowledges === 0) ? 'blue' : 'black';
    },
    
    lmTitle: (oLm) => {
        return (oLm.did === null || oLm.did === 0) ? 'no Photo' : (oLm.nKnowledges === 0) ? 'no Knowledge' : '';
    },
    
    listManagers: (uid) => {
        $('#labmgrList').empty();
        $.post('/labmgr', {qName: 'getManagers'}, (data) => {
            for (let oLm of data) {
                $('<li>')
                        .text(oLm.name)
                        .css('color', ledit.lmColor(oLm))
                        .attr('title', ledit.lmTitle(oLm))
                        .attr('uid', oLm.uid)
                        .click((event) => {
                            ledit.displayLabmanager($(event.target).attr('uid'));
                         })
                        .appendTo('#labmgrList');
            }
            if(uid) {
                $(`#labmgrList li[uid=${uid}]`).click();
                $('.labmgr input[name="name"]')
                        .focus()
                        .select();
            }
        });
    },
    
    displayLabmanager: (uid) => {
        $('.selected').removeClass();
        $(`#labmgrList li[uid=${uid}]`).addClass('selected');
        $.post('/labmgr', {qName: 'getLabmanager', '§1': uid}, (data) => {
            ledit.labManager = data[0]; // save labmanager data for later use
            for (let field in data[0]) {
                switch (field) {
                    case 'password':
                        break;
                    case 'rid':
                        //$('.roles').val('0');
                        $('.roles option').removeAttr('selected');
                        $(`.roles option[rid="${data[0][field]}"]`).attr('selected', 'selected');
                        break;
                    default:
                        $(`input[name='${field}']`).val(data[0][field]);
                }
            }
            ledit.ds = !(ledit.labManager.uid === ledit.lUser.uid || ledit.lUser.rid === 1);
            $('#labmgr input, #labmgr select').attr('disabled', ledit.ds);
            $('.listKnowldgAvailable').css('color', (ledit.ds) ? 'gray' : 'black');
            $('.photo input').attr('disabled', ledit.ds);
            $('.button').css('color', (ledit.ds) ? 'gray' : 'white');
            ledit.oUserRoles.initLeft(ledit.lUser.rid!==1);
            ledit.oUserKnowledge.initLeft(ledit.ds);
            ledit.showPhoto(ledit.labManager.did);
        });
    },
    
    newLabmanager: (event) => {
        if (ledit.ds) return;
        $.post('/labmgr', {qName: 'createLabmanager'}, (data) => {
            let uid = data.insertId;
            ledit.listManagers(uid);
        });
    },
    
    deleteLabmanager: (event) => {
        if (ledit.ds) return;
        let el = $('#labmgrList li.selected');
        let uid = el.attr('uid'); 
        $.post('/labmgr', {qName: 'deleteLabmanager', '§1': uid}, (data) => {
            el.remove();
            ledit.labManager = {};
        });
    },
    
    saveLabmanager: (event) => {
        let uid = $('#labmgrList li.selected').attr('uid');
        let name = event.target.name;
        let value;
        switch (name) {
            case 'rid':
                value = $(event.target[event.target.selectedIndex]).attr('rid');
                break;
            default:
                value = event.target.value;
        }
        ledit.labManager[name] = value;     // update memory-copy
        if (name === 'name') {
            $('#labmgrList li.selected')
                    .css('color', ledit.lmColor(ledit.labManager))
                    .attr('title', ledit.lmTitle(ledit.labManager))
                    .text(value);
        }
        $.post('/labmgr', {qName: 'saveLabmanager', '§1': name, '§2': value, '§3': uid}, (data) => {
            if (Number(data[1][0].uid) === Number(uid)) {
                identify($('.labmgr legend'));
            }
        });
    },

    manageUserRoles: () => {
        let par = {
            manyTable: 'user_roles',
            addQuery: 'addRole',
            remQuery: 'removeRole',
            left: {
                table: 'user',
                keyName: 'uid',
                curKey: () => { return $('#labmgrList li.selected').attr('uid'); },
                class: 'hasRoles'
            },
            right: {
                table: 'roles',
                keyName: 'rid',
                name: 'name',
                class: 'availableRoles'
            }
        };
        ledit.oUserRoles = new HandleManyToManyRelations(par, ledit.lUser.rid !== 1, identify);
    },

    manageUserKnowledge: () => {
        let par = {
            manyTable: 'user_kn',
            addQuery: 'addKn',
            remQuery: 'removeKn',
            left: {
                table: 'user',
                keyName: 'uid',
                curKey: () => { return $('#labmgrList li.selected').attr('uid'); },
                class: 'knowldgUser'
            },
            right: {
                table: 'knowledge',
                keyName: 'kid',
                name: 'name',
                class: 'knowldgAvailable'
            }
        };
        ledit.oUserKnowledge = new HandleManyToManyRelations(par, ledit.ds, identify);
    },
    
    saveKlowledge: (jKnowledge) => {
        $.post('/labmgr', {qName: 'saveKlowledge', '§1': jKnowledge.kid, '§2': jKnowledge.name}, (data) => {
            
        });
    },
    
    readFromClipboard: (event) => {
        if (ledit.ds) return;
        let item = event.originalEvent.clipboardData.items[0];
        if (item.type.indexOf("image") === 0) {
            let blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const photo = new Image();
                photo.onload = (event) => {
                    ledit.processPhoto(photo);
                };
                photo.src = event.target.result;
            };
            reader.readAsDataURL(blob);
        }
    },
    
    loadPhoto: (event) => {
        const photo = new Image();
        const file = event.target.files[0];
        photo.src = event.target.result;
        const reader = new FileReader();
        reader.onload = (event) => {
            photo.onload = (event) => {
                ledit.processPhoto(photo);
            };
            photo.src = event.target.result;
        };
        reader.readAsDataURL(file);
    },
    
    processPhoto: (photo) => {
        const cx = $('.photocanvas')[0].getContext('2d');
        cx.clearRect(0,0,300,400);
        let sf;
        if (photo.height / photo.width < 1) {
            sf = 300 / photo.width;
        } else {
            sf = 400 / photo.height;
        }
        cx.scale(sf, sf);
        let vp = (400 / sf - photo.height) / 2; 
        cx.drawImage(photo, 0, vp);
        let si = 1 / sf;
        cx.scale(si, si);

        ledit.savePhoto($('.photocanvas')[0].toDataURL());
    },
   
    savePhoto: (dataUrl) => {
        // save image data to database
        if (ledit.labManager.did > 0) {
            $.post('/labmgr', {qName: 'updatePhoto', '§1': ledit.labManager.did, '§2': dataUrl}, (data) => {
                identify('.photo legend');
            });
        } else {
            $.post('/labmgr', {qName: 'createPhoto', '§1': dataUrl}, (data) => {
                let did = data.insertId;
                ledit.labManager.did = did;
                $.post('/labmgr', {qName: 'saveLabmanager', '§1': 'did', '§2': did, '§3': ledit.labManager.uid}, (data) => {
                    identify('.photo legend');
                });
            });
        } 

    },
    
    showPhoto: (did) => {
        if (did > 0) {
            $.post('/labmgr', {qName: 'getPhoto', '§1': did}, (data) => {
                let dataURL = data[0].content.toString();
                let photo = new Image();
                photo.onload = (event) => {
                    const cx = $('.photocanvas')[0].getContext('2d');
                    cx.clearRect(0,0,300,400);
                    cx.drawImage(photo, 0, 0);
                };
                photo.src = dataURL;
            });
        } else {
            const cx = $('.photocanvas')[0].getContext('2d');
            cx.clearRect(0,0,300,400);
        }
    }
 };
 
$(document).ready(function() {
    ledit.init();
});

