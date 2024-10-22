 /*
  * class HandleManyToManyRelations
  * 
  * 03.02.2023 01 Initial   Thomas Jakober
  * 
  * ToDo:
  * implement add and remove righthand records.
  * 
  * Parameters:
  * identify:   function,  external function to illuminate the changed element for a while
  * ds:         bool,       true when changes are disabled
  * par:        object,     with following structure:
  *     {
  *        manyTable:      Database table containing the many to many relationships
  *        addQuery:       Query name for adding a new relationship record 
  *        remQuery:       Query name for removing a relationship record 
  *        left: {
  *             table:      Table name of the lefthand relationship
  *             keyName:    Name of the primary key of the lefthand table
  *             curKey:     External function which computes the curren key value for the lefthand relation
  *             query:      Query name for retrieving all lefthand records from the many to many relationship table
  *             class:      Class name of the left hand display element container
  *         },
  *         right: {
  *             table:      Table name of the righthand relationship
  *             keyName:    Name of the primary key of the righthand table
  *             query:      Query name for retrieving all righthand records from the many to many relationship table
  *             name:       
  *             class:      Class name of the left hand display element container
  *         }
  *     }
  *
  * The queries are stored on the database in the "query" table and are executed on the server. They are started using a
  * "post" command.
  * 
  */
 export class HandleManyToManyRelations {
    constructor(par, ds, identify) {
        this.par = par;
        this.ds = ds;
        this.initRight();
    };
    initRight() {
        $('<ul>')
                .addClass(`list_${this.par.manyTable}_Available`)
                .appendTo('.'+this.par.right.class);
        $.post('/labmgr', { qName:  'getHMTRright', '§1': this.par.right.keyName, '§2': this.par.right.table, '§3': this.par.right.name}, (data) => {
            for (let oRight of data) {
                $('<li>')
                       .text(oRight[this.par.right.name])
                       .attr(this.par.right.keyName, oRight[this.par.right.keyName])
                       .click(this, this.addKey)
                       .appendTo(`.list_${this.par.manyTable}_Available`);
            }
        });
    };
    initLeft(rid) {
        let p = this.par;
        this.ds = rid;
        if (rid) {
            $(`.${p.right.class} li`).addClass('disabled');
        } else {
            $(`.${p.right.class} li`).removeClass('disabled');
        }
        if ($(`.${p.left.class} ul`).length === 0) {
            $('<ul>')
                    .addClass(`list_${p.manyTable}_Has`)
                    .appendTo('.'+p.left.class);
        }
        $(`.list_${p.manyTable}_Has`).empty();
        $(`.list_${p.manyTable}_Available li`).show();
        let lKey = p.left.curKey();
        if (lKey) {
            $.post('/labmgr', { qName: 'getHMTRleft', '§1': p.right.keyName, '§2': p.right.name, '§3': p.manyTable, '§4': p.right.table, '§5': p.left.keyName, '§6': lKey }, (data) => {
                for (let oLeft of data) {
                    let el =$('<li>')
                            .text(oLeft[this.par.right.name])
                            .attr(this.par.right.keyName, oLeft[this.par.right.keyName])
                            .click(this, this.removeKey)
                            .appendTo(`.list_${this.par.manyTable}_Has`);
                    if (this.ds) el.addClass('disabled');    
                    $(`.list_${this.par.manyTable}_Available li[${this.par.right.keyName}=${oLeft[this.par.right.keyName]}]`).hide();
                }
            });
        }
    };
    addKey(event) {
        if (!event.data) return;
        var _self =  event.data;
        if (_self.ds) return;  // changes not allowed due to rights
        let p = _self.par;
        let rKey = $(event.target).attr(p.right.keyName);
        let lKey = p.left.curKey();
        if (!lKey) return;  // no user selected
        $(event.target).hide();
        $.post('/labmgr', {qName: 'addHMTR', '§1': lKey, '§2': rKey, '§3': p.manyTable, '§4': p.left.keyName, '§5': p.right.keyName, '§6': p.right.table, '§7': p.right.name}, (data) => {
            let oData = data[1][0];
            let inserted = false;
            let el = $('<li>')
                .attr(_self.par.right.keyName, oData[_self.par.right.keyName])
                .text(oData[_self.par.right.name])
                .click(_self, _self.removeKey);
            
            $(`.list_${_self.par.manyTable}_Has li`).each(function() {
                let elem = $(this);
                if (elem.text() > oData[_self.par.right.name]) {
                    el.insertBefore(elem);
                    inserted = true;
                    return false;
                }
            });
            if (!inserted) {
               el.appendTo(`.list_${_self.par.manyTable}_Has`);
            }
            identify(el);
        });
    };
    removeKey(event) {
        if (!event.data) return;
        let _self = event.data;
        if (_self.ds) return;
        let p = _self.par;
        let rKey =  $(event.target).attr(p.right.keyName);
        let lKey = p.left.curKey();
        $.post('/labmgr', {qName: 'removeHMTR', '§1': lKey, '§2': rKey, '§3': p.manyTable, '§4': p.left.keyName, '§5': p.right.keyName, '§6': p.right.table, '§7': p.right.name}, (data) => {
            if (data[1][0][_self.par.right.keyName]> 0) {
                let el = $(`.list_${_self.par.manyTable}_Available li[${_self.par.right.keyName}="${rKey}"]`);
                el.show();
                $(`.list_${_self.par.manyTable}_Has li[${_self.par.right.keyName}="${rKey}"]`).remove();
                identify(el);
            }
        });
    };
};

