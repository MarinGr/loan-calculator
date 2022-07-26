const loanAmount = document.getElementById("loan-amount");
const slider = document.getElementById("slider");
const loanTerm = document.getElementById("loan-term");
const rate = document.getElementById("rate");

const monthlyPayment = document.getElementById("monthly-payment");
const totalPayment = document.getElementById("total-payment");
const totalInterest = document.getElementById("total-interest");

// Prevent typing non-numeric characters in inputs
const inputFields = [loanAmount, slider, loanTerm, rate];

inputFields.forEach((input) => input.addEventListener("input", validateInput));

function validateInput(e) {
  this.value = this.value.replace(/\D/g, "");
}

//Synchronize text and slider input values of loan amount
const loanAmountInputs = [loanAmount, slider];

loanAmountInputs.forEach((input) =>
  input.addEventListener("input", synchronizeChange)
);

function synchronizeChange(e) {
  if (e.target == slider) {
    loanAmount.value = slider.value;
    loanAmount.focus();
  } else if (e.target == loanAmount) {
    slider.value = loanAmount.value;
  }
  slider.style.backgroundSize =
    ((slider.value - slider.min) * 100) / (slider.max - slider.min) + "% 100%";
}

// Calculate results on change
inputFields.forEach((input) =>
  input.addEventListener("input", calculateResults)
);

function calculateResults(e) {
  const monthlyRate = rate.value / 12 / 100;
  const coefficient =
    (monthlyRate * Math.pow(1 + monthlyRate, loanTerm.value)) /
    (Math.pow(1 + monthlyRate, loanTerm.value) - 1);
  monthlyResult = loanAmount.value * coefficient;

  // Prevent Infinity and NaN output
  if (isFinite(monthlyResult)) {
    removeErrorMessage();

    monthlyPayment.innerText = monthlyResult
      .toFixed()
      // Separate thousands with spaces
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    totalPayment.innerText = (monthlyResult * loanTerm.value)
      .toFixed()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    totalInterest.innerText = (
      monthlyResult * loanTerm.value -
      loanAmount.value
    )
      .toFixed()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } else {
    showError(e);
  }

  function showError(e) {
    const elementExist = document.querySelector(".error-message");

    if (!elementExist) {
      e.target.classList.add("input-error");
      const errorMessage = document.createElement("div");
      const title = document.querySelector(".title");
      title.insertAdjacentElement("beforebegin", errorMessage);
      errorMessage.classList.add("error-message");
      errorMessage.innerText = "Please check your numbers and try again.";
    } else if (e.target.value <= 0) {
      e.target.classList.add("input-error");
    } else {
      e.target.classList.remove("input-error");
    }
  }

  function removeErrorMessage() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => input.classList.remove("input-error"));
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }
}
