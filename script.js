function reverse(input) {
  return input.split("").reverse().join("");
}

function convertBase(number, fromBase, toBase) {
  if (fromBase === toBase) {
    return { value: number, error: null };
  }

  let error = null;

  // TODO: Refactor to use a switch statement
  // TODO: Refactor to make sure user can still convert from dec to hex and vice versa as long as the input equals an integer
  if (fromBase === "DEC") {
    number = parseFloat(number);
    if (isNaN(number)) {
      error = "Error: Invalid input.";
    } else if (toBase === "DEC" || toBase === "HEX") {
      error = "Error: Cannot convert float to DEC or HEX.";
    }
  } else if (fromBase === "BIN") {
    // Pad with zeros to ensure it's a multiple of 4 bits
    while (number.length % 4 !== 0) {
      number = "0" + number;
    }
    number = parseInt(number, 2);
  } else if (fromBase === "HEX") {
    // Convert from hex to decimal first
    number = parseInt(number, 16);
  } else if (fromBase === "FLOAT" && (toBase === "DEC" || toBase === "HEX")) {
    error = "Error: Cannot convert float to DEC or HEX.";
  }

  if (error !== null) {
    return { value: null, error };
  }

  if (toBase === "BIN") {
    // Convert to binary and pad with leading zeros to be a multiple of 4 bits
    return {
      value: _ARITHMETIC.decimalToBinary(number, 4),
      error: null,
    };
  } else if (toBase === "HEX") {
    // Convert to hexadecimal and pad with zeros to ensure it's a multiple of 4 bits
    return {
      value: number
        .toString(16)
        .toUpperCase()
        .padStart(Math.ceil(number.toString(16).length / 4) * 4, "0"),
      error: null,
    };
  } else {
    return { value: number.toString(), error: null };
  }
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
