function getBrowser(userAgent = "") {

  if (/Edg/i.test(userAgent)) return "Edge";
  if (/OPR|Opera/i.test(userAgent)) return "Opera";
  if (/Chrome/i.test(userAgent)) return "Chrome";
  if (/Firefox/i.test(userAgent)) return "Firefox";
  if (/Safari/i.test(userAgent)) return "Safari";

  return "Unknown"
}

function getDevice(userAgent = "") {

  if (/iPad|Tablet/i.test(userAgent)) return "Tablet"

  if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) {
    return "Mobile"
  }

  return "Desktop"

}

module.exports = {
  getBrowser,
  getDevice
}