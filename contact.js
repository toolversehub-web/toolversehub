emailjs.init({
    publicKey: "qAcqWiz1Bce_3O3qu",
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    emailjs.sendForm(
        "service_kzkyqgm",
        "template_ui311k6",
        this
    )
    .then(function () {

        alert("✅ Message sent successfully!");

        form.reset();

    })
    .catch(function (error) {

        alert("❌ Failed to send message.");

        console.log(error);

    });

});