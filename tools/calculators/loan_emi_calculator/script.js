/* =====================================================
   ELEMENTS
===================================================== */

const emiForm = document.getElementById("emiForm");

const loanAmount = document.getElementById("loanAmount");

const currency = document.getElementById("currency");

const interestRate = document.getElementById("interestRate");

const loanTerm = document.getElementById("loanTerm");

const termUnit = document.getElementById("termUnit");

const extraPayment = document.getElementById("extraPayment");

const processingFee = document.getElementById("processingFee");

const startDate = document.getElementById("startDate");

const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

/* =====================================================
   RESULT ELEMENTS
===================================================== */

const monthlyEMI = document.getElementById("monthlyEMI");

const totalPayment = document.getElementById("totalPayment");

const totalInterest = document.getElementById("totalInterest");

const loanPayoff = document.getElementById("loanPayoff");

const extraPaid = document.getElementById("extraPaid");

const processingFeeResult = document.getElementById("processingFeeResult");

const effectiveCost = document.getElementById("effectiveCost");

const interestPercentage = document.getElementById("interestPercentage");

/* =====================================================
   EVENTS
===================================================== */

calculateBtn.addEventListener(

    "click",

    calculateEMI

);

resetBtn.addEventListener(

    "click",

    resetCalculator

);
/* =====================================================
   CALCULATE EMI
===================================================== */

function calculateEMI(){

    const principal = parseFloat(loanAmount.value);

    const annualRate = parseFloat(interestRate.value);

    const extra = parseFloat(extraPayment.value) || 0;

    const fee = parseFloat(processingFee.value) || 0;

    let months = parseInt(loanTerm.value);

    if(

        isNaN(principal) ||

        principal<=0 ||

        isNaN(annualRate) ||

        annualRate<0 ||

        isNaN(months) ||

        months<=0

    ){

        alert(

        "Please enter valid loan details."

        );

        return;

    }

    if(

        termUnit.value==="years"

    ){

        months*=12;

    }

    const monthlyRate=

    annualRate/

    100/

    12;

    let emi;

    /* ============================
       ZERO INTEREST LOAN
    ============================ */

    if(

        monthlyRate===0

    ){

        emi=

        principal/

        months;

    }

    /* ============================
       STANDARD BANK EMI FORMULA
    ============================ */

    else{

        const factor=

        Math.pow(

            1+monthlyRate,

            months

        );

        emi=

        (

            principal*

            monthlyRate*

            factor

        )

        /

        (

            factor-1

        );

    }

    let balance=

    principal;

    let totalInterestPaid=0;

    let totalPaid=0;

    let totalExtraPaid=0;

    let payoffMonths=0;
    /* =====================================================
   AMORTIZATION CALCULATION
===================================================== */

    while(balance>0.01){

        let interestPayment=

        balance*

        monthlyRate;

        let principalPayment;

        if(monthlyRate===0){

            principalPayment=

            emi+extra;

        }

        else{

            principalPayment=

            emi-

            interestPayment+

            extra;

        }

        if(

            principalPayment>

            balance

        ){

            principalPayment=

            balance;

        }

        balance-=

        principalPayment;

        totalInterestPaid+=

        interestPayment;

        totalPaid+=

        principalPayment+

        interestPayment;

        totalExtraPaid+=

        extra;

        payoffMonths++;

    }

    const symbol=

    currency.value;

    monthlyEMI.textContent=

    symbol+" "+emi.toFixed(2);

    totalPayment.textContent=

    symbol+" "+totalPaid.toFixed(2);

    totalInterest.textContent=

    symbol+" "+totalInterestPaid.toFixed(2);

    extraPaid.textContent=

    symbol+" "+totalExtraPaid.toFixed(2);

    processingFeeResult.textContent=

    symbol+" "+fee.toFixed(2);

    effectiveCost.textContent=

    symbol+" "+

    (totalPaid+fee).toFixed(2);

    const interestPercent=

    (

        totalInterestPaid/

        principal

    )*100;

    interestPercentage.textContent=

    interestPercent.toFixed(2)+"%";
    /* =====================================================
   LOAN PAYOFF DATE
===================================================== */

    if(startDate.value!==""){

        const payoffDate=new Date(startDate.value);

        payoffDate.setMonth(

            payoffDate.getMonth()+payoffMonths

        );

        loanPayoff.textContent=

        payoffDate.toLocaleDateString(

            "en-GB",

            {

                day:"numeric",

                month:"long",

                year:"numeric"

            }

        );

    }

    else{

        loanPayoff.textContent=

        payoffMonths+" Months";

    }

}

/* =====================================================
   RESET
===================================================== */

function resetCalculator(){

    emiForm.reset();

    const symbol=currency.value;

    monthlyEMI.textContent=symbol+" 0";

    totalPayment.textContent=symbol+" 0";

    totalInterest.textContent=symbol+" 0";

    extraPaid.textContent=symbol+" 0";

    processingFeeResult.textContent=symbol+" 0";

    effectiveCost.textContent=symbol+" 0";

    interestPercentage.textContent="0%";

    loanPayoff.textContent="--";

}

/* =====================================================
   AUTO CALCULATE
===================================================== */

emiForm.addEventListener(

    "input",

    function(){

        if(

            loanAmount.value!=="" &&

            interestRate.value!=="" &&

            loanTerm.value!==""

        ){

            calculateEMI();

        }

    }

);

currency.addEventListener(

    "change",

    calculateEMI

);

/* =====================================================
   FORM SUBMIT
===================================================== */

emiForm.addEventListener(

    "submit",

    function(event){

        event.preventDefault();

        calculateEMI();

    }

);

/* =====================================================
   INITIALIZE
===================================================== */

resetCalculator();