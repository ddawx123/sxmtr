//一号线主线
var line1_T1 = new Terminal('鉴湖镇');
var line1_T2 = new Terminal('下埠路');
var line1_T3 = new Terminal('大明路');
var line1_T4 = new Terminal('二环南路');
var line1_T5 = new Terminal('城南大道');
var line1_T6 = new Terminal('投醪河');
var line1_T7 = new Terminal('塔山');
var line1_T8 = new Terminal('城市广场');
var line1_T9 = new Terminal('火车站');
var line1_T10 = new Terminal('二环北路');
var line1_T11 = new Terminal('凤林路');
var line1_T12 = new Terminal('镜湖中心');//换乘站
var line1_T13 = new Terminal('奥体中心');
var line1_T14 = new Terminal('绿云路');
var line1_T15 = new Terminal('站前大道');//换乘站
var line1_T16 = new Terminal('镜水路');
var line1_T17 = new Terminal('瓜渚湖');
var line1_T18 = new Terminal('金柯桥大道');
var line1_T19 = new Terminal('笛扬路');
//一号线支线
var line1plus_T16 = new Terminal('群贤路');
var line1plus_T17 = new Terminal('高教园区');
var line1plus_T18 = new Terminal('大庆寺');
var line1plus_T19 = new Terminal('绍兴北站');
var line1plus_T20 = new Terminal('柯桥客运站');
//二号线主线
var line2_T1 = new Terminal('越西路');
var line2_T3 = new Terminal('行政中心');
var line2_T4 = new Terminal('中兴大道');
var line2_T5 = new Terminal('袍中路');
var line2_T6 = new Terminal('越东路');
var line2_T7 = new Terminal('袍江两湖');
var line2_T8 = new Terminal('越兴路');

//每条路线站点
var line1Terminals = [line1_T1, line1_T2, line1_T3, line1_T4, line1_T5, line1_T6, line1_T7, line1_T8, line1_T9, line1_T10, line1_T11, line1_T12, line1_T13, line1_T14, line1_T15, line1_T16, line1_T17, line1_T18, line1_T19];
var line1plusTerminals = [line1_T1, line1_T2, line1_T3, line1_T4, line1_T5, line1_T6, line1_T7, line1_T8, line1_T9, line1_T10, line1_T11, line1_T12, line1_T13, line1_T14, line1_T15, line1plus_T16, line1plus_T17, line1plus_T18, line1plus_T19, line1plus_T20];
var line2Terminals = [line2_T1, line1_T12, line2_T3, line2_T4, line2_T5, line2_T6, line2_T7, line2_T8];


//各条路线
var line1 = new Line(line1Terminals, '一号线');
var line1plus = new Line(line1plusTerminals, '一号线支线');
var line2 = new Line(line2Terminals, '二号线');

//初始化数据
var initData = function() {
    var startLine = $('.start .line');
    var endLine = $('.end .line');
    $('.mtr-name').text(metro.name);
    var lines = metro.getLines();
    //初始化路线
    lines.forEach(function(line, i) {
        startLine.append('<option value="' + i + '">' + line.getName() + '</option>');
        endLine.append('<option value="' + i + '">' + line.getName() + '</option>');
    });
};
var initEvent = function() {
    var startLine = $('.start .line');
    var endLine = $('.end .line');
    var startTerminal = $('.start .terminal');
    var endTerminal = $('.end .terminal');
    //改变起点和终点的路线时，重置路线途径的地体站点
    startLine.on('change', function() {
        var lineIndex = $(this).val();
        var line = metro.getLine(lineIndex);
        startTerminal.empty();
        line.getTerminals().forEach(function(terminal, i) {
            startTerminal.append('<option value="' + i + '">' + terminal.getName() + '</option>')
        });
    });
    endLine.on('change', function() {
        var lineIndex = $(this).val();
        var line = metro.getLine(lineIndex);
        endTerminal.empty();
        line.getTerminals().forEach(function(terminal, i) {
            endTerminal.append('<option value="' + i + '">' + terminal.getName() + '</option>')
        });
    });
    //初始化地铁站点
    startLine.trigger('change');
    endLine.trigger('change');
    //点击搜索，则搜索起点到终点的最短路径，并显示结果到页面
    $('.search').on('click', function() {
        var startLine = $('.start .line').val();
        var endLine = $('.end .line').val();
        var startTerminal = $('.start .terminal').val();
        var endTerminal = $('.end .terminal').val();
        metro.reset();
        var route = metro.search(metro.getLine(startLine).getTerminal(startTerminal), metro.getLine(endLine).getTerminal(endTerminal));
        $('.desc').html('最短用时：' + route.time + '分钟<br/>' + route.desc);
        var text = route.nodes.map(function(desc) {
            return [desc.start, desc.line, desc.count + '个站', desc.end].join('  ');
        });
        text.push(route.toString());
        $('.result').html(text.join('<br/>'));
    });
};
//初始化广州地铁
var metro;
$.ajax({
    url: 'https://passport.dingstudio.cn/api',
    method: 'get',
    data: {
        'format': 'json',
        'action': 'status',
        'requests': Date.parse(new Date()) / 1000,
        'hostname': window.location.hostname
    },
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function (res) {
        if (res.data.authcode === 1) {
            $.ajax({
                url: 'https://passport.dingstudio.cn/api',
                method: 'get',
                data: {
                    'format': 'json',
                    'action': 'verify',
                    'reqtime': Date.parse(new Date()) / 1000,
                    'token': res.data.token,
                    'hostname': window.location.hostname,
                    'cors_domain': 'http://' + window.location.hostname
                },
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (res) {
                    if (res.data.username) {
                        $('#sso_status').html('您已作为：' + res.data.username + ' 登录，<a href="https://passport.dingstudio.cn/sso/login.php?action=dologout&url=' + encodeURIComponent(window.location.href) + '">点此</a>退出。');
                    }
                }
            });
            metro = new MTR('绍兴地铁');
            metro.addLines([line1, line1plus, line2]);
            initData();
            initEvent();
        }
        else {
            $('#sso_status').html('您尚未登录，<a href="https://passport.dingstudio.cn/sso/login?returnUrl=' + encodeURIComponent(window.location.href) + '">点此</a>登录。');
            //window.location.href = 'https://passport.dingstudio.cn/sso/login?returnUrl=' + encodeURIComponent(window.location.href);
        }
    },
    error: function (e) {
        //TODO
    }
});
