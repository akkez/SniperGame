$(function () {
	var body = $('.border');
	var PI = 3.14159;
	var objectRadius = 60;
	var fieldWidth = 800 - objectRadius, fieldHeight = 540 - objectRadius;
	
	var gameDifficulty = location.hash.substr(1);
	var speed = 5;
	var refreshInterval = 40;
	var gameTime = 12000;
	switch (gameDifficulty) {
		case '1':
			speed = 1;
			break;
		case '2':
			speed = 3;
			break;
		case '3':
		default:
			speed = 5;
			break;
	}
	if (speed == 5) {
		gameDifficulty = '3';
	}
	
	var objects = [];
	var gamePoints = 0;
	var objectCount = 0;
	var gameFinished = false;

	var addObject = function () {
		var obj = {
			x: Math.floor(Math.random() * fieldWidth),
			y: Math.floor(Math.random() * fieldHeight),
			angle: Math.floor(Math.random() * 360),
			update: 30 + Math.floor(Math.random() * 20),
			handle: $("<div class='object' data-id=" + objectCount + "><div class='inner'></div></div>").appendTo(body),
			isDisabled: 0
		};
		objects.push(obj);
		objects[objectCount].handle.css({top: objects[objectCount].y, left: objects[objectCount].x});
		objectCount++;
	}

	for (var i = 0; i < 10; i++) {
		addObject();
	}
	
	var updateObjects = function() {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].isDisabled) {
				continue;
			}
			objects[i].update--;
			if (objects[i].x < 0 || objects[i].x > fieldWidth || 
				objects[i].y < 0 || objects[i].y > fieldHeight) {
				objects[i].angle += 180;
				if (objects[i].x < 0 || objects[i].x > fieldWidth) {
					objects[i].x += (objects[i].x < 400) ? 15 : -15;	
				}
				if (objects[i].y < 0 || objects[i].y > fieldHeight) {
					objects[i].y += (objects[i].y < 400) ? 15 : -15;	
				}
			} 
			if (objects[i].update <= 0) {
				objects[i].update = 30 + Math.floor(Math.random() * 20);
				objects[i].angle = Math.floor(Math.random() * 360);
			}
			objects[i].x += speed * Math.cos(objects[i].angle * PI / 180);
			objects[i].y += speed * Math.sin(objects[i].angle * PI / 180);
			objects[i].handle.css({top: objects[i].y, left: objects[i].x});
		}

		var timer = Math.floor((gameTime - performance.now()) / 100) / 10;
		$(".timer").text(timer + " с");
		if (timer <= 0) {
			finishGame();
		}
	}
	
	updateObjects();
	var tickFunction = setInterval(updateObjects, refreshInterval);

	var finishGame = function() {
		clearInterval(tickFunction);

		var name = prompt("Игра окончена! Ваш результат: " + gamePoints + "\nВведите ваше имя для таблицы рекордов:", "");
		if (name == null) {
			name = '';
		}
		gameFinished = true;
		var gameData = {
			'1': [],
			'2': [],
			'3': []
		};
		if ('game' in localStorage) {
			gameData = JSON.parse(localStorage['game']);
		}
		gameData[gameDifficulty].push({
			'name': name == '' ? '<не указано>' : name,
			'score': gamePoints,
		});
		localStorage.setItem('game', JSON.stringify(gameData));
		location.href = './leaderboard.html#' + gameDifficulty;
	}

	var clickHandler = function (id, x, y, isBonus) {
		if (objects[id].isDisabled == 1 || gameFinished) {
			return;
		}
		var obj = $(".object[data-id=" + id + "]");
		var dot = $("<div class='dot'></div>").appendTo(obj);
		dot.css({top: y, left: x});
		objects[id].isDisabled = 1;
		objects[id].handle = null;

		var points = 5;
		if (isBonus) {
			var distance = Math.sqrt((x - 30) * (x - 30) + (y - 30) * (y - 30)); 
			points = Math.ceil(15 - distance) + 10;
		}
		var dotTitle = $("<div class='dot-title'>+" + points + "</div>").appendTo(dot);
		obj.css({'background-color': '#B8B8B8', 'border-color': '#999'});

		gamePoints += points;
		$(".score").text(gamePoints);

		setTimeout(addObject, 400);
		setTimeout(function() {
			obj.fadeOut(300, function() {
				obj.remove();	
			});
		}, 1000);
	}

	$(document).on("mousedown", ".object", function(e) {
		var myId = $(this).data("id");
		var xpos = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;
		var ypos = e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY;

		clickHandler(myId, xpos, ypos, false);
		return false;
	});

	$(document).on("mousedown", ".inner", function(e) {
		var myId = $(this).parent().data("id");
		var xpos = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;
		var ypos = e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY;

		clickHandler(myId, xpos + 15, ypos + 15, true);
		return false;
	});

	$(".exit-game").click(function() {
		return confirm("Вы действительно хотите выйти из игры?");
	});
});

