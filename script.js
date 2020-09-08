document.onkeydown = function(e) {
	if (event.keyCode == 123) {
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
		return false;
	}
	if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
		return false;
	}
};

class Machine {
	constructor() {
		// payTable specifies which winning combinations produce which payout
		// Winning combinations are codified as follows 1: 3xBar, 2: Bar, 3: 2xBar, 4: 7, 5: cherry.
		// If a reel is in a 'top-bottom' position, it is described by two numbers e.g. 51
		// If a reel is in a 'middle' position, it is described by three numbers e.g. 451
		this.musicOn = false;
		this.payTable = {
			2000: [ 515151 ],
			1000: [ 451451451 ],
			4000: [ 454545 ],
			150: [ 345345345, 343434 ],
			75: [
				345345451,
				345451345,
				451345345,
				451451345,
				451345451,
				345451451,
				454551,
				455145,
				514545,
				515145,
				514551,
				455151,
				343445,
				344534,
				453434,
				454534,
				453445,
				344545
			],
			50: [ 121212, 512512512 ],
			20: [ 234234234, 232323 ],
			10: [ 123123123 ],
			5: [
				121223,
				122312,
				231212,
				122323,
				231223,
				232312,
				121234,
				123412,
				341212,
				123434,
				341234,
				343412,
				232334,
				233423,
				342323,
				233434,
				342334,
				343423,
				122334,
				123423,
				231234,
				341223,
				341224,
				233412,
				342412,
				515112,
				511251,
				125151,
				511212,
				125112,
				121251,
				515123,
				512351,
				235151,
				512323,
				235123,
				232351,
				121223,
				122312,
				231212,
				122323,
				231223,
				232312,
				511223,
				512312,
				125123,
				235112,
				122351,
				231251,
				513513123,
				513123513,
				123513513,
				513123123,
				123513123,
				123123513,
				513513234,
				513234513,
				234513513,
				513234234,
				234513234,
				234234513,
				123123234,
				123234123,
				234123123,
				123234234,
				234123234,
				234234123,
				513123234,
				513234123,
				123513234,
				234513123,
				123234513,
				234123512,
				123512123,
				512123123,
				512234123,
				512512234,
				512234512,
				512123234,
				512234234,
				234512234,
				123123512,
				512123512,
				234234512,
				234512512,
				123234512,
				123512234,
				512512123,
				123512512
			]
		};
		// line specifies which line a winning combination occurs on
		this.line = {
			top: [
				515151,
				454551,
				455145,
				514545,
				515145,
				514551,
				455151,
				121212,
				121223,
				122312,
				231212,
				122323,
				231223,
				232312,
				341223,
				121234,
				123412,
				341212,
				123434,
				341234,
				343412,
				232334,
				233423,
				342323,
				233434,
				342334,
				343423,
				122334,
				123423,
				231234,
				341224,
				233412,
				342412
			],
			middle: [
				451451451,
				345345345,
				345345451,
				345451345,
				451345345,
				451451345,
				451345451,
				345451451,
				512512512,
				234234234,
				123123123,
				513513123,
				513123513,
				123513513,
				513123123,
				123513123,
				123123513,
				513513234,
				513234513,
				234513513,
				513234234,
				234513234,
				234234513,
				123123234,
				123234123,
				234123123,
				123234234,
				234123234,
				234234123,
				513123234,
				513234123,
				123513234,
				234513123,
				123234513,
				234123512,
				123512123,
				512123123,
				512234123,
				512512234,
				512234512,
				512123234,
				512234234,
				234512234,
				123123512,
				512123512,
				234234512,
				234512512,
				123234512,
				123512234,
				512512123,
				123512512
			],
			bottom: [
				454545,
				343434,
				343445,
				344534,
				453434,
				454534,
				453445,
				344545,
				232323,
				515112,
				511251,
				125151,
				511212,
				125112,
				121251,
				515123,
				512351,
				235151,
				512323,
				235123,
				232351,
				121223,
				122312,
				231212,
				122323,
				231223,
				232312,
				511223,
				512312,
				125123,
				235112,
				122351,
				231251
			]
		};
		// lineChooser is used for mapping
		this.lineChooser = {
			top: 'topLine',
			middle: 'middleLine',
			bottom: 'bottomLine'
		};
		// fromTo specifies how many pixels a reel will move given the current position and the stop position
		// this amount will be added to pixels that make up 5 full revolutions for each reel
		this.fromTo = {
			123: {
				123: 500,
				23: 450,
				234: 400,
				34: 350,
				345: 300,
				45: 250,
				451: 200,
				51: 150,
				512: 100,
				12: 50
			},
			23: {
				23: 500,
				234: 450,
				34: 400,
				345: 350,
				45: 300,
				451: 250,
				51: 200,
				512: 150,
				12: 100,
				123: 50
			},
			234: {
				234: 500,
				34: 450,
				345: 400,
				45: 350,
				451: 300,
				51: 250,
				512: 200,
				12: 150,
				123: 100,
				23: 50
			},
			34: {
				34: 500,
				345: 450,
				45: 400,
				451: 350,
				51: 300,
				512: 250,
				12: 200,
				123: 150,
				23: 100,
				234: 50
			},
			345: {
				345: 500,
				45: 450,
				451: 400,
				51: 350,
				512: 300,
				12: 250,
				123: 200,
				23: 150,
				234: 100,
				34: 50
			},
			45: {
				45: 500,
				451: 450,
				51: 400,
				512: 350,
				12: 300,
				123: 250,
				23: 200,
				234: 150,
				34: 100,
				345: 50
			},
			451: {
				451: 500,
				51: 450,
				512: 400,
				12: 350,
				123: 300,
				23: 250,
				234: 200,
				34: 150,
				345: 100,
				45: 50
			},
			51: {
				51: 500,
				512: 450,
				12: 400,
				123: 350,
				23: 300,
				234: 250,
				34: 200,
				345: 150,
				45: 100,
				451: 50
			},
			512: {
				512: 500,
				12: 450,
				123: 400,
				23: 350,
				234: 300,
				34: 250,
				345: 200,
				45: 150,
				451: 100,
				51: 50
			},
			12: {
				12: 500,
				123: 450,
				23: 400,
				234: 350,
				34: 300,
				345: 250,
				45: 200,
				451: 150,
				51: 100,
				512: 50
			}
		};
		// start_position keeps track of the start position of each reel
		this.start_position = {
			1: 23,
			2: 23,
			3: 23
		};

		// end position keeps track of the stop position of each reel
		// both of these value are obviously set before any animation takes place.
		this.end_position = {
			1: 23,
			2: 23,
			3: 23
		};

		// helper is a simple mapper to codify user inputs (symbol, position) for each reel outcome in debugger mode
		this.helper = {
			1: {
				top: 12,
				middle: 512,
				bottom: 51
			},
			2: {
				top: 23,
				middle: 123,
				bottom: 12
			},
			3: {
				top: 34,
				middle: 234,
				bottom: 23
			},
			4: {
				top: 45,
				middle: 345,
				bottom: 34
			},
			5: {
				top: 51,
				middle: 451,
				bottom: 45
			}
		};
		// all possible positions of a single reel
		this.array = [ 123, 23, 234, 34, 345, 45, 451, 51, 512, 12 ];

		this.balance = document.getElementById('balance').value;
		this.displayedBalance = document.getElementById('balance').value;
		this.winningLine = 'None';
		this.winAmount = 0;
		this.inputs = document.querySelectorAll('input');
		this.selects = document.querySelectorAll('select');

		gsap.set('.box1', {
			backgroundColor: 'none',
			y: (i) => i * 100
		});
		gsap.set('.box2', {
			backgroundColor: 'none',
			y: (i) => i * 100
		});
		gsap.set('.box3', {
			backgroundColor: 'none',
			y: (i) => i * 100
		});
		document.getElementById('currentBalance').innerHTML = this.balance;
	}
	// Toggles Debugger options
	toggleDebugger() {
		playAudio('./sound/button.mp3');
		if (!document.getElementsByName('mode')[0].checked) {
			document.getElementById('debug_area').style.display = 'none';
		} else {
			document.getElementById('debug_area').style.display = 'block';
		}
	}
	// defineResult checks if debugger is active or not, then calculates either prespecified or random end_positions for each reel and finds out the winning line & win amount
	defineResult() {
		let inDebugMode = document.getElementsByName('mode')[0].checked;
		// console.log(inDebugMode);
		this.start_position = Object.assign({}, this.end_position);
		if (!inDebugMode) {
			this.end_position[1] = this.array[Math.floor(Math.random() * this.array.length)];
			this.end_position[2] = this.array[Math.floor(Math.random() * this.array.length)];
			this.end_position[3] = this.array[Math.floor(Math.random() * this.array.length)];
			// console.log('REELS SET: ');
			// console.log(this.end_position);
		} else {
			let symbol1 = parseInt(document.getElementById('firstsymbol').value); // 1
			let line1 = document.getElementById('firstline').value; // 'top'
			let symbol2 = parseInt(document.getElementById('secondsymbol').value); // 1
			let line2 = document.getElementById('secondline').value; // 'top'
			let symbol3 = parseInt(document.getElementById('thirdsymbol').value); // 1
			let line3 = document.getElementById('thirdline').value; // 'top'

			this.end_position[1] = this.helper[symbol1][line1];
			this.end_position[2] = this.helper[symbol2][line2];
			this.end_position[3] = this.helper[symbol3][line3];

			// console.log('REELS SET: ');
			// console.log(this.end_position);
		}
		let result = parseInt([
			this.end_position[1].toString() + this.end_position[2].toString() + this.end_position[3].toString()
		]);
		// console.log(result);
		for (const property in this.line) {
			if (this.line[property].includes(result)) {
				// console.log(property);
				this.winningLine = property;
				break;
			}
		}
		for (const property in this.payTable) {
			if (this.payTable[property].includes(result)) {
				// console.log(property);
				this.winAmount = property;
				break;
			}
		}
	}

