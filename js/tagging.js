



function Box() {
    this.x = 0;
    this.y = 0;
    this.w = 1; // default width and height?
    this.h = 1;
    this.fill = '#444444';
    this.tag = "default tag";
}
 
// Methods on the Box class
Box.prototype = {
    draw: function(context, isFilled) {
        context.fillStyle = this.fill;
        context.strokeStyle =  '#444444';
        // We can skip the drawing of elements that have moved off the screen:
        //CHANGE
       // if (this.x > WIDTH || this.y > HEIGHT)
         //   return;
        if (this.x + this.w < 0 || this.y + this.h < 0)
            return;
 
        if (isFilled) {

            context.fillRect(this.x, this.y, this.w, this.h);
        } else {
            context.strokeRect(this.x,this.y,this.w,this.h);
        }
 
    } // end draw
}
 
 var boxes = new Array();

//Initialize a new Box and add it
function addRect(x, y, w, h, fill, tag) {
    var rect = new Box;
    rect.x = x;
    rect.y = y;
    rect.w = w
    rect.h = h;
    rect.fill = fill;
    rect.tag = tag;
   //rect.draw(context,  false);
    boxes.push(rect);   // boxes is an array that holds all our current tags
}



 
/**
 * Sets mx,my to the mouse position relative to the canvas
 */
function getMouse(e){
    var element = canvas;
    offsetX = 0;
    offsetY = 0;
 
    if (element.offsetParent){
        do{
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        }
        while ((element = element.offsetParent));
    }
 
    // Add padding and border style widths to offset
    offsetX += .5;
    offsetY += .5;
 
    offsetX +=  .5;
    offsetY += .5;
    console.log("inside getMouse");
 
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY
};
 
// User started tagging
taggerMouseDown = function(e){
	console.log("inside taggerMouseDown");
    getMouse(e);
    taggerStarted = true;

    rectX = mx;
    rectY = my;
};
 
// Either user is moving mouse or drawing a box for tagging
taggerMouseMove = function(e){

 
    if (!taggerStarted){
        return;
    }
 
    getMouse(e);
 
    var x = Math.min(mx, rectX),
        y = Math.min(my, rectY),
        w = Math.abs(mx - rectX),
        h = Math.abs(my - rectY);

 
    mainDraw(x, y, w, h);       // This function draws the box at intermediate steps
}
 
// Tagging is completed
taggerMouseUp = function(e){
    getMouse(e);
    if (taggerStarted){
        var tag = prompt("Enter any tag");
        if (tag != null && tag != "") {
 
            var rectH = my - rectY;
            var rectW = mx - rectX;
 
            if ( rectH < 0) {
                rectY = my;
                rectH = -rectH;
            }
            if (rectW < 0) {
                rectX = mx;
                rectW = -rectW;
            }
 
            if (rectW == 0 || rectH == 0) {
                alert("Error creating tag! Please specify non-zero height and width");
            } else {
            	console.log("inside creating a tag");
                addRect (rectX, rectY, rectW, rectH, "#444444", tag);
            }
 
            // Clear the canvas and draw image on canvas
            //context.clearRect(0, 0, canvas.width, canvas.height);
            //context.drawImage(image, imageX, imageY);
        }
 
        taggerStarted = false;
        taggerMouseMove(e);
    }
}
 
function mainDraw(x, y, w, h) {
     context.clearRect(0, 0, canvas.width, canvas.height);
     context.drawImage(image, imageX, imageY);
    //Draw background stuff here

     
    if (!w || !h){
        return;
    }
 
    context.strokeRect(x, y, w, h);
}



