let selectedButtonId = null;


const colorPicker = document.querySelector('.color-picker-container');

const colorOptionsBtnContainer = document.querySelector('#colors-options-btn');
const colorOptionsBtn = colorOptionsBtnContainer.querySelectorAll('.color-option');

const colorOptionsBorderContainer = document.querySelector('#colors-options-border');
const colorOptionsBorder = colorOptionsBorderContainer.querySelectorAll('.color-option');

const colorOptionsTextContainer = document.querySelector('#colors-options-text');
const colorOptionsText = colorOptionsTextContainer.querySelectorAll('.color-option');

function closeColorEditorModal() {
    selectedButtonId = null;
    colorPicker.style.display = "none";
}
function moveModalToBtnPosition(btn) {
    let noBorderColor = btn.classList.contains('joystick-type') || btn.classList.contains('keyboard-key') || btn.classList.contains('legend-type');
    let noTextColor = !btn.classList.contains('legend-type');
    
    let btnRect = btn.getBoundingClientRect();
    let containerRect = colorPicker.getBoundingClientRect();
    // Setting color picker container position on top the top of the button
    colorPicker.style.left = (btnRect.left-containerRect.width - 50)+'px';
    colorPicker.style.top = (btnRect.top-containerRect.height + ((noBorderColor && noTextColor) ? 15 : 40))+'px';
}
function openColorEditorModal(btn) {
    let noBorderColor = btn.classList.contains('joystick-type') || btn.classList.contains('keyboard-key') || btn.classList.contains('legend-type');
    let noTextColor = !btn.classList.contains('legend-type');

    if (noBorderColor) {
        colorPicker.querySelector('.color-picker-border').style.display = 'none';
    } else {
        colorPicker.querySelector('.color-picker-border').style.display = 'block';
    }

    if (noTextColor) {
        colorPicker.querySelector('.color-picker-text').style.display = 'none';
    } else {
        colorPicker.querySelector('.color-picker-text').style.display = 'block';
    }

    colorPicker.style.display = "flex";
    
    moveModalToBtnPosition(btn);

    // Remove previously selected option before setting the correct one
    colorOptionsBtn.forEach(opt => opt.classList.remove('selected'));
    colorOptionsBorder.forEach(opt => opt.classList.remove('selected'));
    colorOptionsText.forEach(opt => opt.classList.remove('selected'));

    // Set selected colors based on button current color
    let btnBgColor = btn.getAttribute('data-bg-color');
    let btnBorderColor = btn.getAttribute('data-border-color');
    let btnTextColor = btn.getAttribute('data-text-color');
    
    [...colorOptionsBtn].find(opt => {
        return opt.getAttribute('data-name') === btnBgColor;
    }).classList.add('selected');

    if (!noBorderColor) {
        [...colorOptionsBorder].find(opt => {
            return opt.getAttribute('data-name') === btnBorderColor;
        }).classList.add('selected');
    }

    if (!noTextColor) {
        [...colorOptionsText].find(opt => {
            return opt.getAttribute('data-name') === btnTextColor;
        }).classList.add('selected');
    }
}

function getColorDataBasedOnColorOptionButton(color) {
    const colorCode = color.style.backgroundColor;
    const colorName = color.getAttribute('data-name');
    return {colorCode, colorName}
}
colorOptionsBtn.forEach(color => {
    color.addEventListener('click', (evt) => {
        colorOptionsBtn.forEach(opt => opt.classList.remove('selected'))
        color.classList.add('selected');
        const {colorCode, colorName} = getColorDataBasedOnColorOptionButton(color);
        let btn = document.querySelector(`.color-editor-preview#${selectedButtonId}`);
        if (btn) {
            btn.setAttribute('data-bg-color', colorName);
            btn.style.backgroundColor = colorCode;
        }
    })
})
colorOptionsBorder.forEach(color => {
    color.addEventListener('click', (evt) => {
        colorOptionsBorder.forEach(opt => opt.classList.remove('selected'))
        color.classList.add('selected');
        const {colorCode, colorName} = getColorDataBasedOnColorOptionButton(color);
        let btn = document.querySelector(`.color-editor-preview#${selectedButtonId}`);
        if (btn) {
            btn.setAttribute('data-border-color', colorName);
            btn.style.borderColor = colorCode;
        }
    })
})
colorOptionsText.forEach(color => {
    color.addEventListener('click', (evt) => {
        colorOptionsText.forEach(opt => opt.classList.remove('selected'))
        color.classList.add('selected');
        const {colorCode, colorName} = getColorDataBasedOnColorOptionButton(color);
        let btn = document.querySelector(`.color-editor-preview#${selectedButtonId}`);
        if (btn) {
            btn.setAttribute('data-text-color', colorName);
            btn.style.color = colorCode;
        }
    })
})

