function checkCert() {
   const certType = ["hackthecloud"];

   const urlParams = new URLSearchParams(window.location.search);
   const name = urlParams.get("name");
   const role = urlParams.get("role");
   const type = urlParams.get("type");
   const hash = urlParams.get("key");

   var combined = name + role + type;

   var correctHash = 0;
   if (combined.length != 0) {
      for (var i = 0; i < combined.length; i++) {
         var char = combined.charCodeAt(i);
         correctHash = (correctHash << 5) - correctHash + char;
         correctHash = correctHash & correctHash;
      }
   }
   correctHash += ""; //turn into string

   if (!(name || role || type || hash)) {
      console.log("no params");
      window.onload = function () {
         homePage();
         destroyCertTemp();

         var fab = document.getElementsByClassName("fab")[0];
         fab.style.display = "none";
      };
   } else if (correctHash == hash && certType.includes(type)) {
      //wait until elements exist
      var observer = new MutationObserver(function (mutations, me) {
         var elements = [
            document.getElementById("cert")
         ];
         var missing = false;
         for (var i = 0; i < elements.length; i++) {
            if (!elements[i]) {
               missing = true;
            }
         }
         if (!missing) {
            var path = "certs/" + type + ".html";
            $("#cert").load(path, function () {
					document.getElementById("name").innerText = name;
               document.getElementById("role").innerText = role;
               destroyCertTemp();
               console.log("loaded cert");
				});

            me.disconnect();
            return;
         }
      });

      observer.observe(document, {
         childList: true,
         subtree: true,
      });
   } else {
      console.log("invalid cert");
      window.onload = function () {
         invalidCert();
         destroyCertTemp();

         var fab = document.getElementsByClassName("fab")[0];
         fab.style.display = "none";
      };
   }
}

function homePage() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("home").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);
}

function invalidCert() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("error").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);
}

function destroyCertTemp() {
   var certDesigns = document.getElementsByClassName("cert-design");
   for (var i = 0; i < certDesigns.length; i++) {
      certDesigns[i].parentNode.removeChild(certDesigns[i]);
   }
}

function download() {
   window.print();
}

checkCert();
