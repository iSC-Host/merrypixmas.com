$(document).on('touchstart', function(e){ 
    e.preventDefault(); 
});


var count = {head:0, headScale:0, torso:0, legs:0, legScale:0, fill:0, bk:0};
var total = {skin:19, fill:10, bk:10};
var headScales = [1, 1.5, 0.5];
var legScales = [1, 1.5, 0.5];
var doShared = false;
var base = 24;

var $url = purl();
if($url.attr('query')){
	var params = $url.attr('query').split('');
	count.head = parseInt(params[0], base);
	count.headScale = parseInt(params[1], base);
	count.torso = parseInt(params[2], base);
	count.legs = parseInt(params[3], base);
	count.legScale = parseInt(params[4], base);
	count.fill = parseInt(params[5], base);
	count.bk = parseInt(params[6], base);
	doShared = true;
}


//app
$(document).ready(function() {
	
	var loader = new PxLoader();
	
	for(var i=0; i<skins.length; i++){
		var img = new PxLoaderImage('/img/skins/'+skins[i]);
		loader.add(img);
	}
	
	loader.addProgressListener(function(e){
		var percent = Math.round(((e.completedCount / e.totalCount) * 100) / 10) * 10 / 10;
		//console.log(e.completedCount, e.totalCount, percent+'0%');
		$('.loading li').eq(percent-1).addClass('full');
		if(percent === 10){
			setTimeout(function(){
				$('.loading').addClass('x');
				$('.scene').removeClass('x');
				
			}, 500);
		}
	});
	
	if(!$.browser.msie){
		loader.start();
	}
	
	
	//tracking	
	$.track = {
		page: function(url){
			console.log('TRACK:', url)
			//ga
			ga('send', 'pageview', url);
		},
		
		event: function(category, action){
			console.log('TRACK:', 'event', category, action)
			ga('send', 'event', category, action, $url.segment(1));
		}
	}
	
	var $phantom = {s:1, x:0, y:0};
	var $wrapper = $('.george-wrapper');
	var $george = $('.george');
	var $scene = $('.scene');
	var props = {x:0, y:0, rx:0, ry:0, rz:0, s:1};
	
	
	
	//console.log($george.css('transform'));
	var mcScene = new Hammer.Manager($scene[0]);
		mcScene.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
		mcScene.add( new Hammer.Pinch({ threshold: 0 }) );
		mcScene.on("pan", function(e){
			//console.log(e.deltaX)
			props.rx = props.x + e.deltaX;
			props.ry = props.y - e.deltaY;
			
			//props.ry = Math.pow(props.ry, e.deltaX);
			TweenMax.to($george, 0.5, {'scale': props.s , 'rotationY': props.rx, 'rotationX': props.ry, overwrite:1, ease:Strong.easeOut});
			
			//TweenMax.to($george, 0.5, {'rotationY': props.rx, 'rotationX': props.ry, 'rotationZ': props.rz, overwrite:1, ease:Strong.easeOut, onUpdate:function(){
				//$george.css('transform', 'scale('+props.s+') '+$george.css('transform'));
			//}});

		}).on("panend", function(e){
			props.x += e.deltaX;
			props.y -= e.deltaY;
		}).on('pinchstart pinchmove', function(e){
			if(e.type == 'pinchstart') {
            	$phantom.s = props.s;
        	}
			
			TweenMax.to($scene, 0, {'scale': $phantom.s * e.scale, overwrite:1, ease:Strong.easeOut, onUpdate:function(){
				props.s = $phantom.s * e.scale
				//console.log(this)
			}});
			
		}).on('pinchend', function(e){
			//console.log('end',$phantom.s)
			
		});
		
	

		
	var headScale = {s:0};
	var mcHead = new Hammer.Manager($george.find('.head')[0]);
		mcHead.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcHead.on("doubletap", function(e){
			count.headScale++;
			if(count.headScale == headScales.length){count.headScale = 0;}
			doHeadScale();
		});
		function doHeadScale(){
			TweenMax.to(headScale, 0.5, {'s': headScales[count.headScale], overwrite:1, ease:Elastic.easeOut, onUpdate:function(){
				//console.log(headScale.s);
				$george.find('.header').css('transform', 'scale3d('+headScale.s+', '+headScale.s+', '+headScale.s+')');
			}});
		}
		if(doShared){doHeadScale();}
		
	var legScale = {s:0};
	var mcLegLeft = new Hammer.Manager($george.find('.left-leg')[0]);
	var mcLegRight = new Hammer.Manager($george.find('.right-leg')[0]);
		mcLegLeft.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcLegRight.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcLegLeft.on("doubletap", function(e){
			count.legScale++;
			if(count.legScale == legScales.length){count.legScale = 0;}
			doLegScale();
		});
		mcLegRight.on("doubletap", function(e){
			count.legScale++;
			if(count.legScale == legScales.length){count.legScale = 0;}
			doLegScale();
		});
		function doLegScale(){
			TweenMax.to(legScale, 0.5, {'s': legScales[count.legScale], overwrite:1, ease:Elastic.easeOut, onUpdate:function(){
				$george.find('.legs').css('transform', 'scale3d('+legScale.s+', '+legScale.s+', '+legScale.s+')');
			}});
		}
		if(doShared){doLegScale();}
	
	
	var mcTorso = new Hammer.Manager($george.find('.torso')[0]);
		mcTorso.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcTorso.on("doubletap", function(e){
			randomise();
		});
	var mcArmLeft = new Hammer.Manager($george.find('.left-arm')[0]);
		mcArmLeft.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcArmLeft.on("doubletap", function(e){
			randomise();
		});
	var mcArmRight = new Hammer.Manager($george.find('.right-arm')[0]);
		mcArmRight.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		mcArmRight.on("doubletap", function(e){
			randomise();
		});
	
	
	
	
	var mcToggle = new Hammer.Manager($('footer .toggle')[0]);
		//mcToggle.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
		//mcToggle.add(new Hammer.Tap()).requireFailure(mcToggle.get('doubletap'));
		mcToggle.add(new Hammer.Tap());
		mcToggle.on('tap', function(e){
			$('footer').toggleClass('open');
		});
		/*mcToggle.on("doubletap", function(e){
			randomise();
		});*/
		
	
	
	var mcNavHead = new Hammer.Manager($('.controls .head')[0]);
		mcNavHead.add(new Hammer.Tap());
		mcNavHead.on('tap', function(e){
			count.head ++;
			if(count.head == total.skin) {count.head = 0;}
			doHead();
		});
		function doHead(){
			var $items = $george.find('.head');
			clearSkin($items, 'skin');
			$items.addClass('skin'+count.head);
			TweenMax.fromTo($george.find('.head span'), 0.5, {'opacity':1}, {'opacity':0})
		}
		$('.controls .head').on('click', emptyClick);
		if(doShared){doHead();}
	
	
	var mcNavTorso = new Hammer.Manager($('.controls .torso')[0]);
		mcNavTorso.add(new Hammer.Tap());
		mcNavTorso.on('tap', function(e){
			count.torso ++;
			if(count.torso == total.skin) {count.torso = 0;}
			doTorso();
		});
		function doTorso(){
			var $items = $george.find('.torso, .left-arm, .right-arm');
			clearSkin($items, 'skin');
			$items.addClass('skin'+count.torso);
			TweenMax.fromTo($george.find('.torso span, .left-arm span, .right-arm span'), 0.5, {'opacity':1}, {'opacity':0})
		}
		$('.controls .torso').on('click', emptyClick);
		if(doShared){doTorso();}
	
	
	var mcNavLegs = new Hammer.Manager($('.controls .legs')[0]);
		mcNavLegs.add(new Hammer.Tap());
		mcNavLegs.on('tap', function(e){
			count.legs ++;
			if(count.legs == total.skin) {count.legs = 0;}
			doLegs();
		});
		function doLegs(){
			var $items = $george.find('.left-leg, .right-leg');
			clearSkin($items, 'skin');
			$items.addClass('skin'+count.legs);
			TweenMax.fromTo($george.find('.left-leg span, .right-leg span'), 0.5, {'opacity':1}, {'opacity':0})
		}
		$('.controls .legs').on('click', emptyClick);
		if(doShared){doLegs();}
	
	
	var mcNavFill = new Hammer.Manager($('.controls .fill')[0]);
		mcNavFill.add(new Hammer.Tap());
		mcNavFill.on('tap', function(e){
			count.fill ++;
			if(count.fill == total.fill) {count.fill = 0;}
			doFill();
			
		});
		function doFill(){
			var $items = $george;
			clearSkin($items, 'fill');
			$items.addClass('fill'+count.fill);
		}
		$('.controls .fill').on('click', emptyClick);
		if(doShared){doFill();}

	
	var mcNavBk = new Hammer.Manager($('.controls .fill-background')[0]);
		mcNavBk.add(new Hammer.Tap());
		mcNavBk.on('tap', function(e){
			count.bk ++;
			if(count.bk == total.bk) {count.bk = 0;}
			doBk();
		});
		function doBk(){
			var $items = $('body');
			clearSkin($items, 'bk');
			$items.addClass('bk'+count.bk);
		}
		$('.controls .fill-background').on('click', emptyClick);
		if(doShared){doBk();}
		
		
		
		
	var mcNavInfo = new Hammer.Manager($('.info')[0]);
		mcNavInfo.add(new Hammer.Tap());
		mcNavInfo.on('tap', function(e){
			$('.modal').removeClass('hidden');
		});
		$('.info').on('click', emptyClick);
		
	var mcNavClose = new Hammer.Manager($('.modal .close')[0]);
		mcNavClose.add(new Hammer.Tap());
		mcNavClose.on('tap', function(e){
			$('.modal').addClass('hidden');
		});
		$('.modal .close').on('click', emptyClick);
		
	var mcNavLink = new Hammer.Manager($('.modal .scroll a')[0]);
		mcNavLink.add(new Hammer.Tap());
		mcNavLink.on('tap', function(e){
			//document.location = $('.modal .scroll a').attr('href');
			window.open($('.modal .scroll a').attr('href'));
		});
		$('.modal .scroll a').on('click', emptyClick);
	
	
	
	var mcShareTweet = new Hammer.Manager($('.social .twitter')[0]);
		mcShareTweet.add(new Hammer.Tap());
		mcShareTweet.on('tap', function(e){
			//document.location = '#'+createShareUrl();
			$('.social .twitter').attr('href', 'https://twitter.com/share?url=http://'+$url.attr('host')+'/?'+createShareUrl()+'&text='+encodeURIComponent('Check out my character at')+'&hashtags=pixmas')
			window.open('https://twitter.com/share?url=http://'+$url.attr('host')+'/?'+createShareUrl()+'&text='+encodeURIComponent('Check out my character at')+'&hashtags=pixmas');
		});
		$('.social .twitter').on('click', emptyClick);
		/*$('.social .twitter').on('click', function(e){
			$(this).attr('href', 'https://twitter.com/share?url=http://'+$url.attr('host')+'/?'+createShareUrl()+'&text='+encodeURIComponent('Created at merrypixmas.com #pixmas'))
		});*/
	
	var mcShareFB = new Hammer.Manager($('.social .facebook')[0]);
		mcShareFB.add(new Hammer.Tap());
		mcShareFB.on('tap', function(e){
			//document.location = '#'+createShareUrl();
			$('.social .facebook').attr('href', 'http://www.facebook.com/sharer.php?u=http://'+$url.attr('host')+'/?'+createShareUrl())
			window.open('http://www.facebook.com/sharer.php?u=http://'+$url.attr('host')+'/?'+createShareUrl());
		});
		$('.social .facebook').on('click', emptyClick);
		/*$('.social .facebook').on('click', function(e){
			$(this).attr('href', 'http://www.facebook.com/sharer.php?u=http://'+$url.attr('host')+'/?'+createShareUrl())
		});*/

	
	function emptyClick(e){
		e.preventDefault();
	}
	
	function clearSkin($this, type){
		for(var i=0; i<total[type]; i++){
			$this.removeClass(type+i);
		}
	}
	
	
	function rotate(){
		//console.log(this);
		var radius=Math.sqrt(Math.pow(this.rotation,2)+Math.pow(0,2));
		var degree=(radius*-225);
		//$('.george').css('transform','scale(1) rotate3d('+tiltx+', '+tilty+', 0, '+degree+'deg)');
		$('.george').css('transform','scale('+scale+') rotate3d(0, '+this.rotation+', 0, '+radius+'deg)');
		//console.log($george.css('transform'));
	}
	
	
	function randomise() {
		
		count.head = random(total.skin);
		count.headScale = random(3);
		count.torso = random(total.skin);
		count.legs = random(total.skin);
		count.legScale = random(3);
		count.fill = random(total.fill);
		count.bk = random(total.bk);
		
		doHead();
		doHeadScale();
		doTorso();
		doLegs();
		doLegScale();
		doFill();
		doBk();
	}
	
	function random(max){
		return Math.floor((Math.random() * (max-1)));
	}
	
	function createShareUrl() {
		var url = '';
		
			url += count.head.toString(base);
			url += count.headScale.toString(base);
			url += count.torso.toString(base);
			url += count.legs.toString(base);
			url += count.legScale.toString(base);
			url += count.fill.toString(base);
			url += count.bk.toString(base);
			
		return url;
	}
	

	$(window).on('resize', function(){
		jsCanvasSnow.resize(window.innerWidth, window.innerHeight);
	});
	
	jsCanvasSnow.init();


	window.addEventListener('shake', function(){
		jsCanvasSnow.restart();
	}, false);




	
});


