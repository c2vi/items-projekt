
wol = require("node-wol")
wol.wake("00:19:99:fd:28:23", () => {console.log("wol packet sent")})
