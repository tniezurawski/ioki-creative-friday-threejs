var Configuration = function(){
	this.step = 1;
	this.animateRemoving = true;
	this.animateRemovingTime = 50;	// in milliseconds

	this.bonusAnimationTime = 700;
}

var config = new Configuration();

var colors = [
	0xC0C0C0, 0x808080, 0xFF0000, 0x800000, 0xFFFF00, 0x808000, 0x00FF00, 0x008000, 0x00FFFF,
	0x008080, 0x0000FF, 0x000080, 0xFF00FF, 0x800080
]