document.querySelector("#customization-box").addEventListener('scroll', evt => {
    if (!selectedButtonId) return;
    let btn = document.querySelector(`.color-editor-preview#${selectedButtonId}`);
    if (btn) {
        let btnRect = btn.getBoundingClientRect();
        if (btnRect.top > window.innerHeight - 65) {
            closeColorEditorModal();
        } else {
            moveModalToBtnPosition(btn);
        }
    }
})


const buttons = document.querySelectorAll('.color-editor-preview');
function loadButtonsColors() {
    buttons.forEach(button => {
        const bg = button.getAttribute('data-bg-color');
        const border = button.getAttribute('data-border-color');
        const text = button.getAttribute('data-text-color');

        if (bg) {
            const bgButton = colorOptionsBtnContainer.querySelector(`.color-option[data-name="${bg}"]`);
            button.style.backgroundColor = getColorDataBasedOnColorOptionButton(bgButton).colorCode;
        }

        if (border) {
            const borderButton = colorOptionsBorderContainer.querySelector(`.color-option[data-name="${border}"]`);
            button.style.borderColor = getColorDataBasedOnColorOptionButton(borderButton).colorCode;
        }

        if (text) {
            const textButton = colorOptionsTextContainer.querySelector(`.color-option[data-name="${text}"]`);
            button.style.color = getColorDataBasedOnColorOptionButton(textButton).colorCode;
        }
    })
}
buttons.forEach(button => {
    button.addEventListener('click', (evt) => {
        selectedButtonId = evt.target.id
        openColorEditorModal(evt.target);
    })
})

window.addEventListener('click', (evt) => {
    let isOutsideClick = true;
    if (evt.target === colorPicker || colorPicker.contains(evt.target)) return;
    buttons.forEach(btn => {
        if (evt.target === btn || btn.contains(evt.target)) isOutsideClick = false;
    })
    if (!isOutsideClick) return;

    closeColorEditorModal();
});



// ------ ARCADE LAYOUT ------ 
const layoutInput = document.querySelector('#layout-input');
function loadArcadeLayout() {
    document.querySelectorAll('.button-container').forEach(btnContainer => {
        btnContainer.style.display = 'none';
    });
    document.querySelector('.button-container#layout-'+layoutInput.value).style.display = 'block';
}
layoutInput.addEventListener('change', () => {
    loadArcadeLayout();
})



// ------ INVERT ------  
const invertInputsButton = document.querySelector('#invert-inputs');
function invertButtons() {
    document.querySelectorAll('.button-container .color-editor-preview').forEach(buttonColorEditor => {
        let left = buttonColorEditor.style.left;
        buttonColorEditor.style.left = buttonColorEditor.style.right;
        buttonColorEditor.style.right = left;
    })
}
function initButtonsInvertState() {
    if (invertInputsButton.checked === true) {
        invertButtons();
    }
}
invertInputsButton.addEventListener('change', (evt) => {
    invertButtons();
})



// ------ MAIN BTN QTY ------ 
const mainBtnsQuantInput = document.querySelector('#main-btns-quant-input');
function loadMainButtonsVisibility() {
    const quant = parseInt(mainBtnsQuantInput.value);
    const extraButtons = document.querySelectorAll('.color-editor-preview.btn-8');
    if (quant === 8) {
        extraButtons.forEach(btn => {
            btn.classList.remove('disabled');
        })
    } else {
        extraButtons.forEach(btn => {
            btn.classList.add('disabled');
        })
    }
}
mainBtnsQuantInput.addEventListener('change', (evt) => {
    loadMainButtonsVisibility();
})



