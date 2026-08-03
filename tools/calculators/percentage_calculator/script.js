/* ===================================================
                TAB SWITCHING
=================================================== */

const tabButtons =
document.querySelectorAll(".tab-btn");

const tabContents =
document.querySelectorAll(".tab-content");

tabButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        tabButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        tabContents.forEach(tab=>{

            tab.classList.remove("active");

        });

        button.classList.add("active");

        document
        .getElementById(
            button.dataset.tab
        )
        .classList
        .add("active");

    });

});

/* ===================================================
                RESULT ELEMENTS
=================================================== */

const resultValue =
document.getElementById("resultValue");

const formulaText =
document.getElementById("formulaText");

/* ===================================================
                SHOW RESULT
=================================================== */

function showResult(result,formula){

    resultValue.innerHTML=result;

    formulaText.innerHTML=formula;

}

/* ===================================================
            FORMAT NUMBER
=================================================== */

function formatNumber(number){

    return Number(number).toLocaleString(
        "en-US",
        {

            maximumFractionDigits:2

        }

    );

}
/* ===================================================
                % OF NUMBER
=================================================== */

document
.getElementById("calculatePercent")
.addEventListener("click",()=>{

    const percent=parseFloat(

        document.getElementById("percentValue").value

    );

    const number=parseFloat(

        document.getElementById("percentNumber").value

    );

    if(

        isNaN(percent) ||

        isNaN(number)

    ){

        showResult(

            "Please enter valid numbers.",

            "Formula: (Percentage × Number) ÷ 100"

        );

        return;

    }

    const answer=

    (percent*number)/100;

    showResult(

        formatNumber(answer),

        `${percent}% × ${formatNumber(number)} ÷ 100`

    );

});

/* ===================================================
                WHAT PERCENT
=================================================== */

document
.getElementById("calculateWhatPercent")
.addEventListener("click",()=>{

    const value=parseFloat(

        document.getElementById("valueOne").value

    );

    const total=parseFloat(

        document.getElementById("valueTwo").value

    );

    if(

        isNaN(value) ||

        isNaN(total) ||

        total===0

    ){

        showResult(

            "Please enter valid numbers.",

            "Formula: (Value ÷ Total) × 100"

        );

        return;

    }

    const answer=

    (value/total)*100;

    showResult(

        formatNumber(answer)+"%",

        `(${formatNumber(value)} ÷ ${formatNumber(total)}) × 100`

    );

});
/* ===================================================
            PERCENTAGE INCREASE
=================================================== */

document
.getElementById("calculateIncrease")
.addEventListener("click",()=>{

    const oldValue=parseFloat(

        document.getElementById("increaseOld").value

    );

    const newValue=parseFloat(

        document.getElementById("increaseNew").value

    );

    if(

        isNaN(oldValue) ||

        isNaN(newValue) ||

        oldValue===0

    ){

        showResult(

            "Please enter valid numbers.",

            "Formula: ((New - Old) ÷ Old) × 100"

        );

        return;

    }

    const answer=

    ((newValue-oldValue)/oldValue)*100;

    showResult(

        formatNumber(answer)+"%",

        `((${formatNumber(newValue)} - ${formatNumber(oldValue)}) ÷ ${formatNumber(oldValue)}) × 100`

    );

});

/* ===================================================
            PERCENTAGE DECREASE
=================================================== */

document
.getElementById("calculateDecrease")
.addEventListener("click",()=>{

    const oldValue=parseFloat(

        document.getElementById("decreaseOld").value

    );

    const newValue=parseFloat(

        document.getElementById("decreaseNew").value

    );

    if(

        isNaN(oldValue) ||

        isNaN(newValue) ||

        oldValue===0

    ){

        showResult(

            "Please enter valid numbers.",

            "Formula: ((Old - New) ÷ Old) × 100"

        );

        return;

    }

    const answer=

    ((oldValue-newValue)/oldValue)*100;

    showResult(

        formatNumber(answer)+"%",

        `((${formatNumber(oldValue)} - ${formatNumber(newValue)}) ÷ ${formatNumber(oldValue)}) × 100`

    );

});

/* ===================================================
                DISCOUNT
=================================================== */

document
.getElementById("calculateDiscount")
.addEventListener("click",()=>{

    const price=parseFloat(

        document.getElementById("discountPrice").value

    );

    const discount=parseFloat(

        document.getElementById("discountPercent").value

    );

    if(

        isNaN(price) ||

        isNaN(discount)

    ){

        showResult(

            "Please enter valid numbers.",

            "Formula: Price − (Price × Discount ÷ 100)"

        );

        return;

    }

    const saveAmount=

    (price*discount)/100;

    const finalPrice=

    price-saveAmount;

    showResult(

        `Final Price: ${formatNumber(finalPrice)}<br>You Save: ${formatNumber(saveAmount)}`,

        `${formatNumber(price)} − (${discount}% × ${formatNumber(price)})`

    );

});
/* ===================================================
                COPY RESULT
=================================================== */

document
.getElementById("copyResult")
.addEventListener("click",()=>{

    const text=
    resultValue.innerText.trim();

    if(
        text==="" ||
        text==="0"
    ){

        alert("Please calculate a result first.");

        return;

    }

    navigator.clipboard
    .writeText(text)
    .then(()=>{

        alert("Result copied successfully.");

    })
    .catch(()=>{

        alert("Unable to copy result.");

    });

});

/* ===================================================
                RESET
=================================================== */

document
.getElementById("resetCalculator")
.addEventListener("click",()=>{

    document
    .querySelectorAll("input")
    .forEach(input=>{

        input.value="";

    });

    resultValue.innerHTML="0";

    formulaText.innerHTML=
    "Your calculation formula will appear here.";

});

/* ===================================================
                ENTER KEY SUPPORT
=================================================== */

document
.querySelectorAll("input")
.forEach(input=>{

    input.addEventListener("keydown",(e)=>{

        if(e.key==="Enter"){

            const activeButton=

            document.querySelector(

                ".tab-content.active .calculate-btn"

            );

            if(activeButton){

                activeButton.click();

            }

        }

    });

});

/* ===================================================
            PREVENT NEGATIVE VALUES
=================================================== */

document
.querySelectorAll("input[type='number']")
.forEach(input=>{

    input.addEventListener("input",()=>{

        if(

            input.value!=="" &&

            Number(input.value)<0

        ){

            input.value=0;

        }

    });

});

/* ===================================================
            INITIAL STATE
=================================================== */

showResult(

    "0",

    "Your calculation formula will appear here."

);