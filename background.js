//var sites = JSON.stringify(api);
var map = {};
var sites = "";
var time = "";
// var dummy = 
// {
//   {
//     "name" : "utsav",
//     "total_time" : "3356"
//   },
//   {
//     "name" : "asdf",
//     "total_time" : "3356"
//   }
// }
// var currTime = Date.parse(new Date())
// var startTime = Date.parse(localStorage.startTime)
// var delta = (currTime - startTime) / (1000 *  60)
function sendRequest(){
  if(map){
    var request = new XMLHttpRequest();
   request.open("POST", "http://127.0.0.1:5000/api/yolo/", true);
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   //console.log(typeof(map));
   request.send(JSON.stringify(map));
  }
  
}

function sendReporst(){
  if(map){
    for(var x in map.keys()){
      console.log(x);
    }
  }
}
 
class time_intervals {
  constructor(then,now){
    this.then = then;
    this.now = now;
  }
}
class Siteold {
  constructor(name,time_intervals,total_time){
    this.name = name;
    this.time_intervals = time_intervals;
    this.total_time = total_time;
  }
}

class Site {
  constructor(name,total_time){
    this.name = name;
    this.total_time = total_time;
  }
}

var currentSite = null;
var currentSiteStartTime = null;
//var prev = null;



chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    //console.log("onUpdated "+new Date());
    currentTimeUpdate();
  }
);


chrome.tabs.onActivated.addListener(
  function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      //console.log("onActivated"+new Date());
      setCurrent(tab.url);
      //setCurrentFocus(tab.url);
    });
  }
);


chrome.windows.onFocusChanged.addListener(
  function(windowId) {
    //console.log("onFocusChanged"+new Date());
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
      setCurrent(null);
      //console.log("walked away from chrome");
      return;
    }
    currentTimeUpdate();
  }
);

function updateAPIold(){
  if(currentSite!=null && currentSite.length>=1){
    var initial = map[currentSite] || null;
    var now = Date.parse(new Date());
    var then = Date.parse(currentSiteStartTime);
    var diff = (now - then)/(1000*60);
    var timeobj = new time_intervals(then,now);
    if(initial==null){
      var siteobj = new Site(currentSite,null,diff);
      siteobj.time_intervals = siteobj.time_intervals || [];
      siteobj.time_intervals.push(timeobj);
      map[currentSite] = siteobj;
    }else{
      initial.time_intervals.push(timeobj);
      initial.total_time = initial.total_time + diff;
      map[currentSite] = new Site(currentSite,initial.time_intervals,initial.total_time);
    }
    
  }
  currentSite = null;
}

function updateAPI(){
  if(currentSite!=null && currentSite.length>=1){
    var initial = map[currentSite] || null;
    var now = Date.parse(new Date());
    var then = Date.parse(currentSiteStartTime);
    var diff = (now - then)/(1000*60);
    //var timeobj = new time_intervals(then,now);
    if(initial==null){
      var siteobj = new Site(currentSite,diff);
      //siteobj.time_intervals = siteobj.time_intervals || [];
      //siteobj.time_intervals.push(timeobj);
      map[currentSite] = siteobj;
    }else{
      //initial.time_intervals.push(timeobj);
      initial.total_time = initial.total_time + diff;
      map[currentSite] = new Site(currentSite,initial.total_time);
    }
    
  }
  currentSite = null;
}
function currentTimeUpdate(){
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      var url = tabs[0].url;
      chrome.windows.get(tabs[0].windowId, function(win) {
        if (!win.focused) {
          url = null;
        }
        setCurrent(url);
      });
      //console.log(url);
    }
  });
}

function setCurrent(url){
  updateAPI();
  if(url==null){
    currentSite = null;
    currentSiteStartTime = null;
  }else{
    currentSite = trim(url);
    currentSiteStartTime = new Date();
  }
  //console.log(url);
}

function trim(url){
  var match = url.match(/(:\/\/www\.|:\/\/)[a-zA-Z0-9]*\./);
  if(match){
    match = match[0];
    if(match.indexOf("www")!=-1){
      match = match.split("www.")[1];
      match = match.split(".")[0];
    }else{
      match = match.split("://")[1];
      match = match.split(".")[0];
    }
    return match;
  }
  return "";
}

function makeString(){
  sites = "";
  time = "";
  if(map){
    for(var ix in map){
      sites = sites +','+ix;
    }
    for(var ix in map){
      time = time +','+ map[ix].total_time;
    }
  }
  //return str.substring(1);
}

var tabId = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js got a message");
        makeString();
        new Image().src = 'http://127.0.0.1:5000/api/yolo?'+'sites='+sites.substring(1)+'&time='+time.substring(1);
        console.log(request);
        map = [];
        sendResponse("Successful");
    }
);