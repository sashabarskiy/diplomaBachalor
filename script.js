var canvas = document.getElementsByTagName("canvas")[0],
ctx = canvas.getContext('2d');

var speedInput = document.getElementById("speed");
var maxSpeed = speedInput.value;

document.getElementById('speedButton').onclick = function(){
	maxSpeed = speedInput.value;
}

var copter_x = 50;
var copter_y = 50;
var prev_copter_x = 50;
var prev_copter_y = 50;
var copter_speed = 0;
var copter_direction = [0,0];
var prev_copter_direction = [0,1];
var copter_angle = 0;
var bladeAngle = 0; // угол поворота лопостей
var red_radius = 80;
var min_red_radius = 80;

var target = null;

// линейные неподвижные препядствия

/*
var lines = [
[[10,10],[canvas.width - 10,10]],
[[10,10],[10,canvas.height - 10]],
[[canvas.width - 10,10],[canvas.width - 10,canvas.height - 10]],
[[10,canvas.height - 10],[canvas.width - 10,canvas.height - 10]]
];
*/


/*
var lines = [
[[717,507],[571,129]],
[[247,463],[1747,322]],
[[1747,322],[1477,1750]],
[[1290,1438],[1960,1184]]
];
*/

var zoom = 400;

lines = [
[[1 * zoom,1 * zoom],[4 * zoom,1 * zoom]],
[[1 * zoom,1 * zoom],[1 * zoom,5 * zoom]],
[[5 * zoom,1 * zoom],[6 * zoom,1 * zoom]],
[[8 * zoom,1 * zoom],[7 * zoom,1 * zoom]],
[[8 * zoom,1 * zoom],[8 * zoom,3.5 * zoom]],
[[2 * zoom,1 * zoom],[2 * zoom,2 * zoom]],
[[1 * zoom,3 * zoom],[3 * zoom,3 * zoom]],
[[3 * zoom,4 * zoom],[3 * zoom,2 * zoom]],
[[3 * zoom,2 * zoom],[4 * zoom,2 * zoom]],
[[4 * zoom,2 * zoom],[4 * zoom,3 * zoom]],
[[6 * zoom,1 * zoom],[6 * zoom,2 * zoom]],
[[5 * zoom,2 * zoom],[7 * zoom,2 * zoom]],
[[5 * zoom,2 * zoom],[5 * zoom,4 * zoom]],
[[5 * zoom,4 * zoom],[4 * zoom,4 * zoom]],
[[4 * zoom,4 * zoom],[4 * zoom,6 * zoom]],
[[2 * zoom,6 * zoom],[4 * zoom,6 * zoom]],
[[2 * zoom,6 * zoom],[2 * zoom,4 * zoom]],
[[2 * zoom,5 * zoom],[3 * zoom,5 * zoom]],
[[1 * zoom,6 * zoom],[1 * zoom,8 * zoom]],
[[1 * zoom,7 * zoom],[2.5 * zoom,7 * zoom]],
[[1 * zoom,8 * zoom],[5 * zoom,8 * zoom]],
[[6 * zoom,8 * zoom],[8 * zoom,8 * zoom]],
[[8 * zoom,4.5 * zoom],[8 * zoom,8 * zoom]],
[[7 * zoom,2 * zoom],[7 * zoom,7 * zoom]],
[[7 * zoom,7 * zoom],[3.5 * zoom,7 * zoom]],
[[5 * zoom,7 * zoom],[5 * zoom,5 * zoom]],
[[6 * zoom,6 * zoom],[6 * zoom,5 * zoom]],
[[6 * zoom,5 * zoom],[7 * zoom,5 * zoom]],
[[6 * zoom,4 * zoom],[7 * zoom,4 * zoom]],
[[6 * zoom,4 * zoom],[6 * zoom,3 * zoom]]
// [[ * zoom, * zoom],[ * zoom, * zoom]]
];

// тут будут храниться препядствия
var memory = [];

var ways = [];

// для вычисления оптимального пути
var numbers = [];

var copter_i = 0;
var copter_j = 0;
var target_i = 0;
var target_j = 0;
var way_targets = [];

var ceilSize = 50;

