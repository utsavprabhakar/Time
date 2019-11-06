'use strict';
var cur = window.location.href;
console.log(cur);
if(cur.includes("reports")){
	chrome.runtime.sendMessage({sync: "sync"}, function(response) {
  	console.log(response);
    alert(response);
	})
}

// var sites = [];
// sites.push("http://flutter.io");
// sites.push()
// window.location.href = "http://flutter.io";

// try{
//   var today = new Date();
//   var year = today.getFullYear();
//   var month = today.getMonth()+1;
//   var date = today.getDate();
//   var hours = today.getHours()
//   var minutes = today.getMinutes();
//   var seconds = today.getSeconds();
//   chrome.runtime.sendMessage({site:cur,year:year, month:month,date:date,hours:hours,minutes:minutes,seconds:seconds}, function(response) {
//   alert("Time starts now... use it wisely");
  
//   });
// }catch(err){
//   alert("Oh shit here we go again!");
// }

//   // //console.log("asdf");
//       var timer =  setInterval(function(){

//         try{
//           var button = document.createElement("button");
//           button.innerHTML = "Capture the world";
//           button.style.zIndex = 10000000;
//           // 2. Append somewhere
//           var body = document.querySelectorAll("._3lq69")[0];
//           // 3. Add event handler
//           body.appendChild(button);
//           console.log("ASDfa");
//           button.addEventListener ("click", function() {
//           console.log("yo");
//           getAllNumbers();
//           //clearInterval(t);
//           });
//           clearInterval(timer);

//          // body.appendChild(button);


//        }catch(err){

//        }
//         },1000);



// /* Read 

// https://css-tricks.com/use-button-element/
// */
//  	//getAllNumbers();
// //trim("+919818992765");

// function getAllNumbers(){
// 	var x = document.querySelectorAll('#main header span')[2].innerText.split(' ').join("").split(",");


//   var group_name = document.querySelectorAll('#main header span')[1].innerText;
//         var room = Math.round(Math.random()*1000000);
//         alert("Sent to Room No."+room);
//   //console.log(y);
// 	chrome.runtime.sendMessage({data: x,room :room , group_name: group_name}, function(response) {
//   //console.log(response);
//   alert(response);

//   })

// };


