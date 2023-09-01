// Function to check if both input fields have content
function bothInputsHaveContent() {
  const number1 = document.getElementById("number1").value;
  const number2 = document.getElementById("number2").value;
  return number1.trim() !== "" && number2.trim() !== "";
}

// Function to handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default Enter key behavior
    if (bothInputsHaveContent()) {
      performArithmetic();
    } else {
      const arithmeticOutput = document.getElementById("arithmeticOutput");
      arithmeticOutput.style.color = "red";
      arithmeticOutput.textContent = "Both input fields must have content.";
    }
  }
}

// Attach the handleKeyPress function to the input fields
document.getElementById("number1").addEventListener("keydown", handleKeyPress);
document.getElementById("number2").addEventListener("keydown", handleKeyPress);

function convertBase(number, fromBase, toBase) {
  // Check if the bases are the same, no conversion needed
  if (fromBase === toBase) {
    return { value: number, error: "Error: Cannot convert to the same base." };
  }

  let result;
  let error = null;

  switch (fromBase) {
    case "BIN":
      if (toBase === "DEC") {
        result = _NUMBERS.toDecimal(number, 4, fromBase);
      } else if (toBase === "HEX") {
        result = _NUMBERS.toHex(number, 4, fromBase);
      }
      break;
    case "HEX":
      if (toBase === "DEC") {
        result = _NUMBERS.toDecimal(number, 4, fromBase);
      } else if (toBase === "BIN") {
        result = _NUMBERS.toBinary(number, 4, fromBase);
      }
      break;
    case "DEC":
      const decimalNumber = parseInt(number, 10);
      if (toBase === "BIN") {
        result = _NUMBERS.toBinary(decimalNumber, 4, fromBase);
      } else if (toBase === "HEX") {
        result = _NUMBERS.toHex(decimalNumber, 4, fromBase);
      }
      break;
    case "FLOAT":
      if (toBase === "BIN") {
        result = _NUMBERS.toBinary(number, 4, fromBase);
      } else {
        error = "Error: Cannot convert float to DEC or HEX.";
      }
      break;
    default:
      error = "Error: Unsupported base.";
  }

  if (error !== null) {
    return { value: null, error };
  }

  return { value: result, error: null };
}

function convertNumber() {
  const fromType = document.getElementById("fromType").value;
  const toType = document.getElementById("toType").value;
  const numberInput = document.getElementById("numberInput").value;

  // Convert the input number to the specified base
  const conversionResult = convertBase(numberInput, fromType, toType);

  if (conversionResult.error) {
    displayErrorMessage(conversionResult.error, "conversionOutput");
  } else {
    displayResult(`${conversionResult.value}`, "conversionOutput");
  }
}

function performArithmetic() {
  // Get input values
  const base1 = document.getElementById("base1").value;
  const base2 = document.getElementById("base2").value;
  const number1 = document.getElementById("number1").value;
  const number2 = document.getElementById("number2").value;
  const operation = document.getElementById("operation").value;

  // Check if both input fields have content
  if (!number1 || !number2) {
    displayErrorMessage(
      "Both input fields must have content.",
      "arithmeticOutput"
    );
    return;
  }

  // Convert the second number to the base of the first number if needed
  let convertedNumber2 = number2;
  if (base1 !== base2) {
    const conversionResult = convertBase(number2, base2, base1);
    if (conversionResult.error) {
      displayErrorMessage(conversionResult.error);
      return;
    }
    convertedNumber2 = conversionResult.value;
  }

  let result = null;

  // Perform the arithmetic operation
  if (operation === "add") {
    result = addBase(number1, convertedNumber2, base1);
  } else if (operation === "multiply") {
    result = multiplyBase(number1, convertedNumber2, base1);
  }

  // Display the result
  displayResult(result, "arithmeticOutput");
}

function displayErrorMessage(message, elementId) {
  const output = document.getElementById(elementId);
  output.style.color = "red";
  output.textContent = message;
}

function displayResult(result, elementId) {
  const output = document.getElementById(elementId);
  output.style.color = "black";
  output.textContent = `Result: ${result}`;
}

function addBase(number1, number2, base) {
  let baseNum = 0;
  // Determine the base of the input and convert it to an integer
  switch (base) {
    case "BIN":
      baseNum = 2;
      break;
    case "HEX":
      baseNum = 16;
      break;
    case "DEC":
      baseNum = 10;
      break;
  }

  return _NUMBERS.addNumbers(number1, number2, baseNum);
}

function multiplyBase(number1, number2, base) {
  let baseNum = 0;
  // Determine the base of the input and convert it to an integer
  switch (base) {
    case "BIN":
      baseNum = 2;
      break;
    case "HEX":
      baseNum = 16;
      break;
    case "DEC":
      baseNum = 10;
      break;
  }

  return _NUMBERS.multiplyNumbers(number1, number2, baseNum);
}