// ------ MAIN BTN SIZE ------ 
const mainBtnsSizeInput = document.querySelector('#main-btns-size-input');
function loadMainButtonsSize() {
    // TODO - size change
}
mainBtnsSizeInput.addEventListener('change', (evt) => {
    loadMainButtonsSize();
})



// ------ LEGENDS SWITCH ------ 
const legendsSwitch = document.querySelector('#main-btns-legends-switch');
function loadLegends() {
    const areLegendsVisible = legendsSwitch.value == 'true';
    // TODO - show legends
}
legendsSwitch.addEventListener('change', () => {
    loadLegends();
})



// ------ LEGENDS TYPE ------ 
const legendsTypeInput = document.querySelector('#main-btns-legends-type');
function loadLegendsType() {
    const legendsType = legendsTypeInput.value;
    const legendColorBtn = document.querySelector('#legend-color-btn')
    if (legendsType === 'ps4') {
        legendColorBtn.textContent = "△";
    } else {
        legendColorBtn.textContent = "Y";
    }
}
legendsTypeInput.addEventListener('change', () => {
    loadLegendsType();
})


// ------ LAT BUTTONS QUANT ------ 
const latBtnsQuantInput = document.querySelector('#lat-btns-quant-input');
function loadLatButtonsVisibility() {
    const quant = parseInt(latBtnsQuantInput.value);

    if (quant >= 4) 
        document.querySelector('.color-editor-preview.btn-lat-4').classList.remove('disabled');
    else 
        document.querySelector('.color-editor-preview.btn-lat-4').classList.add('disabled');
    
    if (quant >= 5) 
        document.querySelector('.color-editor-preview.btn-lat-5').classList.remove('disabled');
    else 
        document.querySelector('.color-editor-preview.btn-lat-5').classList.add('disabled');
    
    if (quant >= 6) 
        document.querySelector('.color-editor-preview.btn-lat-6').classList.remove('disabled');
    else 
        document.querySelector('.color-editor-preview.btn-lat-6').classList.add('disabled');
    
}
latBtnsQuantInput.addEventListener('change', (evt) => {
    loadLatButtonsVisibility();
})



// ------ LAT BTN SIZE ------ 
const latBtnsSizeInput = document.querySelector('#lat-btns-size-input');
function loadLatButtonsSize() {
    // TODO - size change
}
latBtnsSizeInput.addEventListener('change', (evt) => {
    loadLatButtonsSize();
})



// ------ MODEL ------
const modelInput = document.querySelector('#model-input');
function loadModelInput() {
    if (modelInput.value === 'slim') {
        document.querySelector('.btn-lat-1').style.right = "0px";
        document.querySelector('.btn-lat-1').style.top = "0px";
        
        document.querySelector('.btn-lat-2').style.right = "42px";
        document.querySelector('.btn-lat-2').style.top = "0px";

        document.querySelector('.btn-lat-3').style.right = "84px";
        document.querySelector('.btn-lat-3').style.top = "0px";
        
        document.querySelector('.btn-lat-4').style.left = "84px";
        document.querySelector('.btn-lat-4').style.top = "0px";
        
        document.querySelector('.btn-lat-5').style.left= "42px";
        document.querySelector('.btn-lat-5').style.top = "0px";
        
        document.querySelector('.btn-lat-6').style.left = "0px";
        document.querySelector('.btn-lat-6').style.top = "0px";
    } else {
        document.querySelector('.btn-lat-1').style.right = "50px";
        document.querySelector('.btn-lat-1').style.top = "0px";
        
        document.querySelector('.btn-lat-2').style.right = "50px";
        document.querySelector('.btn-lat-2').style.top = "50px";

        document.querySelector('.btn-lat-3').style.right = "50px";
        document.querySelector('.btn-lat-3').style.top = "100px";
        
        document.querySelector('.btn-lat-4').style.left = "50px";
        document.querySelector('.btn-lat-4').style.top = "100px";
        
        document.querySelector('.btn-lat-5').style.left= "50px";
        document.querySelector('.btn-lat-5').style.top = "50px";
        
        document.querySelector('.btn-lat-6').style.left = "50px";
        document.querySelector('.btn-lat-6').style.top = "0px";
    }

    const evt = new CustomEvent('board-model-change', {
        detail: modelInput.value,
    });
    window.dispatchEvent(evt);
}
modelInput.addEventListener('change', () => {
    loadModelInput();
})


