$(function(){$("title").text(chrome.i18n.getMessage("diff_title"));$("#diff_in_progress").text(chrome.i18n.getMessage("diff_progress"));initiateDiff(atob(window.location.hash.substr(1)))});
