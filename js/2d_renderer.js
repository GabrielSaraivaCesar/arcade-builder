import * as PIXI from './libs/pixi.js';



export default class SceneRenderer {

    init(container) {
        this.app = new PIXI.Application({ 
            backgroundAlpha: 0,
            resizeTo: container,
        });
        container.appendChild(this.app.view);

        // Default settings
        this.changeBoardModel('basic');

        const joystick = PIXI.Sprite.from('/images/sprites/joystick-sprite.png')
        this.app.stage.addChild(joystick);
        joystick.x = this.milimetersToPixels(87.5);
        joystick.y = this.milimetersToPixels(77.5);
        
        this.applyFilter(joystick, "#770000")
    }

    applyFilter(sprite, color) {
        let matrix = this.hexOrRgbaToMatrix(color);
        let colorMatrix = new PIXI.ColorMatrixFilter();
        sprite.filters = [colorMatrix]
        colorMatrix.matrix = matrix;
    }

    hexOrRgbaToMatrix(hexOrRgba) {
        let r, g, b;
    
        // If it's in hex format (with or without alpha)
        if (typeof hexOrRgba === 'string') {
            hexOrRgba = hexOrRgba.replace('#', '');
            let bigint = parseInt(hexOrRgba, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
        }
        // If it's in RGBA format
        else if (Array.isArray(hexOrRgba) && hexOrRgba.length === 3) {
            [r, g, b] = hexOrRgba;
        } else {
            throw new Error('Invalid color format. Use hex string or RGB array.');
        }
    
        // Normalizing RGB values to 0-1 range
        r /= 255;
        g /= 255;
        b /= 255;
    
        // Create a 5x4 matrix for PixiJS
        return [
            r, 0, 0, 0, 0,
            0, g, 0, 0, 0,
            0, 0, b, 0, 0,
            0, 0, 0, 1, 0
        ];
    }

    milimetersToPixels(milimeters) {
        return milimeters * 2; // X2 will be the standard scale to make the image be big enough in terms of pixels
    }

    changeBoardModel(modelName) {
        if (this.board && !this.board._destroyed)
            this.board.destroy();

        let boardSpritePath = '/images/sprites/';

        switch (modelName) {
            case 'basic':
                boardSpritePath += 'table-basic-sprite.png';
                break;
            case 'mini':
                boardSpritePath += 'table-mini-sprite.png';
                break;
            case 'xl':
                boardSpritePath += 'table-xl-sprite.png';
                break;
            case 'slim':
                boardSpritePath += 'table-slim-sprite.png';
                break;
            default:
                break;
        }

        
        this.board = PIXI.Sprite.from(boardSpritePath);
        this.app.stage.addChildAt(this.board, 0);
        this.applyFilter(this.board, "#0c0c0c");
    }

    setBackgroundImage(imageUrl) {
        if (this.boardImageSprite && !this.boardImageSprite._destroyed)
            this.boardImageSprite.destroy();

        this.boardImageSprite = PIXI.Sprite.from(imageUrl);
        this.boardImageSprite.mask = this.board;
        this.app.stage.addChildAt(this.boardImageSprite, 1);
        
        if (this.board.texture.baseTexture.valid) { // If board sprite is loaded
            this.boardImageSprite.width = this.board.width;
            this.boardImageSprite.height = this.board.height;
        } else {
            this.board.texture.baseTexture.on('loaded', () => {
                this.boardImageSprite.width = this.board.width;
                this.boardImageSprite.height = this.board.height;
            });
        }
    }

}