
// Some global variables we use. Not the best thing ever, but gets the job done
// for now.
var interval;
var globalEvent = null;
var mouseUpInterval;
var menuDiv;


/**
 * Hides the 'get directions' button.
 */
function hideDirectionsButton() {
  window.clearInterval(interval);
  menuDiv.style.display = "none";
}


/**
 * Executes the callback only if the text represents an address.
 * This is the method that communicates with the background page in order to
 * geocode this string and see if it's something we know about.
 * @param {string} text The text we are trying to geocode.
 * @param {Function} callback Call if the text is an address.
 */
function executeIfAddress(text, callback) {
  chrome.extension.sendRequest({greeting: "" + text}, function(response) {
    if (response != "") {
      callback(response);
    }
  });
}


/**
 * Returns the html to display a menu item.
 * @param {string} icon The name of the image file to use as an icon.
 * @param {string} text The text to use as the menu item.
 * @param {string} link Where should we take the user.
 */
function getMenuItemHtml(icon, text, link) {
  console.log(icon + ' ' + text + ' ' + link);
  return '<a href="' + link + '" target="_blank">' +
    '<img src="' + chrome.extension.getURL(icon) +
    '" align="absmiddle" height="25" width="25" border="0"></a>&nbsp;' +
    '<a class="select_get_a" href="' + link + '" target="_blank">' +
    text +
    '</a>&nbsp;';
}


/**
 * Tries to evaluate whether a text is a potential address or not. These are
 * some heuristics so that we make sure we don't just send requests for very
 * random blobs of text.
 * @param {string} text The string we want to evaluate.
 * @return {boolean} True if the text could potentially be an address.
 */
function isPotentialAddress(text) {
  text = text.replace(",", "");
  text = text.replace(/[ ]+/, " ");
  
  // An address has to have at least some numbers.
  if (!text.match(/[0-9]+/)) {
    return false;
  }
  
  //An address has to have at least some letters in it too.
  if (!text.match(/[a-zA-Z]+/)) {
    return false;
  }
  
  // An address has to have at least 3 words, but no more than 15)
  var wordCount = text.split(" ").length;
  if (wordCount < 3 || wordCount > 15) {
    return false;
  }
  
  return true;
}


/**
 * Maybe display a directions button next to the highlighted text.
 * @param {number} x The x position where to display this.
 * @param {number} y The y position where to display this.
 * @param {string} text The text to display.
 * @return
 */
function maybeDisplayDirections(x, y, text) {
  window.clearInterval(interval);

  if (!isPotentialAddress(text)) {
    return;
  }
  
  executeIfAddress(text, function(addr) {
    menuDiv.style.left = x + 'px';
    menuDiv.style.top = y + 'px';

    // Writing the menu like this is a bit ugly.
    menuDiv.innerHTML =
      getMenuItemHtml('marker.png', 'Show on map',
                      'http://maps.google.com/maps?q=' + addr + '&z=14') +
      '<hr size="1">' +
      getMenuItemHtml('maps_up25x25.png', 'Get directions to here',
                      'http://maps.google.com/maps?f=d&daddr=' + addr +
                      '&q=' + addr + '&z=14');
    menuDiv.style.display = "block";

    interval = window.setInterval(hideDirectionsButton, 3000);
  });
}


/**
 * Handler for the mouse up event. We need this in order to delay the showing of
 * the menu so that the selection is already done.
 * This fixes the bug where sometimes the menu would pop up when deselecting an
 * address because window.getSelection thought there was still something
 * selected.
 */
function maybeReactToMouseUpEvent() {
  window.clearInterval(mouseUpInterval);
  if (globalEvent == null) {
    return;
  }
  var selection = window.getSelection();
  if (selection.toString() != '') {
    maybeDisplayDirections(globalEvent.pageX, globalEvent.pageY,
                           selection.toString());
  } else {
    hideDirectionsButton();
  }
  globalEvent = null;
}


/**
 * Attaches the listener for when the user selects something.
 * @param {Element} body The body of the document.
 */
function attachSelectListener(body) {
  body.addEventListener('mouseup', function(event) {
    globalEvent = event;
    mouseUpInterval = window.setInterval(maybeReactToMouseUpEvent, 200);
  });
}


/**
 * Called first thing when the page loads. Creates the menu div and attaches it
 * to the page.
 * Also attaches the listener for mouseup.
 */
function main() {
  menuDiv = document.createElement('div')
  // This here is a bit ugly.
  menuDiv.setAttribute('id', 'directions_extension');
  menuDiv.style.position = "absolute !important";

  menuDiv.style.background = "#EEEEFF !important";
  menuDiv.style.border = "1px solid #AAAAFF !important";
  menuDiv.style.padding = "3px !important";
  menuDiv.style.display = "none";
  menuDiv.style['-webkit-border-radius'] = "5px !important";

  document.body.appendChild(menuDiv);

  attachSelectListener(document.body);
}


main();
