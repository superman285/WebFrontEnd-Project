var myCanvas = document.getElementById("myCanvas");
var context = myCanvas.getContext('2d');
var lineWidth = 2;

//鼠标按下标记
var mousedownOnOff = false;

//画笔开关，橡皮擦开关
var brushSwitch = true;
var eraserSwitch = false;

// var eraserPointer = document.querySelector(".eraserPointer");

//顶部四按钮
var paintBrush = document.querySelector(".icon-paint-brush");
var paintEraser = document.querySelector(".icon-eraser");
var paintClear = document.querySelector(".icon-clear");
var paintSave = document.querySelector(".icon-save");

paintBrush.onclick = function () {
    paintBrush.classList.add('active');
    paintEraser.classList.remove('active');
    brushSwitch = true;
    eraserSwitch = false;
};

paintEraser.onclick = function () {
    paintEraser.classList.add('active');
    paintBrush.classList.remove('active');
    brushSwitch = false;
    eraserSwitch = true;
};

paintClear.onmousedown = function() {
    paintClear.classList.toggle('active2');
};
paintClear.onmouseup = function () {
    paintClear.classList.toggle('active2');
};
paintClear.onclick = function () {
    if(confirm("确认清空画布吗？")){
        clearCanvas(myCanvas);
    }else {
        //do nothing
    }
};

paintSave.onmousedown = function() {
    paintSave.classList.toggle('active2');
};
paintSave.onmouseup = function () {
    paintSave.classList.toggle('active2');
};
paintSave.onclick = function () {
    saveCanvas(myCanvas);
};

//画笔粗细
var thinBrush = document.querySelector(".paintLineWidth li:first-child");
var thickBrush = document.querySelector(".paintLineWidth li:last-child");

thinBrush.onclick = function(){
    lineWidth = 2;
    pThickIco.classList.remove('PTactive');
    pThinIco.classList.add('PTactive');
};

thickBrush.onclick = function(){
    lineWidth = 5;
    pThinIco.classList.remove('PTactive');
    pThickIco.classList.add('PTactive');
};

//画笔颜色
var brushColor = 'black';

paintBlack.onclick = function () {
    paintBlack.classList.add('active');
    paintRed.classList.remove('active');
    paintGreen.classList.remove('active');
    paintBlue.classList.remove('active');
    brushColor = 'black';
};
paintRed.onclick = function () {
    paintBlack.classList.remove('active');
    paintRed.classList.add('active');
    paintGreen.classList.remove('active');
    paintBlue.classList.remove('active');
    brushColor = 'red';
};
paintGreen.onclick = function () {
    paintBlack.classList.remove('active');
    paintRed.classList.remove('active');
    paintGreen.classList.add('active');
    paintBlue.classList.remove('active');
    brushColor = 'green';
};
paintBlue.onclick = function () {
    paintBlack.classList.remove('active');
    paintRed.classList.remove('active');
    paintGreen.classList.remove('active');
    paintBlue.classList.add('active');
    brushColor = 'blue';
};

//设备 特性检测
var isTouchMobile = 'ontouchstart' in window || navigator.userAgent.match(/(iPhone|iPod|Android|ios|Mobile)/i);


//正文
//设置画布大小
setCanvasSize();
window.onresize = function () {
    setCanvasSize();
};

setCanvasbg(myCanvas);
watchAction(myCanvas);

//工具函数

//初始化画布背景色为白，否则保存图片为透明背景
function setCanvasbg(canvas) {
    //set background color
    context.fillStyle = 'white';
    //draw background / rect on entire canvas
    context.fillRect(0,0,canvas.width,canvas.height);
}

//设置画布大小函数
function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;

    myCanvas.width = pageWidth;
    myCanvas.height = pageHeight;
}

//画圆
function drawCircle(x,y,r) {
    context.beginPath();
    context.fillStyle = brushColor;
    context.arc(x,y,r,0,Math.PI*2);
    context.fill();
}

//画线/画矩形
function drawLine(initX,initY,endX,endY){
    context.beginPath();
    context.strokeStyle = brushColor;
    context.moveTo(initX,initY);
    context.lineWidth = lineWidth;
    context.lineTo(endX,endY);
    context.stroke();
    context.closePath();
}

//橡皮擦擦除
function eraseLine(x,y) {
    context.clearRect(x - 10, y - 10, 20, 20)
}
//画布清屏
function clearCanvas(canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//保存画布as图片到本地
function saveCanvas(canvas) {
    var saveLink = document.createElement("a");
    //未加入时也可生效
    document.body.appendChild(saveLink);
    saveLink.href = canvas.toDataURL('image/png');
    saveLink.download = 'myBeautyCanvas';//必须设置download属性，a链接才有点击下载功效
    saveLink.target = '_blank';
    saveLink.click();
}

//监听玩家操作
function watchAction(canvas) {

    var startEvent = isTouchMobile ? 'touchstart':'mousedown';
    var moveEvent = isTouchMobile ? 'touchmove':'mousemove';
    var endEvent = isTouchMobile ? 'touchend':'mouseup';

    console.log(startEvent);
    console.log(moveEvent);
    console.log(endEvent);

    var lastX,lastY = undefined;

    canvas.addEventListener(startEvent,(event)=>{
        console.log('点击画布事件触发');
        mousedownOnOff = true;
        var x = event.clientX || event.touches[0].clientX;
        var y = event.clientY || event.touches[0].clientY;
        console.log('坐标'+x);
        if (brushSwitch) {
            drawCircle(x,y,lineWidth/2);
            lastX = x;
            lastY = y;
        }else if(eraserSwitch){
            // eraserPointer.style = `display:block;top:${y-10}px;left:${x-10}px`;
            eraseLine(x,y)
        }
    });
    canvas.addEventListener(moveEvent,function(event){
        var newX,newY;
        if (brushSwitch && mousedownOnOff) {
            console.log('点击鼠标后在画布上移动事件触发');
            newX = event.clientX || event.touches[0].clientX;
            newY = event.clientY || event.touches[0].clientY;
            console.log(newX);
            drawLine(lastX,lastY,newX,newY);
            drawCircle(lastX,lastY,lineWidth/2.5);
            lastX = newX;
            lastY = newY;
        }else if(eraserSwitch && mousedownOnOff) {
            //鼠标移动一次调用一次以下行为，所以一移动就擦
            console.log('橡皮擦，鼠标按下开动');
            var erX = event.clientX || event.touches[0].clientX;
            var erY = event.clientY || event.touches[0].clientY;
            // eraserPointer.style = `display:block;top:${erY-10}px;left:${erX-10}px`;
            eraseLine(erX,erY);
        }
    });
   /* canvas.onmousemove = function (event) {

    }*/
    canvas.addEventListener(endEvent,()=>{
        mousedownOnOff = false;
        if(isTouchMobile){
            console.log('手指提起了');
        }else {
            console.log('鼠标提起了');
        }
    })

}



















//橡皮擦擦除时带图标，不好用，废弃
/*
var body = document.getElementById("bo");
var pointer = document.querySelector(".pointer");
var downFlag = false;

body.onmousedown = function(eve) {
    var x = eve.clientX
    var y = eve.clientY
    // pointer.style = `display:block;top:${y}px;left:${x}px`;

    downFlag = true;
}

body.onmousemove = function(eve) {
    var x = eve.clientX
    var y = eve.clientY
    if(downFlag){
        pointer.style = `display:block;top:${y-10}px;left:${x-10}px`;
        console.log('移动dd3');
    }
}

body.onmouseup = function(eve) {
    pointer.style = `display:none`;
    downFlag = false;
}*/
