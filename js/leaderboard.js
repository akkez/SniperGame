$(function() {
	var refreshTable = function() {
		var hash = location.hash.substr(1);
		var src = [];
		var all = JSON.parse(localStorage.game);
		switch (hash) {
			case '1': 
				src = all['1']; 
				break;
			case '2': 
				src = all['2']; 
				break;
			case '3': 
				src = all['3']; 
				break;
		}
		src.sort(function (a, b) {
			if (a.score > b.score) {
				return -1;
			}
			if (a.score < b.score) {
				return 1;	
			}
			return 0;
		});
		console.log(src);
		var table = $(".table");
		table.find(".row").remove();
		for (var i = 0; i < src.length; i++) {
			var row = $("<tr class='row'></tr>");
			$("<td>" + (i + 1) + "</td>").appendTo(row);
			$("<td>" + src[i].name + "</td>").appendTo(row);
			$("<td>" + src[i].score + "</td>").appendTo(row);
			row.appendTo(table);
		}
		if (src.length == 0) {
			$(".chooser").css('display', 'block');
			$(".table").css('display', 'none');
		} else {
			$(".chooser").css('display', 'none');
			$(".table").css('display', 'block');
		}
	};

	refreshTable();
	$(window).on('hashchange', refreshTable);
});