$(function() {
	$(".start-link").click(function () {
		$(this).parent().css('display', 'none');
		$(".difficulty-chooser").css('display', 'block');
	}); 
});