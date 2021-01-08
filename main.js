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

    usdObj.currencyOut.innerHTML = `${usdObj.currency}<span class="difference diff_usd">${usdObj.difference}&nbsp;₽</span>`
    usdObj.spanDiff = document.querySelector('.diff_usd')

    if (usdObj.difference < 0) {
        usdObj.spanDiff.classList.add('negative')
        usdObj.spanDiff.innerHTML = `-${usdObj.spanDiff.innerHTML}`
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

    eurObj.currencyOut.innerHTML = `${eurObj.currency}<span class="difference diff_eur">${eurObj.difference}&nbsp;₽</span>`
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


fetch(`https://www.cbr-xml-daily.ru/daily_json.js`)
    .then(function(resp) {
        return resp.json()
    })
    .then(function(data) {

        let exchangerObj = {
            rangeInput: document.querySelector('.input_out'),
            range: document.querySelector('.check'),
            inputOut: document.querySelector('.out_exchanger')
        }

        let select = document.querySelector('.select_currency')
        console.log(select.selectedIndex)

        setInterval(() => {
            let rangeValue = exchangerObj.range.value
            if (select.selectedIndex === 0) {
                exchangerObj.rangeInput.value = rangeValue * 10
                exchangerObj.inputOut.innerHTML = `<p>${Math.round(exchangerObj.rangeInput.value * usdObj.currency) }&nbsp;₽</p>`
                exchangerObj.rangeInput.value += ` $`
            } else if (select.selectedIndex === 1) {
                exchangerObj.rangeInput.value = rangeValue * 10
                exchangerObj.inputOut.innerHTML = `<p>${Math.round(exchangerObj.rangeInput.value * eurObj.currency) }&nbsp;₽</p>`
                exchangerObj.rangeInput.value += ` €`
            }
        }, 0)

        console.log(data)

    })