const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

export const applyFormulas = (
  height: number,
  weight: number,
  sex: string,
  resistance: number,
  reactance: number
) => {
  let MLG, MLG2, MLG3;
  if (sex === "Femenino") {
    MLG =
      -4.104 +
      0.518 * (height ** 2 / resistance) +
      0.231 * weight +
      0.13 * reactance +
      4.229 * 0;
    MLG2 =
      -4.036 +
      0.517 * (height ** 2 / resistance) +
      0.238 * weight +
      0.123 * reactance +
      4.07 * 0;
    MLG3 =
      -4.104 +
      0.518 * (height ** 2 / resistance) +
      0.231 * weight +
      0.13 * reactance +
      4.229 * 0;
  } else {
    MLG =
      -4.204 +
      0.518 * (height ** 2 / resistance) +
      0.231 * weight +
      0.13 * reactance +
      4.229 * 1;
    MLG2 =
      -4.036 +
      0.517 * (height ** 2 / resistance) +
      0.238 * weight +
      0.123 * reactance +
      4.07 * 1;
    MLG3 =
      -4.204 +
      0.518 * (height ** 2 / resistance) +
      0.231 * weight +
      0.13 * reactance +
      4.229 * 1;
  }

  const MLGT = (MLG + MLG2 + MLG3) / 3.123;
  const ACT = 0.73 * MLGT;
  const ICW = MLGT * 0.44;
  const ECW = MLGT * 0.29;
  const MINE = MLGT * 0.07;
  const MG = weight - MLGT + 1;
  const PMG = (MG / weight) * 100;
  const IMC = weight / (height / 100) ** 2;
  const MM = height ** 2 / resistance / 2;
  const PRO = weight - ACT - MINE - MG;

  return {
    MLGT: roundToTwoDecimals(MLGT),
    ACT: roundToTwoDecimals(ACT),
    ICW: roundToTwoDecimals(ICW),
    ECW: roundToTwoDecimals(ECW),
    MINE: roundToTwoDecimals(MINE),
    MG: roundToTwoDecimals(MG),
    PMG: roundToTwoDecimals(PMG),
    IMC: roundToTwoDecimals(IMC),
    MM: roundToTwoDecimals(MM),
    PRO: roundToTwoDecimals(PRO),
  };
};
