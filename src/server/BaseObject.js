import CST from '../helpers/CST'

export default class BaseObject {
	constructor(id, position, dir, speed) {
		this.id = id
		this.position = { x: position.x, y: position.y }
		this.targetPosition = { x: null, y: null }
		this.direction = dir
		this.speed = speed
	}

	update(dt) {
		// const distance = this.distanceTo({ position: this.targetPosition })
		// console.log('distance')
		// console.log(distance)
		// if player has to move
		if (this.targetPosition.x && this.targetPosition.y){
			const deltaX = this.targetPosition.x - this.position.x
			const deltaY = this.targetPosition.y - this.position.y
			const distance = this.distanceTo({ position: this.targetPosition })
			const playerTravelDistance = distance/this.speed
			
			if (distance >= 5 && playerTravelDistance > 0.9){
				this.position.x = this.minMaxWorldWidth(this.position.x + deltaX / playerTravelDistance)
				this.position.y = this.minMaxWorldHeight(this.position.y + deltaY / playerTravelDistance)
			} else {
				this.updateTarget({ x: null, y: null })
			}
			

			// this.position.x += dt * this.speed * ( - Math.sin(this.direction ));
    		// this.position.y -= dt * this.speed * Math.cos(this.direction);
			// console.log('movendo player', this.position.x, this.position.y)
			// const dir = Math.atan2(this.position.x - this.targetPosition.x, this.position.y - this.targetPosition.y / 2)
			// this.direction = dir

		}
		return this
	}

	minMaxWorldWidth(value){
		return Math.max(0, Math.min(CST.WORLD_WIDTH, value))
	}

	minMaxWorldHeight(value){
		return Math.max(0, Math.min(CST.WORLD_HEIGHT, value))
	}

	updateTarget(targetPosition){
        this.targetPosition.x = targetPosition.x
        this.targetPosition.y = targetPosition.y
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