/*
 * Create a div containing a label with a input element 
 * and appends it to a parent element.
 *  
 * ds:         bool,       true when changes are disabled
 * par:        object,     with following structure:
 *     {
 *         name:           input field name
 *         type:           input type
 *         label:          label of input field
 *         size:           optional character width
 *         class:          optional input field css class
 *         divcl:          optional surrounding div class
 *         divid:          optional id for this div
 *         attrs:          an array of name value pairs for attributes
 *     }        
 */

export class Input {
    constructor (par, ds) {
        this.par = par;
        this.ds = ds;
        this.createInput();
    }
    createInput() {
        const oInp = $('<div>');
        if (this.par.divcl) oInp.addClass(this.par.divcl);
        if (this.par.divid) oInp.attr('id', this.par.divid);
        $('<label>')
                .addClass('label')
                .attr('for', this.par.name)
                .text(this.par.label)
                .appendTo(oInp);
        $('<input>')
                .attr('type', this.par.type)
                .attr('name', this.par.name)
                .appendTo(oInp);
        if (this.par.class)  $('input', oInp).addClass(this.par.class);
        if (this.par.size) $('input', oInp).attr('size', this.par.size);
        for (let o in this.par.attrs) {
            $('input', oInp).attr(o, this.par.attrs[o]);
        }
        oInp.appendTo(this.par.appendTo);
        return oInp;
    };
};

/*
 * create fieldset with a legend
 * 
 * par: object, with following structure
 *      {
 *          main:   id # or class . of element to which the field is appended to
 *          master: classname of the new fieldset
 *          title:  title of the new field displayed as legend
 */
export class Field {
    constructor(par) {
        this.par = par;
        this.init();
    }
    init() {
        $('<fieldset>')
                .addClass(this.par.master)
                .appendTo(this.par.main);
        $('<legend>')
                .attr('for', '.'+this.par.master)
                .text(this.par.title)
                .appendTo('.'+this.par.master);
    }
}

/*
 * add a button
 * 
 *  par: object, with following structure
 *       {
 *          name:   name to access the button
 *          label:  label on the button
 *          title:  text displayed on hover over the button
 *          click:  method to be called on click
 *          master: id # or class . of element to which the button is appended to 
 *       }
 *  methods of this class:
 *      disable:    self explained, no parameters
 *      ensble:     self explained, no parameters      
 *  
 */
export class Button {
    constructor(par) {
        this.par = par;
        this.disabled = false;
        this. init();
    }
    init() {
        $('<span>')
                .addClass('button')
                .attr('name', this.par.name)
                .attr('title', this.par.title)
                .text(this.par.label)
                .click(this.par.click)
                .appendTo(this.par.master);
        
        $.fn.extend({
            disable: function() {
                this
                        .addClass('disabled')
                        .attr('disabled', true);
            },
            enable: function() {
                this
                        .removeClass('disabled')
                        .attr('disabled', false);
            }
            
        });
    }
}

export function jqSort(ul, el, sortFunc) {
    let jUl = $(ul);
    let aList = $(jUl).children(el).get();
    aList.sort(sortFunc);
    jUl.empty();
    $.each(aList, (idx, itm) => {
        jUl.append(itm);
    });
}

/*
 * scroll element into view and illuminate it for 2 seconds
 */
export function identify(el) {
    $(el)[0].scrollIntoView({block: 'center'});
    $(el).addClass('identify');
    setTimeout(() => {
        $(el).removeClass('identify');
    }, 2000);
};

/*
 * pad right up to n characters with ch charaxter (default blank)
 */
export function padr(txt, n, ch) {
    let c = ch || ' ';
    if (txt.length > n) return substr(txt, 0, n-1);
    return txt + c.repeat(n - txt.length);
}