for(let i = 0; i <= canvas.height / ceilSize; i++){
	
	ways.push([]);
	numbers.push([]);
	for(let j = 0; j <= canvas.width / ceilSize; j++){
		ways[i].push(true);
		numbers[i].push(0);
	}

}

// алгорит нахождения оптимального пути
function aStar(){
	if(!target)
		return;
	for(let i = 0; i < numbers.length; i++)
		for(let j = 0; j < numbers[i].length; j++)
			numbers[i][j] = 0;
	copter_i = Math.trunc(copter_y/ceilSize);
	copter_j = Math.trunc(copter_x/ceilSize);
	target_i = Math.trunc(target[1]/ceilSize);
	target_j = Math.trunc(target[0]/ceilSize);

	if(copter_i == target_i && copter_j == target_j)
		return;

	numbers[copter_i][copter_j] = 1;

	var done = false;

	while(!done)
		for(let i = 0; i < numbers.length && !done; i++)
			for(let j = 0; j < numbers[i].length && !done; j++)
				if(numbers[i][j] != 0){
					if(i > 0 && !numbers[i - 1][j] && ways[i - 1][j]){
						numbers[i - 1][j] = numbers[i][j] + 1;
						if(i - 1 == target_i && j == target_j){
							done = true;
							break;
						}
					}
					if(j > 0 && !numbers[i][j - 1] && ways[i][j - 1]){
						numbers[i][j - 1] = numbers[i][j] + 1;
						if(i == target_i && j - 1 == target_j){
							done = true;
							break;
						}
					}
					if(j < numbers[i].length - 1 && !numbers[i][j + 1] && ways[i][j + 1]){
						numbers[i][j + 1] = numbers[i][j] + 1;
						if(i == target_i && j + 1 == target_j){
							done = true;
							break;
						}
					}
					if(i < numbers.length - 1 && j < numbers[i].length - 1 && !numbers[i + 1][j] && ways[i + 1][j]){
						numbers[i + 1][j] = numbers[i][j] + 1;
						if(i + 1 == target_i && j == target_j){
							done = true;
							break;
						}
					}
				}

	// console.log(numbers);

	way_targets = [];

	copter_i = target_i;
	copter_j = target_j;

	// идём обратно и находим минимальные и идём до 1 и запихиваем в way_targets

	while(numbers[copter_i][copter_j] != 1){

		var min_i = copter_i;
		var min_j = copter_j;
		var min = numbers[copter_i][copter_j];

		if(copter_i > 0 && copter_j > 0 && numbers[copter_i - 1][copter_j - 1] && numbers[copter_i - 1][copter_j - 1] < min){
			min_i = copter_i - 1;
			min_j = copter_j - 1;
			min = numbers[copter_i - 1][copter_j - 1];
		}
		if(copter_i > 0 && numbers[copter_i - 1][copter_j] && numbers[copter_i - 1][copter_j] < min){
			min_i = copter_i - 1;
			min_j = copter_j;
			min = numbers[copter_i - 1][copter_j];
		}
		if(copter_i > 0 && copter_j < numbers[copter_i].length - 1 && numbers[copter_i - 1][copter_j + 1] && numbers[copter_i - 1][copter_j + 1] < min){
			min_i = copter_i - 1;
			min_j = copter_j + 1;
			min = numbers[copter_i - 1][copter_j + 1];
		}

		if(copter_j > 0 && numbers[copter_i][copter_j - 1] && numbers[copter_i][copter_j - 1] < min){
			min_i = copter_i;
			min_j = copter_j - 1;
			min = numbers[copter_i][copter_j - 1];
		}
		if(copter_j < numbers[copter_i].length - 1 && numbers[copter_i][copter_j + 1] && numbers[copter_i][copter_j + 1] < min){
			min_i = copter_i;
			min_j = copter_j + 1;
			min = numbers[copter_i][copter_j + 1];
		}

		if(copter_i < numbers.length && copter_j > 0 && numbers[copter_i + 1][copter_j - 1] && numbers[copter_i + 1][copter_j - 1] < min){
			min_i = copter_i + 1;
			min_j = copter_j - 1;
			min = numbers[copter_i + 1][copter_j - 1];
		}
		if(copter_i < numbers.length && numbers[copter_i + 1][copter_j] && numbers[copter_i + 1][copter_j] < min){
			min_i = copter_i + 1;
			min_j = copter_j;
			min = numbers[copter_i + 1][copter_j];
		}
		if(copter_i < numbers.length && copter_j < numbers[copter_i].length - 1 && numbers[copter_i + 1][copter_j + 1] && numbers[copter_i + 1][copter_j + 1] < min){
			min_i = copter_i + 1;
			min_j = copter_j + 1;
			min = numbers[copter_i + 1][copter_j + 1];
		}

		copter_i = min_i;
		copter_j = min_j;

		way_targets.unshift([min_j*ceilSize+ceilSize/2,min_i*ceilSize+ceilSize/2]);


	}


			
}

