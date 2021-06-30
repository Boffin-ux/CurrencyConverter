document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const select = document.getElementById('currency'),
        output = document.getElementById('output'),
        url = 'http://api.exchangeratesapi.io/v1/latest?access_key=',
        key = 'b043fdbd1730a4e0158bab349a2a64e4',
        symbols = '&symbols=USD,RUB';

    const init = (target) => {
        output.innerHTML = '';
        let addSpan = '';
        const outputConverter = document.createElement('div');
        const outputConverterBack = document.createElement('div');
        outputConverter.classList.add('output-converter');
        outputConverterBack.classList.add('output-converter-back');
        output.append(outputConverter);
        output.append(outputConverterBack);
        outputConverter.innerHTML = `<input type="text" class="currency currency-output"><span>${addSpan}</span>
            <input type="text" class="converter converter-output" disabled><span>Российский рубль (RUB)</span>
            <button class="btn-converter-output">Конвертировать</button>`;
        outputConverterBack.innerHTML = `<input type="text" class="currency currency-back"><span>Российский рубль (RUB)</span>
            <input type="text" class=" converter-back" disabled><span>${addSpan}</span>
            <button class="btn-converter-back">Конвертировать</button>`;

        if (target.value === 'USD') {
            addSpan = 'Доллар США (USD)';
        } else if (target.value === 'EUR') {
            addSpan = 'Евро (EUR)';
        } else if (target.value === 'no') {
            const element = output.querySelectorAll('div');
            element.forEach(item => {
                item.remove();
            });
            output.innerHTML = '<h3>Выберите валюту</h3>';
        }
        output.addEventListener('input', event => {
            checkInput(event);
        });
        if (target.value !== 'no') {
            getData(target.value);
        }
    };

    const getData = (currencyId) => {
        fetch(`${url}${key}${symbols}`, {
            method: 'GET',
            mode: 'cors',
            body: JSON.stringify()
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('status network not 200');
                }
                return (response.json());
            })
            .then(data => {
                getCurrency(data, currencyId);
            })
            .catch(error => console.log(error));
    };

    const checkInput = (event) => {
        const target = event.target;
        if (target.value) {
            if (target.closest('input')) {
                target.value = target.value.replace(/[^0-9]/g, '');
            } else {
                return;
            }
        }
    };

    const getCurrency = (data, currencyId) => {
        const { USD, RUB } = data.rates;
        const currencyOutput = document.querySelector('.currency-output');
        const converterOutput = document.querySelector('.converter-output');
        const currencyBack = document.querySelector('.currency-back');
        const converterBack = document.querySelector('.converter-back');
        converterOutput.value = 0;
        converterBack.value = 0;
        output.addEventListener('click', event => {
            const target = event.target;
            if (currencyId === 'USD') {
                if (target.matches('.btn-converter-output')) {
                    converterOutput.value = parseFloat((currencyOutput.value * (RUB / USD)).toFixed(2));
                } else if (target.matches('.btn-converter-back')) {
                    converterBack.value = parseFloat((currencyBack.value / (RUB / USD)).toFixed(2));
                } else {
                    return;
                }
            }
            if (currencyId === 'EUR') {
                if (target.matches('.btn-converter-output')) {
                    converterOutput.value = parseFloat((currencyOutput.value * RUB).toFixed(2));
                } else if (target.matches('.btn-converter-back')) {
                    converterBack.value = parseFloat((currencyBack.value / RUB).toFixed(2));
                } else {
                    return;
                }
            }
        });
    };

    select.addEventListener('change', event => {
        const target = event.target;
        init(target);
    });
});