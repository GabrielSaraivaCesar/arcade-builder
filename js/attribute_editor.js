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
function openColorEditorModal(btn) {
    let noBorderColor = btn.classList.contains('joystick-type') || btn.classList.contains('keyboard-key') || btn.classList.contains('legend-type')
    let noTextColor = !btn.classList.contains('legend-type')

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
    
    let btnRect = btn.getBoundingClientRect();
    let containerRect = colorPicker.getBoundingClientRect();
    // Setting color picker container position on top the top of the button
    colorPicker.style.left = (btnRect.left-containerRect.width - 50)+'px';
    colorPicker.style.top = (btnRect.top-containerRect.height + ((noBorderColor && noTextColor) ? 15 : 40))+'px';

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
    [...colorOptionsBorder].find(opt => {
        return opt.getAttribute('data-name') === btnBorderColor;
    }).classList.add('selected');
    [...colorOptionsText].find(opt => {
        return opt.getAttribute('data-name') === btnTextColor;
    }).classList.add('selected');
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
        let btn = document.querySelector(`.button-color-editor#${selectedButtonId}`);
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
        let btn = document.querySelector(`.button-color-editor#${selectedButtonId}`);
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
        let btn = document.querySelector(`.button-color-editor#${selectedButtonId}`);
        if (btn) {
            btn.setAttribute('data-text-color', colorName);
            btn.style.color = colorCode;
        }
    })
})


const buttons = document.querySelectorAll('.button-color-editor');
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
    document.querySelectorAll('.button-container .button-color-editor').forEach(buttonColorEditor => {
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
    const extraButtons = document.querySelectorAll('.button-color-editor.btn-8');
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
        document.querySelector('.button-color-editor.btn-lat-4').classList.remove('disabled');
    else 
        document.querySelector('.button-color-editor.btn-lat-4').classList.add('disabled');
    
    if (quant >= 5) 
        document.querySelector('.button-color-editor.btn-lat-5').classList.remove('disabled');
    else 
        document.querySelector('.button-color-editor.btn-lat-5').classList.add('disabled');
    
    if (quant >= 6) 
        document.querySelector('.button-color-editor.btn-lat-6').classList.remove('disabled');
    else 
        document.querySelector('.button-color-editor.btn-lat-6').classList.add('disabled');
    
}
latBtnsQuantInput.addEventListener('change', (evt) => {
    loadLatButtonsVisibility();
})



// ------ BACKGROUND IMAGE ------ 
const imageInput = document.querySelector('#image-input');
const imagePreview = document.querySelector('#bg-image-preview');
function loadBackgroundImage(imageUrl) {
    imagePreview.src = imageUrl;
}
imageInput.addEventListener('change', () => {
    let file = imageInput.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        loadBackgroundImage(reader.result)
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        loadBackgroundImage("")
    }

})


window.addEventListener('load', () => {
    // Execute functions based on input values
    loadMainButtonsVisibility();
    loadMainButtonsSize();
    initButtonsInvertState();
    loadArcadeLayout();
    loadLegends();
    loadLegendsType();
    loadButtonsColors();
})