var canvas = document.getElementsByTagName("canvas")[0],
ctx = canvas.getContext('2d');

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
var ceilSize = 50;

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

function line(x1,y1,x2,y2){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}

var copters = [
new Copter(50,50,lines,canvas,ceilSize),
new Copter(1050,50,lines,canvas,ceilSize)//,
//new Copter(50,1050,lines,canvas,ceilSize)
];


function draw(){

	for(let copter of copters)
		copter.move();

	ctx.fillStyle = "skyblue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 20;
	ctx.strokeStyle = "brown";
	for(let el of lines)
		line(el[0][0],el[0][1],el[1][0],el[1][1]);
	ctx.lineWidth = 1;

	ctx.fillStyle = "black";
	for(let copter of copters)
		for(let i = 0; i < copter.memory.length; i++){
			ctx.beginPath();
			ctx.arc(copter.memory[i][0],copter.memory[i][1],10,0,Math.PI*2,true);
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

	for(let copter of copters){

		ctx.fillStyle = "grey";
		ctx.beginPath();
		ctx.arc(copter.copter_x,copter.copter_y,7,0,Math.PI*2,true);
		ctx.fill();
		ctx.closePath();

		ctx.strokeStyle = "black";
		line(copter.copter_x + 20 * Math.sin(copter.bladeAngle), copter.copter_y + 20 * Math.cos(copter.bladeAngle), copter.copter_x - 20 * Math.sin(copter.bladeAngle), copter.copter_y - 20 * Math.cos(copter.bladeAngle));
		line(copter.copter_x + 20 * Math.sin(copter.bladeAngle + 2*Math.PI/3), copter.copter_y + 20 * Math.cos(copter.bladeAngle + 2*Math.PI/3), copter.copter_x - 20 * Math.sin(copter.bladeAngle + 2*Math.PI/3), copter.copter_y - 20 * Math.cos(copter.bladeAngle + 2*Math.PI/3));
		line(copter.copter_x + 20 * Math.sin(copter.bladeAngle + 4*Math.PI/3), copter.copter_y + 20 * Math.cos(copter.bladeAngle + 4*Math.PI/3), copter.copter_x - 20 * Math.sin(copter.bladeAngle + 4*Math.PI/3), copter.copter_y - 20 * Math.cos(copter.bladeAngle + 4*Math.PI/3));
		copter.bladeAngle += 0.15 + copter.copter_speed / 30;

		if(copter.copter_angle != 666){

			ctx.strokeStyle = "green";
			line(copter.copter_x + 30 * Math.sin(copter.copter_angle), copter.copter_y + 30 * Math.cos(copter.copter_angle), copter.copter_x + 45 * Math.sin(copter.copter_angle), copter.copter_y + 45 * Math.cos(copter.copter_angle));
			line(copter.copter_x + 25 * Math.sin(copter.copter_angle - 0.1), copter.copter_y + 25 * Math.cos(copter.copter_angle - 0.1), copter.copter_x + 45 * Math.sin(copter.copter_angle), copter.copter_y + 45 * Math.cos(copter.copter_angle));
			line(copter.copter_x + 25 * Math.sin(copter.copter_angle + 0.1), copter.copter_y + 25 * Math.cos(copter.copter_angle + 0.1), copter.copter_x + 45 * Math.sin(copter.copter_angle), copter.copter_y + 45 * Math.cos(copter.copter_angle));

		}

		copter.red_radius = (copter.copter_speed * copter.copter_speed * 2 > copter.min_red_radius) ? copter.copter_speed * copter.copter_speed * 2 : copter.min_red_radius;
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.arc(copter.copter_x,copter.copter_y,copter.red_radius,0,Math.PI*2,true);
		ctx.stroke();
		ctx.closePath();

		
		ctx.strokeStyle = "black";
		for(let i = 0; i < 16; i++)
			line(copter.copter_x + (copter.red_radius - 2) * Math.sin(copter.sensorsAngles[i]), copter.copter_y + (copter.red_radius - 2) * Math.cos(copter.sensorsAngles[i]), copter.copter_x + (copter.red_radius + 2) * Math.sin(copter.sensorsAngles[i]), copter.copter_y + (copter.red_radius + 2) * Math.cos(copter.sensorsAngles[i]));
		

		if(copter.target){
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(copter.target[0],copter.target[1],15,0,Math.PI*2,true);
			ctx.fill();
			ctx.closePath();

			for(let t of copter.way_targets){
				ctx.beginPath();
				ctx.arc(t[0],t[1],5,0,Math.PI*2,true);
				ctx.fill();
				ctx.closePath();			
			}

		}


	}

	

}

setInterval(draw,100);

canvas.onclick = function(e){
	copters[0].target = [e.pageX - 8,e.pageY - 8];
	copters[0].aStar();
	console.log(e.pageX,e.pageY);
}

canvas.oncontextmenu = function(e){
	copters[1].target = [e.pageX - 8,e.pageY - 8];
	copters[1].aStar();
	console.log(e.pageX,e.pageY);
	return false; // cancel default menu
}
/*
canvas.onwheel = function(e){
	copters[2].target = [e.pageX - 8,e.pageY - 8];
	copters[2].aStar();
	console.log(e.pageX,e.pageY);
}
*/
// может пригодиться
/*
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
*/
