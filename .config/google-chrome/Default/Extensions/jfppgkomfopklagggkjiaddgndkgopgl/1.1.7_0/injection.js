// Copyright 2010 Google Inc. All Rights Reserved.

function injection() {

  var MSG_TRANSLATE_HEADER = '{{$translateHeader}}';

  // Language the user wants to translate to
  var userLang = '{{$userLang}}';

  // Customizable background color
  var backgroundColor = '{{$color}}';

  // Unique identifiers only used by this extension
  // Generated pseudo-randomly
  var uid = 'd548dfa5db077c5ec1b2a81c53ad7b57';
  var teId = 'STE_' + uid;
  var cbId = 'STECB_' + uid;
  var ipId = 'STEIP_' + uid;

  // Most of these CSS selectors contains multiple comma delimited selectors.
  // This allows us to support both the old CSS classes and new ones before the
  // new ones actually roll out.

  // This is the main content node of a post, it's sibling contains the
  // comment, share, etc links.
  // TODO(jestelle) current if not found, nothing works - lets have a fallback
  // based on dom structure
  var POSTS_QUERY = '.Gm, .ci';
  // This is the sibling of above, with the comment, share, etc links to
  // which we add a "Translate" link
  // If we can't find this, we use the parent node of the post. This should
  // work, just not quite as nicely.
  var POST_CONTROL_TARGET = '.GA, .rE';
  // Main comment node - first child is a link to the profile picture of the
  // commentor. Includes both the name of the commentor, the content, and the +1
  // etc UI (where we'll put the control)
  // TODO(jestelle) currently if not found, nothing works - lets have a fallback
  // based on dom structure
  var COMMENTS_QUERY = '.le, .Ae';
  // This is a child of the main comment node with the actual text content of
  // the comment.
  var COMMENTS_TRANSLATE_TARGET = '.Si, .Mi';
  // This is a hidden eventual child of the above, that includes the plus one
  // button. This is where we'll put the control.
  // If we can't find this, we'll just use the comment node itself. This should
  // work, just not quite as nicely.
  var COMMENT_CONTROL_TARGET = 'button';
  // Main container of the stream, used to listen for DOM changes
  // If we can't find this, we use body - which should work, just may require a
  // little more CPU listening to DOM events.
  var STREAM_CONTAINER_QUERY = '#contentPane';

  // Right hand column, we'll put our translate everything thing here.
  // This is a sibling to the stream container above.
  // If we can't find this, we put it at the bottom of the body - less visible
  // but everything will work fine
  var RIGHT_SIDE_COLUMN = '.ksa.a-f-e, .hxa.a-f-e';


  // Helper function to go up from an element and find the element ID by
  // searching up for an element until we find a node with an id starting with
  // "updated-". We use the rest of the id as the post id.
  function getPostId(element) {
    if (element && element.id &&
        (element.id.indexOf('update-') == 0)) {
      return element.id.substr(7);
    } else if (element && element.parentNode) {
      return getPostId(element.parentNode);
    }
    return undefined;
  }

  // Helper function to go up from an element and find the comment ID by
  // searching up for an element starting with the post ID. We use the entire id
  // of that element as the comment id.
  function getCommentId(element, opt_postId) {
    var postId = opt_postId;
    if (!postId) postId = getPostId(element);
    if (element && element.id &&
        (element.id.indexOf(postId) == 0)) {
      return element.id;
    } else if (element && element.parentNode) {
      return getCommentId(element.parentNode, postId);
    }
    return undefined;
  }

  function debug_log(msg) {
    if (localStorage['translate-debug']) {
      window.console.log(msg);
    }
  }
  debug_log('Debug on');

  // We use this variable as a timer to throttle updating the page, so if a ton
  // of DOM nodes are inserted at once, we don't fire our code a ton of times,
  // just once, after it's done
  var onDomInsertedTimer = undefined;

  var nodeListenTarget = document.querySelector(STREAM_CONTAINER_QUERY);
  if (!nodeListenTarget) nodeListenTarget = document.body;

  // TODO(jestelle): Coming in Chrome 18 - fix this to properly test for the
  // existence of this new API and use it if it's there
  /*
  if (WebKitMutationObserver) {
    var observer = new WebKitMutationObserver(function(mutations) {
      if (window[teId]) {
        mutations.forEach(function(mutation) {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            var newNode = mutation.addedNodes[i];
            if (newNode && newNode.querySelector &&
                (newNode.querySelector(COMMENTS_QUERY) ||
                 newNode.querySelector(POSTS_QUERY))) {
              if (onDomInsertedTimer) {
                clearTimeout(onDomInsertedTimer);
              }

              onDomInsertedTimer = setTimeout(function () {
                markUpPage();
                window[teId].update();

                onDomInsertedTimer = null;
              }, 300);
            }
          }
        })
      }
    });
    observer.observe(nodeListenTarget, { childList: true });
  } else {
  */
    nodeListenTarget.addEventListener(
        'DOMNodeInserted', function (e) {
      if (window[teId]) {
        if (e.target && e.target.querySelector &&
            (e.target.querySelector(COMMENTS_QUERY) ||
             e.target.querySelector(POSTS_QUERY))) {
          if (onDomInsertedTimer) {
            clearTimeout(onDomInsertedTimer);
          }

          onDomInsertedTimer = setTimeout(function () {
            markUpPage();
            window[teId].update();

            onDomInsertedTimer = null;
          }, 300);
        }
      }
    });
  //} // End of the commented out WebKitMutationObserver if above

  setInterval(function () {
    if (!onDomInsertedTimer && window[teId]) {
      markUpPage();
      window[teId].update();
    }
  }, 10000);

  // Main function that marks up the page then adds a sectional element
  function markUpPage() {
    debug_log('Looking for nodes to translate...');

    // Find all posts (based on class name)
    var posts = document.querySelectorAll(POSTS_QUERY);
    for (var i = 0; i < posts.length; i++) {
      var postId = getPostId(posts[i]);

      var beforeMe = null;

      // Create control to translate post
      var newControl = document.createElement('span');
      newControl.className = 'goog-trans-control';
      newControl.setAttribute('forTransId', postId);
      var controlTarget =
          posts[i].parentNode.querySelector(POST_CONTROL_TARGET);
      // If we can't find the place to put the control, just use the post
      // parent node.
      if (!controlTarget) {
        controlTarget = posts[i].parentNode;
      }
      // TODO(jestelle): This is probably always the case at this point...
      // clean it up
      if (controlTarget.getAttribute('role') == 'button') {
        newControl.className += ' goog-trans-post';
        beforeMe = controlTarget;
        controlTarget = controlTarget.parentNode;
      } else {
        newControl.className += ' goog-trans-withdash';
      }
      // See if we've already added a control, if not, we can add the new one
      var checkExists = controlTarget.querySelector('.goog-trans-control');
      if (!checkExists) {
        if (beforeMe) {
          controlTarget.insertBefore(newControl, beforeMe);
        } else {
          controlTarget.appendChild(newControl);
        }
      }

      // Make the post ready to be translated by that above control
      // by adding a class name, but only add it if it hasn't yet been added
      if (posts[i].className.indexOf('goog-trans-target') == -1) {
        posts[i].className = posts[i].className + " goog-trans-target";
      }
      posts[i].setAttribute('transId', postId);
    }

    // Find all comments, based on class name
    var comments = document.querySelectorAll(COMMENTS_QUERY);
    for (var i = 0; i < comments.length; i++) {
      var commentId = getCommentId(comments[i]);
      // If we can't find a comment ID, skip this one.
      // This typically happens when editing a comment.
      if (!commentId) continue;

      // Create control to translate the comment
      var newControl = document.createElement('span');
      newControl.className = 'goog-trans-control goog-trans-withdash';
      newControl.setAttribute('forTransId', commentId);
      var controlTarget =
          comments[i].querySelector(COMMENT_CONTROL_TARGET);
      // Control target's CSS selector could select either the +1 button itself
      // or the parent node of the +1 button. What we want is the parent node,
      // so if we found a button, get it's parent
      if (controlTarget.tagName.toLowerCase() == 'button') {
        controlTarget = controlTarget.parentNode;
      }
      // If we can't find the place to put the control, just use the comment
      // node we already found.
      if (!controlTarget) {
        controlTarget = comments[i];
      }
      // See if we've already added a control, if not, we can add the new one
      var checkExists = controlTarget.querySelector('.goog-trans-control');
      if (!checkExists) {
        controlTarget.appendChild(newControl);
      }

      // Make the comment ready to be translated by that above control
      var commentTarget = comments[i].querySelector(COMMENTS_TRANSLATE_TARGET);
      if (!commentTarget) commentTarget = comments[i];

      if (commentTarget.className.indexOf('goog-trans-target') == -1) {
        commentTarget.className = commentTarget.className + " goog-trans-target";
      }
      commentTarget.setAttribute('transId', commentId);
    }
  }

  // Returns a new SectionalElement, after marking up the page with what should
  // be translated
  function newElem() {
    // Mark up the page with what should be translated
    markUpPage();

    // Create a primary controller element
    var mainElement = document.createElement('div');
    mainElement.id = 'google_sectional_element';

    var container = document.querySelector(RIGHT_SIDE_COLUMN);
    if (container) {
      var smallContainer = document.createElement('div');
      smallContainer.style.margin = '16px 0 0 20px';

      smallContainer.appendChild(mainElement);
      container.appendChild(smallContainer);

      // This whole column is refreshed sometimes, when it is, we want to make
      // sure our node is always the last node
      container.addEventListener(
            'DOMNodeInserted', function (e) {
              if (container.lastChild != smallContainer) {
                smallContainer.parentNode.removeChild(smallContainer);
                container.appendChild(smallContainer);
              }
            });
    } else {
      document.body.appendChild(mainElement);
    }

    var elem = new google.translate.SectionalElement({
          sectionalNodeClassName: 'goog-trans-target',
          controlNodeClassName: 'goog-trans-control',
          background: backgroundColor,
          relate: 'id'
        }, 'google_sectional_element');

    return elem;
  }

  if (!window.google || !google.translate ||
      !google.translate.TranslateElement) {
    // If we have no business being here, don't do anything
    if (document.querySelector(POSTS_QUERY) == null &&
        document.querySelector(COMMENTS_QUERY) == null) {
      return;
    } else {
      debug_log('Couldn\'t find posts or comments');
    }
    if (!window[cbId]) {
      window[cbId] = function() {
        window[teId] = newElem();
      };
    }
    // Makes sure we don't add the element.js loader twice to the page
    // (see http://b/issue?id=5222418) by only adding it if the window doens't
    // already have a teId and also doesn't have the ipId
    if (!window[teId] && !window[ipId]) {
      window[ipId] = true;
      var s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=' +
              encodeURIComponent(cbId) + '&client=es-ste&ug=section&hl=' +
              userLang;
      document.getElementsByTagName('head')[0].appendChild(s);
    } else {
      markUpPage();
      window[teId].update();
    }
  } else {
    debug_log('Already found');
  }
}

function injector() {
  var s = document.createElement('script');
  s.innerHTML = '{{$content}}';
  document.getElementsByTagName('head')[0].appendChild(s);
}
