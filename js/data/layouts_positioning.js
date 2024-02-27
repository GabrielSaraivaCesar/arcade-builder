
// These measures should match real life measures. All positions are calculated in MINIMETERS considered a left-top anchor in relation to the board
// Example: left: 100, would mean that the button is 100 milimiters away from the left edge of the arcade board
// top: 50, means that the button is 50 milimiters away from the top edge of the arcade board

class PieceTypes {
    static JOYSTICK='joystick'
    static BUTTON='button'
    static KEY='key'
}

class PositioningRef {
    static CENTER='center'
    static TOPLEFT='topleft'
}

const AMERICANO = [
    {
        type: PieceTypes.JOYSTICK,
        left: -77,
        top: -10,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 0,
        top: -32,
        buttonName: 'square',
        size: 30,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 35,
        top: -32,
        buttonName: 'triangle',
        size: 30,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 35 + 35,
        top: -32,
        buttonName: 'r1',
        size: 30,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 0,
        top: -32 + 40,
        buttonName: 'x',
        size: 30,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 35,
        top: -32 + 40,
        buttonName: 'circle',
        size: 30,
        ref: PositioningRef.CENTER
    },
    {
        type: PieceTypes.BUTTON,
        left: 35 + 35,
        top: -32 + 40,
        buttonName: 'r2',
        size: 30,
        ref: PositioningRef.CENTER
    },
]

export {
    PieceTypes,
    PositioningRef,
    AMERICANO
}