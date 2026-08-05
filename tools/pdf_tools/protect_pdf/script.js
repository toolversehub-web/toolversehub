/* ======================================================
                    ELEMENTS
====================================================== */

const uploadBox = document.getElementById("uploadBox");

const browseBtn = document.getElementById("browseBtn");

const pdfInput = document.getElementById("pdfInput");

const fileName = document.getElementById("fileName");

const fileSize = document.getElementById("fileSize");

const totalPages = document.getElementById("totalPages");

const passwordInput =
    document.getElementById("passwordInput");

const confirmPassword =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const strengthText =
    document.getElementById("strengthText");

const matchText =
    document.getElementById("matchText");

const protectBtn =
    document.getElementById("protectBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const resetBtn =
    document.getElementById("resetBtn");


/* ======================================================
                    VARIABLES
====================================================== */

let pdfFile = null;

let originalPdfBytes = null;

let totalPageCount = 0;

let protectedPdf = null;


/* ======================================================
                    BROWSE PDF
====================================================== */

browseBtn.addEventListener(
    "click",
    () => {

        pdfInput.click();

    }
);


/* ======================================================
                    SELECT PDF
====================================================== */

pdfInput.addEventListener(
    "change",
    async (event) => {

        if (
            !event.target.files.length
        ) {

            return;

        }

        await loadPDF(
            event.target.files[0]
        );

    }
);


/* ======================================================
                    DRAG & DROP
====================================================== */

uploadBox.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        uploadBox.classList.add(
            "drag"
        );

    }
);


uploadBox.addEventListener(
    "dragleave",
    () => {

        uploadBox.classList.remove(
            "drag"
        );

    }
);


uploadBox.addEventListener(
    "drop",
    async (event) => {

        event.preventDefault();

        uploadBox.classList.remove(
            "drag"
        );

        if (
            !event.dataTransfer
                .files.length
        ) {

            return;

        }

        await loadPDF(
            event.dataTransfer
                .files[0]
        );

    }
);


/* ======================================================
                    LOAD PDF
====================================================== */

async function loadPDF(file) {

    if (
        file.type !==
        "application/pdf"
    ) {

        alert(
            "Please select a valid PDF."
        );

        return;

    }

    try {

        pdfFile = file;

        protectedPdf = null;

        downloadBtn.disabled = true;

        fileName.textContent =
            file.name;

        fileSize.textContent =
            (
                file.size /
                1024 /
                1024
            ).toFixed(2) + " MB";

        originalPdfBytes =
            await file.arrayBuffer();

        const loadingTask =
            pdfjsLib.getDocument({

                data:
                originalPdfBytes.slice(0)

            });

        const pdfDocument =
            await loadingTask.promise;

        totalPageCount =
            pdfDocument.numPages;

        totalPages.textContent =
            totalPageCount;

    }

    catch (error) {

        console.error(error);

        alert(
            "This PDF could not be loaded."
        );

        pdfFile = null;

        originalPdfBytes = null;

        totalPageCount = 0;

        fileName.textContent = "-";

        fileSize.textContent = "-";

        totalPages.textContent = "-";

    }

}
/* ======================================================
                    SHOW / HIDE PASSWORD
====================================================== */

function togglePasswordVisibility(
    input,
    button
) {

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    }

    else {

        input.type = "password";

        button.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

}


