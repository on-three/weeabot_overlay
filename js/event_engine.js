//npm install node-json-rpc
//$ npm install node-json-rpc

var event_engine = {

  init: function(stage) {
    var rpc = require('node-json-rpc');

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

    this.serv.addMethod('scrollingText', function (para, callback){
      var msg = para.msg;
      var error, result;
      //add text to stage
      var c = new createjs.Container()
      var outline = new createjs.Text(msg, "36px Arial", "#000000");
      outline.outline = 3;
      var fill = new createjs.Text(msg, "36px Arial", "#ffff00");
      c.addChild(outline);
      c.addChild(fill);
      //text.shadow = new createjs.Shadow("#000000", 4, 4, 4);
      var w = stage.canvas.width;
      var text_width = fill.getBounds().width;
      c.x = w;
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