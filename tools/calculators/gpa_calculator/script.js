/* =====================================================
   ELEMENTS
===================================================== */

const gpaForm = document.getElementById("gpaForm");

const subjectBody = document.getElementById("subjectBody");

const addSubjectBtn = document.getElementById("addSubject");

const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

/* =====================================================
   RESULT ELEMENTS
===================================================== */

const gpaResult = document.getElementById("gpaResult");

const totalCredits = document.getElementById("totalCredits");

const totalGradePoints = document.getElementById("totalGradePoints");

const academicStanding = document.getElementById("academicStanding");

/* =====================================================
   GRADE POINT SCALE
===================================================== */



/* =====================================================
   EVENTS
===================================================== */

calculateBtn.addEventListener(

    "click",

    calculateGPA

);

addSubjectBtn.addEventListener(

    "click",

    addSubject

);

resetBtn.addEventListener(

    "click",

    resetCalculator

);

/* Remove Subject */

subjectBody.addEventListener(

    "click",

    function(event){

        if(

            event.target.classList.contains("remove-btn")

        ){

            removeSubject(event.target);

        }

    }

);
/* =====================================================
   ADD SUBJECT
===================================================== */

function addSubject(){

    const row=document.createElement("tr");

    row.innerHTML=`

    <td>

        <input
        type="text"
        class="subject-name"
        placeholder="Subject (Optional)">

    </td>

    <td>

        <input
        type="number"
        class="credit-hours"
        min="1"
        max="6"
        value="3">

    </td>

    <td>

        <select class="grade">

            <option value="4.00">A+</option>

            <option value="4.00">A</option>

            <option value="3.67">A-</option>

            <option value="3.33">B+</option>

            <option value="3.00">B</option>

            <option value="2.67">B-</option>

            <option value="2.33">C+</option>

            <option value="2.00">C</option>

            <option value="1.67">C-</option>

            <option value="1.33">D+</option>

            <option value="1.00">D</option>

            <option value="0.00">F</option>

        </select>

    </td>

    <td>

        <button
        type="button"
        class="remove-btn">

        Remove

        </button>

    </td>

    `;

    subjectBody.appendChild(row);

}

/* =====================================================
   REMOVE SUBJECT
===================================================== */

function removeSubject(button){

    const rows=

    subjectBody.querySelectorAll("tr");

    if(rows.length<=1){

        alert(

        "At least one subject is required."

        );

        return;

    }

    button.closest("tr").remove();

}
/* =====================================================
   CALCULATE GPA
===================================================== */

function calculateGPA(){

    const rows=subjectBody.querySelectorAll("tr");

    let totalCreditHours=0;

    let totalPoints=0;

    rows.forEach(function(row){

        const creditInput=

        row.querySelector(".credit-hours");

        const gradeSelect=

        row.querySelector(".grade");

        const credits=

        parseFloat(creditInput.value);

        const grade=

        parseFloat(gradeSelect.value);

        if(

            isNaN(credits)

        ){

            return;

        }

        if(

            credits<=0

        ){

            return;

        }

        totalCreditHours+=credits;

        totalPoints+=

        credits*grade;

    });

    if(

        totalCreditHours===0

    ){

        alert(

        "Please enter valid credit hours."

        );

        return;

    }

    const gpa=

    totalPoints/

    totalCreditHours;

    gpaResult.textContent=

    gpa.toFixed(2);

    totalCredits.textContent=

    totalCreditHours.toFixed(1);

    totalGradePoints.textContent=

    totalPoints.toFixed(2);

    /* =====================================
       Academic Standing
    ===================================== */

    let standing="";

    if(gpa>=3.70){

        standing="Excellent";

    }

    else if(gpa>=3.30){

        standing="Very Good";

    }

    else if(gpa>=2.70){

        standing="Good";

    }

    else if(gpa>=2.00){

        standing="Average";

    }

    else{

        standing="Needs Improvement";

    }

    academicStanding.textContent=

    standing;

}
/* =====================================================
   RESET CALCULATOR
===================================================== */

function resetCalculator(){

    gpaForm.reset();

    gpaResult.textContent="0.00";

    totalCredits.textContent="0";

    totalGradePoints.textContent="0.00";

    academicStanding.textContent="--";

}

/* =====================================================
   AUTO CALCULATE
===================================================== */

subjectBody.addEventListener(

    "input",

    function(){

        calculateGPA();

    }

);

subjectBody.addEventListener(

    "change",

    function(){

        calculateGPA();

    }

);

/* =====================================================
   FORM SUBMIT
===================================================== */

gpaForm.addEventListener(

    "submit",

    function(event){

        event.preventDefault();

        calculateGPA();

    }

);

/* =====================================================
   INITIALIZE
===================================================== */

calculateGPA();