setInterval(aStar,10000);

function remember(point){
	memory.push(point);
}

var nearzone = 100;

function near(point,pix){
	return Math.abs(point[0] - copter_x) < pix && Math.abs(point[1] - copter_y) < pix;
}

function recall(){
	for(let i = 0; i < memory.length; i++){
		if(near(memory[i][0],nearzone))
			return i;
	}
}

function change(i){
	if(memory[i][1] == "right")
		memory[i][1] = "left";
	else
		memory[i][1] = "right";
}

var sensorsAngles = [];
for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI/8)
	sensorsAngles.push(angle);

var prev_sensorsValues = [];
var sensorsValues = [];
for(let i = 0; i < 16; i++)
	sensorsValues.push(null);

var sensorsSpans = document.getElementsByClassName('sensor');
for(let i = 0; i < 16; i++)
	sensorsSpans[i].innerText = sensorsValues[i];

var sensorsPoints = []
for(let i = 0; i < 16; i++)
	sensorsPoints.push([copter_x + red_radius * Math.sin(sensorsAngles[i]),copter_y + red_radius * Math.cos(sensorsAngles[i])]);

function line(x1,y1,x2,y2){

	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();

}

function normalization(angle){
	angle %= Math.PI * 2;
	if(angle < 0)
		angle += Math.PI * 2;
	if(angle > Math.PI * 2)
		angle -= Math.PI * 2;
	return angle;
}

function distance(x1,y1,x2,y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function isBetween(n,n1,n2){
	return (n >= n1 && n <= n2) || (n >= n2 && n <= n1);
}

function getCrossPoint(x1,y1,x2,y2,x3,y3,x4,y4){
	if(x3 == x4 && x1 == x2)
		return null;
	if(x3 == x4){
		if(!isBetween(x3,x1,x2))
			return null;
		var y = (x3 - x1) * (y2 - y1) / (x2 - x1) + y1;
		if(!isBetween(y,y1,y2) || !isBetween(y,y3,y4))
			return null;
		return [x3,y];
	} else if(x1 == x2) {
		if(!isBetween(x1,x3,x4))
			return null;
		var y = (x1 - x3) * (y4 - y3) / (x4 - x3) + y3;
		if(!isBetween(y,y3,y4) || !isBetween(y,y1,y2))
			return null;
		return [x1,y];
	} else {
		var denominator = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1);
		if(denominator == 0)
			return null;
		var x = ((y3 - y1) * (x2 - x1) * (x4 - x3) + x1 * (y2 - y1) * (x4 - x3) - x3 * (y4 - y3) * (x2 - x1)) / denominator;
		if(!isBetween(x,x1,x2) || !isBetween(x,x3,x4))
			return null;
		var y = (x - x3) * (y4 - y3) / (x4 - x3) + y3;
		if(!isBetween(y,y1,y2) || !isBetween(y,y3,y4))
			return null;
		return [x,y];
	}
}

function angleFromDirection(direction){
	var mod = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
	if(mod == 0)
		return 666;
	direction[0]/=mod;
	direction[1]/=mod;
	var angle = Math.acos(direction[1])
	if(direction[0] >= 0)
		return angle;
	else
		return -angle;
}

function directionFromAngle(angle){
	return [Math.sin(angle),Math.cos(angle)];
}

