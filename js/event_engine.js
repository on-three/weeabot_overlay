//npm install node-json-rpc
//$ npm install node-json-rpc

var event_engine = {

  logo : function(stage) {
    var w = stage.canvas.width;
    var h = stage.canvas.height;
    var txt = new createjs.Text("#/jp/shows", "24px Arial", "#ffffff");
    txt.shadow = new createjs.Shadow("#000000", 2, 2, 5);
    var text_width = txt.getBounds().width;
    var text_height = txt.getBounds().height;
    txt.x = w - text_width - 10;
    txt.y = h - text_height - 5;
    stage.addChild(txt);
  },

  lane : function(stage, ypos) {
    this.y = ypos;
    this.t_complete = 0;
    this.AddText = function() {
      //keep track of the time from now in seconds this lane will be clear
      this.t_complete = performance.now() + 6000;
    };
    this.CanAdd = function(stage, text) {
      //can we add the given text to this lane?
      var t_remaining = this.t_complete - performance.now();
      if(t_remaining <= 0) {
        return true;
      }
      var stage_width = stage.canvas.width;
      var text_width = text.getBounds().width;
      var speed = (stage_width + text_width)/6000;
      var t_screen = stage_width/speed;//milliseconds for front of blurb to cross the screen
      return (t_screen > t_remaining);
    }
  },

  niconicoDisplay : function(stage) {
    this.lanes = [];
    for (var i = 0; i < 10; i++) {
      this.lanes.push(new event_engine.lane(stage, i*34+10));
    };

    this.Add = function (msg) {
        for(l in this.lanes) {
          ln = this.lanes[l];
          if(ln.CanAdd(stage, msg)) {
            ln.AddText();
            return ln.y;
            break;
          }
        }
        return 0;
      };
    },

  subtitleDisplay : function(stage) {
    var that = this;
    this.queue = [];
    this.currentText = undefined;
    this.Clear = function() {
      this.queue = [];
    };
    this.Add = function (msg) {
      if(this.currentText!=undefined) {
        this.queue.push(msg)
        return;
      }
      var w = stage.canvas.width;
      var h = stage.canvas.height;
      //limit text width to 3/4 canvas width
      var max_text_width = 3*w/4;
      this.currentText = new createjs.Container()
      var outline = new createjs.Text(msg, "48px Arial", "#000000");
      outline.outline = 3;
      outline.lineWidth = max_text_width;
      var fill = new createjs.Text(msg, "48px Arial", "#ffff00");
      fill.lineWidth = max_text_width;
      //this.currentText.addChild(outline);
      this.currentText.addChild(fill);
      this.currentText.shadow = new createjs.Shadow("#000000", 2, 2, 5);
      var text_width = fill.getBounds().width;
      var text_height = fill.getBounds().height;
      this.currentText.alpha = 0;
      this.currentText.y = h;
      //center
      this.currentText.x = w/2 - text_width/2;
      var y = h - text_height - 30;

      stage.addChild(this.currentText);
      createjs.Tween.get(this.currentText,{loop: false})
        .to({alpha:1,y:y}, 1500, createjs.Ease.backIn)
        .wait(5000)
        .to({alpha:0,y:y-text_height}, 1500, createjs.Ease.backOut)
        .call(function(){
          stage.removeChild(that.currentText);
          that.currentText = undefined;
          if(that.queue.length) {
            var n = that.queue.pop();
            that.Add(n);
          }
        });
      // createjs.Tween.get(this.currentText,{loop: false})
      //   .to({alpha:1;y:600}, 1500)
      //   .wait(5000);
        // .call(function(){
        //   stage.removeChild(this.currentText);
        //   this.currentText=undefined;
        //   if(this.queue.length) {
        //     var n = this.queue.pop();
        //     this.Add(n);
        //   }
        // });
      };
    },

  init: function(stage) {
    var rpc = require('node-json-rpc');
    niconico = new event_engine.niconicoDisplay(stage);
    subtitle = new event_engine.subtitleDisplay(stage);
    event_engine.logo(stage);

    var options = {
      // int port of rpc server, default 5080 for http or 5433 for https 
      port: 5080,
      // string domain name or ip of rpc server, default '127.0.0.1' 
      host: '127.0.0.1',
      // string with default path, default '/' 
      path: '/',
      // boolean false to turn rpc checks off, default true 
      strict: true
    };
   
    // Create a server object with options 
    this.serv =  new rpc.Server(options);

    this.serv.addMethod('StaticMessage', function (para, callback){
      var msg = para.msg;
      subtitle.Add(msg);
      var error, result;
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('ClearAll', function (para, callback){
      subtitle.Clear();
      var error, result;
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('ScrollingMessage', function (para, callback){
      //subtitle.Clear();
      var error, result;
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('AddNicoNicoMsg', function (para, callback){

      var msg = para.msg;

      var error, result;
      //add text to stage
      var c = new createjs.Container()
      var outline = new createjs.Text(msg, "36px Arial", "#000000");
      outline.outline = 3;
      var fill = new createjs.Text(msg, "36px Arial", "#ffff00");
      //c.addChild(outline);
      c.addChild(fill);
      fill.shadow = new createjs.Shadow("#000000", 2, 2, 4);
      var w = stage.canvas.width;
      var text_width = fill.getBounds().width;
      c.x = w;
      c.y = niconico.Add(fill);
      //text.x = 100;
      stage.addChild(c);

      createjs.Tween.get(c,{loop: false})
        .to({x:-1.0*text_width}, 6000)
        .call(function(){stage.removeChild(c);});
        //   var circle = new createjs.Shape();
        // circle.graphics.beginFill("Yellow").drawCircle(0, 0, 75);
        // circle.x = 100;
        // circle.y = 100;
        // stage.addChild(circle);
        // createjs.Tween.get(circle, {loop: true})
        //   .to({x: 400}, 1000, createjs.Ease.getPowInOut(4))
        //   .to({alpha: 0, y: 75}, 500, createjs.Ease.getPowInOut(2))
        //   .to({alpha: 0, y: 125}, 100)
        //   .to({alpha: 1, y: 100}, 500, createjs.Ease.getPowInOut(2))
        //   .to({x: 100}, 800, createjs.Ease.getPowInOut(2));

      result = "OK";
      callback(error, result);
    });
   
  // Add your methods 
  // this.serv.addMethod('myMethod', function (para, callback) {
  //   var error, result;
    
  //   // Add 2 or more parameters together 
  //   if (para.length === 2) {
  //     result = para[0] + para[1];
  //   } else if (para.length > 2) {
  //     result = 0;
  //     para.forEach(function (v, i) {
  //       result += v;
  //     });
  //   } else {
  //     error = { code: -32602, message: "Invalid params" };
  //   }
   
  //   callback(error, result);
  // });
   
  // Start the server 
  this.serv.start(function (error) {
    // Did server start succeed ? 
    if (error) throw error;
    else console.log('Server running ...');
  });
}

}