var $ = function(str, el){ return (el || document).querySelector(str); },
    $$ = function(str, el){ return (el || document).querySelectorAll(str); };

function selectValue(select, value){
  var options, option, selected, i, l;
  if(select && value){
    options = select.querySelectorAll('option[value]');
    l = options.length;
    selected = select.querySelector('option[value="'+value+'"]');
    if(selected){
      for(i = 0; 1 < l; i++){
        if(options[i] == selected){
          select.selectedIndex = i;
          break;
        }
      }
    }
  }
}
function saveOptions() {
  //RG3.storage.set('enabled',!!$('input[name="enabled"]').checked);
  RG3.storage.set('hideContextMenu',!!$('input[name="hide_context_menu"]').checked);
  RG3.storage.set('showCaptions',!!$('input[name="show_captions"]').checked);
  RG3.storage.set('disableTheater',!!$('input[name="disable_theater"]').checked);
  RG3.storage.set('opacity',$('input[name="opacity"]').value > 100 ? 100 : ($('input[name="opacity"]').value < 10 ? 10 : $('input[name="opacity"]').value));
  RG3.storage.set('delay',$('input[name="delay"]').value > 5000 ? 5000 : ($('input[name="delay"]').value < 0 ? 0 : $('input[name="delay"]').value));
  RG3.storage.set('fadeInDuration',$('input[name="fadeInDuration"]').value > 1000 ? 1000 : ($('input[name="fadeInDuration"]').value < 0 ? 0 : $('input[name="fadeInDuration"]').value));
  RG3.storage.set('fadeOutDuration',$('input[name="fadeOutDuration"]').value > 1000 ? 1000 : ($('input[name="fadeOutDuration"]').value < 0 ? 0 : $('input[name="fadeOutDuration"]').value));
  RG3.storage.set('enableShortcut', $('select[name="enable_shortcut"]').value);
  RG3.storage.set('forceZoomKey', $('select[name="force_zoom_key"]').value);
  RG3.storage.set('forceHideKey', $('select[name="force_hide_key"]').value);
  RG3.storage.set('debug',!!$('input[name="debug"]').checked);
  chrome.extension.getBackgroundPage().updateTabs();
  restoreOptions();
}
function restoreOptions(){
  //$('input[name="enabled"]').checked = RG3.storage.get('enabled') !== false;
  $('input[name="hide_context_menu"]').checked = RG3.storage.get('hideContextMenu') === true;
  $('input[name="show_captions"]').checked = RG3.storage.get('showCaptions') !== false;
  $('input[name="disable_theater"]').checked = RG3.storage.get('disableTheater') === true;
  $('select[name="enable_shortcut"]').value = RG3.storage.get('enableShortcut') || 90;
  $('select[name="force_zoom_key"]').value = RG3.storage.get('forceZoomKey') || -1;
  $('select[name="force_hide_key"]').value = RG3.storage.get('forceHideKey') || -1;
  $('input[name="opacity"]').value = RG3.storage.get('opacity') || 100;
  $('input[name="delay"]').value = (RG3.storage.get('delay') || 0);
  $('input[name="fadeInDuration"]').value = (RG3.storage.get('fadeInDuration') || RG3.storage.get('fadeInDuration') === 0 ? RG3.storage.get('fadeInDuration') : 0);
  $('input[name="fadeOutDuration"]').value = (RG3.storage.get('fadeOutDuration') || RG3.storage.get('fadeOutDuration') === 0 ? RG3.storage.get('fadeOutDuration') : 0);
  $('input[name="debug"]') && ($('input[name="debug"]').checked = RG3.storage.get('debug') === true);
}    
function defaultOptions(){
  RG3.storage.set('exposedSettings', false);
  $('.settings-overlay').style.display = 'block';
  //$('input[name="enabled"]').checked = true;
  $('input[name="show_captions"]').checked = true;
  $('input[name="hide_context_menu"]').checked = false;
  $('input[name="disable_theater"]').checked = false;
  $('select[name="enable_shortcut"]').value = 90;
  $('select[name="force_zoom_key"]').value = -1;
  $('select[name="force_hide_key"]').value = -1;
  $('input[name="opacity"]').value = 100;
  $('input[name="delay"]').value = 0;
  $('input[name="fadeInDuration"]').value = 0;
  $('input[name="fadeOutDuration"]').value = 0;
  $('input[name="debug"]') && ($('input[name="debug"]').checked = false);
  saveOptions();
}

function exposeSettings(){
  RG3.storage.set('exposedSettings', true);
  $('.settings-overlay').style.display = 'none';
}

function showSection(id){
  var i,l,navItems = $$('body > section > nav > *'),
    sections = $$('body > section > section');
  for(i = 0, l = navItems.length; i < l; i++){
    navItems[i].className = navItems[i].className.replace(/\s?selected/,'');
    sections[i].className = sections[i].className.replace(/\s?selected/,'');
  }
  $('#'+id).className = $('#'+id).className+' selected';
  $('#'+id+'_nav').className = $('#'+id+'_nav').className+' selected';
}


RG3.util.addEvent(window, 'hashchange', function(e){
  showSection(location.hash.replace(/^\#/,''));
});

RG3.util.addEvent(window, 'load', function(e){
  restoreOptions();
  
  if(RG3.storage.get('exposedSettings')){
    exposeSettings();
  }
  
  var i,l,navItems = $$('body > section > nav > a'), sections = $$('body > section > section');
  navItems[0].className = navItems[0].className+' selected';
  sections[0].className = sections[0].className+' selected';
  if(location.hash){
    showSection(location.hash.replace(/^\#/,''));
  }
  
  var spans = $$('#settings fieldset label + span');
  for(i = 0, l = spans.length; i < l; i++){
    var span = spans[i], input = $('input[type="range"]', span);
    if(input){
      var val = RG3.util.newElement('span',{'html':input.value});
      RG3.util.addEvent(input, 'change', function(e){
        var input = e.target,
          span = $('input[type="range"] + span', e.target.parentNode);
        RG3.util.setProperty(span, 'html',input.value);
      });
      span.appendChild(val);
    }
  }

  if(document.getElementById('viewdebug')){
    RG3.util.addEvent(document.getElementById('viewdebug'), 'click', function(e){
      chrome.extension.getBackgroundPage().openDebugLog();
    });
  }

  document.getElementById('advanced_cancel') && RG3.util.addEvent(document.getElementById('advanced_cancel'), 'click', defaultOptions);
  document.getElementById('advanced_save') && RG3.util.addEvent(document.getElementById('advanced_save'), 'click', saveOptions);
  document.getElementById('advanced_expose') && RG3.util.addEvent(document.getElementById('advanced_expose'), 'click', exposeSettings);

});
    
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22980224-1']);
_gaq.push(['_trackPageview']);
_gaq.push(['_setSampleRate', '1']); //sets sampling rate to 1%

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();