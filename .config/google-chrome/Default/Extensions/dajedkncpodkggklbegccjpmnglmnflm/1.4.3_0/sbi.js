// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * Search-by-Image Chrome extension.
 * Help users to use the Search-by-Image features more easily on Chrome.
 * Users can initiate a Search-by-Image option by right clicking any image on
 * a webpage and selecting "Search Google with this image".
 * Users can also move the mouse over an image and click the camera icon button
 * to initiate a search.
 *
 * TODO(howardzhou): Known issues as of version 1.2.0
 * 1. The camera icon does not move with the dynamically generated image during
 *    mouse scroll. (e.g. Clicking on an image on Pinterest.com front page, and
 *    an enlarged image will popup. The camera icon on that image does not move
 *    with the image during mouse scroll.
 * 2. The camera icon is positioned w.r.t. to the image position, but not its
 *    viewable area. As a result, if the bottom part of the image is covered
 *    up by some other element, the camera icon will appear to be floating on
 *    that other element.
 *
 *
 * @author yimingli@google.com (Yiming Li)
 * @author howardzhou@google.com (Howard Zhou)
 */

/**
 * The id of the camera button, which is a actually div element.
 * @private
 * @const
 */
var CAMERA_BUTTON_ID_ = 'sbi_camera_button';

/**
 * The width of the camera button.
 * @private
 * @const
 */
var CAMERA_BUTTON_WIDTH_ = 29;

/**
 * The height of the camera button.
 * @private
 * @const
 */
var CAMERA_BUTTON_HEIGHT_ = 27;

/**
 * The right margin of the camera button.
 * @private
 * @const
 */
var CAMERA_BUTTON_RIGHT_MARGIN_ = 1;

/**
 * The bottom margin of the camera button.
 * @private
 * @const
 */
var CAMERA_BUTTON_BOTTOM_MARGIN_ = 1;

/**
 * The minimum width of the image to show the camera hover button.
 * @private
 */
var img_hover_minimum_width_ = 45;

/**
 * The minimum height of the image to show the camera hover button.
 * @private
 */
var img_hover_minimum_height_ = 45;

/**
 * The option value for the chrome extension.
 * Value "mouseover" for showing the camera button when the mouse cursor hovers
 * over the image.
 * Value "never" for never showing the camera button.
 * @private
 */
var option_;

/**
 * Points to the last active image.
 * @private
 */
var activeImage_ = null;

/**
 * Convert a relative URL to an absolute one, using the browser's internal
 * mechanism.
 * @param {string} url The original URL string.
 * @return {string} The absolute URL string.
 */
function qualifyUrl(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}

/**
 * Finds the position of the given element relative to the document;
 * replacement for .offset() in jQuery.
 *
 * @param {!Element} elem The DOM element in question.
 * @return {{left: !number, top: !number}} The position to find.
 */
function getOffset(elem) {
  var documentElement = elem.ownerDocument.documentElement;
  var win = elem.ownerDocument.defaultView;
  var rect = elem.getBoundingClientRect();
  return {
    left: rect.left + win.pageXOffset - documentElement.clientLeft,
    top: rect.top + win.pageYOffset - documentElement.clientTop
  };
}

/**
 * Returns if the given element has the given CSS class;
 * replacement for .hasClass() in jQuery.
 *
 * @param {!Element} elem The DOM element in question.
 * @param {!string} className The class to search for.
 * @return {boolean}
 */
function hasClass(elem, className) {
  var classList = elem.className.replace(/[\t\r\n]/g, ' ');
  return (' ' + classList + ' ').indexOf(' ' + className + ' ') != -1;
}

/**
 * Mousemove event listener for images. This will show the camera icon.
 * @param {Object} event The mouseover event.
 * @this {Element}
 */
function sbiMouseover(event) {
  // Skip any non-img element.
  if (event.target.tagName !== 'IMG') {
    return;
  }
  chrome.storage.sync.get(['sbi_option', 'sbi_hover_min_dims'],
    /**
     * Callback function for chrome.storage.sync. Get the option values from
     * Chrome Storage API.
     * @param {Object.<{sbi_option, sbi_hover_min_dims}>} items The returned
     *     storage contents, items in their key-value mappings.
     */
    function(items) {
      option_ = items['sbi_option'];
      if (option_ != 'mouseover') {
        return;
      }

      var hoverMinDims = items['sbi_hover_min_dims'];
      if (hoverMinDims === undefined) {
        hoverMinDims = 45;
      }
      img_hover_minimum_width_ = hoverMinDims;
      img_hover_minimum_height_ = hoverMinDims;

      var currentImage = event.target;
      // Skip rendering the camera button for the following cases:
      // 1. Images on the image result page, e.g. <img class="rg_i">.
      // 2. Images inside imagebox_bigimages, e.g. <img class="th">.
      // 3. Images that contain id="imgthumb", e.g. <img id="imgthumb">.
      // 4. Map tiles, e.g. <img class="css-3d-layer">.
      if (hasClass(currentImage, 'rg_i') ||
          hasClass(currentImage, 'th') ||
          (currentImage.getAttribute('id') !== null &&
           currentImage.getAttribute('id').indexOf('imgthumb') == 0) ||
          hasClass(currentImage, 'css-3d-layer')) {
        return;
      }

      var style = window.getComputedStyle(currentImage, null);
      var height = currentImage.clientHeight;
      var width = currentImage.clientWidth;
      // Ignore too small images and hidden images.
      if (height < img_hover_minimum_width_ ||
          width < img_hover_minimum_height_ ||
          style.getPropertyValue('display') == 'none') {
        return;
      }

      var currentImageOffset = getOffset(currentImage);
      var left = currentImageOffset.left +
          parseFloat(style.paddingLeft) +
          width -
          CAMERA_BUTTON_RIGHT_MARGIN_ -
          CAMERA_BUTTON_WIDTH_;
      var top = currentImageOffset.top +
          parseFloat(style.paddingTop) +
          height -
          CAMERA_BUTTON_BOTTOM_MARGIN_ -
          CAMERA_BUTTON_HEIGHT_;

      var cameraLinkDiv = document.getElementById(CAMERA_BUTTON_ID_);
      cameraLinkDiv.style.top = top.toString() + 'px';
      cameraLinkDiv.style.left = left.toString() + 'px';
      cameraLinkDiv.style.cursor = 'pointer';
      cameraLinkDiv.style.display = 'inline';

      // getAttribute() does not automatically convert a relative URL to an
      // absolute one, so we need to add this extra step here.
      cameraLinkDiv.src = qualifyUrl(
          /** @type {string} */ (currentImage.getAttribute('src')));
      activeImage_ = currentImage;
    }
  );
}

/**
 * Mouseleave event listener for images. This will hide the camera icon when
 * the mouse leaves the image, but only when it is detected that the mouse
 * is leaving the boundaries of the image. Otherwise, if the mouse is on the
 * camera icon, there is flickering.
 * @param {Object} event The mouseout event.
 */
function sbiMouseout(event) {
  if (activeImage_ == null) {
    return;
  }

  var imageTop = getOffset(activeImage_).top;
  var imageLeft = getOffset(activeImage_).left;
  var style = window.getComputedStyle(activeImage_, null);
  var imageWidth = parseFloat(style.getPropertyValue('width'));
  var imageHeight = parseFloat(style.getPropertyValue('height'));

  var mouseTop = event.pageY;
  var mouseLeft = event.pageX;

  if (mouseTop <= imageTop || mouseTop >= imageTop + imageHeight ||
      mouseLeft <= imageLeft || mouseLeft >= imageLeft + imageWidth) {
    var cameraLinkDiv = document.getElementById(CAMERA_BUTTON_ID_);
    cameraLinkDiv.style.display = 'none';
  }
}

/**
 * Queries Google Image Search depending on the content of the image tag.
 * @param {!boolean} selected Whether to select/highlight the newly created
 *     search result tab.
 */
function sbiQueryImageSearch(selected) {
  chrome.extension.sendMessage({
      'action': 'sbiSearch',
      'url': qualifyUrl(activeImage_.getAttribute('src')),
      'selected': selected,
      // This request was triggered by a user clicking the hover camera button.
      'source': 'camera_button'
  });
}

window.addEventListener('load',
  /**
   * The window load event listener. It will be triggered when Chrome starts.
   */
  function(event) {
    var target = event.target;
    if (target instanceof HTMLDocument &&
        // Ignore any inner frame element.
        !target.defaultView.frameElement) {
      // Bind the mouseover and mouseout event.
      document.addEventListener('mouseover', sbiMouseover, true);
      document.addEventListener('mouseout', sbiMouseout, true);

      var cameraLinkDiv = document.createElement('div');
      cameraLinkDiv.setAttribute('id', CAMERA_BUTTON_ID_);
      cameraLinkDiv.setAttribute('class', 'sbi_search');
      cameraLinkDiv.setAttribute('style',
          'left:0px;top:0px;' +
          'position:absolute;width:' +
          CAMERA_BUTTON_WIDTH_ +
          'px;height:' + CAMERA_BUTTON_HEIGHT_ +
          'px;border:none;' +
          'margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;' +
          'z-index:2147483647;' +
          'display:none;'
      );
      cameraLinkDiv.onclick = function(e) {
        // Capture ctrl-click and middle-click to create a tab in the background
        // and just on the right side of the current active tab. This behavior
        // is consistent with the effect of middle-click and ctrl-click on a
        // link element.
        if (e.ctrlKey ||  /* ctrl-click */
            e.button & 1  /* middle-click */) {
          sbiQueryImageSearch(false);
        } else {
          sbiQueryImageSearch(true);
        }
      };

      // Add camera icon to the DOM tree.
      document.getElementsByTagName('body')[0].appendChild(cameraLinkDiv);
    }
  }, false);
