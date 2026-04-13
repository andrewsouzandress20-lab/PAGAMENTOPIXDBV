const form = document.getElementById('pixForm');
const payerNameInput = document.getElementById('payerName');
const payerCpfInput = document.getElementById('payerCpf');
const amountInput = document.getElementById('amount');
const presetButtons = document.querySelectorAll('.preset-button');
const pixModal = document.getElementById('pixModal');
const closeModalButton = document.getElementById('closeModalButton');
const resultBox = document.getElementById('result');
const resultAmount = document.getElementById('resultAmount');
const resultTxid = document.getElementById('resultTxid');
const resultKey = document.getElementById('resultKey');
const payloadText = document.getElementById('payloadText');
const copyButton = document.getElementById('copyButton');
const feedback = document.getElementById('feedback');
const qrCodeContainer = document.getElementById('qrcode');

let currentPayload = '';
const PIX_KEY = 'dd5bbbba-51d3-4f30-b4ba-3fdc4aec9132';
const MERCHANT_NAME = 'DBV PAGAMENTOS';
const MERCHANT_CITY = 'MANAUS';

function tlv(id, value) {
  const content = String(value);
  return `${id}${String(content.length).padStart(2, '0')}${content}`;
}

function crc16(value) {
  let crc = 0xffff;

  for (let index = 0; index < value.length; index += 1) {
    crc ^= value.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function sanitize(text, maxLength) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 /-]/g, '')
    .trim()
    .slice(0, maxLength);
}

function generateTxid() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 12).toUpperCase();
  return `DBV${timestamp}${randomPart}`.slice(0, 25);
}

function buildPixPayload({ amount, payerName, payerCpf }) {
  const txid = generateTxid();
  const merchantName = sanitize(MERCHANT_NAME, 25).toUpperCase() || 'DBV';
  const merchantCity = sanitize(MERCHANT_CITY, 15).toUpperCase() || 'MANAUS';
  const reference = sanitize(payerName || payerCpf || 'PIX', 20).toUpperCase();
  const description = sanitize(`AGUIA DO NORTE ${reference}`, 30).toUpperCase();
  const formattedAmount = Number(amount).toFixed(2);

  const basePayload =
    tlv('00', '01') +
    tlv('01', '11') +
    tlv('26', tlv('00', 'br.gov.bcb.pix') + tlv('01', PIX_KEY) + tlv('02', description)) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', formattedAmount) +
    tlv('58', 'BR') +
    tlv('59', merchantName) +
    tlv('60', merchantCity) +
    tlv('62', tlv('05', txid)) +
    '6304';

  return {
    txid,
    payload: `${basePayload}${crc16(basePayload)}`,
    amount: formattedAmount,
    key: PIX_KEY,
  };
}

function openModal() {
  pixModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeModal() {
  pixModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function updatePresetSelection() {
  const normalizedValue = Number(amountInput.value).toFixed(2);

  presetButtons.forEach((button) => {
    const buttonValue = Number(button.dataset.value).toFixed(2);
    button.classList.toggle('is-selected', buttonValue === normalizedValue);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function renderQrCode(payload) {
  qrCodeContainer.innerHTML = '';

  new QRCode(qrCodeContainer, {
    text: payload,
    width: 220,
    height: 220,
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function generatePix(event) {
  event.preventDefault();
  feedback.classList.add('hidden');

  const numericAmount = Number(amountInput.value);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Informe um valor numerico maior que zero.');
  }

  const data = buildPixPayload({
    payerName: payerNameInput.value.trim(),
    payerCpf: payerCpfInput.value.trim(),
    amount: numericAmount,
  });

  currentPayload = data.payload;
  payloadText.value = data.payload;
  resultAmount.textContent = formatCurrency(Number(data.amount));
  resultTxid.textContent = data.txid;
  resultKey.textContent = data.key;
  renderQrCode(data.payload);
  resultBox.classList.remove('hidden');
  openModal();
}

async function copyPayload() {
  if (!currentPayload) {
    return;
  }

  await navigator.clipboard.writeText(currentPayload);
  feedback.classList.remove('hidden');
}

presetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    amountInput.value = button.dataset.value;
    updatePresetSelection();
  });
});

amountInput.addEventListener('input', () => {
  updatePresetSelection();
});

form.addEventListener('submit', async (event) => {
  try {
    generatePix(event);
  } catch (error) {
    window.alert(error.message);
  }
});

copyButton.addEventListener('click', async () => {
  try {
    await copyPayload();
  } catch {
    window.alert('Nao foi possivel copiar o pagamento PIX.');
  }
});

closeModalButton.addEventListener('click', () => {
  closeModal();
});

pixModal.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !pixModal.classList.contains('hidden')) {
    closeModal();
  }
});

updatePresetSelection();
