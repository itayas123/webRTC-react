// Add zero padding
function zeroPad(number, size = 2) {
  let s = String(number);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

// Convert time from seconds int to mm:ss string
export function timeFormat(seconds) {
  const mm = parseInt(seconds / 60, 10);
  const ss = parseInt(seconds % 60, 10);

  return `${zeroPad(mm)}:${zeroPad(ss)}`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validateEmail(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

export function validateUri(uri) {
  return uri.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
}
