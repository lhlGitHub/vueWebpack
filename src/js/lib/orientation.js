const moveSlowly = (des, start, time) => {
	if(document.querySelector('.header')){
		des-=59;
			console.log('des',des)
		}
	clearInterval(timeout);
	var speedTime = time || 100;
	var start = start || 0;
	var distance = des - start;
	var speed = distance / speedTime;
	var i = 1;
	var pos = start;
	
	var timeout = setInterval(function() {
		if(i == speedTime) {
			pos = des;
			 document.querySelector('#main').scrollTop = pos;
			// console.log('pos',pos)
			clearInterval(timeout);
		} else {
			pos = pos + speed;
			 document.querySelector('#main').scrollTop = pos;	
//			window.scrollTo(0,pos)
			i++;
		}

	}, 1)
}
export default {
	moveSlowly
}