//GA
(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-18656412-14','auto');ga('send','pageview');


//app mode
(function($){
	if(window.navigator.standalone){
		$('html').addClass('standalone');
	}
})(jQuery);



//if (Function('/*@cc_on return document.documentMode===10@*/')()||Function('/*@cc_on return document.documentMode===11@*/')()){
//	document.documentElement.className+=' ie';
//}

//Browser
(function($){
	$.uaMatch = function( ua ) {
		ua = ua.toLowerCase();
		//console.log(ua)
	
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			/(trident)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
	
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
	
	// Don't clobber any existing jQuery.browser in case it's different
	if ( !$.browser ) {
		matched = $.uaMatch( navigator.userAgent );
		browser = {
			/*webkit: false,
			opera: false,
			msie: false,
			mozilla: false,
			chrome: false,
			safari: false*/
		};
		
		browser.compatibility = false;
	
		if ( matched.browser ) {
			
			//IE11
			if(matched.browser == 'trident'){
				matched.browser = 'msie';
			}
			browser[ matched.browser ] = true;
			browser.version = matched.version;
			
			//ie compatibility mode
			if(browser.msie){
				var ua = navigator.userAgent;
				if(/Trident\/7/.exec(ua) && browser.version < 11){
					browser.compatibility = true;
				}
				if(/Trident\/6/.exec(ua) && browser.version < 10){
					browser.compatibility = true;
				}
				if(/Trident\/5/.exec(ua) && browser.version < 9){
					browser.compatibility = true;
				}
				if(/Trident\/4/.exec(ua) && browser.version < 8){
					browser.compatibility = true;
				}
			}
		}
		
		
	
		// Chrome is Webkit, but Webkit is also Safari.
		if ( browser.chrome ) {
			browser.webkit = true;
		} else if ( browser.webkit ) {
			browser.safari = true;
		}
		
		browser.majorVersion = browser.version.substring(0, browser.version.indexOf('.'));
	
		$('html').addClass(matched.browser);
		$('html').addClass(matched.browser+browser.majorVersion);
	
		$.browser = browser;
	}
	
})(jQuery);




function jsParticle(origin, velocity, size, amplitude)
{
	this.origin = origin;
	this.position = new Vector2(origin.x, origin.y);
	this.velocity = velocity || new Vector2(0, 0);
	this.size = size;
	this.amplitude = amplitude;
	this.melted = false;
	
	// randomize start values a bit
	this.dx = Math.random() * 100;
	
	this.update = function(delta_time)
	{
		this.position.y += this.velocity.y * delta_time;
		
		// oscilate the x value between -amplitude and +amplitude
		this.dx += this.velocity.x*delta_time;		
		this.position.x = this.origin.x + (this.amplitude * Math.sin(this.dx));
	};
}

var jsCanvasSnow = 
{
	canvas : null,
	ctx : null,
	particles : [],
	running : false,
	end: false,
	
	start_time : 0,
	frame_time : 0,
	
	frameId: null,

	init : function( )
	{
		// use the container width and height
		this.canvas = document.getElementById('snow');
		this.ctx = this.canvas.getContext('2d');
		this.resize(window.innerWidth, window.innerHeight);    

		// change these values
    // the 2 element arrays represent min and max values
		this.pAmount = 100;         // amount of particles
		this.pSize = [2, 5];    // min and max size
		this.pSwing = [0.1, 1];      // min and max oscilation speed for x movement
		this.pSpeed = [40, 100],     // min and max y speed
		this.pAmplitude = [25, 50];  // min and max distance for x movement
		this.pTime = 10;
		
		//this._init_particles();
	},
	
	start : function()
	{
		this.running = true;
		this.start_time = this.frame_time = microtime();
		this._loop();
	},
	
	restart: function(){
		if(!this.running){
			this._init_particles();
			this.start();
		}else{
			this.start_time = this.frame_time = microtime();
			this._init_partial_particles();
		}
	},
	
	stop : function()
	{
		this.running = false;
		for ( var i = 0 ; i < this.particles.length ; i++){
			//this.particles[i].melted = false;
			delete this.particles[i];
		}
		this.particles.length = 0;
		window.cancelAnimationFrame(this.frameId);
	},
  
  resize : function(w, h)
  {
    this.canvas.width = w;
    this.canvas.height = h;
  },
	
	_loop : function()
	{
		if ( jsCanvasSnow.running )
		{
			jsCanvasSnow._clear();
			jsCanvasSnow._update();
			jsCanvasSnow._draw();
			jsCanvasSnow._queue();
		}
	},	
	
	_init_particles : function()
	{
		// clear the particles array
		this.particles.length = 0;
		
		for ( var i = 0 ; i < this.pAmount ; i++) 
		{
			var origin = new Vector2(frand(0, this.canvas.width), frand(-this.canvas.height, 0));
			var velocity = new Vector2(frand(this.pSwing[0],this.pSwing[1]), frand(this.pSpeed[0],this.pSpeed[1]));
			var size = frand(this.pSize[0], this.pSize[1]);
			var amplitude = frand(this.pAmplitude[0], this.pAmplitude[1]);
			
			this.particles.push(new jsParticle(origin, velocity, size, amplitude));
		}
	},
	
	_init_partial_particles : function()
	{
		for ( var i = 0 ; i < this.particles.length ; i++)
		{
			if(this.particles[i].melted){
			var origin = new Vector2(frand(0, this.canvas.width), frand(-this.canvas.height, 0));
			var velocity = new Vector2(frand(this.pSwing[0],this.pSwing[1]), frand(this.pSpeed[0],this.pSpeed[1]));
			var size = frand(this.pSize[0], this.pSize[1]);
			var amplitude = frand(this.pAmplitude[0], this.pAmplitude[1]);
			
			this.particles[i] = new jsParticle(origin, velocity, size, amplitude);
			}
		}
	},

	_update : function()
	{
		// calculate the time since the last frame
		var now_time = microtime();
		var delta_time = now_time - this.frame_time;
		var allMelted = true;
		
		for ( var i = 0 ; i < this.particles.length ; i++)
		{
			var particle = this.particles[i];
			particle.update(delta_time);
			
			
				if (particle.position.y-particle.size > this.canvas.height)
				{
					if(now_time < this.start_time + this.pTime){
						// reset the particle to the top and a random x position
						particle.position.y = -particle.size;
						particle.position.x = particle.origin.x = Math.random() * this.canvas.width;
						particle.dx = Math.random() * 100;
						allMelted = false;
					}else{
						particle.melted = true;
					}
				}else{
					allMelted = false;
				}
				
			
		}
		
		if(allMelted){
			this.stop();
		}
		
		// save this time for the next frame
		this.frame_time = now_time;
	},
	
	_draw : function()
	{
		this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
		
		for ( var i = 0 ; i < this.particles.length ; i++)
		{
			var particle = this.particles[i];
			//this.ctx.fillRect(particle.position.x, particle.position.y, particle.size, particle.size);
			this.ctx.beginPath();
			this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
			this.ctx.fill();
		}
	},
	
	_clear : function()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	_queue : function()
	{
		this.frameId = window.requestAnimationFrame( jsCanvasSnow._loop );
	}
};

function microtime()
{
	return new Date().getTime()*0.001;
}

// returns a random integer from min to max
function irand(min, max)
{
	return Math.floor((min||0) + Math.random() * ((max+1||100) - (min||0)));
}

// returns a random float from min to max
function frand(min, max)
{
	return (min||0) + Math.random() * ((max||1) - (min||0));
}

function clamp(value, min, max)
{
	return Math.min(Math.max(value, min), max);
}

// Two component vector class
function Vector2(x, y)
{
	this.x = x || 0;
	this.y = y || 0;
	
	this.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
	}
	
	this.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}

function Color(r, g, b)
{
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
}