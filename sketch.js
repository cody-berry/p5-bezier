/*
@author cody
@date 2021-09-22

p5-bezier, based on videos on the Bezier curve from Daniel Shiffman and
 Freya Holmér

version comments draft
.   bezier function to make mouse-controllable control point, cubic
.   implementing lerp from scratch: one dimension (number line)
    2D lerp with point and diagonal
    quadratic lerp method: 3 lerp calls between 3 points
    cubic lerp method
        begin +end shape
    bezier lerp mesh with t
    refactor code for p5.Vector.lerp
    make each vertex a particle with velocity, edges
    advanced project:
        drag and drop demo
            add hover effect
        transfer drag and drop code into p5-bezier
        extend draggableVertex class from p5.Vectors
        super-advanced project:
            particles explode when dragged on to another
 */

let font
let a, b, c, d

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf');
}

function setup() {
    createCanvas(600, 300)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)
    textFont(font, 16)
    a = new p5.Vector(random(width), random(height))
    c = new p5.Vector(400, 10)
    d = new p5.Vector(random(width), random(height))
}

function draw() {
    background(0, 0, 30)
    textAlign(LEFT)
    twoD_clerp_test()
    fill(0, 0, 0)
    noStroke()
    textAlign(CENTER)
    // text('a', a.x + 25, a.y)
    // text('d', d.x + 21, d.y)
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

function bezier_example() {
    // Bezier tries to make itself a filled shape!
    noFill()
    b = new p5.Vector(mouseX, mouseY)
    bezier(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y)
    fill(0, 0, 100)
    // the code below shows the circle so that we know where the anchor and
    // control points are.
    circle(a.x, a.y, 16)
    circle(b.x, b.y, 16)
    circle(c.x, c.y, 16)
    circle(d.x, d.y, 16)
}

