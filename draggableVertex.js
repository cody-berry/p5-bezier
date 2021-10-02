
class draggableVertex extends p5.Vector {
    constructor(x, y, r) {
        super(x, y)
        this.r = r

        // offsets help us calculate where to display our vertex while
        // we're dragging it, since our mouse coordinates constantly update.
        // we want the difference vector between the center of our circle and
        // and the point where our mouse clicked to start dragging
        this.offsetX = 0
        this.offsetY = 0
        this.dragging = false
        this.hovering = false
    }

    // (x, y) refers to pointer_x and pointer_y, the coordinates of the
    // mouse dragging; this method will be called as show(mouseX, mouseY)
    show(x, y) {
        if (this.dragging) {
            this.x = x + this.offsetX
            this.y = y + this.offsetY
        }
        if (this.hovering) {
            fill(0, 0, 100, 20)
        }
        circle(this.x, this.y, this.r*2)
    }

    // this is called on every Vertex on the canvas. we want to check if the
    // mouse is within our vertex, and if so, update our offsets. the offset
    // is the vector from the origin to the point where the mouse clicked.
    pressed(x, y) {
        // We're only dragged if the pressing thing is on.
        if (this.contains(x, y)) {
            this.dragging = true
            console.log("I've been pressed!")
            this.offsetX = this.x - x
            this.offsetY = this.y - y
        }
    }


    // this should be called for every Vertex on the canvas whenever the
    // mouseReleased() event fires. we set our dragging flag to false :)
    notPressed() {
        this.dragging = false
    }

    // a simple "does our Vertex area contain the point where the mouse
    // clicked" boolean function
    contains(x, y) {
        // This is a circle, so we just have to make sure the distance between
        // the point and us is less than our radius!
        return dist(x, y, this.x, this.y) < this.r
    }
}
