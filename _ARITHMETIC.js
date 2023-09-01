class _ARITHMETIC {
  // ------------------------------------------------------------
  constructor() {}

  // TODO: Refactor to use 1 addition function for all bases
  // TODO: Refactor to use 1 multiplication function for all bases

  // --------------------ADDITION METHODS------------------------
  // ------------------------------------------------------------
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
  static multiplyBinary = (a, b, base) => {
    // code here
  };

  static multiplyHex = (a, b, base) => {
    // code here
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
    // Decimal to Binary
    if (fromBase === "DEC" || fromBase === "FLOAT") {
      if (typeof input !== "number") {
        return "Invalid input. Please provide a valid input number.";
      }

      if (isNaN(input) || input < 0) {
        return "Invalid input. Please provide a valid input number.";
      }

      if (input === 0) {
        return "0".padStart(k_prec, "0"); // Ensure at least k_prec bits for zero
      }

      // Convert the integral part to binary (left side of the input point)
      let integralBinary = "";
      let integral = Math.floor(input);
      while (integral > 0) {
        integralBinary = (integral % 2) + integralBinary;
        integral = Math.floor(integral / 2);
      }

      // Check if there is a fractional part
      let fractional = input - Math.floor(input);

      if (fractional === 0) {
        // If no fractional part, pad with leading zeros to be a multiple of k_prec bits
        while (integralBinary.length % k_prec !== 0) {
          integralBinary = "0" + integralBinary;
        }
        return integralBinary;
      } else {
        // Convert the fractional part to binary (right side of the input point)
        let fractionalBinary = ".";
        let precision = 0;

        while (precision < k_prec) {
          // You can adjust the precision here (e.g., k_prec input places)
          fractional *= 2;
          fractionalBinary += Math.floor(fractional);
          fractional -= Math.floor(fractional);
          precision++;
        }

        // Combine the integral and fractional binary parts
        return integralBinary + fractionalBinary;
      }
    } else if (fromBase === "HEX") {
      // Hexadecimal to Binary
      // Check if the string input represents a hexadecimal value
      if (/^[0-9A-Fa-f]+$/.test(input)) {
        // Convert hex to binary by parsing it as an integer and converting to binary string
        let binary = parseInt(input, 16).toString(2);

        // Ensure the binary string has a length that is a multiple of k_prec bits
        while (binary.length % k_prec !== 0) {
          binary = "0" + binary;
        }

        return binary.padStart(k_prec, "0");
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
    // Binary to Hexadecimal
    if (fromBase === "BIN") {
      if (!/^[01]+$/.test(input)) {
        return "Invalid binary input.";
      }

      // Ensure the binary string length is a multiple of k_prec by adding leading zeros if needed
      const padLength =
        input.length % k_prec === 0 ? 0 : k_prec - (input.length % k_prec);
      const paddedInput = "0".repeat(padLength) + input;

      // Convert binary to hexadecimal by grouping into k_prec-bit segments and converting each to hex
      let hexadecimalStr = "";
      for (let i = 0; i < paddedInput.length; i += k_prec) {
        const binarySegment = paddedInput.substr(i, k_prec);
        const decimalValue = parseInt(binarySegment, 2);
        const hexDigit = decimalValue.toString(16).toUpperCase(); // Convert to uppercase
        hexadecimalStr += hexDigit;
      }

      return hexadecimalStr;
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
  static toDecimal = (input, k_prec, fromBase) => {
    // Binary to Decimal
    let decimalValue;

    if (fromBase === "BIN") {
      // Check if the input is a valid binary string
      if (!/^[01]+$/.test(input)) {
        return "Invalid binary input.";
      }

      // Remove leading zeros from the binary string
      input = input.replace(/^0+/, "");

      // Split the binary string into integer and fractional parts
      const [integerPart, fractionalPart] = input.split(".");

      // Convert the integer part to decimal
      decimalValue = parseInt(integerPart, 2);

      // Convert the fractional part to decimal if it exists
      if (fractionalPart) {
        let fractionalDecimal = 0;
        for (let i = 0; i < fractionalPart.length; i++) {
          fractionalDecimal +=
            parseInt(fractionalPart[i], 2) / Math.pow(2, i + 1);
        }
        decimalValue += fractionalDecimal;
      }
    } else {
      // Hexadecimal to Decimal
      // Check if the input is a valid hexadecimal string
      if (!/^[0-9A-Fa-f]+$/.test(input)) {
        return "Invalid hexadecimal input.";
      }
      // Convert hexadecimal to decimal
      decimalValue = parseInt(input, 16);
    }

    // Convert to a string to handle the decimal places and return
    return decimalValue.toString();
  };

  // ------------------------------------------------------------
}
