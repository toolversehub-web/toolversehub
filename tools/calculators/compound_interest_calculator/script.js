/* ==========================================
   ELEMENTS
========================================== */

const principalAmount=

document.getElementById(

"principalAmount"

);

const interestRate=

document.getElementById(

"interestRate"

);

const timePeriod=

document.getElementById(

"timePeriod"

);

const compoundFrequency=

document.getElementById(

"compoundFrequency"

);

const calculateBtn=

document.getElementById(

"calculateBtn"

);

const resetBtn=

document.getElementById(

"resetBtn"

);

const principalResult=

document.getElementById(

"principalResult"

);

const interestResult=

document.getElementById(

"interestResult"

);

const totalAmountResult=

document.getElementById(

"totalAmountResult"

);

/* ==========================================
   RESET RESULTS
========================================== */

function resetResults(){

    principalResult.textContent=

    "₹0";

    interestResult.textContent=

    "₹0";

    totalAmountResult.textContent=

    "₹0";

}

/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener(

"DOMContentLoaded",

()=>{

    resetResults();

}

);
/* ==========================================
   COMPOUND INTEREST CALCULATION
========================================== */

function calculateCompoundInterest(){

    const principal=

    parseFloat(

    principalAmount.value

    );

    const rate=

    parseFloat(

    interestRate.value

    );

    const years=

    parseFloat(

    timePeriod.value

    );

    const frequency=

    parseInt(

    compoundFrequency.value

    );

    if(

        isNaN(principal) ||

        isNaN(rate) ||

        isNaN(years) ||

        principal<=0 ||

        rate<=0 ||

        years<=0

    ){

        alert(

        "Please enter valid values."

        );

        return;

    }

    const amount=

    principal*

    Math.pow(

        1+

        (

            rate/

            100/

            frequency

        ),

        frequency*

        years

    );

    const interest=

    amount-

    principal;

    principalResult.textContent=

    "₹"+

    principal.toLocaleString(

    "en-IN",

    {

        maximumFractionDigits:2

    }

    );

    interestResult.textContent=

    "₹"+

    interest.toLocaleString(

    "en-IN",

    {

        maximumFractionDigits:2

    }

    );

    totalAmountResult.textContent=

    "₹"+

    amount.toLocaleString(

    "en-IN",

    {

        maximumFractionDigits:2

    }

    );

}
/* ==========================================
   CALCULATE BUTTON
========================================== */

calculateBtn.addEventListener(

"click",

()=>{

    calculateCompoundInterest();

}

);

/* ==========================================
   RESET BUTTON
========================================== */

resetBtn.addEventListener(

"click",

()=>{

    principalAmount.value="";

    interestRate.value="";

    timePeriod.value="";

    compoundFrequency.value="1";

    resetResults();

}

);

/* ==========================================
   AUTO CALCULATE
========================================== */

principalAmount.addEventListener(

"input",

autoCalculate

);

interestRate.addEventListener(

"input",

autoCalculate

);

timePeriod.addEventListener(

"input",

autoCalculate

);

compoundFrequency.addEventListener(

"change",

autoCalculate

);

function autoCalculate(){

    if(

        principalAmount.value!=="" &&

        interestRate.value!=="" &&

        timePeriod.value!==""

    ){

        calculateCompoundInterest();

    }

}