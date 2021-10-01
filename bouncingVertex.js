
class BouncingVertex extends p5.Vector {
    constructor(x, y, c) {
        super(x, y)
        this.vel = p5.Vector.random2D()
        this.acc = p5.Vector.random2D().mult(0.6, 0.9)
        this.r = 15
        this.c = c
    }

    show() {
        fill(this.c)
        stroke(this.c)
        circle(this.x, this.y, this.r)
    }

    update() {
        this.vel.add(this.acc)
        this.add(this.vel)
        this.acc = new p5.Vector(0, 0)
    }

    edges() {
        // right
        if (this.x + this.r > width) {
            this.vel.x *= -1
            this.x = width - this.r
        }
        // left
        if (this.x - this.r < 0) {
            this.vel.x *= -1
            this.x = this.r
        }
        // bottom
        if (this.y + this.r > height) {
            this.vel.y *= -1
            this.y = height - this.r
        }
        // top
        if (this.y - this.r < 0) {
            this.vel.y *= -1
            this.y = this.r
        }
    }
}
