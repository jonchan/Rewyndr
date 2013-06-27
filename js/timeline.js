var jonLines = {};
// basketball to apt shopping
jonLines.line1 = {};
jonLines.line1.x1 = 130;
jonLines.line1.y1 = 330;
jonLines.line1.x2 = 420;
jonLines.line1.y2 = 650;
// apt shopping to matt's house
jonLines.line2 = {};
jonLines.line2.x1 = 420;
jonLines.line2.y1 = 650;
jonLines.line2.x2 = 420;
jonLines.line2.y2 = 870;
// matt's house to grad
jonLines.line3 = {};
jonLines.line3.x1 = 412;
jonLines.line3.y1 = 870;
jonLines.line3.x2 = 122;
jonLines.line3.y2 = 1150;
// grad to beach bbq
jonLines.line4 = {};
jonLines.line4.x1 = 130;
jonLines.line4.y1 = 1150;
jonLines.line4.x2 = 420;
jonLines.line4.y2 = 1320;
// beach bbq to dance
jonLines.line5 = {};
jonLines.line5.x1 = 420;
jonLines.line5.y1 = 1320;
jonLines.line5.x2 = 130;
jonLines.line5.y2 = 1350;
// dance to dorms
jonLines.line6 = {};
jonLines.line6.x1 = 130;
jonLines.line6.y1 = 1350;
jonLines.line6.x2 = 130;
jonLines.line6.y2 = 1900;

var samLines = {};
// wedding to matt's house
samLines.line1 = {};
samLines.line1.x1 = 724;
samLines.line1.y1 = 200;
samLines.line1.x2 = 420;
samLines.line1.y2 = 870;
// matt's house to grad
samLines.line2 = {};
samLines.line2.x1 = 420;
samLines.line2.y1 = 870;
samLines.line2.x2 = 130;
samLines.line2.y2 = 1150;
// grad to nyc
samLines.line3 = {};
samLines.line3.x1 = 130;
samLines.line3.y1 = 1150;
samLines.line3.x2 = 724;
samLines.line3.y2 = 1400;
// nyc to halloween
samLines.line4 = {};
samLines.line4.x1 = 724;
samLines.line4.y1 = 1400;
samLines.line4.x2 = 420;
samLines.line4.y2 = 1600;
// halloween to dorms
samLines.line5 = {};
samLines.line5.x1 = 420;
samLines.line5.y1 = 1600;
samLines.line5.x2 = 130;
samLines.line5.y2 = 1900;

$(document).ready (function() {
  initializeLines();
  $("#sam").click(function() {
    if ($(this)[0].checked === true) $(".line-sam").removeClass("invisible");
    if ($(this)[0].checked === false) $(".line-sam").addClass("invisible");
  });
  $("#jon").click(function() {
    if ($(this)[0].checked === true) $(".line-jon").removeClass("invisible");
    if ($(this)[0].checked === false) $(".line-jon").addClass("invisible");
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
  createPersonLines(jonLines, "line-jon");
  createPersonLines(samLines, "line-sam");
  $(".line-sam").addClass("invisible");
  $(".line-jon").addClass("invisible");
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