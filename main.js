'use strict'


// отображение актуального курса двух главных валют

class Currency {
    constructor() {
        this.months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
    }
    get date() {
        if (this._date.getDate().toString().length == 1) {
            return `0${this._date.getDate()} ${this.months[this._date.getMonth()]} ${this._date.getFullYear()}`
        } else {
            return `${this._date.getDate()} ${this.months[this._date.getMonth()]} ${this._date.getFullYear()}`
        }
    }
    set date(value) {
        return this._date = value
    }

}


let usdObj = new Currency()
let eurObj = new Currency()


// объект валюты доллар США, содержит всю инфу с сервера 
const createUsd = function(data) {
    usdObj.currencyOut = document.querySelector('.usd_out')
    usdObj.dateOut = document.querySelector('.date_currency_usd')

    usdObj.currency = +data['Valute']['USD']['Value'].toFixed(2)
    usdObj.difference = ((+data['Valute']['USD']['Value']) - (+data['Valute']['USD']['Previous'])).toFixed(2)

    usdObj.currencyOut.innerHTML = `${usdObj.currency}<span class="difference diff_usd">${usdObj.difference}&nbsp;&#x20bd</span>`
    usdObj.spanDiff = document.querySelector('.diff_usd')

    if (usdObj.difference < 0) {
        usdObj.spanDiff.classList.add('negative')
        usdObj.spanDiff.innerHTML = `${usdObj.spanDiff.innerHTML}`
    } else {
        usdObj.spanDiff.classList.remove('negative')
    }


    let currentDate = data['Date']
    let strDate = currentDate.slice(0, currentDate.indexOf('T'))

    usdObj.date = new Date(strDate)
    usdObj.dateOut.innerHTML = `${usdObj.date}`

}

// объект валюты евро, содержит всю инфу с сервера 
const createEuro = function(data) {
    eurObj.currencyOut = document.querySelector('.euro_out')
    eurObj.dateOut = document.querySelector('.date_currency_eur')

    eurObj.currency = +data['Valute']['EUR']['Value'].toFixed(2)
    eurObj.difference = ((+data['Valute']['EUR']['Value']) - (+data['Valute']['EUR']['Previous'])).toFixed(2)

    eurObj.currencyOut.innerHTML = `${eurObj.currency}<span class="difference diff_eur">${eurObj.difference}&nbsp;&#x20bd</span>`
    eurObj.spanDiff = document.querySelector('.diff_eur')

    if (eurObj.difference < 0) {
        eurObj.spanDiff.classList.add('negative')
    } else {
        eurObj.spanDiff.classList.remove('negative')
    }

    let currentDate = data['Date']
    let strDate = currentDate.slice(0, currentDate.indexOf('T'))

    eurObj.date = new Date(strDate)
    eurObj.dateOut.innerHTML = `${eurObj.date}`

}

// запрос к сервере и работа с полученным объектом 

fetch(`https://www.cbr-xml-daily.ru/daily_json.js`)
    .then(function(resp) {
        return resp.json()
    })
    .then(function(data) {
        //функции отображения валют США и ЕВРО 
        createUsd(data)
        createEuro(data)
    })


// работа ползунка второго блока и отображение заданных значений в зависимости от курса

let exchangerObj = {
    rangeInput: document.querySelector('.input_out'),
    range: document.querySelector('.check'),
    inputOut: document.querySelector('.out_exchanger'),
    textInputOut: document.createElement('p'),
    select: document.querySelector('.select_currency'),
}


exchangerObj.inputOut.append(exchangerObj.textInputOut)
exchangerObj.rangeInput.value = exchangerObj.range.value
exchangerObj.textInputOut.innerHTML = `0 &#x20bd`


let currentValue = exchangerObj.range.value
let currentSelect = exchangerObj.select.selectedIndex;


let changeInputOut = function(obj) {
    if (obj.select.selectedIndex === 0) {
        let result = Math.round(obj.rangeInput.value * usdObj.currency)
        obj.textInputOut.innerHTML = `${result}&nbsp;&#x20bd`
    } else if (obj.select.selectedIndex === 1) {
        let result = Math.round(obj.rangeInput.value * eurObj.currency)
        obj.textInputOut.innerHTML = `${result}&nbsp;&#x20bd`
    }
}

let changeInputValue = function(obj) {
    if (obj.rangeInput.value != (obj.range.value * 10)) {
        if (obj.rangeInput.value > 1000) obj.rangeInput.value = 1000

        if (obj.select.selectedIndex === 0) {
            let result = Math.round(obj.rangeInput.value * usdObj.currency)
            obj.textInputOut.innerHTML = `${result}&nbsp;&#x20bd`
        } else if (obj.select.selectedIndex === 1) {
            let result = Math.round(obj.rangeInput.value * eurObj.currency)
            obj.textInputOut.innerHTML = `${result}&nbsp;&#x20bd`
        }
    }
    obj.range.value = obj.rangeInput.value / 10;
}



setInterval(() => {
    if (exchangerObj.range.value != currentValue) {
        exchangerObj.rangeInput.value = exchangerObj.range.value * 10;
        changeInputOut(exchangerObj)
        currentValue = exchangerObj.range.value
    }
})

setInterval(() => {
    if (currentSelect != exchangerObj.select.selectedIndex) {
        changeInputOut(exchangerObj)
        currentSelect = exchangerObj.select.selectedIndex
    }
})

setInterval(() => {
    changeInputValue(exchangerObj)
    currentValue = exchangerObj.range.value
})


// работа инпута и кнопок при адаптивности

let buttonsCurrency = {
    currencyButtonsBlock: document.querySelector('.currency_buttons'),
    usd: document.querySelector('.usd_btn'),
    eur: document.querySelector('.eur_btn'),
}
buttonsCurrency.currentButton = buttonsCurrency.usd

buttonsCurrency.currencyButtonsBlock.addEventListener('click', function(e) {
    clickButton(e)
})

function clickButton(e) {
    let target = e.target
    let currency = e.target.dataset.select

    if (!target.closest('button')) return

    active(target, currency)
}

function active(button, select) {
    if (buttonsCurrency.currentButton) {
        buttonsCurrency.currentButton.classList.remove('active')
    }
    buttonsCurrency.currentButton = button
    buttonsCurrency.currentButton.classList.add('active')
    exchangerObj.select.selectedIndex = select
}