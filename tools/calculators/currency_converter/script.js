/* ==========================================
   ELEMENTS
========================================== */

const amount = document.getElementById("amount");

const fromCurrency = document.getElementById("fromCurrency");

const toCurrency = document.getElementById("toCurrency");

const swapBtn = document.getElementById("swapBtn");

const convertBtn = document.getElementById("convertBtn");

const result = document.getElementById("result");

const exchangeRate = document.getElementById("exchangeRate");

const lastUpdated = document.getElementById("lastUpdated");

/* ==========================================
   API
========================================== */

const API_URL = "https://open.er-api.com/v6/latest/USD";

/* ==========================================
   LOAD CURRENCIES
========================================== */

async function loadCurrencies(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        if(data.result !== "success"){

            throw new Error("API Error");

        }

        const currencies = Object.keys(data.rates);

        fromCurrency.innerHTML = "";

        toCurrency.innerHTML = "";

        currencies.forEach(code=>{

            const option1 = document.createElement("option");

            option1.value = code;

            option1.textContent = code;

            fromCurrency.appendChild(option1);

            const option2 = document.createElement("option");

            option2.value = code;

            option2.textContent = code;

            toCurrency.appendChild(option2);

        });

        fromCurrency.value = "USD";

        toCurrency.value = "PKR";

    }

    catch(error){

        result.textContent = "Error";

        exchangeRate.textContent = "Unable to load currencies.";

        lastUpdated.textContent = "";

    }

}

loadCurrencies();
/* ==========================================
   LIVE CONVERSION
========================================== */

async function convertCurrency(){

    const value = parseFloat(amount.value);

    if(isNaN(value) || value<=0){

        result.textContent = "0.00";

        exchangeRate.textContent = "Please enter a valid amount.";

        lastUpdated.textContent = "";

        return;

    }

    try{

        const from = fromCurrency.value;

        const to = toCurrency.value;

        const response = await fetch(

            `https://open.er-api.com/v6/latest/${from}`

        );

        const data = await response.json();

        if(data.result!=="success"){

            throw new Error("API Error");

        }

        const rate = data.rates[to];

        const converted = value * rate;

        result.textContent =

        `${converted.toFixed(2)} ${to}`;

        exchangeRate.textContent =

        `1 ${from} = ${rate.toFixed(4)} ${to}`;

        lastUpdated.textContent =

        `Updated: ${data.time_last_update_utc}`;

    }

    catch(error){

        result.textContent = "Error";

        exchangeRate.textContent =

        "Unable to fetch exchange rate.";

        lastUpdated.textContent = "";

    }

}

/* ==========================================
   SWAP CURRENCIES
========================================== */

swapBtn.addEventListener("click",()=>{

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;

    toCurrency.value = temp;

    if(amount.value!==""){

        convertCurrency();

    }

});
/* ==========================================
   CONVERT BUTTON
========================================== */

convertBtn.addEventListener("click",()=>{

    convertCurrency();

});

/* ==========================================
   ENTER KEY SUPPORT
========================================== */

amount.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        convertCurrency();

    }

});

/* ==========================================
   AUTO CONVERT ON INPUT
========================================== */

amount.addEventListener("input",()=>{

    if(amount.value!=="" && parseFloat(amount.value)>0){

        convertCurrency();

    }

});

/* ==========================================
   AUTO CONVERT WHEN CURRENCY CHANGES
========================================== */

fromCurrency.addEventListener("change",()=>{

    if(amount.value!=="" && parseFloat(amount.value)>0){

        convertCurrency();

    }

});

toCurrency.addEventListener("change",()=>{

    if(amount.value!=="" && parseFloat(amount.value)>0){

        convertCurrency();

    }

});
/* ==========================================
   RESET RESULT
========================================== */

function resetResult(){

    result.textContent = "0.00";

    exchangeRate.textContent = "Exchange rate will appear here.";

    lastUpdated.textContent = "";

}

/* ==========================================
   RESET WHEN INPUT IS EMPTY
========================================== */

amount.addEventListener("input",()=>{

    if(amount.value===""){

        resetResult();

    }

});

/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener("load",()=>{

    resetResult();

});

/* ==========================================
   INITIALIZE PAGE
========================================== */

window.addEventListener("load",async()=>{

    await loadCurrencies();

    resetResult();

});