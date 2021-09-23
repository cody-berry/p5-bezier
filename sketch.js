/*
@author cody
@date 2021-09-22

p5-bezier, based on videos on the Bezier curve from Daniel Shiffman and
 Freya Holmér

version comments draft
    bezier function to make mouse-controllable control point, cubic
    implementing lerp from scratch: one dimension (number line)
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
let a
let b
let c
let d

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf');
}

function setup() {
    createCanvas(600, 300)
    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 30)
    a = new p5.Vector(100, height/2)
    c = new p5.Vector(400, 10)
    d = new p5.Vector(width-100, height/2)
}

function draw() {
    background(0, 0, 30)
    bezier_example()
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