annotatedMouseMove = function(e){
    getMouse(e);
 
    var backgroundDrew = false;
 
    var l = boxes.length;
    var i = 0;
    var prevRectIndex = -2;
    for (i = 0; i < l; i++) {
        if (mx > boxes[i].x && mx < boxes[i].x+boxes[i].w &&  my > boxes[i].y && my < boxes[i].y+boxes[i].h) {
            if (i != prevRectIndex) {
                prevRectIndex = i;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, imageX, imageY)
                //drawImage (context, image, resizeFactor);
                boxes[i].draw(context, false);
                //drawAllBoxes(false);
 
                // Remove previously shown annotation (important when two annotations overlap)
                if (annotation) {
                    m_container.get()[0].removeChild(annotation);
                    annotation = false;
                }
                if(annotationRemove) {
                    m_container.get()[0].removeChild(annotationRemove);
                    annotationRemove = false;
                }
 
                // Show annotation on mouse over
                annotation = document.createElement("div");
                annotation.style.position = 'absolute';
                annotation.style.top = (offsetY + boxes[i].y) + "px";
                annotation.style.left = offsetX + boxes[i].x + "px";
                annotation.style.width = boxes[i].w + 'px';
                annotation.style.lineHeight = boxes[i].h + 'px';
                //annotation.style.background.
                annotation.className += ' tagger-annotation';
 
                annotation.innerHTML = boxes[i].tag;
 
                annotationRemove = document.createElement("button");
                annotationRemove.style.position = 'absolute';
                annotationRemove.style.top = offsetY + boxes[i].y + "px";
                annotationRemove.style.left = offsetX + boxes[i].x + boxes[i].w - 20 + "px";
                annotationRemove.className += ' annotation';
                annotationRemove.className += ' tagger-annotation-action-remove';
 
                annotationRemove.onclick = function() {
                    removeAnnotation(i);
                };
 
                document.getElementById("image-space").appendChild(annotation);
                document.getElementById("image-space").appendChild(annotationRemove);
            }
 
            break;
        }
    }
 
    if (i == l && prevRectIndex != -1) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        //drawImage (context, image, resizeFactor);
        context.drawImage(image, imageX, imageY);
        //drawAllBoxes(false);
        prevRectIndex = -1;
        if(annotation) {
            document.getElementById("image-space").removeChild(annotation);
            annotation = false;
        }
        if(annotationRemove) {
            document.getElementById("image-space").removeChild(annotationRemove);
            annotationRemove = false;
        }
    }
}
 
var removeAnnotation = function(i) {
    boxes.splice(i,1);
    canvasElem.mousemove();
}

function createTag()
{

}

function tagPhoto() { 
    canvas.onmousedown = createTag;
    canvas.onmouseup = taggerMouseUp;
    canvas.onmousemove = taggerMouseMove;
}; 

//tagPhoto();

  var annotation = false;
   var annotationRemove = false;

//viewTags();
function viewTags(){
   
   canvas.onmousedown = null;
   canvas.onmouseup = null;
   canvas.onmousemove = annotatedMouseMove;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawTag(canvas, centerX, centerY)
{

      context.beginPath();
      console.log(centerX-25);
      console.log(centerX);

      context.rect(centerX, centerY, 50, 50);


      context.lineWidth = 4;
      context.strokeStyle = '#fff';
      context.stroke();
}

var taggerStarted;
var canvas = document.getElementById("image-canvas");
var viewTagsButton = document.getElementById("viewTags");
var tagPhotosButton = document.getElementById("tag-photo");

var context = canvas.getContext('2d');
var imageX = 10;
var imageY = 10;
var image = new Image();

$(document).ready(function() 
{
    $("#detailed-photo img").hide();
    image.src = $("#detailed-photo img").attr("src");
    image = $("#detailed-photo img").get(0);
    var imageX = 10;
    var imageY = 10;

    $("#image-canvas").attr("width", image.width);
    $("#image-canvas").attr("height", image.height);

    context.drawImage(image, 10, 10); // Draw image only after loading is finished

    $("#tag-photo").click(function() {
        $("#image-canvas").css("cursor", "crosshair");

        canvas.addEventListener('mousedown', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
            console.log(message);
            drawTag(canvas, mousePos.x, mousePos.y);
        }, false);
    });



});