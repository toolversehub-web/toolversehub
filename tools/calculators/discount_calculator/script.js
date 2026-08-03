// =====================================
// GET ELEMENTS
// =====================================

const originalPrice = document.getElementById("originalPrice");
const discountType = document.getElementById("discountType");
const discountValue = document.getElementById("discountValue");
const tax = document.getElementById("tax");
const currency = document.getElementById("currency");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

// =====================================
// RESULT ELEMENTS
// =====================================

const resultOriginal = document.getElementById("resultOriginal");
const resultDiscount = document.getElementById("resultDiscount");
const resultSave = document.getElementById("resultSave");
const resultTax = document.getElementById("resultTax");
const resultFinal = document.getElementById("resultFinal");
const savingPercent = document.getElementById("savingPercent");

// =====================================
// SUMMARY ELEMENTS
// =====================================

const summaryOriginal = document.getElementById("summaryOriginal");
const summaryDiscount = document.getElementById("summaryDiscount");
const summaryAfterDiscount = document.getElementById("summaryAfterDiscount");
const summaryTax = document.getElementById("summaryTax");
const summaryFinal = document.getElementById("summaryFinal");

// =====================================
// CALCULATE BUTTON
// =====================================

calculateBtn.addEventListener("click", function () {

    let price = parseFloat(originalPrice.value);
    let discount = parseFloat(discountValue.value);
    let taxRate = parseFloat(tax.value);

    if (isNaN(price) || price <= 0) {

        alert("Please enter a valid original price.");

        return;

    }

    if (isNaN(discount) || discount < 0) {

        alert("Please enter a valid discount.");

        return;

    }

    if (isNaN(taxRate)) {

        taxRate = 0;

    }

    let discountAmount = 0;

    // ==============================
    // DISCOUNT TYPE
    // ==============================

    if (discountType.value === "percent") {

        discountAmount = price * discount / 100;

    }

    else {

        discountAmount = discount;

    }

    if (discountAmount > price) {

        discountAmount = price;

    }

    const priceAfterDiscount = price - discountAmount;

    const taxAmount = priceAfterDiscount * taxRate / 100;

    const finalPrice = priceAfterDiscount + taxAmount;

    const savePercent = (discountAmount / price) * 100;

    const symbol = currency.value;
        // =====================================
    // UPDATE RESULT CARDS
    // =====================================

    resultOriginal.textContent =
        symbol + price.toFixed(2);

    resultDiscount.textContent =
        discountType.value === "percent"
            ? discount.toFixed(2) + "%"
            : symbol + discountAmount.toFixed(2);

    resultSave.textContent =
        symbol + discountAmount.toFixed(2);

    resultTax.textContent =
        symbol + taxAmount.toFixed(2);

    resultFinal.textContent =
        symbol + finalPrice.toFixed(2);

    savingPercent.textContent =
        savePercent.toFixed(2) + "%";

    // =====================================
    // UPDATE SUMMARY
    // =====================================

    summaryOriginal.textContent =
        symbol + price.toFixed(2);

    summaryDiscount.textContent =
        symbol + discountAmount.toFixed(2);

    summaryAfterDiscount.textContent =
        symbol + priceAfterDiscount.toFixed(2);

    summaryTax.textContent =
        symbol + taxAmount.toFixed(2);

    summaryFinal.textContent =
        symbol + finalPrice.toFixed(2);

});

// =====================================
// RESET BUTTON
// =====================================

resetBtn.addEventListener("click", function () {

    originalPrice.value = "";
    discountValue.value = "";
    tax.value = "";

    discountType.selectedIndex = 0;
    currency.selectedIndex = 0;

    resultOriginal.textContent = "--";
    resultDiscount.textContent = "--";
    resultSave.textContent = "--";
    resultTax.textContent = "--";
    resultFinal.textContent = "--";
    savingPercent.textContent = "--";

    summaryOriginal.textContent = "--";
    summaryDiscount.textContent = "--";
    summaryAfterDiscount.textContent = "--";
    summaryTax.textContent = "--";
    summaryFinal.textContent = "--";

});