var http = require('http'), // 创建本地 http 服务
    request = require('request'), // 对外发送 http 请求
    cheerio = require('cheerio'), // 服务端的 JQ
    eventproxy = require('eventproxy'), // 事件处理
    fs = require('fs'); // 文件处理

http.createServer(start).listen(3000); // 创建 http 服务，监听 3000 端口
console.log('listen 3000');

function start(req, res) {
    var ep = new eventproxy(), // 事件实例
        now = 0, // 统计已获取到的信息数量
        themes = []; // 存放所有主题信息

    // 爬虫结束，排序并输出到文件和页面上
    ep.on('endReq', function () {
        console.log('done');
        themes.sort((v1, v2) => v2.star - v1.star)
        fs.writeFile('./result.text', JSON.stringify(themes), function (err) {
            if (err) throw err;
            console.log('write in file');
        });
        themes.forEach((obj) => {
            res.write(obj.name + ', star: ' + obj.star + '<br/>');
        })
        res.end();
    });

    // 触发所有主题链接
    ep.on('seeUrls', function () {
        res.write('<br/>');
        res.write('theme length is: ' + themes.length + '<br/>');
        themes.forEach(function (obj, i) {
            setTimeout(function () {
                ep.emit('getStar', i);
            }, 200 * i) // 友善爬虫哈哈哈

        })

    })

    // 请求主题所在 github，爬取关注数 star
    ep.on('getStar', function (i) {
        request(themes[i].url, { timeout: 6000 }, function (err, response, body) {
            console.log((++now * 100 / themes.length | 0) + '%', themes[i]); // 输出当前进度和爬取主题
            try { // 防止链接非 github 或访问失败导致数据处理报错
                var $ = cheerio.load(body),
                count = $('.social-count').length ? $('.social-count').eq(1).html() : '0';
                themes[i].star = +count.replace(/(,+)|(\s+)/g, ''); // 去掉空格和 ,
            } catch (err) {
                themes[i].star = 0
            }
            if (now == themes.length) {
                ep.emit('endReq'); // 触发结束事件
            }
        });
    })

    // 访问页面，获取所有主题的链接和名称
    request('https://hexo.io/themes/', function (err, response, body) {
        var $ = cheerio.load(body);
        var curPageUrls = $('.plugin-name');
        themeLen = curPageUrls.length;
        for (var i = 0; i < themeLen; i++) {
            var obj = {};
            obj.url = curPageUrls.eq(i).attr('href');
            obj.name = curPageUrls.eq(i).html()
            themes.push(obj);
        }
        ep.emit('seeUrls');
    });
}
