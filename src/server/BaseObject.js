import CST from '../helpers/CST'

export default class BaseObject {
	constructor(id, position, speed, dir = null) {
		this.id = id
		this.position = { x: position.x, y: position.y }
		this.targetPosition = { x: null, y: null }
		this.dir = dir || Math.random() * 2 * Math.PI
		this.speed = speed
	}

	update(dt) {
		// if player has to move
		if (this.targetPosition.x && this.targetPosition.y){
			const deltaX = this.targetPosition.x - this.position.x
			const deltaY = this.targetPosition.y - this.position.y
			const distance = this.distanceTo({ position: this.targetPosition })

			const ratio = dt*10
			const playerTravelDistance = distance/this.speed

			const velX = (deltaX/distance) * this.speed
			const velY = (deltaY/distance) * this.speed
			const direction =  Math.atan2(this.position.y - this.targetPosition.y, this.position.x - this.targetPosition.x)

			if (distance >= 5 && playerTravelDistance > 0.9){
				this.updatePosition({
					x: this.minMaxWorldWidth(this.position.x + velX * ratio),
					y: this.minMaxWorldHeight(this.position.y + velY * ratio)
				})
				this.setDirection(direction)
			} else {
				this.updateTargetPosition({ x: null, y: null })
			}

			// this.position.x += dt * this.speed * ( - Math.sin(this.direction ));
    		// this.position.y -= dt * this.speed * Math.cos(this.direction);
			// console.log('movendo player', this.position.x, this.position.y)
			// const dir = Math.atan2(this.position.x - this.targetPosition.x, this.position.y - this.targetPosition.y / 2)
			// this.direction = dir

		}
		return this
	}

	updateTargetPosition(targetPosition){
        this.targetPosition.x = targetPosition.x
        this.targetPosition.y = targetPosition.y
	}

	updatePosition(position, dir){
        this.position.x = position.x
		this.position.y = position.y
    }

	setDirection(dir) {
		this.dir = dir
	}

	minMaxWorldWidth(value){
		return Math.max(0, Math.min(CST.WORLD_WIDTH, value))
	}

	minMaxWorldHeight(value){
		return Math.max(0, Math.min(CST.WORLD_HEIGHT, value))
	}

	distanceTo(object) {
		const dx = this.position.x - object.position.x
		const dy = this.position.y - object.position.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	serializeForUpdate() {
		return {
			id: this.id,
			position: {
				x: this.position.x,
				y: this.position.y
			},
			targetPosition: {
				x: this.targetPosition.x,
				y: this.targetPosition.y,
			},
			dir: this.dir
		}
	}
}