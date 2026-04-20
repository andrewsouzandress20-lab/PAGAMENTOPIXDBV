/**
 * Utility for generating BRCode (PIX Copy and Paste)
 */

export function generatePixPayload({
  key,
  amount,
  merchantName = "AGUIA DO NORTE",
  merchantCity = "SAO PAULO",
  txid = "PIXAGUIA"
}: {
  key: string;
  amount: number;
  merchantName?: string;
  merchantCity?: string;
  txid?: string;
}) {
  const formatLength = (val: string) => val.length.toString().padStart(2, "0");

  const identifier = "000201"; // Payload Format Indicator
  
  // 26: Merchant Account Information
  const gui = "0014br.gov.bcb.pix";
  const keyField = `01${formatLength(key)}${key}`;
  const merchantAccountInfo = `26${(gui.length + keyField.length).toString().padStart(2, "0")}${gui}${keyField}`;
  
  const merchantCategory = "52040000";
  const currency = "5303986"; // BRL
  
  const formattedAmount = amount.toFixed(2);
  const amountField = `54${formatLength(formattedAmount)}${formattedAmount}`;
  
  const countryCode = "5802BR";
  const merchantNameField = `59${formatLength(merchantName)}${merchantName}`;
  const merchantCityField = `60${formatLength(merchantCity)}${merchantCity}`;
  
  // 62: Additional Data Field Template
  const txidField = `05${formatLength(txid.substring(0, 25))}${txid.substring(0, 25)}`;
  const additionalData = `62${formatLength(txidField)}${txidField}`;
  
  const payloadBeforeCRC = `${identifier}${merchantAccountInfo}${merchantCategory}${currency}${amountField}${countryCode}${merchantNameField}${merchantCityField}${additionalData}6304`;
  
  return `${payloadBeforeCRC}${crc16(payloadBeforeCRC)}`;
}

function crc16(data: string): string {
  let crc = 0xFFFF;
  const poly = 0x1021;

  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ poly) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
