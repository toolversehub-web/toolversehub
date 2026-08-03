/* ==========================================
   ELEMENTS
========================================== */

const startDate=document.getElementById("startDate");

const endDate=document.getElementById("endDate");

const calculateBtn=document.getElementById("calculateBtn");

const resetBtn=document.getElementById("resetBtn");

const yearsResult=document.getElementById("yearsResult");

const monthsResult=document.getElementById("monthsResult");

const daysResult=document.getElementById("daysResult");

const totalDaysResult=document.getElementById("totalDaysResult");

const totalWeeksResult=document.getElementById("totalWeeksResult");

const totalMonthsResult=document.getElementById("totalMonthsResult");

/* ==========================================
   RESET RESULTS
========================================== */

function resetResults(){

    yearsResult.textContent="0";

    monthsResult.textContent="0";

    daysResult.textContent="0";

    totalDaysResult.textContent="0";

    totalWeeksResult.textContent="0";

    totalMonthsResult.textContent="0";

}

/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener("load",()=>{

    resetResults();

});
/* ==========================================
   CALCULATE DATE DIFFERENCE
========================================== */

function calculateDifference(){

    if(startDate.value==="" || endDate.value===""){

        alert("Please select both dates.");

        return;

    }

    let start=new Date(startDate.value);

    let end=new Date(endDate.value);

    if(start>end){

        [start,end]=[end,start];

    }

    let years=end.getFullYear()-start.getFullYear();

    let months=end.getMonth()-start.getMonth();

    let days=end.getDate()-start.getDate();

    if(days<0){

        months--;

        const previousMonth=new Date(
            end.getFullYear(),
            end.getMonth(),
            0
        ).getDate();

        days+=previousMonth;

    }

    if(months<0){

        years--;

        months+=12;

    }

    yearsResult.textContent=years;

    monthsResult.textContent=months;

    daysResult.textContent=days;

    const difference=end-start;

    const totalDays=Math.floor(
        difference/(1000*60*60*24)
    );

    const totalWeeks=(totalDays/7).toFixed(1);

    const totalMonths=(totalDays/30.44).toFixed(1);

    totalDaysResult.textContent=totalDays;

    totalWeeksResult.textContent=totalWeeks;

    totalMonthsResult.textContent=totalMonths;

}
/* ==========================================
   TOTAL DAYS / WEEKS / MONTHS
========================================== */



/* ==========================================
   CALCULATE BUTTON
========================================== */

calculateBtn.addEventListener("click",()=>{

    calculateDifference();

});
/* ==========================================
   RESET BUTTON
========================================== */

resetBtn.addEventListener("click",()=>{

    startDate.value="";

    endDate.value="";

    resetResults();

});

/* ==========================================
   AUTO CALCULATE
========================================== */

startDate.addEventListener("change",()=>{

    if(startDate.value!=="" && endDate.value!==""){

        calculateDifference();

    }

});

endDate.addEventListener("change",()=>{

    if(startDate.value!=="" && endDate.value!==""){

        calculateDifference();

    }

});

/* ==========================================
   PAGE INITIALIZATION
========================================== */

window.addEventListener("DOMContentLoaded",()=>{

    resetResults();

});