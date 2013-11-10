$(function(){
	$('.click-open-extension-page').click(function(){
		top.location.href=chrome.extension.getURL( $(this).data('url'));
	})

	var randomnumber=Math.floor(Math.random()*11);
	if (randomnumber%2==0) {
		var cake = true;
		$('#support').addClass('cake')
	}	
})