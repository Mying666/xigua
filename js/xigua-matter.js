window.onload = function () {
	const Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Bounds = Matter.Bounds,
		Composite = Matter.Composite,
		Composites = Matter.Composites,
		Common = Matter.Common,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		World = Matter.World,
		Events = Matter.Events,
		Bodies = Matter.Bodies;

	class Game {
		constructor(params) {
			this.sizeList = [20, 25, 35, 45, 55, 70, 80, 95];
			this.colorList = [
				'#FF0000',
				'#FF7F00',
				'#F0E68C',
				'#00FF00',
				'#00FFFF',
				'#0000FF',
				'#8B00FF',
				'#40E0D0'
			];
			this.max = this.sizeList.length;
			this.width = document.body.offsetWidth;
			this.height = document.body.offsetHeight;

			// create engine
			this.engine = Engine.create();
			this.world = this.engine.world;

			// create renderer
			const render = Render.create({
				element: document.body,
				engine: this.engine,
				options: {
					width: this.width,
					height: this.height,
					wireframes: false,
					background: '#fff'
				}
			});

			Render.run(render);
			// create runner
			const runner = Runner.create();
			Runner.run(runner, this.engine);

			this.addFloor();
			this.addEvents();
			this.addStaticBall();
		}

		addEvents() {
			window.onmousedown = (e) => {
				const { offsetX } = e;
				if (!this.staticBall) return;
				this.addBall(offsetX);
			};

			// 碰撞事件
			Events.on(this.engine, 'collisionStart', (event) => {
				const pairs = event.pairs;

				// change object colours to show those in an active collision (e.g. resting contact)
				for (let i = 0; i < pairs.length; i++) {
					const pair = pairs[i];
					const { bodyA, bodyB } = pair;
					const rep = /ball/;

					if (rep.test(bodyA.label) && rep.test(bodyB.label)) {
						// if (bodyA.label !== bodyB.label) return
						// console.log(bodyA.label, bodyB.label);
						if (bodyA.label !== bodyB.label) return;
						let ballIndex = bodyA.label.replace('ball', '');
						ballIndex++;
						if (ballIndex >= this.max) {
							World.remove(this.world, bodyA);
						} else {
							World.remove(this.world, bodyA);
							World.remove(this.world, bodyB);
							World.add(
								this.world,
								Bodies.circle(
									bodyA.position.x,
									bodyA.position.y,
									this.sizeList[ballIndex],
									{
										label: `ball${ballIndex}`,
										frictionAir: 0.01 - 0.0001 * this.sizeList[ballIndex],
										hasBounds: true,
										restitution: 0.3,
										render: {
											fillStyle: this.colorList[ballIndex]
										}
									}
								)
							);
						}
						World.remove(this.world, bodyB);
					}
				}
			});
		}

		addFloor() {
			const { world, width, height } = this;
			// add floor
			World.add(
				world,
				Bodies.rectangle(width / 2, 0, width, 1, {
					isStatic: true,
					render: {
						fillStyle: 'transparent',
						lineWidth: 1
					}
				})
			);
			World.add(
				world,
				Bodies.rectangle(width / 2, height, width, 1, {
					isStatic: true,
					render: {
						fillStyle: 'transparent',
						lineWidth: 1
					}
				})
			);
			World.add(
				world,
				Bodies.rectangle(width, height / 2, 1, height, {
					isStatic: true,
					render: {
						fillStyle: 'transparent',
						lineWidth: 1
					}
				})
			);
			World.add(
				world,
				Bodies.rectangle(0, height / 2, 1, height, {
					isStatic: true,
					render: {
						fillStyle: 'transparent',
						lineWidth: 1
					}
				})
			);
		}

		addStaticBall() {
			const index = this.randomNum(0, 2);
			const size = this.sizeList[index];
			const color = this.colorList[index];
			this.staticBall = Bodies.circle(this.width / 2, 40, size, {
				isStatic: true,
				label: `ball${index}`,
				frictionAir: 0.01 - 0.0001 * size,
				hasBounds: true,
				restitution: 0.3,
				render: {
					fillStyle: color
				}
			});
			World.add(this.world, this.staticBall);
		}

		addBall(offsetX) {
			World.remove(this.world, this.staticBall);
			const label = this.staticBall.label;
			const size = this.staticBall.circleRadius;
			const color = this.staticBall.render.fillStyle;
			offsetX = Math.max(size, offsetX);
			offsetX = Math.min(this.width - size, offsetX);

			World.add(
				this.world,
				Bodies.circle(offsetX, 40, size, {
					label,
					frictionAir: 0.01 - 0.0001 * size,
					hasBounds: true,
					restitution: 0.3,
					render: {
						fillStyle: color
					}
				})
			);
			setTimeout(() => {
				this.addStaticBall();
			}, 1000);
		}

		randomNum(a = 0, b = 100) {
			return Math.round(Math.random() * (b - a) + a);
		}
	}

	new Game();
};
