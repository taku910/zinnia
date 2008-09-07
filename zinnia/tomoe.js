/* 
 *  Ajax-based hand written recognition
 *  Copyright (C) Taku Kudo <taku@chasen.org>
 */

function getPosition(evt)
{
  evt = (evt) ?  evt : ((event) ? event : null);
  var left = 0;
  var top = 0;

  if (evt.pageX) {
    left = evt.pageX;
    top  = evt.pageY;
  } else {
    left = evt.clientX + document.documentElement.scrollLeft;
    top  = evt.clientY +  document.documentElement.scrollTop;
  }
 
  return {x : left, y : top}; 
}

function createXmlHttp ()
{
  xmlhttp = false;

  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    xmlhttp = new XMLHttpRequest();
  }

  return xmlhttp;
}

onload = function ()
{
  var tomoe = new TOMOE();
}

function TOMOE ()
{
  var canvas = document.getElementById("tomoe-canvas");
  canvas.className = "tomoe-canvas";
  this.canvas = canvas;

  var self = this;
  canvas.onmouseup   = function(event) { self.mouseup(event); }
  canvas.onmousedown = function(event) { self.mousedown(event); }
  canvas.onmousemove = function(event) { self.mousemove(event); }

  var clear_button = document.getElementById("tomoe-clear-button");
  clear_button.onclick = function(event) { self.clearAll(); }

  this.resultArea = document.getElementById("tomoe-result");
  this.resultArea.className = "tomoe-result";

  this.textInput =  document.getElementById("tomoe-text");
  this.textInput.className = "tomoe-text";
   
  var left = 0;
  var top = 0;
  for (var o = canvas; o ; o = o.offsetParent) {
    left += (o.offsetLeft - o.scrollLeft);
    top  += (o.offsetTop - o.scrollTop);
  }
   
  this.offsetLeft = left;
  this.offsetTop  = top;

  this.clearAll();

  //  this.read(input);
  //  this.getExample();
}

TOMOE.prototype.checkXmlHttp = function()
{
  if (! this.xmlhttp) this.xmlhttp = createXmlHttp();
  if (! this.xmlhttp || this.xmlhttp.readyState == 1 ||
      this.xmlhttp.readyState == 2 || this.xmlhttp.readyState == 3){
    return false; 
  }
  return true;
}

TOMOE.prototype.readExample = function(s)
{
  this.clearAll();
  var lines = s.split('\n');
  if (lines.length <= 3) return;

  this.exampleId = lines[0];
  this.resultChar = lines[1];
  var results = lines[2].match(/:(\d+)/);
  if (results == null) return;
  var stroke_num = results[1];

  for (var i = 0; i < stroke_num; ++i) {
    var t = lines[i+3].replace(/[\)\(]/g, "").split(' ');
    var stroke_num = t[0];
    if (2 * stroke_num + 1 != t.length) return;
    for (var j = 0; j < stroke_num; ++j) {
      var x = parseInt(t[2*j + 1]) + this.offsetLeft;
      var y = parseInt(t[2*j + 2]) + this.offsetTop;
      this.addPoint(x, y);
    }
    this.finishStroke();
  }
}

TOMOE.prototype.clearAll = function()
{
  this.clear();
  this.textInput.value = "";  
}

TOMOE.prototype.clear = function()
{
  this.xmlhttp = null;
  this.active = false;
  this.sequence = [];
  this.point_num = 0;
  this.stroke_num = 0;
  this.prev_x = -1;
  this.prev_y = -1;
  this.resultArea.innerHTML = "";
  this.resultArea.style.display= "none";
  this.resultNum = 0;
  this.resultChar = "";
  this.exampleId = 0;

  var o = this.canvas;
  while (o.firstChild) {
    o.removeChild(o.firstChild);
  }
}

TOMOE.prototype.showResult = function()
{
  this.resultArea.style.display = "block";
  this.resultArea.innerHTML = "";
  this.resultNum = 0;
}

TOMOE.prototype.addResult = function(c, p)
{
  var div = document.createElement("div");  
  var txt = document.createTextNode(c);
  var span = document.createElement("span");
  span.className = "tomoe-char";
  span.appendChild(txt);

  var txt2 = document.createTextNode(p);
  var span2 = document.createElement("span");
  span2.appendChild(txt2);
  span2.className = "tomoe-prob";

  div.appendChild(span);
  div.appendChild(span2);

  var self = this;
  var idx = this.resultNum;
  div.onmouseover = function(event) { self.highlight(idx); }
  div.onclick = function(event) { 
    self.sendFeedback(c); 
    self.textInput.value += c;
    self.clear(); 
  }

  this.resultNum++;
  this.resultArea.appendChild(div);
}

TOMOE.prototype.highlight = function(idx)
{
  var divs = this.resultArea.getElementsByTagName('div');
  for (i = 0; i < divs.length; i++) {
    if (i == idx) {
      divs[i].className = 'tomoe-srs';
    } else {
      divs[i].className = 'tomoe-sr';
    }
  }
}

TOMOE.prototype.createButton = function(label)
{
  var b = document.createElement("input");  
  b.className = "tomoe-button";
  b.value = label;
  b.type  = "button";
  return b;
}

