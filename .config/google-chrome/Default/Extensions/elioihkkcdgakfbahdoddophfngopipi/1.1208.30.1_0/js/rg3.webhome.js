chrome.extension.sendRequest(
  {'name':'getExtDetails'},
  function(response){
    var el = document.createElement('div');
    el.id = '__fbpzinstalled__';
    el.style.display = 'none';
    el.className = 'ext-installed';
    if(response){
      el.setAttribute('data-version', String(response.version));
      el.setAttribute('data-id', response.id);
    }
    document.body.appendChild(el);
  }
);
