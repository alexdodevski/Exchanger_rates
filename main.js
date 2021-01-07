'use strict'

console.log('hi')

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

const createUsd = function(data) {
    let usdObj = new Currency()
    usdObj.currencyOut = document.querySelector('.usd_out')
    usdObj.dateOut = document.querySelector('.date_currency_usd')

    usdObj.currency = +data['Valute']['USD']['Value'].toFixed(2)
    usdObj.difference = ((+data['Valute']['USD']['Value']) - (+data['Valute']['USD']['Previous'])).toFixed(2)

    usdObj.currencyOut.innerHTML = `${usdObj.currency}<span class="difference diff_usd">${usdObj.difference}&nbsp;₽</span>`
    usdObj.spanDiff = document.querySelector('.diff_usd')

    if (usdObj.difference < 0) {
        usdObj.spanDiff.classList.add('negative')
    } else {
        usdObj.spanDiff.classList.remove('negative')
    }


    let currentDate = data['Date']
    let strDate = currentDate.slice(0, currentDate.indexOf('T'))

    usdObj.date = new Date(strDate)
    usdObj.dateOut.innerHTML = `${usdObj.date}`
    console.log(usdObj)
}


const createEuro = function(data) {
    let eurObj = new Currency()
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
    console.log(eurObj)
}



fetch(`https://www.cbr-xml-daily.ru/daily_json.js`)
    .then(function(resp) {
        return resp.json()
    })
    .then(function(data) {
        console.log(data)
        createUsd(data)
        createEuro(data)
    })