TOMOE.prototype.getExample = function(c)
{
  if (! this.checkXmlHttp()) return;
  this.xmlhttp.open("POST", "tomoeajax.cgi", true);

  var self = this;
  this.xmlhttp.onreadystatechange = function() {
    //    var r = self.xmlhttp.responseText;
    //    if (r == "") {
    //      alert("データがありません");
    //      return;
    //    }
    
    self.readExample(input);
    //    self.read(r);
    self.showResult();
    self.addResult(self.resultChar, "1.0");

    var ok = self.createButton("正解");
    ok.onclick = function() { 
      //      self.sendFeedback2(self.resultChar + " # correct");
      self.clearAll(); 
      self.getExample();
    }
    self.resultArea.appendChild(ok);

    var progress = self.createButton("書きかけ");
    progress.onclick = function() { 
      //      self.sendFeedback2(self.resultChar + " # in_stroke");
      self.clearAll(); 
      self.getExample();
    }
    self.resultArea.appendChild(progress);

    var pending = self.createButton("保留");
    pending.onclick = function() {
      //      self.sendFeedback2(self.resultChar + " # pending");
      self.clearAll(); 
      self.getExample();
    }
    self.resultArea.appendChild(pending);
  };
  this.xmlhttp.send("");
}

TOMOE.prototype.sendFeedback = function(c)
{
  this.xmlhttp.open("POST", "tomoeajaxlog.cgi", true);
  r = this.makeMessage(c);
  this.xmlhttp.onreadystatechange = function() {};
  this.xmlhttp.send(r);
}

TOMOE.prototype.sendStroke = function()
{
  var r = this.makeMessage('_');

  if (! this.checkXmlHttp()) return;

  this.xmlhttp.open("POST", "tomoeajax.cgi", true);

  var self = this;
  this.xmlhttp.onreadystatechange = function() {
    if (self.xmlhttp.readyState == 4 && self.xmlhttp.status == 200) {
      self.showResult();
      var cand = self.xmlhttp.responseText.split('\n');
      for (var i = 0; i < cand.length; i++) {
	if (cand[i] == "") break;
	var l = cand[i].split('\t');
	self.addResult(l[0], l[1]);
      }

      var undo = self.createButton("やり直す");
      undo.onclick = function() { self.clear(); }
      self.resultArea.appendChild(undo);

      var learn = self.createButton("教える");
      learn.onclick = function() { 
	var n = prompt("正解を教えてください", "");
	if (n) {
	 self.sendFeedback(n);
	 self.textInput.value += n;
 	 self.clear();
	} 
      }
      self.resultArea.appendChild(learn); 
    }
  }

  this.xmlhttp.send(r);
}

TOMOE.prototype.mouseup = function(event)
{
  this.trace(event);
  this.finishStroke();
  this.sendStroke();
}

TOMOE.prototype.mousemove = function(event)
{
  this.trace(event);
}

TOMOE.prototype.mousedown = function(event) 
{
  this.active = true;
  this.trace(event);
}

TOMOE.prototype.finishStroke = function()
{
  this.active = false;
  this.point_num = 0;
  this.stroke_num++;
  this.prev_x = -1;
  this.prev_y = -1;
}

TOMOE.prototype.addPoint = function(x, y)
{
  var x2 = x - this.offsetLeft;
  var y2 = y - this.offsetTop;

  if (this.point_num == 0) 
  this.sequence[this.stroke_num] = new Array;

  this.sequence[this.stroke_num][this.point_num] = { x:x2, y:y2 };
  ++this.point_num;

  if (this.prev_x != -1) {
    this.drawLine(this.prev_x, this.prev_y, x, y);
  } else {
    this.drawDot(x, y);
  }  

  this.prev_x = x;
  this.prev_y = y;
}

TOMOE.prototype.trace = function (event)
{
  if (! this.active) return;
  var pos = getPosition(event);
  this.addPoint(pos.x, pos.y);
}

TOMOE.prototype.drawDot = function(x,y)
{
  var dot = document.createElement("span");
  dot.style.left = x  + "px";
  dot.style.top =  y  + "px";
  dot.className = "tomoe-dot";
  this.canvas.appendChild(dot);
}

TOMOE.prototype.drawLine = function(x1,y1,x2,y2) 
{
  if (x1 == x2 && y1 == y2) return;

  var x_move = x2 - x1;
  var y_move = y2 - y1;
  var x_diff = x_move < 0 ? 1 : -1;
  var y_diff = y_move < 0 ? 1 : -1;

  if (Math.abs(x_move) >= Math.abs(y_move)){
    for (var i = x_move; i != 0; i += x_diff) {
      this.drawDot(x2 - i, y2 - Math.round(y_move * i / x_move));
    }
  } else {
    for (var i = y_move; i != 0; i += y_diff) {
      this.drawDot(x2 - Math.round(x_move * i / y_move), y2 - i);
    }
  }
}

TOMOE.prototype.makeMessage = function (c)
{
  var r = c;
  r += "\n:" + this.sequence.length + "\n";
  for (var i = 0; i < this.sequence.length; ++i) {
    r += + this.sequence[i].length;
    for (var j = 0; j < this.sequence[i].length; ++j) {
      r += (" (" + this.sequence[i][j].x + " " + this.sequence[i][j].y + ")" );
    }
    r += "\n";
  }

  return r;
}  
