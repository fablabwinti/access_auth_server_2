/*
 * labmgr.js
 * 
 * Browser javascript for invoice creation and editing
 * 
 *  2022-07-27 by Thomas Jakober
 *   
 */

/* global labmgr, PDFLib, await, pdfDoc, StandardFonts, fetch, fontkit */

labmgr = {
    aMachines: [],
    aEvents: [],
    aArticles: [],
    aPaymodes: [],
    aUsers: [],
    labmgr: '',
    hasSales: false,
    uid: '',
    sumGrand: 0,
    init: function() {
        $('#tid')
            .trigger('focus')
            .on('focus', function() {
                $(this).select();
            });
    },
    searchCardId: function (e) {
        $.post('/labmgr', {qName: 'getTagFromId', '§1': $('#tid').val()}, (data) => {
            if (data.length === 1) {
                let tid = data[0].tid;
                $('#invoice .iCreate').removeClass('disabled');
                labmgr.sumGrand = 0;
                labmgr.calcInvoice(tid);
                labmgr.createInvoice(tid);
                $('#name').val(data[0].name);    // display name associated with tid
                $('#tid').select();
            }
        });
    },
    searchTagName: function (e) {
        $.post('/labmgr', {qName: 'getTagFromName', '§1': e.target.value}, (data) => {
            $('.pop').remove();
            if (data.length > 0) {
                let oUl = $('<ul>');
                let dl = data.length - 1;
                data.forEach((tag, i) => {
                    let oLi = $('<li>')
                            .attr('tid', tag.tid)
                            .attr('uid', tag.uid)
                            .text(tag.name)
                            .click((event) => {
                                event.stopPropagation();
                                labmgr.selectUser(event);
                            })
                            .appendTo(oUl);
                    if (i === dl) {
                        oUl
                            .addClass('pop')
                            .insertAfter('#name');
;
                    }
                });
            }
        });
    },

    selectUser: function (e) {
        var tid = $(e.target).attr('tid');
        $('#tid').on('focus', function(){
            $(this).select();
        });
        $('#tid')
            .val($(e.target).attr('uid'));
        $('#name').val($(e.target).text());
        $('.pop').remove();
        $('#invoice .iCreate').removeClass('disabled');
        $('#psales').empty();
        labmgr.sumGrand = 0;
        labmgr.calcInvoice(tid);
        labmgr.createInvoice(tid);
    },

    createInvoice: function (tid) {
        $('#invoice').remove();
        let oInv = $('<div>')
                .attr('id', 'invoice')
                .insertAfter('form[name=tagInput');
        $('<div>')
                .text('Invoice')
                .addClass('iTitle')
                .appendTo(oInv);
        let oControl = $('<div>')
                .addClass('control')
                .appendTo(oInv);
        $('<div>')
                .addClass(['button', 'iPrint'])
                .text('Print')
                .click((event) => labmgr.printInvoice(tid))
                .appendTo(oControl);
        $('<div>')
                .addClass(['button', 'iCreate'])
                .text('Create Invoice')
                .click((event => labmgr.insertInvoice(event, tid)))
                .appendTo(oControl);
        $('<div>')
                .addClass(['button', 'oldInv'])
                .text('Check old Invoices')
                .click((event) => labmgr.listInvoices(event, tid))
                .appendTo(oControl);
        let oData = $('<div>')
                .addClass('data')
                .appendTo(oInv);
        let line1 = $('<div>')
                .addClass('line1')
                .appendTo(oData);
        $('<div>')
                .addClass(['iid', 'text'])
                .text('    ')
                .appendTo(line1);
        $('<div>')
                .addClass(['iDate', 'text'])
                .text('No Invoice yet')
                .appendTo(line1);
        $('<apan>')
                .text(' Amount: ')
                .appendTo(line1);
        $('<div>')
                .addClass(['iTotal', 'text'])
                .text('0.00')
                .appendTo(line1);
        let line2 = $('<div>')
                .addClass('line2')
                .appendTo(oData);
        $('<span>')
                .text('payed at: ')
                .addClass('valign')
                .appendTo(line2);
        $('<div>')
                .addClass(['text', 'payedAt', 'valign'])
                .appendTo(line2);
        $('<span>')
                .text(' with ')
                .addClass('valign')
                .appendTo(line2);
        let oSel = $('<select>')
                .addClass(['iPayed', 'valign'])
				.attr('id', 'iPayed')
                .attr('disabled', true)
                .appendTo(line2);
		$(document).on('change', '#iPayed', (event) => labmgr.setPayment(event, tid));
        let line3 = $('<div>')
                .addClass(['line3', 'valign'])
                .appendTo(oData);
        $('<span>')
                .text('Lab Manager: ')
                .addClass('valign')
                .appendTo(line3);
        $('<div>')
                .addClass(['text', 'iLabmgr', 'valign'])
                .text('unassigned')
                .appendTo(line3);

        $('<option>')
                .val('')
                .text('unpaid')
                .appendTo(oSel);
        for (let o of labmgr.aPaymodes) {
            $('<option>')
                    .val(o.pid)
                    .text(o.name)
                    .appendTo(oSel);
        }

    },

    listInvoices: function (e, tid) {
        $.post('/labmgr', {qName: 'getInvoices', '§1': tid}, (data) => {
            let oList = $('<div>')
                    .attr('id', 'listInv')
                    .appendTo('#invoice');
            $('<thead>').appendTo(oList);
            let aCols = ['iid', 'createdAt', 'tagid', 'name', 'total', 'payedAt', 'collectedBy', 'paymode'];
            for (let i in aCols) {
                $('<th>')
                        .addClass(aCols[i])
                        .text(labmgr.capFirst(aCols[i]))
                        .appendTo('#listInv thead');
            }
            $('<tbody>').appendTo(oList);
            if (data.length === 0) {
                let oTr = $('<tr>').appendTo('#listInv tbody');
                $('<td>')
                        .text('no invoices on this tag yet')
                        .appendTo(oTr);
                return;
            }
            for (let i in data) {
                let oRow = data[i];
                let oTr = $('<tr>').appendTo('#listInv tbody');
                for (let k in aCols) {
                    let key = aCols[k];
                    let value = oRow[key];
                    let oTd = $('<td>').appendTo(oTr);
                    switch (key) {
                        case 'iid':
                            oTd.prop('ix', i);
                            break;
                        case 'createdAt':
                        case 'payedAt':
                            value = labmgr.dateFormat(value);
                            break;
                        case 'total':
                            value = value.toFixed(2);
                            break;
                    }
                    oTd.addClass(key)
                            .text(value)
                            .appendTo(oTr);
                }
            }
            $('#listInv tr')
                    .click((event) => {
                        let el = $('td:first', $(event.target).parent());
                        labmgr.showInvoice(tid, el.text(), data[el.prop('ix')]);
                    });
        });
    },

    showInvoice: function (tid, iid, dRow) {
        $('#listInv').remove();
        $('#invoice .iCreate').addClass('disabled');
        $('#invoice .iid').text(dRow.iid);
        $('#invoice .iDate').text(labmgr.dateFormat(dRow.createdAt));
        $('#invoice .payedAt').text(labmgr.dateFormat(dRow.payedAt));
        $('#invoice .iPayed option:contains(' + dRow.paymode + ')').prop('selected', true);
        $('#invoice .iPayed').attr('disabled', ($('#invoice .iid').text() === ''));
        $('#invoice .iTotal').text(dRow.total.toFixed(2));
        $('#invoice .iLabmgr').text((dRow.collectedBy ? dRow.collectedBy : 'unassigned'));
        labmgr.calcInvoice(tid, iid);
    },

    insertInvoice: function (e, tid) {
        $.post('/labmgr', {qName: 'insertInvoice', '§1': tid, '§2': $('#name').val(), '§3': labmgr.sumGrand}, (data) => {
            // data has 4 sql results. #2 is the reult from invoice, that has one row 
            let oRow = data[2][0];
            $('#invoice .iid').text(oRow.iid);
            $('#invoice .iDate').text(labmgr.dateFormat(oRow.createdAt));
            $('#invoice .iTotal').text(oRow.total.toFixed(2));
            $('#invoice .iCreate').addClass('disabled');
            $('#invoice .iPayed').attr('disabled', false);
            $('.iLabmgr').text(oRow.collectedBy);
        });
    },

    setPayment: function (e, tid) {
        if ($('#invoice .iid').text() === '') {
            return;
        }
        $.post('/labmgr', {qName: 'setPayment', '§1': $('#invoice .iid').text(), '§2': $('#invoice option:selected').val()}, (data) => {
            let oRow = data[2][0];
            $('#invoice .payedAt').text(labmgr.dateFormat(oRow.payedAt));

        });
    },

    calcInvoice: function (tid, iid) {
        labmgr.sumGrand = 0;
        $('#psales').empty();
        let qiid;
        if (!iid) {
            qiid = 'IS NULL';
        } else {
            qiid = '= ' + iid;
        }
        $.post('/labmgr', {qName: 'invoiceMachines', '§1': tid, '§2': qiid}, data => {
            $('#mtime').empty();
            $('#sales').empty();
            $('<h2>Machine Time</h2>').appendTo('#mtime');
            labmgr.hasSales = false;
            let sumMachines = 0;
            let start, end, usage, min_usage, iStart;
            start = null;
            for (i = 0; i < data.length; i++) {
                let rec = data[i];
                if (rec.event === 'Product Sale') {
                    labmgr.hasSales = true;
                    continue;
                }
                if (rec.event === 'Tag login') {
                    iStart = i;
                    start = new Date(rec.timestamp);
                } else if (data[i].event === 'Tag logout') {
                    if (start === null) {
                        // logout without login found
                        continue    // ignore
                    }
                    end = new Date(data[i].timestamp);
                    usage = Math.ceil((end - start) / 60000);      // result in minutes
                    data[iStart].usageEff = usage;
                    usage = Math.ceil(usage / rec.period);
                    if (usage < rec.minp) {
                        usage = rec.minp;
                    }
                    usage = usage * rec.period;
                    data[iStart].usage = usage;
                    let sum = rec.price * usage / rec.period;
                    data[iStart].sum = sum;
                    sumMachines += sum;
                    start = null; //set logout processed
                }
            }
            labmgr.dispTable(data, 'machineTime', '#mtime', tid);
            if (sumMachines === 0) {
                $('<h3>').text('No open positions').appendTo('#mtime');
                labmgr.sales(tid, false, iid);
            } else {
                $('<div>')
                        .addClass('totalLine')
                        .appendTo('#mtime');
                $('<div>')
                        .addClass('totalLabel')
                        .text('Total Machines')
                        .appendTo('#mtime .totalLine');
                $('<div>')
                        .addClass('sumTotal')
                        .text(Number(sumMachines).toFixed(2))
                        .appendTo('#mtime .totalLine');
                labmgr.sumGrand = sumMachines;
                if (labmgr.hasSales) {
                    labmgr.sales(tid, null, iid);
                }
            }
        });
    },

    newSales: function (data) {
        data.push(
                {lid: '', timestamp: labmgr.dateToMysql(Date.now()), items: '', quantity: '1', price: '', unit: '', minp: '', sum: '', remarks: '', add: 'Add'}
        );
    },

    sales: function (tid, editLast, iid) {
        let qiid;
        if (!iid) {
            qiid = 'IS NULL';
        } else {
            qiid = '= '+iid;
        }
        $.post('/labmgr', {qName: 'getSales', '§1': tid, '§2': qiid}, data => {
            if (data.length === 0) {    // when no sales recorded yet
                labmgr.newSales(data);
                editLast = true;         // go into edit mode 
            }
            labmgr.processSales(data, tid, editLast);
        });
    },

    processSales: function (data, tid, editLast) {
        $('#psales').empty();
        $('<h2>Product Sale</h2>').appendTo('#psales');
        let sumSales = 0;
        let start, end, iStart;
        for (i = 0; i < data.length; i++) {
            let req = data[i];
            if (req.quantity < req.minp) {
                req.quantity = req.minp;
            }
            req.sum = req.quantity * req.price;
            sumSales = sumSales + req.sum;
        }

        labmgr.dispTable(data, 'sales', '#psales', tid, editLast);
        $('<div>')
                .addClass('totalLine')
                .appendTo('#psales');
        $('<div>')
                .addClass('totalLabel')
                .text('Total Sales')
                .appendTo('#psales .totalLine');
        $('<div>')
                .addClass('sumTotal')
                .text(Number(sumSales).toFixed(2))
                .appendTo('#psales .totalLine');
        let sumGrand = Number($('#mtime .sumTotal').text()) + sumSales;
        labmgr.sumGrand = sumGrand;
        if (sumSales !== sumGrand) {
            $('<div>')
                    .attr('id', 'grandTotalLine')
                    .addClass('totalLine')
                    .appendTo('#psales');
            $('<div>')
                    .addClass('totalLabel')
                    .text('Grand Total')
                    .appendTo('#grandTotalLine');
            $('<div>')
                    .addClass('sumTotal')
                    .text(Number(sumGrand).toFixed(2))
                    .appendTo('#grandTotalLine');
        }
    },

    dispTable: function (t, tname, target, tid, editLast) {
        if (t.length === 0) {
            return;
        }
        let oTable = $('<table>')
                .attr('id', tname)
                .appendTo(target);
        let oThead = $('<thead>').appendTo(oTable);
        for (const [key, value] of Object.entries(t[0])) {
            if (key === 'usageEff') {
                continue;
            }
            let oTh = $('<th>')
                    .text(labmgr.capFirst(key))
                    .addClass(key.replace(' ', '_'))
                    .appendTo(oThead);
            if (key === 'add sales') {
                $(oTh).click(() => {
                    if ($('#invoice .iid').text() > 0) {
                        labmgr.blinkRed($(event.target).parent(), 'add_sales');
                        return;
                    }
                    labmgr.newSales(t);
                    labmgr.sales(tid, true);
                });
            }
            if (key === 'add') {
                oTh.click((event) => {
                    if ($('#invoice .iid').text() > 0) {
                        labmgr.blinkRed($(event.target).parent(), 'add');
                        return;
                    }
                    if ($(event.target).parent().parent().attr('id') === 'machineTime') {
                        labmgr.addLogEntry(tid);
                    } else {
                        labmgr.newSales(t);
                        labmgr.processSales(t, tid, true);
                    }
                });
            }
        }
        let oTbody = $('<tbody>').appendTo(oTable);
        for (let i in t) {
            if (t[i].event === undefined || t[i].event === 'Tag login') {
                let oTr = $('<tr>').appendTo(oTbody);
                let oRow = t[i];
                for (const [key, value] of Object.entries(t[i])) {
                    let oTd = $('<td>').addClass(key).appendTo(oTr); ;
                    switch (key) {
                        case 'usageEff':
                            continue;
                        case 'lid':
                            oTd.attr('tid', tid);
                            oTd.text(value);
                            break;
                        case 'timestamp':
                            oTd.text(labmgr.dateFormat(value));
                            break;
                        case 'usage':
                            oTd.attr('title', oRow.usageEff + ' min effective');
                            oTd.text(value);
                            break;
                        case 'price':
                        case 'sum':
                            oTd.text(Number(value).toFixed(2));
                            break;
                        case 'add':
                            oTd.text('Edit');
                            oTd.click((event) => {
                                if (t[i].event === undefined) {
                                    if (oTd.text() === 'Edit') {
                                        if ($('#invoice .iid').text() > 0) {
                                            // it's an old invoice, changes are denied
                                            labmgr.blinkRed($(event.target).parent(), 'add');
                                            return;
                                        }
                                        labmgr.editSales($(event.target).parent(), oRow, tid);
                                    } else {
                                        labmgr.saveSales($(event.target).parent(), oRow, tid);
                                    }
                                } else {
                                    labmgr.editMachineLog($(event.target).parent(), tid);
                                }
                            });
                            break;
                        case 'del':
                            oTd.text('Del');
                            oTd.click((event) => {
                                if ($('#invoice .iid').text() > 0) {
                                    // it's an old invoice, changes are denied
                                    labmgr.blinkRed($(event.target).parent(), 'del');
                                    return;
                                }
                                labmgr.deleteSales($(event.target).parent(), oRow, tid);
                            });
                            break;
                        default:
                            oTd.text(value);
                    }
                }
            }
        }
        if (editLast === true) {
            $('#sales tr:last')[0].scrollIntoView();
            $('#sales tr:last td.add').click();
            return;
        }
        if (Number(editLast) < 0) {
            $('#sales tr:last')[0].scrollIntoView();
        }
        if (Number(editLast) > 0) {
            $('#sales tbody td.lid').each(function (index) {
                if (this.textContent === editLast.toString()) {
                    this.scrollIntoView();
                }
            });
        }
    },

    editMachineLog: function (oRow, tid) {
        $('#machineTime tr').removeClass('selected');
        oRow.addClass('selected');
        var lid = $('td:first-child', oRow).text();
		var machine = $($('td', oRow)[2]).text();
        var tid = $('td:first-child', oRow).attr('tid');
        $.post('/labmgr', {qName: 'getMachineLog', '§1': tid, '§2': lid, '§3': machine}, (data) => {
			//data = data[1];
            let i;
            for (i = 0; i < data.length; i++) {
                if (data[i].event === 'Tag logout') {
                    break;
                }
            }
            let sl = i + 1;
            data.splice(i + 1, data.length - i);
            labmgr.dispEdit(lid, tid, data, (oTable) => {
                // all logs of a session processed. Now it needs to sort them
                let changed;
                do {
                    let aRows = $('tr', oTable);
                    let cnt = aRows.length - 1;
                    changed = false;
                    for (let i = 0; i < cnt; i++) {
                        let first = $('td', aRows[i]).first().text();
                        let second = $('td', aRows[i + 1]).first().text();
                        if (second < first) {
                            let o = $(aRows[i + 1]).detach();
                            o.insertBefore($(aRows[i]));
                            changed = true;
                        }
                    }
                } while (changed);

                let oMt = $('#machineTime tbody');
                let wTop = oMt.offset().top;
                let wBottom = wTop + oMt.height();
                let rh = $('#machineTime tr').height();
                $(oTable).css({top: oRow.offset().top + rh});
                oRow.attr('id', 'curRow');
                //console.log($('#curRow').offset().top, wTop, wBottom, oMt.height());
                $(oRow).parent().scroll((e) => {
                    let curPos = $('#curRow').offset().top;
                    //console.log(curPos, wTop, wBottom);
                    if (curPos > wTop - rh && curPos < wBottom - rh) {
                        $(oTable).show();
                        $(oTable).css({top: $('#curRow').offset().top + rh});
                    } else {
                        $(oTable).hide();
                    }
                });
            });
        });
    },

    dispEdit: function (lid, tid, t, cb) {
        $('.editLog').remove();
        const oTable = $('<table>').addClass('editLog').appendTo('#mtime');
        const oTbody = $('<tbody>').appendTo(oTable);
        let cnt = t.length;     // counter for number of logs to be processed
        for (let i in t) {
            $.post('/labmgr', {qName: 'getLog', '§1': t[i].lid}, (data) => {
                let oTr = $('<tr>').appendTo(oTbody);
                for (const [key, value] of Object.entries(data[0])) {
                    let oTd = $('<td>').addClass(key);
                    switch (key) {
                        case 'lid':
                            oTd.attr('tid', tid);
                            oTd.text(value);
                            break;
                        case 'timestamp':
                            $('<input>')
                                    .addClass(key)
                                    .attr('name', key)
                                    .attr('type', 'date')
                                    .val(new Date(value).toISOString().substr(0, 10))
                                    .appendTo(oTd);
                            $('<input>')
                                    .addClass(key)
                                    .attr('name', key)
                                    .attr('type', 'time')
                                    .val(new Date(value).toLocaleTimeString())
                                    .appendTo(oTd);
                            break;
                        case 'mid':
                            labmgr.genPopup(labmgr.aMachines, key, 'mid', value, 'name').appendTo(oTd);
                            break;
                        case 'eid':
                            labmgr.genPopup(labmgr.aEvents, key, 'eid', value, 'name').appendTo(oTd);
                            break;
                        case 'remarks':
                            $('<input>')
                                    .addClass(key)
                                    .attr('type', 'text')
                                    .val(value)
                                    .appendTo(oTd);
                            break;
                        case 'add':
                            oTd.text('save');
                            oTd.click((event) => {
                                let oRow = $(event.target).parent();
                                if ($('#invoice .iid').text() > 0) {
                                    // it's an old invoice, changes are denied
                                    labmgr.blinkRed(oRow, 'add');
                                    return;
                                }
                                labmgr.saveLog(oRow, tid);
                            });
                            break;
                        default:
                            $('<span>')
                                    .addClass(key)
                                    .appendTo(oTd);
                    }
                    $(oTd).appendTo(oTr);
                }
                cnt--;
                if (cnt === 0) {
                    cb(oTable);
                }
            });
        }
    },

    saveLog: function (oRow, tid) {
        let oData = {
            qName: 'saveMachineLog',
            '§1': $('.lid', oRow).text(),
            '§2': $('.timestamp input:first', oRow).val() + ' ' + $('.timestamp input:last', oRow).val(),
            '§3': $('.mid select', oRow).prop('selectedIndex'),
            '§4': $('.lid', oRow).attr('tid'),
            '§5': $('.eid select', oRow).prop('selectedIndex'),
            '§6': $('.remarks input', oRow).val()
        };
        $.post('/labmgr', oData, (data) => {
            oRow.parent().parent().remove();
            $('#machineTime tr').removeClass('selected');
            labmgr.calcInvoice($('.lid', oRow).attr('tid'));
        });
    },

    editSales: function (oRow, data, tid) {
        if ($('#sales tr').hasClass('selected')) {
            labmgr.blinkRed(oRow, 'add');
            return;
        }

        oRow.addClass('selected');
        for (const [key, value] of Object.entries(data)) {
            switch (key) {
                case 'items':
                    $('td.' + key, oRow).empty();
                    // find aid from title in articles
                    let aid = '';
                    if (value.length > 0) {
                        aid = labmgr.aArticles.find(o => o.title === value).aid;
                    }
                    labmgr.genPopup(labmgr.aArticles, key, 'aid', aid, 'title')
                            .change((e) => {
                                let aid = e.target[e.target.selectedIndex].value;
                                labmgr.assignArticleValues(aid, oRow);
                            })
                            .appendTo($('td.' + key, oRow));
                    break;
                case 'quantity':
                    $('td.' + key, oRow).empty();
                    $('<input>')
                            .addClass([key, 'editSales'])
                            .attr('type', 'number')
                            .val(value)
                            .change((e) => {
                                labmgr.recalcArticle(oRow);
                            })
                            .appendTo($('td.' + key, oRow));
                    break;
                case 'remarks':
                    $('td.' + key, oRow).empty();
                    $('<input>')
                            .addClass([key, 'editSales'])
                            .val(value)
                            .appendTo($('td.' + key, oRow));
            }
        }
        $('.add', oRow)
                .text('save');
    },

    saveSales: function (oRow, data, tid) {
        let oData = {
            qName: ((data.lid ? 'updateSales' : 'insertSales')),
            '§1': data.lid,
            '§2': labmgr.dateToMysql(data.timestamp),
            '§3': $('td.items select option:selected', oRow).val(), // aid
            '§4': $('input.quantity', oRow).val(),
            '§5': 8, // eid: Product sales
            '§6': $('input.remarks', oRow).val(),
            '§7': tid
        };
        let editLast = (data.lid === '' ? -1 : data.lid);
        $.post('/labmgr', oData, () => {
            oRow.removeClass('selected');
            labmgr.sales(tid, editLast);
        });
    },

    deleteSales(oRow, data, tid) {
        if ($('#sales tr').hasClass('selected') || $('#invoice .iid').text() > 0) {
            labmgr.blinkRed(oRow, 'del');
            return;
        }
        oRow.addClass('selected');
        if (confirm('delete row lid #' + $('td.lid', oRow).text() + '?')) {
            $.post('/labmgr', {qName: 'deleteSales', '§1': $('td.lid', oRow).text()}, (data) => {
                labmgr.sales(tid);
                oRow.get(0).scrollIntoView();
            });
        } else {
            oRow.removeClass('selected');
        }
    },

    blinkRed(oRow, clss) {
        $('td,th.' + clss, oRow).css('color', 'red');
        setTimeout(() => {
            $('td,th.' + clss, oRow).css('color', '');
        }, 500);
    },

    assignArticleValues(aid, oRow) {
        //console.log('Artikel: '+aid);
        $.post('/labmgr', {qName: 'getArticle', '§1': aid}, (data) => {
            //console.log(data[0]);
            let oArt = data[0];
            $('td.price', oRow).text(oArt.price.toFixed(2));
            $('td.unit', oRow).text(oArt.unit);
            $('td.minp', oRow).text(oArt.minp);
            labmgr.recalcArticle(oRow);
        });
    },

    recalcArticle: function (oRow) {
        let minp = $('td.minp', oRow).text();
        if ($('input.quantity', oRow).val() < minp) {
            $('input.quantity', oRow).val(minp);
        }
        let sum = $('input.quantity', oRow).val() * $('td.price', oRow).text();
        $('td.sum', oRow).text(sum.toFixed(2));
    },

    addLogEntry: function () {
        let a = 0;
    },

    editLogEntry: function (oRow) {
        let a = 1;
    },
    
    printInvoice: async function(tid) {
        const PDFDocument = PDFLib.PDFDocument;
        const rgb = PDFLib.rgb;
        const StandardFonts = PDFLib.StandardFonts;
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        //const HelveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        //const HelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const trebucBytes = await fetch('fonts/trebuc.ttf').then((res) => res.arrayBuffer());
        const trebuc = await pdfDoc.embedFont(trebucBytes);
        const trebucbdBytes = await fetch('fonts/trebucbd.ttf').then((res) => res.arrayBuffer());
        const trebucbd = await pdfDoc.embedFont(trebucbdBytes);
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        page.drawRectangle({x: 20, y: height-80, width: width-40, height: 60, color: rgb(0, 0.45, 0.64)});
        const pngImageBytes = await fetch('img/logo.png').then((res) => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngImageBytes);
        page.drawImage(pngImage, {
            x: 40,
            y: height-70,
            width: 40,
            height: 40
        });
        page.drawText('FAB LAB', {
            x: 100,
            y: height-60,
            font: trebucbd,
            size: 30,
            color: rgb(1, 1, 1)
        });
        page.drawText('WINTI', {
            x: 230,
            y: height-58,
            font: trebucbd,
            size: 26,
            color: rgb(0.69, 0.94, 1)
        });
        let nInvoice = $('#invoice .iid').text();
        page.drawText(`Invoice Nr. ${nInvoice}`, {
            x: 40,
            y: height-120,
            font: trebucbd,
            size: 20,
            color: rgb(0, 0, 0)
        });
        page.drawText(`Date: ${$('#invoice .iDate').text()}`, {
            x: 400,
            y: height-120,
            font: trebuc,
            size: 15,
            color: rgb(0, 0, 0)
        });
        
        
        let x = 40;
        let y = height-150;
        page.drawText(`Card ID: `, {
            x: x,
            y: y,
            font: trebuc,
            size: 15,
            color: rgb(0, 0, 0)
        });
        page.drawText($('#tid').val(), {
            x: x+70,
            y: y,
            font: trebuc,
            size: 15,
            color: rgb(0, 0, 0)
        });
        y -= 20;
        page.drawText(`Name: `, {
            x: x,
            y: y,
            font: trebuc,
            size: 15,
            color: rgb(0, 0, 0)
        });
        page.drawText($('#name').val(), {
            x: x+70,
            y: y,
            font: trebuc,
            size: 15,
            color: rgb(0, 0, 0)
        });

        let table = '#machineTime';
        let prop = 0.5;     // propotion from screen pixels to pdf pixels
        let fSize = 7;      // font size
        y -= 25;
        
        // print machine time
        if ($('#machineTime tr').length > 0) {
            page.drawText($('#mtime h2').text(), {
                x: x,
                y: y,
                font: trebucbd,
                size: 9,
                color: rgb(0, 0, 0)
            });
            y -= 12;
            y = labmgr.printTable(table, page, prop, trebuc, fSize, x, y, rgb(0, 0, 0), 11);
            // draw total line
            let pos = x;
            let cols = $(table+' td');
            let sumCol = 9;
            // calulate left distance of sum column
            for (let i=0; i<sumCol; i++) {
                pos += ($(cols[i]).width() * prop + 5);
            }
            let sWidth = $(cols[sumCol]).width() * prop;
            y += 10;
            page.drawLine({
                start:  { x: pos, y: y-2 },
                end:    { x: pos+sWidth, y: y-2 },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            y -= 12;
            let totalLabel = $($('#mtime .totalLabel')[0]).text();
            let labelPos = pos - trebucbd.widthOfTextAtSize(totalLabel, fSize) - 2;
            page.drawText(totalLabel, {
                x: labelPos,
                y: y,
                font: trebucbd,
                size: fSize,
                color: rgb(0, 0, 0)
            });
            let tx = $('#mtime .sumTotal').text();
            page.drawText(tx, {
                x: labmgr.rAlign(tx, trebucbd, fSize, sWidth, pos),
                y: y,
                font: trebucbd,
                size: fSize,
                color: rgb(0, 0, 0)
            });
            y -= 30;
        }

        page.drawText($('#psales h2').text(), {
            x: x,
            y: y,
            font: trebucbd,
            size: 9,
            color: rgb(0, 0, 0)
        });
        y -= 12;
        
        // print sales
        if ($('#sales tr').length > 0 ){
            table = '#sales';
            y = labmgr.printTable(table, page, prop, trebuc, fSize, x, y, rgb(0, 0, 0), 9);
            // draw total line
            pos = x;
            cols = $(table+' td');
            sumCol = 7;
            // calulate left distance of sum column
            for (let i=0; i<sumCol; i++) {
                let w = $(cols[i]).width() * prop;
                if ($(cols[i]).attr('class') === 'items') {
                    w = 167;
                }
                pos += w + 5;
            }
            sWidth = $(cols[sumCol]).width() * prop;

            y += 10;
            page.drawLine({
                start:  { x: pos, y: y-2 },
                end:    { x: pos+sWidth, y: y-2 },
                thickness: 1,
                color: rgb(0, 0, 0)
            });
            y -= 12;
            totalLabel = $($('#psales .totalLabel')[0]).text();
            labelPos = pos - trebucbd.widthOfTextAtSize(totalLabel, fSize) - 2;
            page.drawText(totalLabel, {
                x: labelPos,
                y: y,
                font: trebucbd,
                size: fSize,
                color: rgb(0, 0, 0)
            });
            tx = $($('#psales .sumTotal')[0]).text();
            page.drawText(tx, {
                x: labmgr.rAlign(tx, trebucbd, fSize, sWidth, pos),
                y: y,
                font: trebucbd,
                size: fSize,
                color: rgb(0, 0, 0)
            });
            y -= 5;
            
            // Grand Total
            tx = $($('#psales .sumTotal')[1]).text();
            if (tx > 0) {
                totalLabel = $($('#psales .totalLabel')[1]).text();
                page.drawLine({
                    start:  { x: pos, y: y-2 },
                    end:    { x: pos+sWidth, y: y-2 },
                    thickness: 1,
                    color: rgb(0, 0, 0)
                });
                y -= 12;

                labelPos = pos - trebucbd.widthOfTextAtSize(totalLabel, fSize) - 2;
                page.drawText(totalLabel, {
                    x: labelPos,
                    y: y,
                    font: trebucbd,
                    size: fSize,
                    color: rgb(0, 0, 0)
                });
                page.drawText(tx, {
                    x: labmgr.rAlign(tx, trebucbd, fSize, sWidth, pos),
                    y: y,
                    font: trebucbd,
                    size: fSize,
                    color: rgb(0, 0, 0)
                });
                y -= 4;
                page.drawLine({
                    start:  { x: pos, y: y },
                    end:    { x: pos+sWidth, y: y },
                    thickness: 1,
                    color: rgb(0, 0, 0)
                });
                y -= 2;
                page.drawLine({
                    start:  { x: pos, y: y },
                    end:    { x: pos+sWidth, y: y },
                    thickness: 1,
                    color: rgb(0, 0, 0)
                });
            }
            y -= 12;
            tx = `Payed at ${$('#invoice .payedAt').text()} with ${$('#invoice .iPayed option:selected').text()}`;
            if ($('#invoice .payedAt').text().length > 0) {
                page.drawText(tx, {
                    x: x,
                    y: y,
                    font: trebucbd,
                    size: 9,
                    color: rgb(0, 0, 0)
                });
                y -= 14;
                tx = `Collected by Labmanager ${$('#invoice .iLabmgr').text()}`;
                page.drawText(tx, {
                    x: x,
                    y: y,
                    font: trebucbd,
                    size: 9,
                    color: rgb(0, 0, 0)
                });
            }
        }
        nInvoice = Number(nInvoice);
        let sInvoice = '0'.repeat(6-nInvoice.length)+nInvoice;
        let fn = 'invoice_'+nInvoice+'_'+labmgr.dateToMysql(new Date())+'.pdf';
        const pdfBytes = await pdfDoc.save();
        //download(pdfBytes, false, "application/pdf");
        let blb = new Blob([pdfBytes], {type: 'application/pdf'});
        window.URL.filename = fn;
        link = window.URL.createObjectURL(blb);
        let w = window.open(link);
        let a = 0;
    },
    
    printTable: function(table, page, prop, font, fSize, x, y, color, maxCol) {
        if ($(table).length > 0) {
            let x1 = x;
            // draw column titles
            $(table+' th').each((i, e) => {
                if (i < maxCol) {
                    let je = $(e);
                    let w = je.width() * prop;
                    if (je.attr('class') === 'items') {
                        w = 167;
                    }
                    page.drawText(je.text(), {
                        x: x1,
                        y: y,
                        font: font,
                        size: fSize,
                        color: color
                    });
                    // Underline every title
                    page.drawLine({
                        start:  { x: x1, y: y-2 },
                        end:    { x: x1+w, y: y-2 },
                        thickness: 1,
                        color: color
                    });
                    x1 += (w+5);
                }
            });
            y -= 15;
            $(table+' tr').each((i, e) => {
                let x1 = x;
                let prop1 = prop;
                $('td', e).each((i, e) => {
                    if (i < maxCol) {
                        let je = $(e);
                        let w = je.width() * prop;
                        if (je.attr('class') === 'items') {
                            w = 167;
                        }
                        let y1 = y;
                        let text = je.text();
                        let x2 = x1;
                        if (je.css('text-align') === 'right') {
                            x2 = labmgr.rAlign(text, font, fSize, w, x1);
                        }
                        page.drawText(je.text(), {
                            x: x2,
                            y: y1,
                            font: font,
                            size: fSize,
                            color: color
                        });
                        x1 += (w+5); 
                    }
                });
                y -= 12;
            });
        }
        return y;
    },
    
    rAlign: function(text, font, size, width, x) {
        let textSize = font.widthOfTextAtSize(text, size);
        return x + width - textSize;
    },

    genPopup: function (a, id, v, init, field) {
        let fld = field || 'name';
        let oSel = $('<select>')
                .attr(fld, id)
                .addClass();
        $('<option>')
                .val('')
                .text('please select')
                .appendTo(oSel);
        for (let o of a) {
            $('<option>')
                    .val(o[v])
                    .text(o[fld])
                    .prop('selected', o[v] === init)
                    .appendTo(oSel);
        }
        return oSel;
    },
    capFirst(s) {
        // capitalize first letter
        return s.charAt(0).toUpperCase() + s.slice(1);
    },
    dateToMysql(s) {
        let d = new Date(s);
        let c = d.getFullYear() + '-' + labmgr.lz(d.getMonth() + 1) + '-' + labmgr.lz(d.getDate()) + ' ';
        c += (labmgr.lz(d.getHours()) + ':' + labmgr.lz(d.getMinutes()) + ':' + labmgr.lz(d.getSeconds()));
        return c;
    },
    dateFormat(s) {
        if (s === null)
            return '';
        let d = new Date(s);
        let c = labmgr.lz(d.getDate()) + '.' + labmgr.lz(d.getMonth() + 1) + '.' + d.getFullYear() + ' ';
        c += (labmgr.lz(d.getHours()) + ':' + labmgr.lz(d.getMinutes()));
        return c;
    },
    lz(n) {
        let s = n.toString();
        if (n < 10) {
            s = '0' + s;
        }
        return s;
    },

    getMachines: function () {
        $.post('/labmgr', {qName: 'getMachines'}, (data) => {
            labmgr.aMachines = data;
        });
    },
    getEvents: function () {
        $.post('/labmgr', {qName: 'getEvents'}, (data) => {
            labmgr.aEvents = data;
        });
    },
    getArticles: function () {
        $.post('/labmgr', {qName: 'getArticles'}, (data) => {
            labmgr.aArticles = data;
        });
    },
    getPaymodes: function () {
        $.post('/labmgr', {qName: 'getPaymodes'}, (data) => {
            labmgr.aPaymodes = data;
        });
    },
    getUsers: function () {
        $.post('/labmgr', {qName: 'getUsers'}, (data) => {
            labmgr.aUsers = data;
        });
    }
};

$(document).ready(function () {
    $('form[name=tagInput]').submit((event) => {
        labmgr.searchCardId(event);
        event.preventDefault();
    });
    $('#name').keyup((event) => {
        labmgr.searchTagName(event);
    }).click((event) => {
        event.target.select();
    });
    labmgr.getMachines();
    labmgr.getEvents();
    labmgr.getArticles();
    labmgr.getPaymodes();
    labmgr.getUsers();

    $(document).click(function (e) {
        if ($('#sales .selected')) {
            if (!$(e.target).closest('#sales .selected').length) {
                if ($('.selected td.lid').text() > 0) {
                    $('#sales .selected .select').remove();
                    $('#sales .selected .input').remove();
                    $('#sales .selected td.add').text('edit');
                    $('#sales .selected').removeClass('selected');
                }
            }
        }
        if ($('#listInv').length > 0) {
            if (!$(e.target).closest('#listInv').length) {
                $('#listInv').remove();
            }
        }
        if ($('.editLog').length > 0) {
            if (!$(e.target).closest('.editLog').length) {
                $('.editLog').remove();
                $('#machineTime tr').removeClass('selected');
            }
        }
        if ($('.pop').length > 0) {
            $('.pop').remove();
            let el = $('#tid').val();
            if (el.length > 0) {
                $('.btn-primary').click();
            }
        }
    });
});

$(document).ready(function() {
    labmgr.init();
});
