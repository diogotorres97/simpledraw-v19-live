import { SimpleDrawDocument } from './document'
import { Circle, Rectangle, Shape } from './shape'

export interface Action<T> {
    readonly shape: Shape
    do(): T
    undo(): void
}

abstract class CreateShapeAction<S extends Shape> implements Action<Shape> {
    constructor(private doc: SimpleDrawDocument, public readonly shape: S) { }

    public do(): Shape {
        this.doc.add(this.shape)
        return this.shape
    }

    public undo() {
        this.doc.objects = this.doc.objects.filter(o => o !== this.shape)
    }
}

export class CreateCircleAction extends CreateShapeAction<Circle> {
    constructor(doc: SimpleDrawDocument, private x: number, private y: number, private radius: number) {
        super(doc, new Circle(x, y, radius))
    }
}

export class CreateRectangleAction extends CreateShapeAction<Rectangle> {
    constructor(doc: SimpleDrawDocument, private x: number, private y: number, private width: number, private height: number) {
        super(doc, new Rectangle(x, y, width, height))
    }
}

export class TranslateAction implements Action<void> {
    public oldX: number
    public oldY: number

    constructor(private doc: SimpleDrawDocument, public shape: Shape, private xd: number, private yd: number) { }

    public do(): void {
        this.oldX = this.shape.x
        this.oldY = this.shape.y
        this.shape.translate(this.xd, this.yd)
    }

    public undo() {
        this.shape.x = this.oldX
        this.shape.y = this.oldY
       // this.shape.translate(-this.xd, -this.yd)
    }
}