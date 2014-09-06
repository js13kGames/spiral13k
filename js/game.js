var fMOON_G = -1360.0;
var fEARTH_G = 3960.0;
var dPI = 2*Math.PI;

var bGAME = false;
var bPAUSE = false;
var bMOON_G = false;
var bBLOCK_G = false;

var moonOrbitR = 45;
var moonMotionPath = 75;
var angle = 0.75 * Math.PI;
var blockAngle = Math.PI/2;
var blockXY = [];
var d0 = [];
var meteor = [];

var canvas = document.getElementById('canvas2d');
var background = document.getElementById('background');
var ctx = canvas.getContext('2d');
var bg_ctx = background.getContext('2d');

canvas.width = 960;
canvas.height = 640;
background.width = 960;
background.height = 640;

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

// Earth
var e_grd_radial = ctx.createRadialGradient(centerX,centerY,10,centerX,centerY,25);
	e_grd_radial.addColorStop(0.10, 'rgba(61,204,248,0)');
	e_grd_radial.addColorStop(0.30, 'rgba(61,204,248,0.1)');
	e_grd_radial.addColorStop(0.60, 'rgba(61,204,248,0.6)');
	e_grd_radial.addColorStop(0.90, 'rgba(61,204,248,0.1)');
	e_grd_radial.addColorStop(1.00, 'rgba(255,255,255,0)');
bg_ctx.lineWidth = 1;
bg_ctx.strokeStyle = 'rgba(61,204,248,0.4)';
bg_ctx.beginPath();
bg_ctx.arc( centerX, centerY, 30, 0, 2*Math.PI );
bg_ctx.fillStyle = e_grd_radial;
bg_ctx.fill();
bg_ctx.beginPath();
bg_ctx.arc( centerX, centerY, 10, 0, 2*Math.PI );
bg_ctx.fillStyle = 'rgba(61,204,248,0.2)';
bg_ctx.fill();
bg_ctx.stroke();
/*bg_ctx.beginPath();
bg_ctx.arc( centerX, centerY, 20, 0, 2*Math.PI );
bg_ctx.stroke();*/



function start() {
	d0 = new Derivative();
	var
			px = centerX
		,	py = 50
		,	vx = (Math.random() > 0.3) ? 0.7 : -0.7
		,	vy = -0.1;

	meteor = {
		position: new Vec(px, py),
		velocity: new Vec(vx, vy)
	};

	requestAnimationFrame(render);
}
function render () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Moon + orbit
	Xm = centerX + moonMotionPath * Math.cos(angle * Math.PI / 180);
	Ym = centerY + moonMotionPath * Math.sin(angle * Math.PI / 180);

	var m_grd_radial = ctx.createRadialGradient(Xm,Ym,10,Xm,Ym,55);
		m_grd_radial.addColorStop(0.40, 'rgba(255,255,255,0)');
		m_grd_radial.addColorStop(0.75, 'rgba(0,0,0,.1)');
		m_grd_radial.addColorStop(0.80, 'rgba(0,0,0,.25)');
		m_grd_radial.addColorStop(0.85, 'rgba(0,0,0,.1)');
		m_grd_radial.addColorStop(1.00, 'rgba(255,255,255,0)');

	ctx.beginPath();
	ctx.arc( Xm, Ym, 55, 0, dPI);
	ctx.fillStyle = m_grd_radial;
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = 'rgba(0, 0, 0,.15)';
	ctx.fillStyle = 'rgba(0,0,0,.25)';
	ctx.lineWidth = 5;
	ctx.arc( Xm, Ym, 15, 0, dPI );
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'rgba(0, 0, 0,.2)';
	ctx.lineWidth = 1;
	ctx.arc( Xm, Ym, 45, 0, dPI );
	ctx.stroke();

	motion();

	if(bGAME) requestAnimationFrame(render);
}

var meteorStep = function(center, body){
	delta = 1;
	var d1 = compute(center, body, delta*0, d0);
	var d2 = compute(center, body, delta*0.2, d1);
	var d3 = compute(center, body, delta*0.4, d2);
	var d4 = compute(center, body, delta*1, d3);
	
	d2.iadd(d3).imul(2);
	d4.iadd(d1).iadd(d2).imul(1/6);

	body.position.iadd(d4.position.mul(delta));
	body.velocity.iadd(d4.velocity.mul(delta));

	if(body.position.x > 960) body.position.x = 960.0001;
	if(body.position.x < 0) body.position.x = -0.0001;
	if(body.position.y > 640) body.position.y = 640.0001;
	if(body.position.y < 0) body.position.y = -0.0001;
}

