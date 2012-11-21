(function() {
var util = {};
var table = [];
var size = 10;

var cursor = {row: 0, col: 0};

util.format = function(str /*, ... */) {
    var args = _.toArray(arguments).slice(1);
    var i = 0;
    var n = args.length;
    return str.replace(/{\d+}/g, function(tok) {
        var num = tok.substring(1, tok.length - 1);
        return args[num];
    });
};

var highlight = function(row, col) {
    var classes = {2: 'selected', 1: 'crosshair'};
    _.times(size, function(r) {
        _.times(size, function(c) {
            var td = table[c][r];
            var R = row === r;
            var C = col === c;
            td.className = classes[0 + R + C] || '';
        });
    });
};

util.clamp = function(x, a, b) {
    var max = Math.max;
    var min = Math.min;

    return min(max(x, a), b);
};

var moveCursor = function(row, col) {
    row = util.clamp(row | 0, 0, size - 1);
    col = util.clamp(col | 0, 0, size - 1);

    cursor.row = row;
    cursor.col = col;

    highlight(row, col);
};

var translateCursor = function(drow, dcol) {
    moveCursor(cursor.row + drow, cursor.col + dcol);
};

var loadGame = function() {
    _.times(size, function(x) {
        var tbody = $('#theTableBody');
        var tr = $('<tr>');
        var row = [];
        _.times(size, function(y) {
            var td = $('<td>');
            td.data('row', y);
            td.data('col', x);
            tr.append(td);
            row.push(td[0]);
        });
        tbody.append(tr);
        table.push(row);
    });

    moveCursor(1, 1);

    $('#theTable').on('mousemove', 'td', function(event) {
        var target = $(event.target);

        var row = target.data('row') >>> 0;
        var col = target.data('col') >>> 0;

        moveCursor(row, col);
    });

    $(document).keydown(function(event) {
        var key = event.keyCode;
        switch (key) {
        case 73: translateCursor( 0, -1); break;
        case 74: translateCursor(-1,  0); break;
        case 75: translateCursor( 0, +1); break;
        case 76: translateCursor(+1,  0); break;
        };
    });
};

$(loadGame);
})();
