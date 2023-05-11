const url = 'https://api.exchangerate.host/latest';

let currentCurr = 'RUB', exchangeCurr = 'USD';
let currVal = 1;

const inpLeft = document.querySelector('#left-input');
const inpRight = document.querySelector('#right-input');

const currLeft = document.querySelector('#left-curr');
const currRight = document.querySelector('#right-curr');

const btnLeft = document.querySelectorAll('.currency1 .li-btn');
for (let i = 0; i < btnLeft.length; i++) {
    btnLeft[i].addEventListener('click', changeCurrentCurrency);
}

const btnRight = document.querySelectorAll('.currency2 .li-btn');
for (let i = 0; i < btnRight.length; i++) {
    btnRight[i].addEventListener('click', changeExchangeCurrency);
}

async function loadCurrency(a, b) {
    if (a === b) return 1;
    const query = `?base=${a}&symbols=${b}`;
    const res = await fetch(url + query);
    const data = await res.json();
    return data.rates[b];
}

function getData(c, e, l, r) {
    loadCurrency(c, e)
        .then(data => {
            currVal = data.toFixed(4);
            const val = parseFloat(l.value);
            r.value = (val * currVal).toFixed(4);
            currLeft.innerText = `1 ${c} = ${currVal} ${e}`;
            const excVal = (1 / currVal).toFixed(4);
            currRight.innerText = `1 ${e} = ${excVal} ${c}`;
        })
        .catch(e => alert('Network error: error while getting data'));
}

function changeCurrentCurrency(e) {
    const btn = e.target;
    for (let i = 0; i < btnLeft.length; i++) {
        btnLeft[i].classList.remove('li-active');
    }
    btn.classList.add('li-active');
    currentCurr = btn.innerText.toUpperCase();
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
}

function changeExchangeCurrency(e) {
    const btn = e.target;
    for (let i = 0; i < btnRight.length; i++) {
        btnRight[i].classList.remove('li-active');
    }
    btn.classList.add('li-active');
    exchangeCurr = btn.innerText.toUpperCase();
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
}

inpLeft.addEventListener('input', (e) => {
    if (e.target.value === '') {
        e.target.value = 0;
    }
    e.target.value = e.target.value.replaceAll(',', '.');
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
});

inpRight.addEventListener('input', (e) => {
    if (e.target.value === '') {
        e.target.value = 0;
    }
    e.target.value = e.target.value.replaceAll(',', ',');
    getData(exchangeCurr, currentCurr, inpRight, inpLeft);
});

inpLeft.addEventListener('keydown', acceptNumber);
inpRight.addEventListener('keydown', acceptNumber);

function acceptNumber(e) {
    if( ! ( (e.key === 'Backspace') || (e.key === 'Delete') ||
    ( ('0' <= e.key) && (e.key <= '9') ) ||
    (e.key === '.') || (e.key === '.') 
    ) ){
        e.preventDefault();
    }
    if ((e.key === ',') || (e.key === '.')) {
        if (e.target.value.indexOf('.') >= 0) {
            e.preventDefault();
        }
    }
}

getData(currentCurr, exchangeCurr, inpLeft, inpRight);