var motion = function() {
	var dr = Math.sqrt(Math.pow(Xm - meteor.position.x, 2) + Math.pow(Ym - meteor.position.y, 2));

	bMOON_G = (dr <= moonOrbitR) ? true : false;

	var previous = new Vec(meteor.position.x, meteor.position.y);

	var center = (bMOON_G) ? new Vec( Xm,Ym ) : new Vec( centerX,centerY );

	if(meteor.position.x > canvas.width || meteor.position.x < 0)
		meteor.velocity.x *= -1;
	if(meteor.position.y > canvas.height || meteor.position.y < 0)
		meteor.velocity.y *= -1;

	meteorStep(center, meteor);	

		// Meteor[path]
	/*bg_ctx.strokeStyle = 'rgba(255,64,64,0.8)';
	bg_ctx.lineWidth = 1;
	bg_ctx.beginPath();
	bg_ctx.setLineDash([2, 3]);
	bg_ctx.moveTo(previous.x, previous.y);
	bg_ctx.lineTo(meteor.position.x, meteor.position.y);
	bg_ctx.stroke();
*/
	// Meteor
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.arc( meteor.position.x , meteor.position.y, 7, 0, dPI );
	ctx.fillStyle = 'rgba(255,64,64,0.6)';
	ctx.strokeStyle = 'rgba(255,64,64,0.8)';
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.arc( meteor.position.x , meteor.position.y, 10, 0, dPI );
	ctx.stroke();

	meteor.velocity.x = meteor.velocity.x > 5 ? 5 : meteor.velocity.x;
	meteor.velocity.y = meteor.velocity.y > 5 ? 5 : meteor.velocity.y;

};

var Derivative = function(position, velocity){
	this.position = position ? position : new Vec(0, 0);
	this.velocity = velocity ? velocity : new Vec(0, 0);
		
	this.iadd = function(other){
		this.position.iadd(other.position);
		this.velocity.iadd(other.velocity);
		return this;
	}
	this.add = function(other){
		return new Derivative(
			this.position.add(other.position),
			this.velocity.add(other.velocity)
		)
	}

	this.mul = function(scalar){
		return new Derivative(
			this.position.mul(scalar),
			this.velocity.mul(scalar)
		)
	}
	this.imul = function(scalar){
		this.position.imul(scalar);
		this.velocity.imul(scalar);
		return this;
	}
}
var compute = function(center, initial, delta, derivative){
	var state = derivative.mul(delta).add(initial);
		return new Derivative(
		state.velocity,
		acceleration(center, state.position)
	);
}

var Vec = function(x, y){
	this.type = 'Vector';
	this.x = x;
	this.y = y;
}

Vec.prototype = {
	isub: function(other){
		this.x -= other.x;
		this.y -= other.y;
		return this;
	},
	sub: function(other){
		return new Vec(
			this.x - other.x,
			this.y - other.y
		);
	},
	iadd: function(other){
		this.x += other.x;
		this.y += other.y;
		return this;
	},
	add: function(other){
		return new Vec(
			this.x + other.x,
			this.y + other.y
		);
	},

	imul: function(scalar){
		this.x *= scalar;
		this.y *= scalar;
		return this;
	},
	mul: function(scalar){
		return new Vec(
			this.x * scalar,
			this.y * scalar
		)
	},
	idiv: function(scalar){
		this.x /= scalar;
		this.y /= scalar;
		return this;
	},
	div: function(scalar){
		return new Vec(
			this.x / scalar,
			this.y / scalar
		)
	},

	normalized: function(){
		var x=this.x, y=this.y;
		var length = Math.sqrt(x*x + y*y)
		return new Vec(x/length, y/length);
	},
	normalize: function(){
		var x=this.x, y=this.y;
		var length = Math.sqrt(x*x + y*y)
		this.x = x/length;
		this.y = y/length;
		return this;
	},

	length: function(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},

	distance: function(other){
		var x = this.x - other.x;
		var y = this.y - other.y;
		return Math.sqrt(x*x + y*y);
	},

	copy: function(){
		return new Vec(this.x, this.y);
	}
}

var acceleration = function(a, b){
	var G = (bMOON_G || bBLOCK_G) ? fMOON_G : fEARTH_G;
	var direction = a.sub(b);
	var length = direction.length();
	var normal = direction.normalized();
	return normal.mul(G/Math.pow(length, 2));
};

var copy = function(){
	var result = {}
	for(name in this){
		if(this[name].type == 'Vector'){
			result[name] = this[name].copy();
		}
		else{
			result[name] = this[name];
		}
	}
	return result;
}

// ...
canvas.onmousemove = function(move){
	angle = Math.atan2(move.offsetY - centerY, move.offsetX - centerX) * 180/Math.PI;
}

window.onkeydown = function (press) {	
	if(press.keyCode == 83) {
		if(!bGAME && !bPAUSE){
			bGAME = true;
			start();
		}

	} else if(press.keyCode == 80) {
		bGAME = bGAME ? false : true;
		bPAUSE = bPAUSE ? false : true;
		if(bGAME) requestAnimationFrame(render);
	}
};
