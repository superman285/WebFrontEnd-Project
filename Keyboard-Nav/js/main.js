

//优化代码方案：把一坨代码放到一个函数里头，将线性结构变为树形结构，会清晰很多


//第一部分，初始化
var initalData = init();
var keyMap = initalData.keyMap;
var websiteMap = initalData.websiteMap;

//第二部分，生成键盘
generateKeyboard();

//第三部分，监听用户键盘按键
monitorKeyboard();



//初始化函数
function init() {
    //1.初始化数据内容，包括键盘按键和按键对应网站
    var keyMap = {
        0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0,''],
        1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        '3': ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    };
    var websiteMap = {
        1: '163.com',
        2: '2345.com',
        3: '360.cn',
        4: '4399.com',
        5: '58.com',
        6: '6.cn',
        7: '7daysinn.cn',
        8: '8264.com',
        9: '99.com.cn',
        0: '05wang.com',
        q: 'qq.com',
        w: 'weibo.com',
        e: 'ebay.com',
        r: 'renren.com',
        t: 'taobao.com',
        y: 'yy.com',
        u: 'ui.cn',
        i: 'iqiyi.com',
        o: 'oschina.net',
        p: 'pconline.com.cn',
        a: 'amazon.com',
        s: 'sohu.com',
        d: 'douban.com',
        f: 'ftchinese.com',
        g: 'ganji.com',
        h: 'hao123.com',
        j: 'jd.com',
        k: 'kuaishou.com',
        l: 'lenovo.com',
        z: 'zhihu.com',
        x: 'xinhuanet.com',
        c: 'csdn.net',
        v: 'vip.com',
        b: 'baidu.com',
        n: 'nike.com',
        m: 'microsoft.com'
    }

    var websiteMap_new = JSON.parse(localStorage.getItem('websiteMap_new') || 'null');

    if (websiteMap_new) {
        websiteMap = websiteMap_new;
    }

    return {
        keyMap: keyMap,
        websiteMap: websiteMap
    }
}


//生成页面元素
function createKbd(row_index,kbd_index) {
    //键位
    var kbd = document.createElement("kbd");
    //易错：如果这儿textContent放在btn的textContent之后会把btn设置的textContent覆盖掉。
    kbd.textContent = keyMap[row_index][kbd_index];
    //id与键位对应字母是一样的
    kbd.id = keyMap[row_index][kbd_index];

    return kbd;
}

function createWebicon(row_index,kbd_index) {
    //网址icon
    var webicon = document.createElement("img");
    if (websiteMap[keyMap[row_index][kbd_index]]) {
        webicon.src = '//www.' + websiteMap[keyMap[row_index][kbd_index]] + '/favicon.ico';
    } else {
        webicon.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png'
    }
    webicon.onerror = function (e) {
        e.target.src = '//i.loli.net/2017/11/10/5a05afbc5e183.png'
    }

    return webicon;
}

function createEdit_btn(row_index,kbd_index) {
    //网址编辑按钮
    var edit_btn = document.createElement("button");
    edit_btn.textContent = 'Edit';
    edit_btn.id = keyMap[row_index][kbd_index];
    edit_btn.onclick = function (clickEvent) {

        console.log("按下的键：" + clickEvent.target['id']);
        if (websiteMap[clickEvent.target.id]) {
            var edit_input = prompt('当前网站是' + websiteMap[clickEvent.target['id']] + '\n请输入想变更的网站');
        } else {
            var edit_input = prompt('请输入想变更的网站');
        }
        /*if (typeof(edit_input)=="string") {
            console.log("没错 是的");
        }*/
        if (edit_input) {
            //处理下开头www.的问题
            //截取前4位
            var head4 = edit_input.substr(0, 4);
            console.log(head4);
            if (head4 == "www.") {
                console.log('开头截掉把');
                console.log('截取前' + edit_input);
                //去掉前4位
                edit_input = edit_input.substr(4)
                console.log('截取后' + edit_input);
            }
            websiteMap[clickEvent.target.id] = edit_input;
            localStorage.setItem('websiteMap_new', JSON.stringify(websiteMap));
            //刷新页面以更新图标
            location.reload();
        } else if (edit_input === "") {
            //点了确定，但没内容，返回""
            alert('输入内容不可为空！');
            //do nothing
        } else {
            //点了取消，返回的是null值
            //do nothing
        }
    }
    return edit_btn;
}

//JS把kbd建好，利用循环
//生成键盘函数
function generateKeyboard() {
    for (var row_index = 0; row_index < Object.keys(keyMap).length; row_index++) {
        var kbd_row = document.createElement("div");
        kbd_row.className = 'kbd_row';

        var kbd_rowsWrapper = document.getElementById("kbd-rowsWrapper");
        //也可以直接使用id，不用getElementById，即省略以上这句
        kbd_rowsWrapper.appendChild(kbd_row);

        for (var kbd_index = 0; kbd_index < keyMap[row_index].length; kbd_index++) {

            var kbd = createKbd(row_index,kbd_index);

            var webicon = createWebicon(row_index,kbd_index);
            console.log(kbd.id + "的icon地址是：" + webicon.src)

            var edit_btn = createEdit_btn(row_index,kbd_index);

            kbd.appendChild(webicon);
            kbd.appendChild(edit_btn);
            kbd_row.appendChild(kbd);
        }
    }

}

//针对用户输入值的处理
function handle(edit_input) {
    return edit_input;
}

//监听用户按键函数
function monitorKeyboard() {
    //监听键盘按键事件
    document.onkeypress = function (pressEvent) {

        var pressKey = pressEvent.key;

        var press_key = document.getElementById(pressKey);

        press_key.style = "box-shadow:\n" +
            "        0.1em 0.1em 0.1em rgba(0, 0, 0, 0.25),\n" +
            "        0 0 0 0.05em rgba(0, 0, 0, 0.3),\n" +
            "        -0.025em -0.05em 0.025em rgba(255, 255, 255, 0.8) inset;";

        console.log(pressEvent);
        console.log('按下的键：' + pressKey);

        if(websiteMap[pressKey]) {
            var pressWebsite = 'http://www.' + websiteMap[pressKey];
            window.open(pressWebsite, '_blank');
        }else {
            alert('暂无对应网址！')
        }

    }


}