(function() {
var util = {};
var puzzle = [];
var size = 10;
var hintsSize = Math.ceil(size/2);

var cursor = {row: 0, col: 0, isClicked: false};

var highlight = function(row, col) {
    var classes = {2: 'selected', 1: 'crosshair'};
    _.times(size + hintsSize, function(r) {
        _.times(size + hintsSize, function(c) {
            var td = puzzle[c][r];
            var R = row === r;
            var C = col === c;
            var cls = classes[0 + R + C];
            if (cls) {
                $(td).addClass(cls);
                if (r < size && c < size) {
                    $(td).addClass('tile');
                }
            }
        });
    });
};

var selectTile = function() {
    var c = cursor.col;
    var r = cursor.row;
    var tile = puzzle[c][r];
    $(tile).toggleClass('filled');
};

util.clamp = function(x, a, b) {
    var max = Math.max;
    var min = Math.min;

    return min(max(x, a), b);
};

var moveCursor = function(row, col) {
    $('#theTable td').removeClass('crosshair selected');

    row = util.clamp(row | 0, 0, size - 1);
    col = util.clamp(col | 0, 0, size - 1);

    cursor.row = row;
    cursor.col = col;

    highlight(row, col);

    var c = cursor.col;
    var r = cursor.row;
    var tile = $(puzzle[c][r]);
    if (cursor.isClicked && ! tile.hasClass('filled')) {
        selectTile();
    }
};

var translateCursor = function(drow, dcol) {
    var r = cursor.row + drow;
    var c = cursor.col + dcol;
    moveCursor(r, c);
};

var loadGame = function() {
    _.times(size + hintsSize, function(x) {
        var tbody = $('#theTableBody');
        var tr = $('<tr>');
        var row = [];
        _.times(size + hintsSize, function(y) {
            var td = $('<td>');
            td.data('row', y);
            td.data('col', x);
            var isHint = x >= size || y >= size;
            if (isHint) {
                td.addClass('hint');
                td.text(x + y);
            }
            tr.append(td);
            row.push(td[0]);
        });
        tbody.append(tr);
        puzzle.push(row);
    });

    moveCursor(1, 1);

    $('#theTable').on('mouseenter', 'td', function(event) {
        var target = $(event.target);

        console.log(target);

        var row = target.data('row') >>> 0;
        var col = target.data('col') >>> 0;

        moveCursor(row, col);
    }).on('mousedown', function(event) {
        cursor.isClicked = true;
        selectTile();
        event.preventDefault();
    });
    $(document).on('mouseup', function(event) {
        cursor.isClicked = false;
    });

    $(document).keydown(function(event) {
        var key = event.which;
        var keyWasHit = true;
        switch (key) {
        case 73: translateCursor( 0, -1); break;
        case 74: translateCursor(-1,  0); break;
        case 75: translateCursor( 0, +1); break;
        case 76: translateCursor(+1,  0); break;
        case 32: cursor.isClicked = true; selectTile(); break;
        default: console.log('keycode:', key);
            console.log('keycode:', key);
            keyWasHit = false;
        }

        if (keyWasHit) {
            event.preventDefault();
        }
    });

    $(document).keyup(function(event) {
        var key = event.which;
        var keyWasHit = true;
        switch (key) {
        case 32: cursor.isClicked = false; break;
        default:
            console.log('keycode:', key);
            keyWasHit = false;
        }

        if (keyWasHit) {
            event.preventDefault();
        }
    });
};

$(loadGame);
})();