	// blink and foo are used for toggling the win line
	foo() {
		// console.log('blink');
		// console.log(this.winningLine);
		// console.log(this.lineChooser[this.winningLine]);
		// console.log(this.winAmount);
		// console.log(document.getElementsByName(this.winAmount)[0]);

		document.getElementById(this.lineChooser[this.winningLine]).style.visibility = 'visible';
		document.getElementsByName(this.winAmount)[0].parentNode.style.visibility = 'hidden';

		// document.getElementsByName(this.winAmount)[0].classList.add("glow")

		setTimeout(() => {
			document.getElementById(this.lineChooser[this.winningLine]).style.visibility = 'hidden';
			document.getElementsByName(this.winAmount)[0].parentNode.style.visibility = 'visible';
		}, 400);
	}

	blink(count) {
		if (count < 5) {
			this.foo();
			// var caller = arguments.callee;
			window.setTimeout(function() {
				machine.blink(count + 1);
			}, 800);
			playAudio('./sound/win.mp3');
		} else {
			this.winAmount = 0;
			this.winningLine = 'None';
			document.querySelector('button').disabled = false;
			this.inputs.forEach((i) => (i.disabled = false));
			this.selects.forEach((i) => (i.disabled = false));
		}
	}

	// animate uses GSAP to animate the reels.
	// it first animates each reel 5 full revolutions, and then some more, depending on the stop position of each reel as set by defineResults
	animate() {
		var tl = new TimelineMax();
		tl
			.to('.box1', {
				duration: 0.35,
				ease: 'none',
				y: `+=500`, //move each 50px box 250px to right (5 full rotations)
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 5
			})
			.to('.box1', {
				duration: 0.5,
				ease: 'none',
				y: `+=${this.fromTo[this.start_position[1]][this.end_position[1]]}`, //move each box 50px or 1 number to right /// 25 for half movement
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 0
			});

		var t2 = new TimelineMax();
		t2
			.to('.box2', {
				duration: 0.4,
				ease: 'none',
				y: '+=500', //move each box 500px to right
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 5
			})
			.to('.box2', {
				duration: 0.5,
				ease: 'none',
				y: `+=${this.fromTo[this.start_position[2]][this.end_position[2]]}`, //move each box 50px or 1 number to right /// 25 for half movement
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 0
			});

		var t3 = new TimelineMax();
		t3
			.to('.box3', {
				duration: 0.45,
				ease: 'none',
				y: '+=500', //move each box 500px to right
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 5
			})
			.to('.box3', {
				duration: 0.5,
				ease: 'none',
				y: `+=${this.fromTo[this.start_position[3]][this.end_position[3]]}`, //move each box 50px or 1 number to right /// 25 for half movement
				modifiers: {
					y: gsap.utils.unitize((y) => parseFloat(y) % 500) //force x value to be between 0 and 500 using modulus
				},
				repeat: 0
			});
	}

