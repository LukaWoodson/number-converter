class Numbers {
  constructor() {}

  // --------------------ADDITION METHODS------------------------
  // ------------------------------------------------------------
  static addNumbers = (a, b, base) => {
    const num1 = parseInt(a, base);
    const num2 = parseInt(b, base);

    switch (base) {
      case 2:
        return Numbers.addBinary(a, b, base);
      case 16:
        return Numbers.addHex(a, b, base);
      case 10:
        // Check to make sure the inputs are valid numbers
        if (isNaN(a) || isNaN(b)) {
          return "Error: Invalid input or base.";
        }
        return (num1 + num2).toString(base);
    }
  };

  static addBinary = (a, b, base) => {
    // Split the binary numbers into integer and fractional parts
    let [intPart1, fracPart1] = a.split(".");
    let [intPart2, fracPart2] = b.split(".");

    // Initialize variables to store the results
    let resultInt = "";
    let resultFrac = "";

    // Determine if either input has a fractional part
    const hasFracPart = fracPart1 || fracPart2;

    // Pad fractional parts with trailing zeros to make them of equal length
    if (fracPart1 || fracPart2) {
      const maxFracLength = Math.max(
        fracPart1 ? fracPart1.length : 0,
        fracPart2 ? fracPart2.length : 0
      );
      fracPart1 = fracPart1 ? fracPart1.padEnd(maxFracLength, "0") : "0";
      fracPart2 = fracPart2 ? fracPart2.padEnd(maxFracLength, "0") : "0";

      let carry = 0;

      for (let i = fracPart1.length - 1; i >= 0; i--) {
        let r = carry;
        r += fracPart1[i] === "1" ? 1 : 0;
        r += fracPart2[i] === "1" ? 1 : 0;
        resultFrac = (r % 2 === 1 ? "1" : "0") + resultFrac;
        carry = r < 2 ? 0 : 1;
      }

      if (carry !== 0) {
        resultFrac = "1" + resultFrac;
      }
    }

    // Add the integer parts
    const intSum = parseInt(intPart1 || "0", 2) + parseInt(intPart2 || "0", 2);
    resultInt = intSum.toString(2);

    // Ensure that the result has multiples of 4 bits to the left when there's no decimal
    if (!hasFracPart) {
      const remainder = resultInt.length % 4;
      if (remainder !== 0) {
        resultInt = "0".repeat(4 - remainder) + resultInt;
      }
    }

    // Combine integer and fractional parts (if fractional part exists)
    let result = resultInt;

    // Add a decimal point only if either input has a fractional part
    if (hasFracPart) {
      result += "." + resultFrac;
    }

    return result.toString(base); // Convert the result to the specified base
  };

  static addHex = (a, b, base) => {
    // Convert hexadecimal strings to decimal integers
    const decimal1 = parseInt(a, base);
    const decimal2 = parseInt(b, base);

    // Add the decimal values
    const sumDecimal = decimal1 + decimal2;

    // Convert the sum back to hexadecimal
    const sumHexadecimal = sumDecimal.toString(base);

    return sumHexadecimal;
  };

  // -----------------MULTIPLICATION METHODS---------------------
  // ------------------------------------------------------------
  static multiplyNumbers = (a, b, base) => {
    const num1 = parseInt(a, base);
    const num2 = parseInt(b, base);

    switch (base) {
      case 2:
        return Numbers.multiplyBinary(a, b, base);
      case 16:
        return Numbers.multiplyHex(a, b, base);
      case 10:
        // Check to make sure the inputs are valid numbers
        if (isNaN(a) || isNaN(b)) {
          return "Error: Invalid input or base.";
        }
        return (num1 * num2).toString(base);
    }
  };

  static multiplyBinary = (a, b, base) => {
    // Convert binary strings to decimal numbers
    const decimal1 = parseInt(a, base);
    const decimal2 = parseInt(b, base);

    // Multiply the decimal numbers
    const resultDecimal = decimal1 * decimal2;

    // Convert the result back to binary and pad to 4 bits
    let resultBinary = resultDecimal.toString(base);

    // Pad with leading zeros to ensure 8 bits
    while (resultBinary.length % base !== 0) {
      resultBinary = "0" + resultBinary;
    }

    return resultBinary;
  };

  static multiplyHex = (a, b, base) => {
    // Convert hexadecimal strings to decimal numbers
    const decimal1 = parseInt(a, base);
    const decimal2 = parseInt(b, base);

    // Multiply the decimal numbers
    const resultDecimal = decimal1 * decimal2;

    // Convert the result back to hexadecimal
    const resultHexadecimal = resultDecimal.toString(base).toUpperCase();

    return resultHexadecimal;
  };
  // -------------------CONVERSION METHODS-----------------------
  // ------------------------------------------------------------
  /**
   * Converts a decimal number or hexadecimal string to binary. Takes in a decimal number or hexadecimal string for input, the precision for the fractional part (if applicable), and the base of the input.
   * @param {number || string} input
   * @param {number} k_prec
   * @param {string} fromBase
   * @returns
   */
  static toBinary = (input, k_prec, fromBase) => {
    // Helper function to pad binary numbers
    const padBinary = (binary, length) => binary.padStart(length, "0");

    if (fromBase === "DEC") {
      if (typeof input !== "number" || isNaN(input) || input < 0) {
        return "Invalid input. Please provide a valid input number.";
      }

      if (input === 0) {
        return padBinary("0", k_prec); // Ensure at least k_prec bits for zero
      }

      // Convert the integral part to binary
      let integralBinary = "";
      let integral = Math.floor(input);
      while (integral > 0) {
        integralBinary = (integral % 2) + integralBinary;
        integral = Math.floor(integral / 2);
      }

      // Pad the integral binary part to ensure it's a multiple of 4 bits
      const padLength = Math.ceil(integralBinary.length / k_prec) * k_prec;

      // Combine the integral binary part
      return padBinary(integralBinary, padLength);
    } else if (fromBase === "FLOAT") {
      // Helper function to calculate the binary representation of a binary section
      const calcBinary = (binary, bits) => {
        let convertedBinary = "";
        for (let i = bits - 1; i >= 0; i--) {
          convertedBinary += (binary >> i) & 1 ? "1" : "0";
        }
        return convertedBinary;
      };

      // Extract sign, exponent, and mantissa
      const signBit = input < 0 ? 1 : 0;
      const absValue = Math.abs(input);
      const exponent = Math.floor(Math.log2(absValue));
      const normalizedMantissa = absValue / Math.pow(2, exponent) - 1;

      // Convert exponent to biased representation
      const biasedExponent = exponent + 127;

      // Convert mantissa to binary
      const convertedMantissa = calcBinary(
        Math.round(normalizedMantissa * Math.pow(2, 23)),
        23
      );

      // Convert exponent to binary
      const convertedExponent = calcBinary(biasedExponent, 8);

      // Construct IEEE 754 representation
      const ieee754Representation =
        signBit + " " + convertedExponent + " " + convertedMantissa;

      return ieee754Representation;
    } else if (fromBase === "HEX") {
      // Check if the string input represents a hexadecimal value
      if (/^[0-9A-Fa-f]+$/.test(input)) {
        // Convert hex to binary by parsing it as an integer and converting to binary string
        let binary = parseInt(input, 16).toString(2);

        // Pad the integral binary part to ensure it's a multiple of 4 bits
        const padLength = Math.ceil(binary.length / k_prec) * k_prec;

        // Ensure the binary string has a length that is a multiple of k_prec bits
        return padBinary(binary, padLength);
      } else {
        return "Invalid hexadecimal input.";
      }
    }
  };

  /**
   * Converts a binary string or decimal number to hexadecimal. Takes in a binary string or decimal number for input, the precision for the fractional part (if applicable), and the base of the input.
   * @param {number || string} input
   * @param {number} k_prec
   * @param {string} fromBase
   * @returns
   */
  static toHex = (input, k_prec, fromBase) => {
    // Helper function to convert binary to hexadecimal
    const binaryToHex = (binary) => {
      let hex = "";
      for (let i = 0; i < binary.length; i += k_prec) {
        const nibble = binary.substr(i, k_prec);
        hex += parseInt(nibble, 2).toString(16).toUpperCase();
      }
      return hex;
    };

    if (fromBase === "BIN") {
      if (!/^[01]+$/.test(input)) {
        return "Invalid binary input.";
      }

      // Ensure the binary string length is a multiple of k_prec (each hex digit corresponds to k_prec bits)
      const padLength =
        input.length % k_prec === 0 ? 0 : k_prec - (input.length % k_prec);
      const paddedInput = "0".repeat(padLength) + input;

      // Convert binary to hexadecimal using the helper function
      return binaryToHex(paddedInput);
    } else if (fromBase === "DEC") {
      if (typeof input !== "number") {
        return "Invalid input. Please provide a valid input number.";
      }

      // Convert Decimal to Hexadecimal and return
      return parseInt(input).toString(16).toUpperCase();
    }
  };

  /**
   * Converts a binary string or hexadecimal string to decimal. Takes in a binary string or hexadecimal string for input, the precision for the fractional part (if applicable), and the base of the input.
   * @param {number || string} input
   * @param {number} k_prec
   * @param {string} fromBase
   * @returns
   */
  static toDecimal = (input, fromBase) => {
    if (fromBase === "BIN") {
      // Check if the input is a valid binary string
      if (!/^[01]+$/.test(input)) {
        return "Invalid binary input.";
      }

      // Parse the binary string to decimal
      let decimalValue = 0;
      let isNegative = false;

      // Check if the binary number is negative
      if (input[0] === "-") {
        isNegative = true;
        input = input.slice(1);
      }

      for (let i = 0; i < input.length; i++) {
        decimalValue = decimalValue * 2 + parseInt(input[i], 2);
      }

      if (isNegative) {
        decimalValue = -decimalValue;
      }

      return decimalValue.toString();
    } else if (fromBase === "HEX") {
      // Check if the input is a valid hexadecimal string
      if (!/^[0-9A-Fa-f]+$/.test(input)) {
        return "Invalid hexadecimal input.";
      }

      // Parse the hexadecimal string to decimal
      const decimalValue = parseInt(input, 16);
      return decimalValue.toString();
    } else {
      return "Unsupported input base.";
    }
  };

  // ------------------------------------------------------------
}
