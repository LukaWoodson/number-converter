function reverse(input) {
  return input.split("").reverse().join("");
}

function convertBase(number, fromBase, toBase) {
  let error = null;
  let result = null;

  // Check if the bases are the same, no conversion needed
  if (fromBase === toBase) {
    error = "Error: Cannot convert to the same base.";
  } else {
    switch (fromBase) {
      case "BIN": // ------FROM BINARY ------
        if (toBase === "DEC") {
          // TO DECIMAL
          result = _ARITHMETIC.toDecimal(number, 4, fromBase);
          if (result === "Invalid binary input.")
            return { value: null, error: result };
        } else {
          // TO HEXADECIMAL
          result = _ARITHMETIC.toHex(number, 4, fromBase);
          if (result === "Invalid binary input.")
            return { value: null, error: result };
        }
        break;
      case "HEX": // ------FROM HEXADECIMAL ------
        if (toBase === "DEC") {
          // TO DECIMAL
          result = _ARITHMETIC.toDecimal(number, 4, fromBase);
          if (result === "Invalid hexadecimal input.")
            return { value: null, error: result };
        } else {
          // TO BINARY
          result = _ARITHMETIC.toBinary(number, 4, fromBase);
          if (result === "Invalid hexadecimal input.")
            return { value: null, error: result };
        }
        break;
      case "DEC": // ------FROM DECIMAL ------
        if (toBase === "BIN") {
          // TO BINARY
          result = _ARITHMETIC.toBinary(number, 4, fromBase);
          if (result === "Invalid input. Please provide a valid input number.")
            return { value: null, error: result };
        } else {
          // TO HEXADECIMAL
          result = _ARITHMETIC.toHex(number, 4, fromBase);
          if (result === "Invalid input. Please provide a valid input number.")
            return { value: null, error: result };
        }
        break;
      case "FLOAT": // ------FROM FLOAT ------
        if (toBase === "DEC" || toBase === "HEX") {
          // TO DECIMAL OR HEXADECIMAL
          error = "Error: Cannot convert float to DEC or HEX.";
        } else {
          // TO BINARY
          result = _ARITHMETIC.toBinary(number, 4, fromBase);
          if (result === "Invalid input. Please provide a valid input number.")
            return { value: null, error: result };
        }
        break;
    }
  }

  // If an error occurred, return it
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

  const outputDiv = document.getElementById("conversionOutput");
  if (conversionResult.error) {
    outputDiv.style.color = "red";
    outputDiv.textContent = conversionResult.error;
  } else {
    outputDiv.style.color = "black";
    outputDiv.textContent = `Converted number: ${conversionResult.value}`;
  }
}

function performArithmetic() {
  const base1 = document.getElementById("base1").value;
  const base2 = document.getElementById("base2").value;
  const number1 = document.getElementById("number1").value;
  const number2 = document.getElementById("number2").value;
  const operation = document.getElementById("operation").value;

  // Convert the second number to the base of the first number
  const convertedNumber2 = convertBase(number2, base2, base1).value;

  let result;

  if (operation === "add") {
    // Use the new addBinary function for both integer and fractional addition
    result = _ARITHMETIC.addBinary(number1, convertedNumber2, base1);
  } else if (operation === "multiply") {
    result = multiplyInBase(number1, convertedNumber2, base1);
  }

  document.getElementById("arithmeticOutput").innerHTML = `Result: ${result}`;
}

function addInBase(number1, number2, base) {
  const num1 = parseInt(number1, base);
  const num2 = parseInt(number2, base);

  if (isNaN(num1) || isNaN(num2)) {
    return "Error: Invalid input or base.";
  }

  return (num1 + num2).toString(base);
}

function multiplyInBase(number1, number2, base) {
  const num1 = parseInt(number1, base);
  const num2 = parseInt(number2, base);

  if (isNaN(num1) || isNaN(num2)) {
    return "Error: Invalid input or base.";
  }

  return (num1 * num2).toString(base);
}
