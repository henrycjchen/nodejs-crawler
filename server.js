var http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    eventproxy = require('eventproxy');

http.createServer(start).listen(3000);
console.log('listen 3000');

// 主start程序
function start(req, res) {
    var ep = new eventproxy(),
    urlsArray = [], //存放爬取网址
    themes = []; // 存放所有主题信息
    ep.on('seeUrls',function () {
        console.log(themes.length);
        res.write('<br/>');
        res.write('theme length is: ' + themeLen + '<br/>');
        urlsArray.forEach(function (url,i) {
            ep.emit('getStar',i)
        })
    })
    ep.on('getStar',function (i) {
        superagent.get(urlsArray[i])
            .end(function (err, pres) {
                console.log(i,themes[i]);
                try { // 防止页面访问失败或页面非 github 而报错导致崩溃
                    var name = themes[i];
                    var $ = cheerio.load(pres.text);
                    var count = $('.social-count').length?$('.social-count').eq(1).html():0;
                    themes[i].star=count;
                } catch (err) {

                }
                ep.emit('endReq');
            }); 
    })
    superagent.get('https://hexo.io/themes/')
        .end(function (err, pres) {
            var $ = cheerio.load(pres.text);
            var curPageUrls = $('.plugin-name');
            themeLen = curPageUrls.length;
            for (var i = 0; i < curPageUrls.length; i++) {
                var articleUrl = curPageUrls.eq(i).attr('href');
                urlsArray.push(articleUrl);
                var obj = {};
                obj.name=curPageUrls.eq(i).html()
                themes.push(obj);
            }
            ep.after('endReq',themes.length, function () {
                themes.sort((v1, v2)=>v1.star>v2.star)
                themes.forEach((obj, i)=>{
                    res.write('theme name is: ' + obj.name + ', star:'+obj.star+'<br/>');
                })              

                res.end();
            });
            ep.emit('seeUrls');
        });    
}
