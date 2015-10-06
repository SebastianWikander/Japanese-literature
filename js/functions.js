function circles(canvas, context, data){
	this.canvas = canvas;
	this.context = context;
	this.data = data;
	this.canvasArea = canvas.height*canvas.width;
	
	this.sum = 0;
	for (var i = 0; i < data.length; i++) {
		this.sum = this.sum + data[i][1];
	}
	
	this.circles = new Array();
	for (var i = 0; i < data.length; i++) {
		this.circles.push(new circle(canvas, context, data[i][0], getColor(255, 20+i*2, 20+i*2), data[i][1]/this.sum));
	}
	self = this;
	
	this.update = update;
	function update() {
		var circleArea = 0;
		for(var i = 0; i < self.circles.length; i++) {
			circleArea = circleArea + Math.pow(self.circles[i].radius, 2) * Math.PI;
		}

		if (circleArea > 0.75 * self.canvasArea) {
			for(var i = 0; i < circles.length; i++) {
				var circle = self.circles[i];
				circle.xVelocity = circle.xVelocity*0.95;
				circle.yVelocity = circle.yVelocity*0.95;
				circle.growthRate = circle.growthRate*0.99;
			}
		} 
			
		for(var i = 0; i < self.circles.length; i++) {
			self.circles[i].update(self.circles);
		}
	}
}

function getColor(r, g, b) 
	{ return "#"+(r).toString(16)+(g).toString(16)+(b).toString(16); }
			
function circle(canvas, context, letter, color, growthRate) {
	this.canvas = canvas;
	this.context = context;
	this.x = 10 + Math.random()*(canvas.width - 20);
	this.y = 10 + Math.random()*(canvas.height - 20);
	this.xVelocity = Math.random()*Math.pow(-1, (Math.round(Math.random()*2)))*2;
	this.yVelocity = Math.random()*Math.pow(-1, (Math.round(Math.random()*2)))*2;
	this.radius = 10;
	this.mass = 10;
	this.letter = letter;
	this.frequency = "23";
	this.originalColor = color;
	this.color = color;
	this.growthRate = growthRate;
	this.collision = false;
				
	var self = this;
				
	this.move = move;
	function move() {
		self.x = Math.round(self.x + self.xVelocity);
		self.y = Math.round(self.y + self.yVelocity);
	}
				
	this.grow = grow;
	function grow() {
		if(Math.random() < self.growthRate && self.collision == false){
			self.radius = self.radius + 1; }
		self.collision = false;
	}
				
	function getMousePos(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	self.canvas.addEventListener('mousemove', function(e) {
		var mousePos = getMousePos(self.canvas, e);
		if ((mousePos.x-self.x)*(mousePos.x-self.x)+(mousePos.y-self.y)*(mousePos.y-self.y) < self.radius*self.radius) 
			{ self.color = "orange"; }
		else 
			{ self.color = self.originalColor; }					
	}, false);
				
	this.drawCircle = drawCircle;
	function drawCircle() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fillStyle = this.color;
		context.fill();
			 	
		context.font = "bold " + this.radius + "px Helvetica";
		context.fillStyle = "#fff";
		context.textBaseline = "middle";
		context.fillText(this.letter, this.x - this.radius/2, this.y);
	}
				
	this.detectBorderCollision = detectBorderCollision;
	function detectBorderCollision() {
		if(self.x - self.radius < 0) {
			self.xVelocity = -self.xVelocity;
			var distance = self.x;
			var factor = (distance - self.radius)/distance;
		  self.x -= distance * factor * 0.5;
			self.collision = true;
		}
		else if(self.x + self.radius > self.canvas.width) { 
			self.xVelocity = -self.xVelocity;
			var distance = self.canvas.width - self.x;
			var factor = (distance - self.radius)/distance;
		  self.x += distance * factor * 0.5;
			self.collision = true;
		}
		else if(self.y - self.radius < 0) {
			self.yVelocity = -self.yVelocity;
			var distance = self.y;
			var factor = (distance - self.radius)/distance;
		  self.y -= distance * factor * 0.5;
			self.collision = true;
		}
		else if(self.y + self.radius > self.canvas.height) {
			self.yVelocity = -self.yVelocity;
			var distance = self.canvas.height - self.y;
			var factor = (distance - self.radius)/distance;
		  self.y += distance * factor * 0.5;
			self.collision = true;
		}
	}
				
	this.isCollidingWith = isCollidingWith;
	function isCollidingWith(circle) {
		var dx = self.x - circle.x;
		var dy = self.y - circle.y;
		var rad = self.radius + circle.radius;
		if((dx * dx)  + (dy * dy) < rad * rad) { 
			return true; }
		else {
			return false; }
	}
				
	this.getVelocity = getVelocity;
	function getVelocity() {
		return Math.sqrt(Math.pow(self.xVelocity, 2) + Math.pow(self.yVelocity, 2) );
	}
				
	this.collideWith = collideWith;
	function collideWith(circle) {
		var dx = self.x - circle.x;
		var dy = self.y - circle.y;
		var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		var nx = dx / distance;
		var ny = dy / distance;
		var p = 2 * (self.xVelocity * nx + self.yVelocity * ny - circle.xVelocity * nx - circle.yVelocity * ny) / (self.mass + circle.mass);
					
		self.xVelocity = self.xVelocity - p * self.mass * nx;
		self.yVelocity = self.yVelocity - p * self.mass * ny;
		circle.xVelocity = circle.xVelocity + p * circle.mass * nx;
		circle.yVelocity = circle.yVelocity + p * circle.mass * ny;
					
		var rad = self.radius + circle.radius;
		if(distance < rad){ 
			var factor = (distance - rad)/distance;
		  self.x -= dx * factor * 0.5;
			self.y -= dy * factor * 0.5;
			circle.x += dx * factor * 0.5;
			circle.y += dy * factor * 0.5;
		}
		self.collision = true;
	}	
				
	this.detectCollision = detectCollision;
	function detectCollision(circles) {
		for(var i = 0; i < circles.length; i++){
			if(self.isCollidingWith(circles[i]) && circles[i].x != self.x && circles[i].y != self.y) {
				self.collideWith(circles[i]);
			}
		}
	}
				
	this.update = update;
	function update(circles) {
		self.detectCollision(circles);
		self.detectBorderCollision();
		self.grow();
		self.move();
		self.drawCircle();
	}
}