// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function click(e) {
  chrome.tabs.executeScript(null,
      {code:"getAllNumbers()"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
 	getAllNumbers();
});

function getAllNumbers(){
	var x = document.querySelectorAll('#main header span')[2].innerText.split(", ");
	$.ajax(
            {
                  type:'GET',
                  url: "http://localhost:8080/birth",
                  data:encodeURIComponent(JSON.stringify(x)),
                   success: function(data){
                   alert("Welcome to MISSION HELIX !");
                 }
               }
            );
}