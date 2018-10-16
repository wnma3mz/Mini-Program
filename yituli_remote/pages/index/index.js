//index.js
//获取应用实例
const app = getApp()
const getdate = require('./getdate.js');
const jinrishici = require('../../utils/jinrishici.js')

const vw = wx.getSystemInfoSync().windowWidth
const vh = wx.getSystemInfoSync().windowHeight

const ctx = wx.createCanvasContext('myCanvas');


Page({
  data: {
    jinrishici: {},
    flag: 123,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  drawPage: function() {

    const x0 = 0+5,
      y0 = 0+5
    var linecolor = 'deepskyblue';
    ctx.setStrokeStyle(linecolor);
    ctx.fillStyle = "#fff";

    ctx.fillRect(0, 0, vw, vh);

    // 最外围矩形
    ctx.lineWidth = 5;
    ctx.strokeRect(x0, y0, vw - x0*2, vh * 0.8);
    ctx.save();

    // 中间的矩形
    ctx.lineWidth = 2;
    var scaleXY = 0.95;
    ctx.translate((x0 + vw / 2) * (1 - scaleXY), (y0 + vh * 0.8 / 2) * (1 - scaleXY));
    ctx.scale(scaleXY, scaleXY);
    ctx.strokeRect(x0, y0, vw - x0*2, vh * 0.8);

    ctx.restore();
    ctx.save();

    // 最里面的矩形
    ctx.lineWidth = 1;
    var scaleX = 0.85;
    var scaleY = 0.3;
    ctx.translate((x0 + vw / 2) * (1 - scaleX), (vh * 0.75) * (1 - scaleY));
    ctx.scale(scaleX, scaleY);
    ctx.strokeRect(x0, y0, vw - x0, vh * 0.8);

    ctx.restore();
    ctx.save();

    // 进度条
    ctx.setFillStyle('gray')
    var scaleX = 0.85;
    var scaleY = 0.05;
    ctx.translate((x0 + vw / 2) * (1 - scaleX), (vh * 0.45) * (1 - scaleY));
    ctx.scale(scaleX, scaleY);
    ctx.fillRect(x0, y0, vw - x0, vh * 0.8);

    ctx.restore();
    ctx.save();


    ctx.fillStyle = linecolor;
    var today = new getdate();
    var tmp_w;
    ctx.font = "normal 20px 楷体";

    var fontsize = {
      'date': (vw > 700) ? 40 : 20,
      'num': (vw > 700) ? 180 : 90,
      'year': (vw > 700) ? 30 : 15,
      'gushi': (vw > 400) ? 20 : 15,
    }

    if (vw > 700) {
      fontsize.gushi = 30;
    }

    ctx.setFontSize(fontsize.date);
    // console.log(fontsize, x0, y0);
    ctx.fillText(today.date, x0 + fontsize.date, y0 + fontsize.date * 2);
    tmp_w = ctx.measureText(today.day).width;
    ctx.fillText(today.day, vw - x0 - fontsize.date * 2 - tmp_w, y0 + fontsize.date * 2);

    ctx.setFontSize(fontsize.num);
    ctx.setTextAlign('center');
    ctx.fillText(today.num, vw / 2, vh * 0.3);

    ctx.setFontSize(fontsize.year)
    ctx.setTextAlign('center');
    ctx.fillText(today.lunarday, vw / 2, vh * 0.3 + fontsize.year * 1.5);
    ctx.fillText(today.word_string, vw / 2, vh * 0.3 + (fontsize.year * 1.5) * 2);

    ctx.translate((x0 + vw / 2) * (1 - scaleX), (vh * 0.45) * (1 - scaleY));
    ctx.scale(scaleX, scaleY);

    ctx.fillRect(x0, y0, (vw - x0) * today.percent_days / 100, vh * 0.8);

    ctx.restore();
    ctx.save();

    ctx.setFillStyle(linecolor)
    ctx.setFontSize(fontsize.gushi);
    wx.getStorage({
      key: 'gushi',
      success: function(res) {
        var content = res.data.content;
        var title = res.data.origin.title;
        var author = res.data.origin.author;

        ctx.setTextAlign('center');
        ctx.fillText(title, vw / 2, vh * 0.6);
        ctx.fillText(content, vw / 2, vh * 0.6 + fontsize.gushi * 2);
        tmp_w = ctx.measureText(author + '—— ').width;
        ctx.setTextAlign('center');
        ctx.fillText('—— ' + author, vw - tmp_w - 2, vh * 0.6 + fontsize.gushi * 4.5);

        ctx.draw();
      },
      fail: function(res) {
        var title = '南轩松';
        var content = '阴生古苔绿，色染秋烟碧。';
        var author = '李白';

        ctx.setTextAlign('center');
        ctx.fillText(title, vw / 2, vh * 0.6);
        ctx.fillText(content, vw / 2, vh * 0.6 + fontsize.gushi * 2);
        tmp_w = ctx.measureText(author + '—— ').width;
        ctx.setTextAlign('center');
        ctx.fillText('—— ' + author, vw - tmp_w - 2, vh * 0.6 + fontsize.gushi * 4.5);

        ctx.draw();
      }
    })

  },

  setgushi: function() {
    var that = this;
    jinrishici.load(res => {
      var content = res.data.content;
      var title = res.data.origin.title;
      var author = res.data.origin.author;

      if ((title.length > 6) || (content > 12)) {
        that.setgushi();
      } else {
        wx.setStorage({
          key: 'gushi',
          data: res.data,
        })
      }
    })
  },


  onLoad: function() {
    this.setgushi();
    this.drawPage();
  },

  save: function() {

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight,
      canvasId: 'myCanvas',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            this.setData({
              shareImgShow: false
            }, () => {
              setTimeout(() => {
                this.setData({
                  shareGuideShow: true
                });
              }, 200);
            });
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1500
            })
          },
          complete(res) {
            // complete
          }
        });
      },
      fail: err => {
        setTimeout(() => {
          this.save();
        }, 200);
      }
    });

    // this.onLoad();
  },

  onShow: function() {},

  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    return {
      //## 此为转发页面所显示的标题
      //title: '好友代付', 
      //## 此为转发页面的描述性文字
      desc: '江湖救急，还请贵人伸手相助啊!',
      //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
      path: 'pages/subpayment/firpayment/index?sn=' + this.data.sn,
      //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
      success: function (res) {
        //这是我自定义的函数，可替换自己的操作
        util.showToast(1, '发送成功');
      },
      //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
      fail: function () {
        util.showToast(0, '朋友代付转发失败...');
      }
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})