	// pickResult runs when player clicks play
	// IF player has enough funds buttons and inputs get disabled and the game starts,
	// first defineResult picks the ending position
	// then animate animates the reels to specified positions
	// If the game was a success a blink animation will activate on the reels and paytable.
	async pickResult() {
		if (!this.musicOn) {
			playAudio('sound/ambient.mp3');
			this.musicOn = true;
		}
		if (this.balance >= 1) {
			this.balance -= 1;
			document.getElementById('balance').value = this.balance;
			document.getElementById('currentBalance').innerHTML = this.balance;
			const button = document.querySelector('button');

			this.inputs.forEach((i) => (i.disabled = true));
			this.selects.forEach((i) => (i.disabled = true));

			button.disabled = true;
			this.defineResult();
			playAudio('./sound/gears.mp3');
			await new Promise((resolve) => {
				// this.getResults();
				this.animate();
				setTimeout(resolve, 3500);
			});
			if (this.winAmount === 0 || this.winningLine === 'None') {
				// console.log('NO LUCK TRY AGAIN!');
				button.disabled = false;
				this.inputs.forEach((i) => (i.disabled = false));
				this.selects.forEach((i) => (i.disabled = false));
			} else {
				// console.log('Winning amount: ' + this.winAmount + ' on ' + this.winningLine + ' row!!!');
				this.balance += parseInt(this.winAmount);
				document.getElementById('balance').value = this.balance;
				document.getElementById('currentBalance').innerHTML = this.balance;
				this.blink(2);
			}
		} else {
			playAudio('sound/denied2.mp3');
			// alert('not enough coin!')
		}
	}
	// setBalance allows the debugger to change player's current balance
	setBalance() {
		this.balance = document.getElementById('balance').value;
		document.getElementById('balance').value = this.balance;
		document.getElementById('currentBalance').innerHTML = this.balance;
	}
}

let machine = new Machine();

function playAudio(url) {
	new Audio(url).play();
}
