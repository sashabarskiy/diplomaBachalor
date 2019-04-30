class Copter{

	constructor(copter_x,copter_y,lines,canvas,ceilSize,copters) {
		this.ceilSize = ceilSize;
		this.copters = copters;
		this.lines = lines;
		this.maxSpeed = 10;
		this.copter_x = copter_x;
		this.copter_y = copter_y;
		this.prev_copter_x = 50;
		this.prev_copter_y = 50;
		this.copter_speed = 0;
		this.copter_direction = [0,0];
		this.prev_copter_direction = [0,1];
		this.copter_angle = 0;
		this.bladeAngle = 0;
		this.red_radius = 80;
		this.min_red_radius = 80;
		this.target = null;
		this.memory = [];
		this.ways = [];
		this.numbers = [];
		this.copter_i = 0;
		this.copter_j = 0;
		this.target_i = 0;
		this.target_j = 0;
		this.way_targets = [];
		this.sensorsAngles = [];
		this.prev_sensorsValues = [];
		this.sensorsValues = [];
		this.sensorsPoints = [];
		this.rightOrLeft = null;
		for(let i = 0; i <= canvas.height / ceilSize; i++){
			this.ways.push([]);
			this.numbers.push([]);
			for(let j = 0; j <= canvas.width / ceilSize; j++){
				this.ways[i].push(true);
				this.numbers[i].push(0);
			}
		}
		setInterval(this.aStar,10000);
		for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI/8)
			this.sensorsAngles.push(angle);
		for(let i = 0; i < 16; i++)
			this.sensorsValues.push(null);
		for(let i = 0; i < 16; i++)
			this.sensorsPoints.push([this.copter_x + this.red_radius * Math.sin(this.sensorsAngles[i]),this.copter_y + this.red_radius * Math.cos(this.sensorsAngles[i])]);
	}

	aStar() {
		if(!this.target)
			return;
		for(let i = 0; i < this.numbers.length; i++)
			for(let j = 0; j < this.numbers[i].length; j++)
				this.numbers[i][j] = 0;
		this.copter_i = Math.trunc(this.copter_y/this.ceilSize);
		this.copter_j = Math.trunc(this.copter_x/this.ceilSize);
		this.target_i = Math.trunc(this.target[1]/this.ceilSize);
		this.target_j = Math.trunc(this.target[0]/this.ceilSize);
		if(this.ways[this.target_i][this.target_j] == false){
			this.target = null;
			return;
		}
		if(this.copter_i == this.target_i && this.copter_j == this.target_j)
			return;
		this.numbers[this.copter_i][this.copter_j] = 1;
		var done = false;
		while(!done)
			for(let i = 0; i < this.numbers.length && !done; i++)
				for(let j = 0; j < this.numbers[i].length && !done; j++)
					if(this.numbers[i][j] != 0){
						if(i > 0 && !this.numbers[i - 1][j] && this.ways[i - 1][j]){
							this.numbers[i - 1][j] = this.numbers[i][j] + 1;
							if(i - 1 == this.target_i && j == this.target_j){
								done = true;
								break;
							}
						}
						if(j > 0 && !this.numbers[i][j - 1] && this.ways[i][j - 1]){
							this.numbers[i][j - 1] = this.numbers[i][j] + 1;
							if(i == this.target_i && j - 1 == this.target_j){
								done = true;
								break;
							}
						}
						if(j < this.numbers[i].length - 1 && !this.numbers[i][j + 1] && this.ways[i][j + 1]){
							this.numbers[i][j + 1] = this.numbers[i][j] + 1;
							if(i == this.target_i && j + 1 == this.target_j){
								done = true;
								break;
							}
						}
						if(i < this.numbers.length - 1 && j < this.numbers[i].length - 1 && !this.numbers[i + 1][j] && this.ways[i + 1][j]){
							this.numbers[i + 1][j] = this.numbers[i][j] + 1;
							if(i + 1 == this.target_i && j == this.target_j){
								done = true;
								break;
							}
						}
					}
		this.way_targets = [];
		this.copter_i = this.target_i;
		this.copter_j = this.target_j;
		while(this.numbers[this.copter_i][this.copter_j] != 1){
			var min_i = this.copter_i;
			var min_j = this.copter_j;
			var min = this.numbers[this.copter_i][this.copter_j];
			if(this.copter_i > 0 && this.copter_j > 0 && this.numbers[this.copter_i - 1][this.copter_j - 1] && this.numbers[this.copter_i - 1][this.copter_j - 1] < min){
				min_i = this.copter_i - 1;
				min_j = this.copter_j - 1;
				min = this.numbers[this.copter_i - 1][this.copter_j - 1];
			}
			if(this.copter_i > 0 && this.numbers[this.copter_i - 1][this.copter_j] && this.numbers[this.copter_i - 1][this.copter_j] < min){
				min_i = this.copter_i - 1;
				min_j = this.copter_j;
				min = this.numbers[this.copter_i - 1][this.copter_j];
			}
			if(this.copter_i > 0 && this.copter_j < this.numbers[this.copter_i].length - 1 && this.numbers[this.copter_i - 1][this.copter_j + 1] && this.numbers[this.copter_i - 1][this.copter_j + 1] < min){
				min_i = this.copter_i - 1;
				min_j = this.copter_j + 1;
				min = this.numbers[this.copter_i - 1][this.copter_j + 1];
			}
			if(this.copter_j > 0 && this.numbers[this.copter_i][this.copter_j - 1] && this.numbers[this.copter_i][this.copter_j - 1] < min){
				min_i = this.copter_i;
				min_j = this.copter_j - 1;
				min = this.numbers[this.copter_i][this.copter_j - 1];
			}
			if(this.copter_j < this.numbers[this.copter_i].length - 1 && this.numbers[this.copter_i][this.copter_j + 1] && this.numbers[this.copter_i][this.copter_j + 1] < min){
				min_i = this.copter_i;
				min_j = this.copter_j + 1;
				min = this.numbers[this.copter_i][this.copter_j + 1];
			}
			if(this.copter_i < this.numbers.length && this.copter_j > 0 && this.numbers[this.copter_i + 1][this.copter_j - 1] && this.numbers[this.copter_i + 1][this.copter_j - 1] < min){
				min_i = this.copter_i + 1;
				min_j = this.copter_j - 1;
				min = this.numbers[this.copter_i + 1][this.copter_j - 1];
			}
			if(this.copter_i < this.numbers.length && this.numbers[this.copter_i + 1][this.copter_j] && this.numbers[this.copter_i + 1][this.copter_j] < min){
				min_i = this.copter_i + 1;
				min_j = this.copter_j;
				min = this.numbers[this.copter_i + 1][this.copter_j];
			}
			if(this.copter_i < this.numbers.length && this.copter_j < this.numbers[this.copter_i].length - 1 && this.numbers[this.copter_i + 1][this.copter_j + 1] && this.numbers[this.copter_i + 1][this.copter_j + 1] < min){
				min_i = this.copter_i + 1;
				min_j = this.copter_j + 1;
				min = this.numbers[this.copter_i + 1][this.copter_j + 1];
			}
			this.copter_i = min_i;
			this.copter_j = min_j;
			this.way_targets.unshift([min_j*this.ceilSize+this.ceilSize/2,min_i*this.ceilSize+this.ceilSize/2]);
		}		
	}

	remember(point){
		this.memory.push(point);
	}

	near(point,pix){
		return Math.abs(point[0] - this.copter_x) < pix && Math.abs(point[1] - this.copter_y) < pix;
	}

	normalization(angle){
		angle %= Math.PI * 2;
		if(angle < 0)
			angle += Math.PI * 2;
		if(angle > Math.PI * 2)
			angle -= Math.PI * 2;
		return angle;
	}

	distance(x1,y1,x2,y2){
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	}

	isBetween(n,n1,n2){
		return (n >= n1 && n <= n2) || (n >= n2 && n <= n1);
	}

	getCrossPoint(x1,y1,x2,y2,x3,y3,x4,y4){
		if(x3 == x4 && x1 == x2)
			return null;
		if(x3 == x4){
			if(!this.isBetween(x3,x1,x2))
				return null;
			var y = (x3 - x1) * (y2 - y1) / (x2 - x1) + y1;
			if(!this.isBetween(y,y1,y2) || !this.isBetween(y,y3,y4))
				return null;
			return [x3,y];
		} else if(x1 == x2) {
			if(!this.isBetween(x1,x3,x4))
				return null;
			var y = (x1 - x3) * (y4 - y3) / (x4 - x3) + y3;
			if(!this.isBetween(y,y3,y4) || !this.isBetween(y,y1,y2))
				return null;
			return [x1,y];
		} else {
			var denominator = (y2 - y1) * (x4 - x3) - (y4 - y3) * (x2 - x1);
			if(denominator == 0)
				return null;
			var x = ((y3 - y1) * (x2 - x1) * (x4 - x3) + x1 * (y2 - y1) * (x4 - x3) - x3 * (y4 - y3) * (x2 - x1)) / denominator;
			if(!this.isBetween(x,x1,x2) || !this.isBetween(x,x3,x4))
				return null;
			var y = (x - x3) * (y4 - y3) / (x4 - x3) + y3;
			if(!this.isBetween(y,y1,y2) || !this.isBetween(y,y3,y4))
				return null;
			return [x,y];
		}
	}

	// возвращает массив точек пересечения отрезка и окружности
	getCrossPointWithCircle(x0,y0,r,x1,y1,x2,y2){

		if(x1 != x2){
			var a = (x1 - x2) * (x1 - x2) - (y2 - y1) * (y2 - y1);
			var b = 2 * x0 * (x2 - x1) * (x2 - x1) + 2 * x1 * (y2 - y1) * (y2 - y1) + 2 * y1 * (y1 - y2) * (x2 - x1) + 2 * y0 * (y2 - y1) * (x2 - x1);
			var c = r * r * (x2 - x1) * (x2 - x1) - x0 * x0 * (x2 - x1) * (x2 - x1) - x1 * x1 * (y2 - y1) * (y2 - y1) - y1 * y1 * (x2 - x1) * (x2 - x1) - y0 * y0 * (x2 - x1) * (x2 - x1) + x1 * 2 * y1 * (y2 - y1) * (x2 - x1) + x1 * 2 * y0 * (y1 - y2) * (x2 - x1);
			var d = b * b - 4 * a * c;
			if(d < 0)
				return null;
			var res_x0 = (-b - Math.sqrt(d)) / (2 * a);
			var res_x1 = (-b + Math.sqrt(d)) / (2 * a);
			var res_y0 = ((res_x0 - x1) * (y2 - y1)) / (x2 - x1) + y1;
			var res_y1 = ((res_x1 - x1) * (y2 - y1)) / (x2 - x1) + y1;
			var res = [];
			if( this.isBetween(res_x0,x1,x2) && this.isBetween(res_y0,y1,y2) )
				res.push([res_x0,res_y0]);
			if( this.isBetween(res_x1,x1,x2) && this.isBetween(res_y1,y1,y2) )
				res.push([res_x1,res_y1]);
			if (res.length)
				return res;
			return null;
		}
		if ( r * r - (x1 - x0) * (x1 - x0) >= 0 ){
			var res_x0 = x1;
			var res_x1 = x1;
			var res_y0 = Math.sqrt(r * r - (x1 - x0) * (x1 - x0)) + y0;
			var res_y1 = -Math.sqrt(r * r - (x1 - x0) * (x1 - x0)) + y0;
			var res = [];
			if( this.isBetween(res_x0,x1,x2) && this.isBetween(res_y0,y1,y2) )
				res.push([res_x0,res_y0]);
			if( this.isBetween(res_x1,x1,x2) && this.isBetween(res_y1,y1,y2) )
				res.push([res_x1,res_y1]);
			if (res.length)
				return res;
			return null;	
		}
		return null;
	}

	angleFromDirection(direction){
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

	directionFromAngle(angle){
		return [Math.sin(angle),Math.cos(angle)];
	}

	isBetweenAngles(angle,angle1,angle2){

		if(angle1 - angle2 > Math.PI/2){
			angle1 -= Math.PI * 2;
			if(angle > angle1 && angle > angle2)
				angle -= Math.PI * 2;
			return this.isBetween(angle,angle1,angle2);
		} else if(angle2 - angle1 > Math.PI/2){
			angle2 -= Math.PI * 2;
			if(angle > angle1 && angle > angle2)
				angle -= Math.PI * 2;
			return this.isBetween(angle,angle1,angle2);
		} else {
			if(angle > angle1 && angle > angle2)
				angle -= Math.PI * 2;
			return this.isBetween(angle,angle1,angle2);
		}

	}

	setCopterDirection(direction){
		var angle = this.normalization(this.angleFromDirection(direction));
		var sensor1;
		var sensor2;
		for(let i = 0; i < 15; i++)
			if(this.isBetweenAngles(angle,this.sensorsAngles[i],this.sensorsAngles[i + 1])){
				sensor1 = i;
				sensor2 = i + 1;
			}
		if(!sensor1 && !sensor2 && this.isBetweenAngles(angle,this.sensorsAngles[0],this.sensorsAngles[15])){
			sensor1 = 0;
			sensor2 = 15;
		}
		if(!this.sensorsValues[sensor1] && !this.sensorsValues[sensor2]){
			this.copter_direction = direction;
			return true;
			}
		return false;
	}

	forgetRightOrLeft(){
		setTimeout(function(main){
			main.rightOrLeft = null;
		},300,this);
	}

	move(){
		this.copter_angle = this.angleFromDirection(this.prev_copter_direction);
		if (this.copter_direction[0] || this.copter_direction[1]){
			this.prev_copter_direction = [this.prev_copter_direction[0] + this.copter_direction[0],this.prev_copter_direction[1] + this.copter_direction[1]];
			this.copter_speed += 0.7;
			if(this.copter_speed > this.maxSpeed)
				this.copter_speed = this.maxSpeed;
			this.copter_direction = [0,0];
		}
		this.copter_speed -= 0.5;
		if(this.copter_speed < 0)
			this.copter_speed = 0;
		this.prev_copter_x = this.copter_x;
		this.prev_copter_y = this.copter_y;
		this.copter_x += this.prev_copter_direction[0] * this.copter_speed;
		this.copter_y += this.prev_copter_direction[1] * this.copter_speed;
		this.sensorsAngles = [];
		for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI/8)
			this.sensorsAngles.push(this.normalization(this.copter_angle + angle));
		this.sensorsPoints = []
		for(let i = 0; i < 16; i++)
			this.sensorsPoints.push([this.copter_x + this.red_radius * Math.sin(this.sensorsAngles[i]),this.copter_y + this.red_radius * Math.cos(this.sensorsAngles[i])]);
		this.prev_sensorsValues = [];
		for(let i = 0; i < 16; i++)
			this.prev_sensorsValues.push(this.sensorsValues[i]);
		for(let i = 0; i < 16; i++){

			this.sensorsValues[i] = null;

			for(let j = 0; j < this.lines.length; j++){
				var crossPoint = this.getCrossPoint(this.copter_x,this.copter_y,this.sensorsPoints[i][0],this.sensorsPoints[i][1],this.lines[j][0][0],this.lines[j][0][1],this.lines[j][1][0],this.lines[j][1][1]);
				if(crossPoint){
					this.remember(crossPoint);
					var ii = Math.trunc(crossPoint[1]/this.ceilSize);
					var jj = Math.trunc(crossPoint[0]/this.ceilSize);
					if(this.ways[ii][jj]){
						this.ways[ii][jj] = false;

						if(ii > 0 && jj > 0 && !this.ways[ii - 1][jj - 1]){
							this.ways[ii][jj - 1] = false;
							this.ways[ii - 1][jj] = false;
						}

						if(ii > 0 && jj < this.ways[ii].length - 1 && !this.ways[ii - 1][jj + 1]){
							this.ways[ii][jj + 1] = false;
							this.ways[ii - 1][jj] = false;
						}

						if(ii < this.ways.length - 1 && jj > 0 && !this.ways[ii + 1][jj - 1]){
							this.ways[ii][jj - 1] = false;
							this.ways[ii + 1][jj] = false;
						}

						if(ii < this.ways.length - 1 && jj < this.ways[ii].length - 1 && !this.ways[ii + 1][jj + 1]){
							this.ways[ii][jj + 1] = false;
							this.ways[ii + 1][jj] = false;
						}

						this.aStar();
					}

					var someDistance = this.distance(this.copter_x,this.copter_y,crossPoint[0],crossPoint[1]);
					if(!this.sensorsValues[i] || someDistance < this.sensorsValues[i]){
						this.sensorsValues[i] = someDistance;
					}
				}
			}

			// коптер это окружность с радиусом 100
			for(let copter of copters){
				if(copter.copter_x != this.copter_x && copter.copter_y != this.copter_y){
					var hahaha = this.getCrossPointWithCircle(copter.copter_x,copter.copter_y,100,this.copter_x,this.copter_y,this.sensorsPoints[i][0],this.sensorsPoints[i][1]);
					if(hahaha)
						console.log(hahaha);
				}
			}


			
		}
		if(this.prev_copter_x == this.copter_x && this.prev_copter_y == this.copter_y){
			this.memory = [];
			this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[8]));
		}
		if(this.sensorsValues[0] || (this.near([this.prev_copter_x,this.prev_copter_y],30) && (this.sensorsValues[15] || this.sensorsValues[1]))){
			if(!this.rightOrLeft){
				var rightSum = 0;
				for(let i = 1 ; i < 5; i++)
					if(this.sensorsValues[i])
						rightSum += this.sensorsValues[i];
					else
						rightSum += 666;
				var leftSum = 0;
				for(let i = 12 ; i < 16; i++)
					if(this.sensorsValues[i])
						leftSum += this.sensorsValues[i];
					else
						leftSum += 666;
				if(rightSum > leftSum)
					this.rightOrLeft = "left";
				else
					this.rightOrLeft = "right";
				this.forgetRightOrLeft();
				if(leftSum < 2000 && rightSum < 2000){
					this.copter_speed -= 2;
				}
			}
			if(this.rightOrLeft == "right")
				this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[12]));
			else if (this.rightOrLeft == "left")
				this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[4]));
		}
		if(this.sensorsValues[12] && this.sensorsValues[13]){
			var alpha =  Math.asin(this.sensorsValues[13] * Math.sin(Math.PI/8) / (this.sensorsValues[12] * this.sensorsValues[12] + this.sensorsValues[13] * this.sensorsValues[13] - 2 * this.sensorsValues[12] * this.sensorsValues[13] * Math.cos(Math.PI / 8)));
			this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0] - alpha));
		}
		if(this.sensorsValues[12] && this.sensorsValues[11]){
			var alpha =  Math.asin(this.sensorsValues[11] * Math.sin(Math.PI/8) / (this.sensorsValues[12] * this.sensorsValues[12] + this.sensorsValues[11] * this.sensorsValues[11] - 2 * this.sensorsValues[12] * this.sensorsValues[11] * Math.cos(Math.PI / 8)));
			this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0] + alpha));
		}
		if(this.sensorsValues[4] && this.sensorsValues[3]){
			var alpha =  Math.asin(this.sensorsValues[3] * Math.sin(Math.PI/8) / (this.sensorsValues[4] * this.sensorsValues[4] + this.sensorsValues[3] * this.sensorsValues[3] - 2 * this.sensorsValues[3] * this.sensorsValues[4] * Math.cos(Math.PI / 8)));
			this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0] + alpha));
		}
		if(this.sensorsValues[4] && this.sensorsValues[5]){
			var alpha =  Math.asin(this.sensorsValues[5] * Math.sin(Math.PI/8) / (this.sensorsValues[4] * this.sensorsValues[4] + this.sensorsValues[5] * this.sensorsValues[5] - 2 * this.sensorsValues[5] * this.sensorsValues[4] * Math.cos(Math.PI / 8)));
			this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0] - alpha));
		}
		if(this.target){
			if(this.way_targets.length == 0){
				if(!this.setCopterDirection([this.target[0] - this.copter_x,this.target[1] - this.copter_y]))
					this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0]));
			} else {
				if(!this.setCopterDirection([this.way_targets[0][0] - this.copter_x,this.way_targets[0][1] - this.copter_y]))
					this.setCopterDirection(this.directionFromAngle(this.sensorsAngles[0]));
			}

			if(this.near(this.target,30)){
				this.target = null;
				this.memory = [];
			} else if(this.way_targets.length){
				var near_way_target_i = 0;
				for(let i = 0; i < this.way_targets.length; i++)
					if(this.near(this.way_targets[i],30)){
						near_way_target_i = i + 1;
						break;
					}
				for(let i = 0; i < near_way_target_i; i++)
					this.way_targets.shift();
			}

		}

	}

}