togglePassword.addEventListener(
    "click",
    () => {

        togglePasswordVisibility(
            passwordInput,
            togglePassword
        );

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    () => {

        togglePasswordVisibility(
            confirmPassword,
            toggleConfirmPassword
        );

    }
);


/* ======================================================
                    PASSWORD STRENGTH
====================================================== */

function checkPasswordStrength() {

    const password =
        passwordInput.value;

    if (!password) {

        strengthText.textContent =
            "Password strength: -";

        strengthText.style.color =
            "#b8c6d8";

        return;

    }

    let strength = 0;

    if (password.length >= 6) {

        strength++;

    }

    if (password.length >= 10) {

        strength++;

    }

    if (/[A-Z]/.test(password)) {

        strength++;

    }

    if (/[0-9]/.test(password)) {

        strength++;

    }

    if (/[^A-Za-z0-9]/.test(password)) {

        strength++;

    }

    if (strength <= 2) {

        strengthText.textContent =
            "Password strength: Weak";

        strengthText.style.color =
            "#ef4444";

    }

    else if (strength <= 4) {

        strengthText.textContent =
            "Password strength: Medium";

        strengthText.style.color =
            "#f59e0b";

    }

    else {

        strengthText.textContent =
            "Password strength: Strong";

        strengthText.style.color =
            "#22c55e";

    }

}


/* ======================================================
                    PASSWORD MATCH
====================================================== */

function checkPasswordMatch() {

    const password =
        passwordInput.value;

    const confirm =
        confirmPassword.value;

    if (
        !password &&
        !confirm
    ) {

        matchText.textContent =
            "Password match: -";

        matchText.style.color =
            "#b8c6d8";

        return;

    }

    if (
        password === confirm
    ) {

        matchText.textContent =
            "Password match: Matched";

        matchText.style.color =
            "#22c55e";

    }

    else {

        matchText.textContent =
            "Password match: Not matched";

        matchText.style.color =
            "#ef4444";

    }

}


passwordInput.addEventListener(
    "input",
    () => {

        checkPasswordStrength();

        checkPasswordMatch();

        protectedPdf = null;

        downloadBtn.disabled = true;

    }
);


confirmPassword.addEventListener(
    "input",
    () => {

        checkPasswordMatch();

        protectedPdf = null;

        downloadBtn.disabled = true;

    }
);
/* ======================================================
                    PROTECT PDF
====================================================== */

protectBtn.addEventListener("click", async () => {

    if (!pdfFile) {

        alert("Please upload a PDF first.");
        return;

    }

    const password = passwordInput.value;
    const confirm = confirmPassword.value;

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");
        return;

    }

    if (password !== confirm) {

        alert("Passwords do not match.");
        return;

    }

    protectBtn.disabled = true;

    protectBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Protecting...';

    try {

        const formData = new FormData();

        formData.append("pdf", pdfFile);
        formData.append("password", password);

        const response = await fetch(
    "https://toolversehub-production-ba65.up.railway.app/protect",
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {

            throw new Error("Server Error");

        }

        protectedPdf = await response.blob();

        downloadBtn.disabled = false;

        alert("PDF protected successfully.");

    }

    catch (error) {

        console.error(error);

        protectedPdf = null;

        downloadBtn.disabled = true;

        alert("PDF could not be protected.");

    }

    finally {

        protectBtn.disabled = false;

        protectBtn.innerHTML =
            '<i class="fa-solid fa-lock"></i> Protect PDF';

    }

});

/* ======================================================
                    DOWNLOAD PROTECTED PDF
====================================================== */

downloadBtn.addEventListener(
    "click",
    () => {

        if (!protectedPdf) {

            alert(
                "Please protect the PDF first."
            );

            return;

        }

        const pdfBlob =
            new Blob(

                [protectedPdf],

                {

                    type:
                    "application/pdf"

                }

            );

        const pdfURL =
            URL.createObjectURL(
                pdfBlob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            pdfURL;

        link.download =
            "ToolVerseHub-Protected-PDF.pdf";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    pdfURL
                );

            },
            1000
        );

    }
);


/* ======================================================
                    RESET
====================================================== */

resetBtn.addEventListener(
    "click",
    () => {

        pdfFile = null;

        originalPdfBytes = null;

        totalPageCount = 0;

        protectedPdf = null;

        pdfInput.value = "";

        passwordInput.value = "";

        confirmPassword.value = "";

        fileName.textContent = "-";

        fileSize.textContent = "-";

        totalPages.textContent = "-";

        strengthText.textContent =
            "Password strength: -";

        strengthText.style.color =
            "#b8c6d8";

        matchText.textContent =
            "Password match: -";

        matchText.style.color =
            "#b8c6d8";

        passwordInput.type =
            "password";

        confirmPassword.type =
            "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

        downloadBtn.disabled =
            true;

        protectBtn.disabled =
            false;

        protectBtn.innerHTML =
            '<i class="fa-solid fa-lock"></i> Protect PDF';

    }
);


/* ======================================================
                    INITIALIZATION
====================================================== */

downloadBtn.disabled = true;

console.log(
    "Protect PDF Tool Loaded Successfully"
);