function isBetweenAngles(angle,angle1,angle2){

	if(angle1 - angle2 > Math.PI/2){
		angle1 -= Math.PI * 2;
		if(angle > angle1 && angle > angle2)
			angle -= Math.PI * 2;
		return isBetween(angle,angle1,angle2);
	} else if(angle2 - angle1 > Math.PI/2){
		angle2 -= Math.PI * 2;
		if(angle > angle1 && angle > angle2)
			angle -= Math.PI * 2;
		return isBetween(angle,angle1,angle2);
	} else {
		if(angle > angle1 && angle > angle2)
			angle -= Math.PI * 2;
		return isBetween(angle,angle1,angle2);
	}

}

function setCopterDirection(direction){
	var angle = normalization(angleFromDirection(direction));
	var sensor1;
	var sensor2;
	for(let i = 0; i < 15; i++)
		if(isBetweenAngles(angle,sensorsAngles[i],sensorsAngles[i + 1])){
			sensor1 = i;
			sensor2 = i + 1;
		}
	if(!sensor1 && !sensor2 && isBetweenAngles(angle,sensorsAngles[0],sensorsAngles[15])){
		sensor1 = 0;
		sensor2 = 15;
	}
	if(!sensorsValues[sensor1] && !sensorsValues[sensor2]){
		copter_direction = direction;
		return true;
		}
	return false;
}

var rightOrLeft = null;

function forgetRightOrLeft(){
	setTimeout(function(){
		rightOrLeft = null;
	},zoom);
}

var alignment = 0.05;

