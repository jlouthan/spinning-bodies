var canvas = document.getElementById('canvas'),
        imageLoader = document.getElementById('imageLoader'),
        context = canvas.getContext('2d'),
        image = new Image(),
        imageData,
        mousedown = {},
        rubberbandRectangle = {},
        dragging = false,
        croppedCanvas = document.getElementById('croppedCanvas'),
        croppedContext = croppedCanvas.getContext('2d');

context.lineWidth = 1.0;
context.strokeStyle = 'red';
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
         image = new Image();
        image.onload = function(){
drawLoadedImage();
        }
        image.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

canvas.onmousedown = function(event) {
    var location = windowToCanvas(canvas, event.clientX, event.clientY);
    event.preventDefault();
    rubberbandStart(location.x,location.y);
};

canvas.onmousemove = function(event){
    event.preventDefault();
    var location;
    if(dragging){
        location = windowToCanvas(canvas,event.clientX,event.clientY);
       // alert(location.x + " and " + location.y);
        rubberbandStretch(location.x,location.y);
    }
};

canvas.onmouseup = function(event){
    rubberbandEnd();
};

//return canvas coordinates of clicked point
function windowToCanvas(canvas, x, y) {
    var boundingBox = canvas.getBoundingClientRect();

    return {x: (x - boundingBox.left) * (canvas.width / boundingBox.width),
        y: (y - boundingBox.top) * (canvas.height / boundingBox.height)
    };
}

function rubberbandStart(x,y){
    mousedown.x = x;
    mousedown.y = y;
    rubberbandRectangle.left = mousedown.x;
    rubberbandRectangle.top = mousedown.y;
    dragging = true;
}

function rubberbandStretch(x,y){
    if(rubberbandRectangle.width>2*context.lineWidth && rubberbandRectangle.height>2*context.lineWidth){
        if(imageData !== undefined){
            restoreRubberbandPixels();
        }
    }
    
    setRubberbandRectangle(x,y);
    
    if(rubberbandRectangle.width > 2*context.lineWidth && rubberbandRectangle.height>2*context.lineWidth){
        updateRubberband();
    }
}

function restoreRubberbandPixels(){
    context.putImageData(imageData, rubberbandRectangle.left, rubberbandRectangle.top);
}

function setRubberbandRectangle(x,y){
    rubberbandRectangle.left = Math.min(x,mousedown.x);
     rubberbandRectangle.top = Math.min(y,mousedown.y);
      rubberbandRectangle.width = Math.abs(x-mousedown.x);
       rubberbandRectangle.height = Math.abs(y-mousedown.y);
}

function updateRubberband(){
    captureRubberbandPixels();
    drawRubberband();
}

function captureRubberbandPixels(){
    imageData = context.getImageData(rubberbandRectangle.left,rubberbandRectangle.top,rubberbandRectangle.width,rubberbandRectangle.height);
    
}

function drawRubberband(){
    context.strokeRect(rubberbandRectangle.left + context.lineWidth, rubberbandRectangle.top + context.lineWidth,
rubberbandRectangle.width - 2*context.lineWidth, rubberbandRectangle.height - 2*context.lineWidth);
}

function drawLoadedImage(){
        if (image.width <= canvas.width && image.height <= canvas.height) {
        //center the image and draw it
        context.drawImage(image, (canvas.width - image.width) / 2, 0, image.width, image.height);
    }
    else {
        //scale the image to canvas size and draw it 
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
}

function rubberbandEnd(){
    //change this to redraw without stretching
    
/*    context.drawImage(canvas,rubberbandRectangle.left + context.lineWidth*2,rubberbandRectangle.top + context.lineWidth*2,
rubberbandRectangle.width - 4*context.lineWidth, rubberbandRectangle.height - 4*context.lineWidth, 0, 0, canvas.width, canvas.height);*/

drawLoadedImage();

croppedContext.clearRect(0, 0, canvas.width, canvas.height);
croppedContext.drawImage(canvas,rubberbandRectangle.left + context.lineWidth*2,rubberbandRectangle.top + context.lineWidth*2,
rubberbandRectangle.width - 4*context.lineWidth, rubberbandRectangle.height - 4*context.lineWidth,
(croppedCanvas.width-rubberbandRectangle.width)/2,(croppedCanvas.height-rubberbandRectangle.height)/2,rubberbandRectangle.width,rubberbandRectangle.height);
 var dataURL = croppedCanvas.toDataURL('image/png');
      // set canvasImg image src to dataURL
      // so it can be saved as an image
      croppedImage = document.getElementById('canvasImage');
      croppedImage.src = dataURL;
     // var imagePNG = Canvas2Image.saveAsPNG(croppedCanvas, true);
    
    dragging = false;
    imageData = undefined;
}