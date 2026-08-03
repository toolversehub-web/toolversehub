// =======================================
// GET ELEMENTS
// =======================================

const age = document.getElementById("age");

const heightUnit = document.getElementById("heightUnit");
const weightUnit = document.getElementById("weightUnit");

const cmGroup = document.getElementById("cmGroup");
const meterGroup = document.getElementById("meterGroup");
const feetGroup = document.getElementById("feetGroup");

const heightCm = document.getElementById("heightCm");
const heightMeter = document.getElementById("heightMeter");
const feet = document.getElementById("feet");
const inches = document.getElementById("inches");

const weight = document.getElementById("weight");

const calculateBtn = document.getElementById("calculateBtn");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const idealWeight = document.getElementById("idealWeight");
const healthyRange = document.getElementById("healthyRange");

const meterText = document.getElementById("meterText");
const healthTips = document.getElementById("healthTips");

// =======================================
// HEIGHT UNIT SWITCH
// =======================================

heightUnit.addEventListener("change", function () {

    cmGroup.style.display = "none";
    meterGroup.style.display = "none";
    feetGroup.style.display = "none";

    if (heightUnit.value === "cm") {

        cmGroup.style.display = "block";

    }

    else if (heightUnit.value === "m") {

        meterGroup.style.display = "block";

    }

    else {

        feetGroup.style.display = "block";

    }

});

// =======================================
// CALCULATE BUTTON
// =======================================

calculateBtn.addEventListener("click", function () {

    let ageValue = Number(age.value);

    let weightValue = Number(weight.value);

    let heightValue = 0;

    if (ageValue < 2 || ageValue > 120) {

        alert("Please enter a valid age.");

        return;

    }

    if (weightValue <= 0) {

        alert("Please enter a valid weight.");

        return;

    }

    // ==============================
    // HEIGHT CONVERSION
    // ==============================

    if (heightUnit.value === "cm") {

        if (heightCm.value === "") {

            alert("Please enter your height.");

            return;

        }

        heightValue = Number(heightCm.value) / 100;

    }

    else if (heightUnit.value === "m") {

        if (heightMeter.value === "") {

            alert("Please enter your height.");

            return;

        }

        heightValue = Number(heightMeter.value);

    }

    else {

        if (feet.value === "" || inches.value === "") {

            alert("Please enter Feet and Inches.");

            return;

        }

        let totalInches = (Number(feet.value) * 12) + Number(inches.value);

        heightValue = totalInches * 0.0254;

    }

    // ==============================
    // WEIGHT CONVERSION
    // ==============================

    if (weightUnit.value === "lb") {

        weightValue = weightValue * 0.45359237;

    }

    else if (weightUnit.value === "st") {

        weightValue = weightValue * 6.35029;

    }

    // Continue in Part 2...
        // ==============================
    // BMI CALCULATION
    // ==============================

    const bmi = weightValue / (heightValue * heightValue);

    bmiValue.textContent = bmi.toFixed(1);

    healthyRange.textContent = "18.5 - 24.9";

    // ==============================
    // BMI CATEGORY
    // ==============================

    let tips = "";
    let meterMessage = "";

    if (bmi < 18.5) {

        bmiCategory.textContent = "Underweight";

        tips = "Increase calorie intake with healthy foods and consult a healthcare professional if needed.";

        meterMessage = "You are Underweight.";

    }

    else if (bmi < 25) {

        bmiCategory.textContent = "Normal Weight";

        tips = "Excellent! Maintain your healthy weight with a balanced diet and regular exercise.";

        meterMessage = "Your BMI is in the Healthy Range.";

    }

    else if (bmi < 30) {

        bmiCategory.textContent = "Overweight";

        tips = "Try regular exercise and reduce high-calorie foods to reach a healthier weight.";

        meterMessage = "You are Overweight.";

    }

    else {

        bmiCategory.textContent = "Obese";

        tips = "It is recommended to consult a healthcare professional and follow a healthy lifestyle plan.";

        meterMessage = "Your BMI indicates Obesity.";

    }

    healthTips.textContent = tips;

    meterText.textContent = meterMessage;

    // ==============================
    // IDEAL WEIGHT
    // ==============================

    const gender =
        document.querySelector('input[name="gender"]:checked').value;

    const heightInches = heightValue / 0.0254;

    let ideal = 0;

    if (gender === "male") {

        ideal = 50 + ((heightInches - 60) * 2.3);

    }

    else if (gender === "female") {

        ideal = 45.5 + ((heightInches - 60) * 2.3);

    }

    else {

        ideal = 47.75 + ((heightInches - 60) * 2.3);

    }

    if (ideal < 0) {

        ideal = 0;

    }

    idealWeight.textContent = ideal.toFixed(1) + " kg";

    // ==============================
    // BMI SCALE HIGHLIGHT
    // ==============================

    const under = document.querySelector(".underweight");
    const normal = document.querySelector(".normal");
    const over = document.querySelector(".overweight");
    const obese = document.querySelector(".obese");

    under.style.opacity = "0.4";
    normal.style.opacity = "0.4";
    over.style.opacity = "0.4";
    obese.style.opacity = "0.4";

    if (bmi < 18.5) {

        under.style.opacity = "1";

    }

    else if (bmi < 25) {

        normal.style.opacity = "1";

    }

    else if (bmi < 30) {

        over.style.opacity = "1";

    }

    else {

        obese.style.opacity = "1";

    }

});