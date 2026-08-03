/* =====================================================
   ELEMENTS
===================================================== */

const form = document.getElementById("bmrForm");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

/* Gender */

const gender = document.getElementsByName("gender");

/* Age */

const age = document.getElementById("age");

/* Height */

const heightUnit = document.getElementById("heightUnit");

const cmGroup = document.getElementById("cmGroup");
const feetGroup = document.getElementById("feetGroup");
const meterGroup = document.getElementById("meterGroup");

const heightCm = document.getElementById("heightCm");
const heightFeet = document.getElementById("heightFeet");
const heightInches = document.getElementById("heightInches");
const heightMeter = document.getElementById("heightMeter");

/* Weight */

const weightUnit = document.getElementById("weightUnit");
const weight = document.getElementById("weight");

/* Activity */

const activity = document.getElementById("activity");

/* Results */

const bmrResult = document.getElementById("bmrResult");
const tdeeResult = document.getElementById("tdeeResult");
const bmiResult = document.getElementById("bmiResult");
const bmiStatus = document.getElementById("bmiStatus");

const healthyWeight = document.getElementById("healthyWeight");

const waterResult = document.getElementById("waterResult");

const lossCalories = document.getElementById("lossCalories");
const gainCalories = document.getElementById("gainCalories");

const proteinResult = document.getElementById("proteinResult");
const fatResult = document.getElementById("fatResult");

/* =====================================================
   EVENTS
===================================================== */

calculateBtn.addEventListener("click", calculateBMR);

resetBtn.addEventListener("click", resetCalculator);

heightUnit.addEventListener("change", updateHeightFields);

/* =====================================================
   HEIGHT UNIT SWITCHER
===================================================== */

function updateHeightFields(){

    cmGroup.style.display = "none";
    feetGroup.style.display = "none";
    meterGroup.style.display = "none";

    if(heightUnit.value==="cm"){

        cmGroup.style.display="block";

    }

    else if(heightUnit.value==="ft"){

        feetGroup.style.display="grid";

    }

    else{

        meterGroup.style.display="block";

    }

}

updateHeightFields();

/* =====================================================
   GET SELECTED GENDER
===================================================== */

function getGender(){

    for(let i=0;i<gender.length;i++){

        if(gender[i].checked){

            return gender[i].value;

        }

    }

    return "male";

}

/* =====================================================
   HEIGHT TO CM
===================================================== */

function getHeightInCm(){

    if(heightUnit.value==="cm"){

        return parseFloat(heightCm.value);

    }

    if(heightUnit.value==="ft"){

        const ft = parseFloat(heightFeet.value)||0;

        const inch = parseFloat(heightInches.value)||0;

        return (ft*30.48)+(inch*2.54);

    }

    return parseFloat(heightMeter.value)*100;

}

/* =====================================================
   WEIGHT TO KG
===================================================== */

function getWeightInKg(){

    let value = parseFloat(weight.value);

    if(weightUnit.value==="kg"){

        return value;

    }

    if(weightUnit.value==="lb"){

        return value*0.45359237;

    }

    return value*6.35029318;

}

/* =====================================================
   ROUND FUNCTION
===================================================== */

function round(value){

    return Math.round(value);

}
/* =====================================================
   MAIN CALCULATION
===================================================== */

