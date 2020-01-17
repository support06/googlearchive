/*
*
* Copyright 2008 Google
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/

/**
 * @author Steffen Meschkat (mesch@google.com)
 *
 * @fileoverview Utility functions used to manage application state.
 */


function recordExternalState(name, value) {
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  currentExternalState[name] = value;
}

function getExternalState(name) {
  var re = new RegExp("\\b" + encodeURIComponent(name) + "=([^;]*)");
  var values = re.exec(document.cookie);
  return values ? decodeURIComponent(values[1]) : null;
}

function detectExternalStateChange(name, load) {
  var currentValue = null;
  window.setInterval(function() {
    var externalValue = getExternalState(name);
    if (currentValue !== externalValue) {
      currentValue = externalValue;
      load(currentValue);
    }
  }, 100);
}

function urlQuery(window) {
  return window.location.search.substring(1);
}
