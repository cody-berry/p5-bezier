/*
@author cody
@date 2021-09-22

p5-bezier, based on videos on the Bezier curve from Daniel Shiffman and
 Freya Holmér

version comments draft
.   bezier function to make mouse-controllable control point, cubic
.   implementing lerp from scratch: one dimension (number line)
.   2D lerp with point and diagonal
.   First point on first quarter and second point on last quarter
.   quadratic lerp method: 3 lerp calls between 3 points
.   cubic lerp method
.       begin +end shape
.   bezier lerp mesh with t
.   refactor code for p5.Vector.lerp
.   make each vertex a particle with velocity, edges
    advanced project:
        quadratic example
        cubic example
        super-advanced project:
            particles explode when dragged on to another
 */

let font
let vertices

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf');
}

class Quadratic_Bezier_Example {
    constructor() {
        colorMode(HSB, 360, 100, 100, 100)
        background(0, 0, 30)
        textFont(font, 16)
        this.a = new p5.Vector(random(width), random(height))
        this.c = new p5.Vector(random(width), random(height))
        this.d = new p5.Vector(random(width), random(height))

    }

    draw() {
        stroke(0, 0, 100)
        quadratic_bezier(this.a, this.c, this.d)
        // where are the anchor and control points?
        fill(0, 0, 100)
        // anchor points:
        circle(this.a.x, this.a.y, 16)
        circle(this.d.x, this.d.y, 16)
        // control points:
        circle(this.c.x, this.c.y, 16)
        // related line segments:
        line(this.a.x, this.a.y, this.c.x, this.c.y)
        line(this.c.x, this.c.y, this.d.x, this.d.y)
    }
}

class Cubic_Bezier_Example {
    constructor() {
        colorMode(HSB, 360, 100, 100, 100)
        background(0, 0, 30)
        textFont(font, 16)
        this.a = new BouncingVertex(random(width), random(height), 15, color(0, 50, 100))
        this.b = new BouncingVertex(random(width), random(height), 15, color(210, 80, 100))
        this.c = new BouncingVertex(random(width), random(height), 15, color(90, 60, 100))
        this.d = new BouncingVertex(random(width), random(height), 15, color(50, 90, 100))
        this.vertices = [this.a, this.b, this.c, this.d]
    }

    draw() {
        stroke(0, 0, 100)
        cubic_bezier(this.a, this.b, this.c, this.d)
        // where are the anchor and control points?
        fill(0, 0, 100)

        this.vertices.forEach(v => v.update())
        this.vertices.forEach(v => v.show())
        this.vertices.forEach(v => v.edges())

        // related line segments:
        strokeWeight(1)
        line(this.a.x, this.a.y, this.b.x, this.b.y)
        line(this.b.x, this.b.y, this.c.x, this.c.y)
        line(this.c.x, this.c.y, this.d.x, this.d.y)
    }
}

class Quadratic_Example {
    constructor() {
        colorMode(HSB, 360, 100, 100, 100)
        background(0, 0, 30)
        textFont(font, 16)
        this.a = new draggableVertex(random(width), random(height), 15)
        this.c = new draggableVertex(random(width), random(height), 15)
        this.d = new draggableVertex(random(width), random(height), 15)

    }

    draw() {
        stroke(0, 0, 100)
        quadratic_bezier(this.a, this.c, this.d)
        // where are the anchor and control points?
        // anchor points:
        this.a.show(mouseX, mouseY)
        this.d.show(mouseX, mouseY)
        // control points:
        this.c.show(mouseX, mouseY)
        // related line segments:
        line(this.a.x, this.a.y, this.c.x, this.c.y)
        line(this.c.x, this.c.y, this.d.x, this.d.y)
    }
}

class Cubic_Example {
    constructor() {
        colorMode(HSB, 360, 100, 100, 100)
        background(0, 0, 30)
        textFont(font, 16)
        // we want the radius of each circle to be less than 8 so that when
        // our bezier curve point goes to 0, we can still see it.
        this.a = new draggableVertex(130, height - 50, 10)
        this.b = new draggableVertex(180, 100, 10)
        this.c = new draggableVertex(width - 180, 100, 10)
        this.d = new draggableVertex(width - 130, height - 50, 10)

    }

