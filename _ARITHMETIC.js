class _ARITHMETIC {
  // ------------------------------------------------------------
  constructor() {}

  // --------------------- BINARY -------------------------------
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
  // TODO: Implement multiplication

  // -------------------- DECIMAL -------------------------------
  // ------------------------------------------------------------
  static decimalToBinary = (decimal, k_prec) => {
    if (isNaN(decimal) || decimal < 0) {
      return "Invalid input. Please provide a non-negative decimal number.";
    }

    if (decimal === 0) {
      return "0".padStart(4, "0"); // Ensure at least 4 bits for zero
    }

    // Convert the integral part to binary (left side of the decimal point)
    let integralBinary = "";
    let integral = Math.floor(decimal);
    while (integral > 0) {
      integralBinary = (integral % 2) + integralBinary;
      integral = Math.floor(integral / 2);
    }

    // Check if there is a fractional part
    let fractional = decimal - Math.floor(decimal);

    if (fractional === 0) {
      // If no fractional part, pad with leading zeros to be a multiple of 4 bits
      while (integralBinary.length % 4 !== 0) {
        integralBinary = "0" + integralBinary;
      }
      return integralBinary;
    } else {
      // Convert the fractional part to binary (right side of the decimal point)
      let fractionalBinary = ".";
      let precision = 0;

      while (precision < k_prec) {
        // You can adjust the precision here (e.g., 4 decimal places)
        fractional *= 2;
        fractionalBinary += Math.floor(fractional);
        fractional -= Math.floor(fractional);
        precision++;
      }

      // Combine the integral and fractional binary parts
      return integralBinary + fractionalBinary;
    }
  };

  static addDecimal = (a, b, base) => {};

  // TODO: Implement multiplication

  // -------------------- HEXADECIMAL ---------------------------
  // ------------------------------------------------------------
  static hexToBinary = (hex) => {
    // Convert hex to binary by parsing it as an integer and converting to binary string
    return parseInt(hex, 16).toString(2).padStart(8, "0");
  };

  static addHex = (a, b, base) => {};

  // TODO: Implement multiplication

  // ------------------------------------------------------------
}
