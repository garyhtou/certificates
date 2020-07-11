function checkCert() {
   const urlParams = new URLSearchParams(window.location.search);

   //mandatory params
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

         var fab = document.getElementsByClassName("fab")[0];
         fab.style.display = "none";
      };
   } else if (correctHash == hash && certType.includes(type)) {
      //wait until elements exist
      var observer = new MutationObserver(function (mutations, me) {
         var elements = [document.getElementById("cert")];
         var missing = false;
         for (var i = 0; i < elements.length; i++) {
            if (!elements[i]) {
               missing = true;
            }
         }
         if (!missing) {
            var path = "certs/" + type + ".html";

            var request = new XMLHttpRequest();
            request.open("GET", path, true);
            request.onload = function () {
               if (request.status >= 200 && request.status < 400) {
                  var resp = request.responseText;

                  document.querySelector("#cert").innerHTML = resp;
                  document.getElementById("name").innerText = name;
                  document.getElementById("role").innerText = role;
                  console.log("loaded cert");
               } else {
                  error();
               }
            };
            request.send();

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
   var error = document.getElementById("invalid").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);
}

function error() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("error").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);
}

function download() {
   window.print();
}

function certResize() {
   var headerHeight;
   window.onload = function () {
      headerHeight = document.getElementsByClassName("header")[0].offsetHeight;
      document.documentElement.style.setProperty(
         "--header-height",
         headerHeight + "px"
      );
      resize();
   };
   window.onresize = function () {
      resize();
   };

   function resize() {
      // width: 100vw;
      // max-width: CALC(
      // 	(100vh - 105px) * 1.29411764706
      // );
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var newRootSize = (Math.min(
         windowWidth,
         (windowHeight - headerHeight) * 1.29411764706
      )/800) + "px";
		document.getElementsByTagName("html")[0].style.fontSize = newRootSize;
   }
}

certResize();
checkCert();