    show() {
        let max_t = 0.5*sin(frameCount/100) + 0.5
        // Let's draw the curve.
        beginShape()
        noFill()
        strokeWeight(4)
        stroke(0, 0, 100)
        fill(0, 0, 30)
        let p // we're going to be redefining p later
        for (let t = 0; t <= max_t; t += 0.001) {
            // we need to get the cubic point that's on the curve
            p = cubic(this.a, this.b, this.c, this.d, t)
            vertex(p.x, p.y)
        }
        endShape()
        // now that p is at the maximum point on the bezier curve, we can
        // actually use it to draw the last point on the bezier curve
        circle(p.x, p.y, 16)


        // now let's draw the lerp points!
        fill(0, 0, 30, 100)
        stroke(210, 100, 80)


        // we always want to lerp on our max t
        let A = p5.Vector.lerp(this.a, this.b, max_t)
        // we do the same for c, so we've complete our first level for our
        // first quadratic
        let B = p5.Vector.lerp(this.b, this.c, max_t)
        // we do the same for d, so we've completed our first level for our
        // second quadratic
        let C = p5.Vector.lerp(this.c, this.d, max_t)
        // and now we can draw the lines that lerp between those.
        line(A.x, A.y, B.x, B.y)
        line(B.x, B.y, C.x, C.y)
        // and now we can show the points! Just make sure the radius is more
        // than 6 and less than 8 so that we can actually see both the
        // first-order lerp point and the bezier curve point.
        circle(A.x, A.y, 14)
        circle(B.x, B.y, 14)
        circle(C.x, C.y, 14)

        // Now we can add our red points, our second-order lerp points! This
        // time there are only two of them, since 3 inputs (one t, so really
        // 2 point inputs) turn into 1, 3 - 1 = 2; thus there will be only 2
        // red points.


        // We can use our earlier points, A, B, and C, to define our lerps.
        stroke(0, 100, 80)
        let D = p5.Vector.lerp(A, B, max_t)
        let E = p5.Vector.lerp(B, C, max_t)
        line(D.x, D.y, E.x, E.y)
        fill(0, 0, 30)
        circle(D.x, D.y, 15)
        circle(E.x, E.y, 15)

        // And finally, our dots.
        stroke(0, 0, 60)
        // we need to have different max t values so that we can appropriately
        // draw our lines
        // related line segments:
        line(this.a.x, this.a.y, this.b.x, this.b.y)
        line(this.b.x, this.b.y, this.c.x, this.c.y)
        line(this.c.x, this.c.y, this.d.x, this.d.y)
        // we want our circles to get rid of anything inside them, so we should
        // fill with the background color.
        fill(0, 0, 30, 100)
        // where are the anchor and control points?
        // anchor points:
        this.a.show(mouseX, mouseY)
        // I ran into a problem where some circles' hovering attribute fill
        // will affect the next one.
        fill(0, 0, 30, 100)
        this.d.show(mouseX, mouseY)
        // control points:
        fill(0, 0, 30, 100)
        this.b.show(mouseX, mouseY)
        fill(0, 0, 30, 100)
        this.c.show(mouseX, mouseY)

    }
}

let example

function setup() {
    createCanvas(600, 300)
    // example = new Cubic_Bezier_Example()
    // example = new Quadratic_Bezier_Example()
    example = new Cubic_Example()
    vertices = [example.a, example.b, example.c, example.d]
}

function draw() {
    background(0, 0, 30, 100)
    example.show()
    vertices.forEach(v => v.hovering = v.contains(mouseX, mouseY))
}

function mousePressed() {
    vertices.forEach(v => v.pressed(mouseX, mouseY))
}


// call all our Vertices and make sure they know nothing's clicking them
function mouseReleased() {
    vertices.forEach(v => v.notPressed())
}


function mouseMoved() {
    /*
      we can check if we're mousing over any rectangle here
      on mouseMoved(), check contains foreach r in rectangles
        if contains:
            set hover to true
        else set hover to false

      in show(), fill transparent if hover is true
     */
}

// my linear interpolation function (Lerp)
function clerp(a, b, t) {
    // We want to go 1-t times as far to a and t times as far to b
    return (1-t)*a + (t)*b
}

