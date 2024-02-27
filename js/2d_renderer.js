import * as PIXI from './libs/pixi.js';
import { PieceTypes, PositioningRef, AMERICANO } from './data/layouts_positioning.js';


export default class SceneRenderer {

    boardMargin = 50

    init(container) {
        this.app = new PIXI.Application({ 
            backgroundAlpha: 0,
            resizeTo: container,
        });

        container.appendChild(this.app.view);


        this.boardContainer = new PIXI.Container();
        this.boardImageContainer = new PIXI.Container();
        this.buttonsContainer = new PIXI.Container();

        this.app.stage.addChildAt(this.boardContainer, 0);
        this.app.stage.addChildAt(this.boardImageContainer, 1);
        this.app.stage.addChildAt(this.buttonsContainer, 2);

        // Default settings
        this.changeBoardModel('basic');

        setTimeout(() => {
            container.style.opacity = 1;
            container.style.left = '0px';
        }, 100);

        this.buttons = {}
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
        return milimeters * 1.86; // X1.86 will be the standard scale to make the image be big enough in terms of pixels
    }

    milimetersToRelativePixelsX(milimeters, ref=PositioningRef.TOPLEFT) {
        if (ref === PositioningRef.CENTER) {
            return this.milimetersToPixels(milimeters) + this.boardMargin + (this.board.width/2);
        }
        return this.milimetersToPixels(milimeters) + this.boardMargin;
    }
    milimetersToRelativePixelsY(milimeters, ref=PositioningRef.TOPLEFT) {
        if (ref === PositioningRef.CENTER) {
            return this.milimetersToPixels(milimeters) + this.boardMargin + (this.board.height/2);
        }
        return this.milimetersToPixels(milimeters) + this.boardMargin;
    }


    setBackgroundImageSize() {
        if (!this.board || this.board.texture.baseTexture?.valid == false) {
            console.log('well..')
            return;
        }
        this.boardImageSprite.width = this.board.width;
        this.boardImageSprite.height = this.board.height;
    }

    setBackgroundImage(imageUrl) {
        if (this.boardImageSprite && !this.boardImageSprite._destroyed)
            this.boardImageSprite.destroy();

        this.imageUrl = imageUrl
        this.boardImageSprite = PIXI.Sprite.from(this.imageUrl);
        this.boardImageSprite.x = this.board.x;
        this.boardImageSprite.y = this.board.y;
        this.boardImageSprite.mask = this.board;
        this.boardImageContainer.addChild(this.boardImageSprite);
        
        if (this.board.texture.baseTexture.valid) { // If board sprite is loaded
            this.setBackgroundImageSize();
        } else {
            this.board.texture.baseTexture.on('loaded', () => {
                this.setBackgroundImageSize();
            });
        }
    }

    downloadRenderImage() {
        this.app.renderer.extract.canvas(this.app.stage).toBlob(function(blob){
            var a = document.createElement('a');
            document.body.append(a);
            a.download = "Template_Arcade.png";
            a.href = URL.createObjectURL(blob);
            a.click();
            a.remove();
        }, 'image/png');
    }

    
    changeBoardModel(modelName) {
        if (this.board && !this.board._destroyed) {
            this.board.destroy();
            this.boardCopy.destroy();
        }

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

        
        if (this.boardImageSprite && !this.boardImageSprite._destroyed) {
            this.boardImageSprite.mask = null; // Remove mask to avoid errors since this.board will be destroyed
        }
        this.board = PIXI.Sprite.from(boardSpritePath);
        this.boardCopy = PIXI.Sprite.from(boardSpritePath);

        const onBoardLoad = () => {
            this.board.width -= 6;
            this.board.height -= 6;

            if (this.boardImageSprite && !this.boardImageSprite._destroyed) {
                this.boardImageSprite.mask = this.board;
                this.setBackgroundImageSize();
            }
            if (this.layoutName) {
                this.changeBoardLayout(this.layoutName);
            }
        }

        this.boardContainer.removeChildren();
        this.boardCopy.x = this.boardMargin;
        this.boardCopy.y = this.boardMargin;
        this.boardContainer.addChild(this.boardCopy);

        this.board.x = this.boardMargin + 3;
        this.board.y = this.boardMargin + 3;
        this.boardContainer.addChild(this.board);

        this.applyFilter(this.board, "#0c0c0c");
        this.applyFilter(this.boardCopy, "#0c0c0c");

        if (this.board.texture.baseTexture.valid) { 
            onBoardLoad();
        } else {
            this.board.texture.baseTexture.on('loaded', () => {
                onBoardLoad();
            });
        }
    }


    changeBoardLayout(layoutName) {
        this.layoutName = layoutName;
        let layoutConfig = null;

        switch (layoutName) {
            case 'americano':
                layoutConfig = AMERICANO
                break;
        
            default:
                break;
        }

        if (layoutConfig === null) return;

        if (this.joystick) {
            this.joystick.destroy();
        }
        if (this.buttons) {
            Object.keys(this.buttons).forEach(buttonName => {
                this.buttons[buttonName].destroy();
            })
        }

        layoutConfig.forEach(config => {
            let obj = null;
            if (config.type === PieceTypes.JOYSTICK) {
                this.joystick = PIXI.Sprite.from('/images/sprites/joystick-sprite.png')
                obj = this.joystick;

            } else if (config.type === PieceTypes.BUTTON) {
                if (config.size === 30) {
                    this.buttons[config.buttonName] = PIXI.Sprite.from('/images/sprites/btn-30-sprite.png')
                } else if (config.size === 25) {
                    this.buttons[config.buttonName] = PIXI.Sprite.from('/images/sprites/btn-25-sprite.png')
                }
                obj = this.buttons[config.buttonName];
            }

            obj.anchor.set(0.5);
            obj.visible = true;
            this.buttonsContainer.addChild(obj);
            obj.x = this.milimetersToRelativePixelsX(config.left, config.ref);
            obj.y = this.milimetersToRelativePixelsY(config.top, config.ref);
        })
    }

}