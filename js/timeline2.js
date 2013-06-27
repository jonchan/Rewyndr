var kpopLines = {};
// birthdays to halloween
kpopLines.line1 = {};
kpopLines.line1.x1 = 422;
kpopLines.line1.y1 = 200;
kpopLines.line1.x2 = 422;
kpopLines.line1.y2 = 450;
// halloween to santacon
kpopLines.line2 = {};
kpopLines.line2.x1 = 422;
kpopLines.line2.y1 = 450;
kpopLines.line2.x2 = 422;
kpopLines.line2.y2 = 900;
// santacon to graduation
kpopLines.line3 = {};
kpopLines.line3.x1 = 422;
kpopLines.line3.y1 = 900;
kpopLines.line3.x2 = 125;
kpopLines.line3.y2 = 1150;
// graduation to springbreak
kpopLines.line4 = {};
kpopLines.line4.x1 = 125;
kpopLines.line4.y1 = 1150;
kpopLines.line4.x2 = 750;
kpopLines.line4.y2 = 1450;

var addyLines = {};
// birthdays to halloween
addyLines.line1 = {};
addyLines.line1.x1 = 416;
addyLines.line1.y1 = 200;
addyLines.line1.x2 = 416;
addyLines.line1.y2 = 450;
// halloween to carnival ***
addyLines.line2 = {};
addyLines.line2.x1 = 422;
addyLines.line2.y1 = 450;
addyLines.line2.x2 = 128;
addyLines.line2.y2 = 700;
// carnival to santacon **
addyLines.line3 = {};
addyLines.line3.x1 = 128;
addyLines.line3.y1 = 700;
addyLines.line3.x2 = 422;
addyLines.line3.y2 = 900;
// santcon to graduation
addyLines.line4 = {};
addyLines.line4.x1 = 414;
addyLines.line4.y1 = 900;
addyLines.line4.x2 = 115;
addyLines.line4.y2 = 1150;
// graduation to springbreak
addyLines.line5 = {};
addyLines.line5.x1 = 112;
addyLines.line5.y1 = 1150;
addyLines.line5.x2 = 737;
addyLines.line5.y2 = 1450;
// springbreak to chacha's bday **
addyLines.line6 = {};
addyLines.line6.x1 = 750;
addyLines.line6.y1 = 1450;
addyLines.line6.x2 = 128;
addyLines.line6.y2 = 1700;

$(document).ready (function() {
  initializeLines();
  $("#addy").click(function() {
    if ($(this)[0].checked === true) $(".line-addy").removeClass("invisible");
    if ($(this)[0].checked === false) $(".line-addy").addClass("invisible");
  });
  $("#kpop").click(function() {
    if ($(this)[0].checked === true) $(".line-kpop").removeClass("invisible");
    if ($(this)[0].checked === false) $(".line-kpop").addClass("invisible");
  });
  $(".moment").hover(
    function() {
      console.log("hello");
      $(this).find($(".moment-hover")).removeClass("invisible");
    },
    function() {
      console.log("not hello");
      $(this).find($(".moment-hover")).addClass("invisible");
    }
  );
});

function initializeLines() {
  createPersonLines(kpopLines, "line-kpop");
  createPersonLines(addyLines, "line-addy");
  $(".line-addy").addClass("invisible");
  $(".line-kpop").addClass("invisible");
  $(".moment-hover").addClass("invisible");
}

function createPersonLines(personObject, colorClass) {
  $.each(personObject, function (index, value) {
    $.each($(this), function (index2, value2) {
      createLine(value2.x1, value2.y1, value2.x2, value2.y2, colorClass);
    });
  });
}

// line construction from http://monkeyandcrow.com/blog/drawing_lines_with_css3/
function createLine(x1,y1, x2,y2, colorClass) {
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  var transform = 'rotate(' + angle + 'deg)';
  var linesoffset = $("#lines").offset();

    var line = $('<div>')
        .appendTo('#lines')
        .addClass('line ' + colorClass)
        .css({
          'position': 'absolute',
          'transform': transform
        })
        .width(length)
        .offset({
          left: x1 + linesoffset.left,
          top: y1 + linesoffset.top
        });

    return line;
}

