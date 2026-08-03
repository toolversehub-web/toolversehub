/* ==========================================
   ELEMENTS
========================================== */

const monthlyInvestment=

document.getElementById(

"monthlyInvestment"

);

const annualReturn=

document.getElementById(

"annualReturn"

);

const investmentYears=

document.getElementById(

"investmentYears"

);

const calculateBtn=

document.getElementById(

"calculateBtn"

);

const resetBtn=

document.getElementById(

"resetBtn"

);

const investedAmount=

document.getElementById(

"investedAmount"

);

const estimatedReturns=

document.getElementById(

"estimatedReturns"

);

const maturityValue=

document.getElementById(

"maturityValue"

);

/* ==========================================
   RESET RESULTS
========================================== */

function resetResults(){

    investedAmount.textContent=

    "₹0";

    estimatedReturns.textContent=

    "₹0";

    maturityValue.textContent=

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
   SIP CALCULATION
========================================== */

function calculateSIP(){

    const monthly=

    parseFloat(

    monthlyInvestment.value

    );

    const annual=

    parseFloat(

    annualReturn.value

    );

    const years=

    parseFloat(

    investmentYears.value

    );

    if(

        isNaN(monthly) ||

        isNaN(annual) ||

        isNaN(years) ||

        monthly<=0 ||

        annual<=0 ||

        years<=0

    ){

        alert(

        "Please enter valid values."

        );

        return;

    }

    const monthlyRate=

    annual/12/100;

    const months=

    years*12;

    const maturity=

    monthly*

    (

        (

            Math.pow(

                1+monthlyRate,

                months

            )-1

        )/

        monthlyRate

    )*

    (

        1+monthlyRate

    );

    const invested=

    monthly*months;

    const returns=

    maturity-invested;

    investedAmount.textContent=

    "₹"+

    invested.toLocaleString(

    "en-IN",

    {

    maximumFractionDigits:2

    }

    );

    estimatedReturns.textContent=

    "₹"+

    returns.toLocaleString(

    "en-IN",

    {

    maximumFractionDigits:2

    }

    );

    maturityValue.textContent=

    "₹"+

    maturity.toLocaleString(

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

    calculateSIP();

}

);

/* ==========================================
   RESET BUTTON
========================================== */

resetBtn.addEventListener(

"click",

()=>{

    monthlyInvestment.value="";

    annualReturn.value="";

    investmentYears.value="";

    resetResults();

}

);

/* ==========================================
   AUTO CALCULATE
========================================== */

monthlyInvestment.addEventListener(

"input",

()=>{

    if(

        monthlyInvestment.value!=="" &&

        annualReturn.value!=="" &&

        investmentYears.value!==""

    ){

        calculateSIP();

    }

}

);

annualReturn.addEventListener(

"input",

()=>{

    if(

        monthlyInvestment.value!=="" &&

        annualReturn.value!=="" &&

        investmentYears.value!==""

    ){

        calculateSIP();

    }

}

);

investmentYears.addEventListener(

"input",

()=>{

    if(

        monthlyInvestment.value!=="" &&

        annualReturn.value!=="" &&

        investmentYears.value!==""

    ){

        calculateSIP();

    }

}

);
