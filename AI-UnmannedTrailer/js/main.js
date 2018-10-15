//切换主题色
var logo = document.querySelector(".logo");
var root = document.querySelector("html");

logo.onclick = function () {

    root.classList.toggle('lightTheme');
    console.log('主题切换完毕');
}

//启动停止命令提交form
var controlBtnStop = document.querySelector(".controlBtn-stop");
var controlBtnStart = document.querySelector(".controlBtn-start");
var btnStopForm = document.querySelector(".btnStopForm");
var btnStartForm = document.querySelector(".btnStartForm");

controlBtnStop.onclick = function () {
    btnStopForm.submit();
    alert('急停命令已发送！');
}

controlBtnStart.onclick = function () {
    btnStartForm.submit();
    alert("启动命令已发送！")
    /*swal({
        title: '重启命令已发送！',
        type: 'info',
        confirmButtonText: 'OK'
    })*/
}

