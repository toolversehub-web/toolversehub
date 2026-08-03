/* ==========================================
   ELEMENTS
========================================== */

const inputValue = document.getElementById("inputValue");

const category = document.getElementById("category");

const fromUnit = document.getElementById("fromUnit");

const toUnit = document.getElementById("toUnit");

const convertBtn = document.getElementById("convertBtn");

const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");

const resultText = document.getElementById("resultText");

/* ==========================================
   UNIT DATA
========================================== */

const units = {

length:[
"Meter",
"Kilometer",
"Centimeter",
"Millimeter",
"Inch",
"Foot",
"Yard",
"Mile"
],

weight:[
"Kilogram",
"Gram",
"Pound",
"Ounce"
],

temperature:[
"Celsius",
"Fahrenheit",
"Kelvin"
],

speed:[
"km/h",
"m/s",
"mph"
],

volume:[
"Liter",
"Milliliter",
"Cubic Meter"
],

area:[
"Square Meter",
"Square Kilometer",
"Square Foot",
"Acre"
]

};

/* ==========================================
   LOAD UNITS
========================================== */

function loadUnits(){

    fromUnit.innerHTML="";

    toUnit.innerHTML="";

    units[category.value].forEach(unit=>{

        let option1=document.createElement("option");

        option1.value=unit;

        option1.textContent=unit;

        fromUnit.appendChild(option1);

        let option2=document.createElement("option");

        option2.value=unit;

        option2.textContent=unit;

        toUnit.appendChild(option2);

    });

}

loadUnits();

category.addEventListener("change",loadUnits);
/* ==========================================
   CONVERSION FACTORS
========================================== */

const factors={

length:{
"Meter":1,
"Kilometer":1000,
"Centimeter":0.01,
"Millimeter":0.001,
"Inch":0.0254,
"Foot":0.3048,
"Yard":0.9144,
"Mile":1609.344
},

weight:{
"Kilogram":1,
"Gram":0.001,
"Pound":0.45359237,
"Ounce":0.0283495
},

speed:{
"km/h":1,
"m/s":3.6,
"mph":1.609344
},

volume:{
"Liter":1,
"Milliliter":0.001,
"Cubic Meter":1000
},

area:{
"Square Meter":1,
"Square Kilometer":1000000,
"Square Foot":0.092903,
"Acre":4046.8564224
}

};

/* ==========================================
   SWAP BUTTON
========================================== */

swapBtn.addEventListener("click",()=>{

    const temp=fromUnit.value;

    fromUnit.value=toUnit.value;

    toUnit.value=temp;

});

/* ==========================================
   SIMPLE CONVERSION
========================================== */

function convertByFactor(value,type,from,to){

    let base=value*factors[type][from];

    return base/factors[type][to];

}
/* ==========================================
   TEMPERATURE CONVERSION
========================================== */

function convertTemperature(value,from,to){

    let celsius;

    if(from==="Celsius"){

        celsius=value;

    }

    else if(from==="Fahrenheit"){

        celsius=(value-32)*5/9;

    }

    else{

        celsius=value-273.15;

    }

    if(to==="Celsius"){

        return celsius;

    }

    else if(to==="Fahrenheit"){

        return (celsius*9/5)+32;

    }

    else{

        return celsius+273.15;

    }

}

/* ==========================================
   CONVERT BUTTON
========================================== */

convertBtn.addEventListener("click",()=>{

    const value=parseFloat(inputValue.value);

    if(isNaN(value)){

        result.textContent="0";

        resultText.textContent="Please enter a valid number.";

        return;

    }

    let answer;

    if(category.value==="temperature"){

        answer=convertTemperature(
            value,
            fromUnit.value,
            toUnit.value
        );

    }

    else{

        answer=convertByFactor(
            value,
            category.value,
            fromUnit.value,
            toUnit.value
        );

    }

    answer=Number(answer.toFixed(6));

    result.textContent=answer;

    resultText.textContent=
    `${value} ${fromUnit.value} = ${answer} ${toUnit.value}`;

});
/* ==========================================
   ENTER KEY SUPPORT
========================================== */

inputValue.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        convertBtn.click();

    }

});

/* ==========================================
   AUTO CONVERT AFTER SWAP
========================================== */

swapBtn.addEventListener("click",()=>{

    if(inputValue.value!==""){

        convertBtn.click();

    }

});

/* ==========================================
   RESET RESULT ON CATEGORY CHANGE
========================================== */

category.addEventListener("change",()=>{

    result.textContent="0";

    resultText.textContent="Your converted value will appear here.";

});

/* ==========================================
   RESET RESULT ON INPUT CHANGE
========================================== */

inputValue.addEventListener("input",()=>{

    if(inputValue.value===""){

        result.textContent="0";

        resultText.textContent="Your converted value will appear here.";

    }

});

/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener("load",()=>{

    loadUnits();

    result.textContent="0";

    resultText.textContent="Your converted value will appear here.";

});