// tests clerp
function clerp_test() {
    // t ranges from 0 to 1
    let t = map(mouseX, 0, width, 0, 1)
    let px, py
    // we want the mouse to pull the point in the same direction
    if (a.x < d.x) {
        px = clerp(a.x, d.x, t)
        py = clerp(a.y, d.y, t)

    } else {
        px = clerp(d.x, a.x, t)
        py = clerp(d.y, a.y, t)
    }

    // Draw saves the last frame's stroke weight, stroke, and fill.
    strokeWeight(4)
    stroke(0, 0, 100)

    // We need to make sure that our point is on the line. After that,
    // we need to noStroke() so that we don't stroke our text.
    line(a.x, a.y, d.x, d.y)
    noStroke()

    // What is t?
    fill(0, 0, 100)
    text("t: " + t, 30, 30)

    // Where are the endpoints? (I guess I don't need to draw these if I
    // already have the line)
    circle(d.x, d.y, 16)
    circle(a.x, a.y, 20)

    // Where is our lerp point? (most important for testing)
    fill(0, 0, 100)
    stroke(210, 80, 100)
    strokeWeight(20)
    point(px, py)
}

// my 2D linear interpolation function
function twoD_clerp(a, b, t) {
    // We want to go 1-t times as far to a and t times as far to b
    return new p5.Vector(clerp(a.x, b.x, t), clerp(a.y, b.y, t))
}

// tests twoD_clerp
function twoD_clerp_test() {
    mouseX = constrain(mouseX, 0, width)
    let t = map(mouseX, 0, width, 0, 1)
    let p

    // we want the mouse to pull the point in the same direction
    if (a.x < d.x)
        p = twoD_clerp(a, d, t)
    else p = twoD_clerp(d, a, t)

    // Draw saves the last frame's stroke weight, stroke, and fill.
    strokeWeight(4)
    stroke(0, 0, 100)

    // We need to make sure that our point is on this line, and after that
    // we need to noStroke() so that our text doesn't have an outline.
    line(a.x, a.y, d.x, d.y)
    noStroke()

    // What is t?
    fill(0, 0, 100)
    text("t: " + t, 30, 30)

    // Draws the endpoints (I guess I don't need these if we already have
    // the line)
    circle(d.x, d.y, 16)
    circle(a.x, a.y, 20)

    // Where is our lerp point? (most important for testing)
    fill(0, 0, 100)
    stroke(210, 80, 100)
    strokeWeight(20)
    point(p.x, p.y)
}

// returns a point on the quadratic bezier curve at a given t-value
function quadratic(start, control, end, t) {
    // we need a lerp between start and control
    let a = p5.Vector.lerp(start, control, t)
    // we need a lerp between control and end
    let b = p5.Vector.lerp(control, end, t)
    // we need a lerp between those two points, and those trace the
    // quadratic bezier curve
    let p = p5.Vector.lerp(a, b, t)
    return p
}

// draws the quadratic bezier curve
function quadratic_bezier(start, control, end) {
    // we need to have different t values
    beginShape()
    noFill()
    strokeWeight(4)
    stroke(0, 0, 100)
    for (let t = 0; t <= 1; t += 0.01) {
        // we need to get the quadratic point that's on the curve
        let p = quadratic(start, control, end, t)
        vertex(p.x, p.y)
    }
    endShape()
}

// returns a point on the cubic bezier curve
function cubic(start, control1, control2, end, t){
    let a = quadratic(start, control1, control2, t)
    let b = quadratic(control1, control2, end, t)
    return p5.Vector.lerp(a, b, t)
}

// draws the cubic bezier curve
function cubic_bezier(start, control1, control2, end) {
    // we need to have different t values
    beginShape()
    noFill()
    strokeWeight(4)
    stroke(0, 0, 100)
    for (let t = 0; t <= 1; t += 0.01) {
        // we need to get the quadratic point that's on the curve
        let p = cubic(start, control1, control2, end, t)
        vertex(p.x, p.y)
    }
    endShape()
}

// draws the cubic bezier curve using the bezier() function
function bezier_example() {
    // Bezier tries to make itself a filled shape!
    noFill()
    let b = new p5.Vector(mouseX, mouseY)
    bezier(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y)
    fill(0, 0, 100)
    // the code below shows the circle so that we know where the anchor and
    // control points are.
    circle(a.x, a.y, 16)
    circle(b.x, b.y, 16)
    circle(c.x, c.y, 16)
    circle(d.x, d.y, 16)
}

