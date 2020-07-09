function checkCert() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const role = urlParams.get("role");
  const hash = urlParams.get("key");

  console.log(urlParams);
  console.log(name);
  console.log(role);
  console.log(hash);

  var combined = name + role;

  var correctHash = 0;
  if (combined.length != 0) {
    for (i = 0; i < combined.length; i++) {
      char = combined.charCodeAt(i);
      correctHash = (correctHash << 5) - correctHash + char;
      correctHash = correctHash & correctHash;
    }
  }
  console.log("correctHash: " + correctHash);

  if (correctHash == hash) {
    //wait until elements exist
    var observer = new MutationObserver(function (mutations, me) {
      var elements = [
        document.getElementById("name"),
        document.getElementById("role"),
      ];
      var missing = false;
      for (var i = 0; i < elements.length; i++) {
        if (!elements[i]) {
          missing = true;
        }
      }
      if (!missing) {
        //TODO DISPLAY CERT
			document.getElementById("name").innerText = name;
			document.getElementById("role").innerText = role;


        me.disconnect(); // stop observing
        return;
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  } else {
    //SHOW ERROR MESSAGE
  }
}

function download() {
	var certificate = document.getElementById("cert");
	

}

checkCert();