function move(){
	copter_angle = angleFromDirection(prev_copter_direction);
	if (copter_direction[0] || copter_direction[1]){
		prev_copter_direction = [prev_copter_direction[0] + copter_direction[0],prev_copter_direction[1] + copter_direction[1]];
		copter_speed += 0.7;
		if(copter_speed > maxSpeed)
			copter_speed = maxSpeed;
		copter_direction = [0,0];
	}
	copter_speed -= 0.5;
	if(copter_speed < 0)
		copter_speed = 0;
	prev_copter_x = copter_x;
	prev_copter_y = copter_y;
	copter_x += prev_copter_direction[0] * copter_speed;
	copter_y += prev_copter_direction[1] * copter_speed;
	sensorsAngles = [];
	for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI/8)
		sensorsAngles.push(normalization(copter_angle + angle));
	sensorsPoints = []
	for(let i = 0; i < 16; i++)
		sensorsPoints.push([copter_x + red_radius * Math.sin(sensorsAngles[i]),copter_y + red_radius * Math.cos(sensorsAngles[i])]);
	prev_sensorsValues = [];
	for(let i = 0; i < 16; i++)
		prev_sensorsValues.push(sensorsValues[i]);
	for(let i = 0; i < 16; i++){
		sensorsValues[i] = null;
		for(let j = 0; j < lines.length; j++){
			var crossPoint = getCrossPoint(copter_x,copter_y,sensorsPoints[i][0],sensorsPoints[i][1],lines[j][0][0],lines[j][0][1],lines[j][1][0],lines[j][1][1]);
			if(crossPoint){
				remember(crossPoint);

				var ii = Math.trunc(crossPoint[1]/ceilSize);
				var jj = Math.trunc(crossPoint[0]/ceilSize);

				if(ways[ii][jj]){
					ways[ii][jj] = false;

					if(ii > 0 && jj > 0 && !ways[ii - 1][jj - 1]){
						ways[ii][jj - 1] = false;
						ways[ii - 1][jj] = false;
					}

					if(ii > 0 && jj < ways[ii].length - 1 && !ways[ii - 1][jj + 1]){
						ways[ii][jj + 1] = false;
						ways[ii - 1][jj] = false;
					}

					if(ii < ways.length - 1 && jj > 0 && !ways[ii + 1][jj - 1]){
						ways[ii][jj - 1] = false;
						ways[ii + 1][jj] = false;
					}

					if(ii < ways.length - 1 && jj < ways[ii].length - 1 && !ways[ii + 1][jj + 1]){
						ways[ii][jj + 1] = false;
						ways[ii + 1][jj] = false;
					}

					aStar();
				}

				var someDistance = distance(copter_x,copter_y,crossPoint[0],crossPoint[1]);
				if(!sensorsValues[i] || someDistance < sensorsValues[i]){
					sensorsValues[i] = someDistance;
				}
			}
		}
		
	}
	for(let i = 0; i < 16; i++)
		sensorsSpans[i].innerText = sensorsValues[i];

	// движение в сторону цели

	if(prev_copter_x == copter_x && prev_copter_y == copter_y){
		memory = [];
		setCopterDirection(directionFromAngle(sensorsAngles[8])); // TODO проверить
	}

	if(sensorsValues[0] || (near([prev_copter_x,prev_copter_y],30) && (sensorsValues[15] || sensorsValues[1]))){
		if(!rightOrLeft){
			var rightSum = 0;
			for(let i = 1 ; i < 5; i++)
				if(sensorsValues[i])
					rightSum += sensorsValues[i];
				else
					rightSum += 666;
			var leftSum = 0;
			for(let i = 12 ; i < 16; i++)
				if(sensorsValues[i])
					leftSum += sensorsValues[i];
				else
					leftSum += 666;
			if(rightSum > leftSum)
				rightOrLeft = "left";
			else
				rightOrLeft = "right";
			forgetRightOrLeft();
			if(leftSum < 2000 && rightSum < 2000){
				console.log('low!!');
				copter_speed -= 2;
			}
		}
		if(rightOrLeft == "right")
			setCopterDirection(directionFromAngle(sensorsAngles[12]));
		else if (rightOrLeft == "left")
			setCopterDirection(directionFromAngle(sensorsAngles[4]));
	}

	if(sensorsValues[12] && sensorsValues[13]){
		var alpha =  Math.asin(sensorsValues[13] * Math.sin(Math.PI/8) / (sensorsValues[12] * sensorsValues[12] + sensorsValues[13] * sensorsValues[13] - 2 * sensorsValues[12] * sensorsValues[13] * Math.cos(Math.PI / 8)));
		setCopterDirection(directionFromAngle(sensorsAngles[0] - alpha));
	}
	if(sensorsValues[12] && sensorsValues[11]){
		var alpha =  Math.asin(sensorsValues[11] * Math.sin(Math.PI/8) / (sensorsValues[12] * sensorsValues[12] + sensorsValues[11] * sensorsValues[11] - 2 * sensorsValues[12] * sensorsValues[11] * Math.cos(Math.PI / 8)));
		setCopterDirection(directionFromAngle(sensorsAngles[0] + alpha));
	}
	if(sensorsValues[4] && sensorsValues[3]){
		var alpha =  Math.asin(sensorsValues[3] * Math.sin(Math.PI/8) / (sensorsValues[4] * sensorsValues[4] + sensorsValues[3] * sensorsValues[3] - 2 * sensorsValues[3] * sensorsValues[4] * Math.cos(Math.PI / 8)));
		setCopterDirection(directionFromAngle(sensorsAngles[0] + alpha));
	}
	if(sensorsValues[4] && sensorsValues[5]){
		var alpha =  Math.asin(sensorsValues[5] * Math.sin(Math.PI/8) / (sensorsValues[4] * sensorsValues[4] + sensorsValues[5] * sensorsValues[5] - 2 * sensorsValues[5] * sensorsValues[4] * Math.cos(Math.PI / 8)));
		setCopterDirection(directionFromAngle(sensorsAngles[0] - alpha));
	}

	if(target){

		if(way_targets.length == 0){
			if(!setCopterDirection([target[0] - copter_x,target[1] - copter_y]))
				setCopterDirection(directionFromAngle(sensorsAngles[0]));
		} else {
			if(!setCopterDirection([way_targets[0][0] - copter_x,way_targets[0][1] - copter_y]))
				setCopterDirection(directionFromAngle(sensorsAngles[0]));
		}

		if(near(target,30)){
			target = null;
			memory = [];
		} else if(way_targets.length && near(way_targets[0],30)){
			way_targets.shift();
		}

	}

}

