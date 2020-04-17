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
