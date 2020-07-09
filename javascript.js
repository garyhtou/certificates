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
  correctHash += ""; //turn into string
  console.log("correctHash: " + correctHash);

  if (correctHash == hash) {
    //wait until elements exist
    var observer = new MutationObserver(function (mutations, me) {
      var elements = [
        document.getElementById("cert"),
        document.getElementById("cert-temp")
      ];
      var missing = false;
      for (var i = 0; i < elements.length; i++) {
        if (!elements[i]) {
          missing = true;
        }
      }
      if (!missing) {
        var certHolder = document.getElementById("cert");
        var cert = document.getElementById("cert-temp").content.cloneNode(true);
        certHolder.innerHTML = "";
        certHolder.appendChild(cert);
        document.getElementById("name").innerText = name;
        document.getElementById("role").innerText = role;

        destroyCertTemp();
        me.disconnect(); // stop observing
        return;
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  } else {
    console.log("incorrect");
    var observer = new MutationObserver(function (mutations, me) {
      var elements = [
        document.getElementById("cert"),
        document.getElementById("cert-temp")
      ];
      var missing = false;
      for (var i = 0; i < elements.length; i++) {
        if (!elements[i]) {
          missing = true;
        }
      }
      if (!missing) {
        var certHolder = document.getElementById("cert");
        certHolder.innerHTML = "<h1>error message</h1>";

        destroyCertTemp();
        me.disconnect(); // stop observing
        return;
      }
    });
  }
}

function destroyCertTemp() {
  document.getElementById("cert-temp").innerHTML = "";
}


function download() {
  var certificate = document.getElementById("cert");
}

checkCert();