// ------ BACKGROUND IMAGE ------ 
const imageInput = document.querySelector('#image-input');
const imagePreview = document.querySelector('#bg-image-preview');
function loadBackgroundImage(imageUrl) {
    imagePreview.src = imageUrl || '';
    const evt = new CustomEvent('background-image-change', {
        detail: imageUrl,
    });
    window.dispatchEvent(evt);
}

imageInput.addEventListener('change', () => {
    let file = imageInput.files[0];
    if (file) {
        readImage(file).then(url => {
            loadBackgroundImage(url);
        })
    }

})



// ------ EXPORT FILE ------
const exportFileButton = document.querySelector('#export-file-btn');
function download(filename, text) {
    // This function creates a download button with the content that we need to download, then clicks it to start the download
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
exportFileButton.addEventListener('click', () => {
    const resultJson = {
        'model-input': document.getElementById('model-input').value,
        'invert-inputs': document.getElementById('invert-inputs').checked,
        'layout-input': document.getElementById('layout-input').value,
        'main-btns-quant-input': document.getElementById('main-btns-quant-input').value,
        'main-btns-size-input': document.getElementById('main-btns-size-input').value,
        'main-btns-legends-switch': document.getElementById('main-btns-legends-switch').value,
        'main-btns-legends-type': document.getElementById('main-btns-legends-type').value,
        'lat-btns-quant-input': document.getElementById('lat-btns-quant-input').value,
        'lat-btns-size-input': document.getElementById('lat-btns-size-input').value,
        'image-input': document.getElementById('bg-image-preview').src,
    }

    const addColorEditorToFile = (colorEditor) => {
        resultJson[colorEditor.id] = {
            'style': colorEditor.getAttribute('style'),
            'data-bg-color': colorEditor.getAttribute('data-bg-color'),
            'data-border-color': colorEditor.getAttribute('data-border-color'),
            'data-text-color': colorEditor.getAttribute('data-text-color'),
        }
    }

    // All main buttons
    document.querySelectorAll('.button-container#layout-'+resultJson['layout-input']+' .color-editor-preview').forEach(button => {
        addColorEditorToFile(button)
    });
    
    // Legend color
    let legendColor = document.getElementById('legend-color-btn');
    addColorEditorToFile(legendColor);
   
    // All lateral buttons
    document.querySelectorAll('.button-container-lateral .color-editor-preview').forEach(button => {
        addColorEditorToFile(button)
    });

    download('arcade_builder_proj.UA', JSON.stringify(resultJson));
})



// ------ IMPORT FILE ------
const importFileButton = document.querySelector('#import-file-btn');
importFileButton.addEventListener('change', () => {
    
    let file = importFileButton.files[0];
    readTextFile(file).then(text => {
        const data = JSON.parse(text);
        const elementsToIgnore = ['image-input'];

        Object.keys(data).forEach(elementId => {
            if (elementsToIgnore.includes(elementId)) return;

            const value = data[elementId];
            const element = document.getElementById(elementId);

            if (typeof value === 'boolean') {
                element.checked = value;
            } else if (typeof value === 'string') {
                element.value = value;
            } else if (typeof value === 'object') {
                Object.keys(value).forEach(attribute => {
                    if (value[attribute] != null) {
                        element.setAttribute(attribute, value[attribute]);
                    }
                })
            }
        });

        if (data['image-input']) {
            loadBackgroundImage(data['image-input']);
        }
        initAttributeEditor();
    })
});

function initAttributeEditor() {
    
    // Execute functions based on input values
    loadArcadeLayout();
    loadMainButtonsVisibility();
    loadMainButtonsSize();
    initButtonsInvertState();
    loadLegends();
    loadLegendsType();
    loadButtonsColors();
    loadLatButtonsVisibility();
    loadLatButtonsSize();
    loadModelInput();

}
window.addEventListener('load', () => {
    initAttributeEditor();
})