function calculateBMR(){

    const genderValue = getGender();

    const ageValue = parseInt(age.value);

    const height = getHeightInCm();

    const weightKg = getWeightInKg();

    const activityLevel = parseFloat(activity.value);

    /* ==========================
       VALIDATION
    ========================== */

    if(

        isNaN(ageValue) ||

        isNaN(height) ||

        isNaN(weightKg)

    ){

        alert("Please fill all required fields.");

        return;

    }

    if(ageValue<5 || ageValue>120){

        alert("Age must be between 5 and 120 years.");

        return;

    }

    if(height<50 || height>300){

        alert("Please enter a valid height.");

        return;

    }

    if(weightKg<20 || weightKg>500){

        alert("Please enter a valid weight.");

        return;

    }

    /* ==========================
       BMR
    ========================== */

    let bmr;

    if(genderValue==="male"){

        bmr =

        (10*weightKg)

        +

        (6.25*height)

        -

        (5*ageValue)

        +

        5;

    }

    else{

        bmr =

        (10*weightKg)

        +

        (6.25*height)

        -

        (5*ageValue)

        -

        161;

    }

    /* ==========================
       TDEE
    ========================== */

    const tdee =

    bmr*activityLevel;

    /* ==========================
       WEIGHT GOALS
    ========================== */

    const loss = tdee-500;

    const gain = tdee+500;

    /* ==========================
       BMI
    ========================== */

    const heightMeter =

    height/100;

    const bmi =

    weightKg/

    (

        heightMeter*

        heightMeter

    );

    /* ==========================
       SHOW MAIN RESULTS
    ========================== */

    bmrResult.textContent =

    round(bmr)

    +" kcal";

    tdeeResult.textContent =

    round(tdee)

    +" kcal";

    bmiResult.textContent =

    bmi.toFixed(1);

    lossCalories.textContent =

    round(loss)

    +" kcal";

    gainCalories.textContent =

    round(gain)

    +" kcal";

    /* ==========================
       CONTINUE
    ========================== */

    updateBMI(bmi);

    updateHealthyWeight(height);

    updateWater(weightKg);

    updateMacros(weightKg);

}
/* =====================================================
   BMI STATUS
===================================================== */

function updateBMI(bmi){

    let status="";

    if(bmi<18.5){

        status="Underweight";

    }

    else if(bmi<25){

        status="Normal Weight";

    }

    else if(bmi<30){

        status="Overweight";

    }

    else if(bmi<35){

        status="Obesity Class I";

    }

    else if(bmi<40){

        status="Obesity Class II";

    }

    else{

        status="Obesity Class III";

    }

    bmiStatus.textContent=status;

}

/* =====================================================
   HEALTHY WEIGHT RANGE
===================================================== */

function updateHealthyWeight(heightCm){

    const heightM=heightCm/100;

    const minWeight=18.5*(heightM*heightM);

    const maxWeight=24.9*(heightM*heightM);

    healthyWeight.textContent=

    minWeight.toFixed(1)

    +" kg - "+

    maxWeight.toFixed(1)

    +" kg";

}

/* =====================================================
   WATER INTAKE
===================================================== */

function updateWater(weightKg){

    /* 35 ml per kg */

    const waterML=

    weightKg*35;

    const waterL=

    waterML/1000;

    const glasses=

    Math.round(waterML/250);

    waterResult.textContent=

    waterL.toFixed(1)

    +" L | "+

    glasses+

    " Glasses";

}

/* =====================================================
   PROTEIN & FAT
===================================================== */

function updateMacros(weightKg){

    /* Protein = 1.6g/kg */

    const protein=

    weightKg*1.6;

    /* Fat = 0.8g/kg */

    const fat=

    weightKg*0.8;

    proteinResult.textContent=

    protein.toFixed(0)

    +" g/day";

    fatResult.textContent=

    fat.toFixed(0)

    +" g/day";

}
/* =====================================================
   RESET CALCULATOR
===================================================== */

function resetCalculator(){

    form.reset();

    updateHeightFields();

    bmrResult.textContent="--";

    tdeeResult.textContent="--";

    bmiResult.textContent="--";

    bmiStatus.textContent="--";

    healthyWeight.textContent="--";

    waterResult.textContent="--";

    lossCalories.textContent="--";

    gainCalories.textContent="--";

    proteinResult.textContent="--";

    fatResult.textContent="--";

}

/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

form.addEventListener("submit",function(event){

    event.preventDefault();

    calculateBMR();

});

/* =====================================================
   AUTO SELECT HEIGHT FIELD
===================================================== */

heightUnit.addEventListener("change",function(){

    updateHeightFields();

    if(heightUnit.value==="cm"){

        heightCm.focus();

    }

    else if(heightUnit.value==="ft"){

        heightFeet.focus();

    }

    else{

        heightMeter.focus();

    }

});

/* =====================================================
   ONLY POSITIVE VALUES
===================================================== */

const numberInputs=document.querySelectorAll("input[type='number']");

numberInputs.forEach(function(input){

    input.addEventListener("input",function(){

        if(this.value<0){

            this.value="";

        }

    });

});

/* =====================================================
   DEFAULT STATE
===================================================== */

updateHeightFields();

resetCalculator();