function draw(){

	move();

	ctx.fillStyle = "skyblue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 20;
	ctx.strokeStyle = "brown";
	for(let el of lines)
		line(el[0][0],el[0][1],el[1][0],el[1][1]);
	ctx.lineWidth = 1;

	ctx.fillStyle = "black";
	for(let i = 0; i < memory.length; i++){
		ctx.beginPath();
		ctx.arc(memory[i][0],memory[i][1],10,0,Math.PI*2,true);
		ctx.fill();
		ctx.closePath();
	}

/*
	ctx.fillStyle = "red";
	for(let i = 0; i < ways.length; i++)
		for(let j = 0; j < ways[i].length; j++){
			ctx.beginPath();
			ctx.arc(j * ceilSize,i * ceilSize,1,0,Math.PI*2,true);
			ctx.fill();
			ctx.closePath();
			if(!ways[i][j]){
				line(j * ceilSize,i * ceilSize,(j+1)*ceilSize,(i+1)*ceilSize)
				line((j+1) * ceilSize,i * ceilSize,j*ceilSize,(i+1)*ceilSize)
				}
			}
*/


	ctx.fillStyle = "grey";
	ctx.beginPath();
	ctx.arc(copter_x,copter_y,7,0,Math.PI*2,true);
	ctx.fill();
	ctx.closePath();
	ctx.strokeStyle = "black";
	line(copter_x + 20 * Math.sin(bladeAngle), copter_y + 20 * Math.cos(bladeAngle), copter_x - 20 * Math.sin(bladeAngle), copter_y - 20 * Math.cos(bladeAngle));
	line(copter_x + 20 * Math.sin(bladeAngle + 2*Math.PI/3), copter_y + 20 * Math.cos(bladeAngle + 2*Math.PI/3), copter_x - 20 * Math.sin(bladeAngle + 2*Math.PI/3), copter_y - 20 * Math.cos(bladeAngle + 2*Math.PI/3));
	line(copter_x + 20 * Math.sin(bladeAngle + 4*Math.PI/3), copter_y + 20 * Math.cos(bladeAngle + 4*Math.PI/3), copter_x - 20 * Math.sin(bladeAngle + 4*Math.PI/3), copter_y - 20 * Math.cos(bladeAngle + 4*Math.PI/3));
	bladeAngle += 0.15 + copter_speed / 30;

	if(copter_angle != 666){

		ctx.strokeStyle = "green";
		line(copter_x + 30 * Math.sin(copter_angle), copter_y + 30 * Math.cos(copter_angle), copter_x + 45 * Math.sin(copter_angle), copter_y + 45 * Math.cos(copter_angle));
		line(copter_x + 25 * Math.sin(copter_angle - 0.1), copter_y + 25 * Math.cos(copter_angle - 0.1), copter_x + 45 * Math.sin(copter_angle), copter_y + 45 * Math.cos(copter_angle));
		line(copter_x + 25 * Math.sin(copter_angle + 0.1), copter_y + 25 * Math.cos(copter_angle + 0.1), copter_x + 45 * Math.sin(copter_angle), copter_y + 45 * Math.cos(copter_angle));

	}

	red_radius = (copter_speed * copter_speed * 2 > min_red_radius) ? copter_speed * copter_speed * 2 : min_red_radius;
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.arc(copter_x,copter_y,red_radius,0,Math.PI*2,true);
	ctx.stroke();
	ctx.closePath();

	
	ctx.strokeStyle = "black";
	for(let i = 0; i < 16; i++)
		line(copter_x + (red_radius - 2) * Math.sin(sensorsAngles[i]), copter_y + (red_radius - 2) * Math.cos(sensorsAngles[i]), copter_x + (red_radius + 2) * Math.sin(sensorsAngles[i]), copter_y + (red_radius + 2) * Math.cos(sensorsAngles[i]));
	

	if(target){
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(target[0],target[1],15,0,Math.PI*2,true);
		ctx.fill();
		ctx.closePath();

		for(let t of way_targets){
			ctx.beginPath();
			ctx.arc(t[0],t[1],5,0,Math.PI*2,true);
			ctx.fill();
			ctx.closePath();			
		}

	}

}

setInterval(draw,100);

document.body.onkeydown = function(e){

	if(e.code == 'ArrowUp'){
		setCopterDirection([0,-1]);
	}
	if(e.code == 'ArrowRight'){
		setCopterDirection([1,0]);
	}
	if(e.code == 'ArrowDown'){
		setCopterDirection([0,1]);
	}	
	if(e.code == 'ArrowLeft'){
		setCopterDirection([-1,0]);
	}

}

canvas.onclick = function(e){
	target = [e.clientX - 8,e.clientY - 8];
	aStar();
	// console.log("target = ",target);
}
