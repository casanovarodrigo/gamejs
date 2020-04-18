export default class BaseObject {
	constructor(id, position, dir, speed) {
		this.id = id
		this.position = { x: position.x, y: position.y }
		this.targetPosition = { x: position.x, y: position.y }
		this.direction = dir
		this.speed = speed
	}

	update(dt) {
		// if player has to move
		if (this.targetPosition.x !== this.position.x || this.targetPosition.y !== this.position.y){
			
			this.position.x -= dt * this.speed * Math.sin(this.direction)
			this.position.y -= dt * this.speed * Math.cos(this.direction)
			// console.log('movendo player', this.position.x, this.position.y)
			// const dir = Math.atan2(this.position.x - this.targetPosition.x, this.position.y - this.targetPosition.y / 2)
			// this.direction = dir

		}
		return this
	}

	distanceTo(object) {
		const dx = this.position.x - object.position.x
		const dy = this.position.y - object.position.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	setDirection(dir) {
		this.direction = dir
	}

	serializeForUpdate() {
		return {
			id: this.id,
			position: {
				x: this.position.x,
				y: this.position.y
			},
			dir: this.direction
		}
	}
}