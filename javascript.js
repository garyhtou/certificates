function checkCert() {
   const urlParams = new URLSearchParams(window.location.search);

   //mandatory params
   const type = urlParams.get("type");
   const hash = urlParams.get("key");

   var allParams = [];
   var flattenedParams = [];
   for (var entry of urlParams.entries()) {
      if (entry[0] != "key") {
         allParams.push(entry);
         flattenedParams.push(entry[0]);
         flattenedParams.push(entry[1]);
      }
   }

   var correctHash = keyHash(flattenedParams);

   if (!(type || hash)) {
      console.log("no params");
      window.onload = function () {
         homePage();
      };
   } else if (hash == correctHash && certType.includes(type)) {
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
						for(var entry of allParams) {
							var elements = document.querySelectorAll("[cert-replace=" + entry[0] + "]");
							for(var element of elements) {
								element.innerText = entry[1];
							}
						}
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
      };
   }

   function keyHash(params) {
      //[key1, value1, key2, value2, ...]

      if (params.length % 2 != 0) {
         return (
            "ERROR: odd number of arguments (" +
            params.length +
            ") [" +
            Math.random() +
            "]"
         ); //random number prevents correct hash
      }
      var correctHash = 0;
      for (var i = 0; i < params.length; i += 2) {
         correctHash +=
            parseInt(hashParam(params[i] + "|" + params[i + 1])) / params.length;
      }
      correctHash = hashParam(correctHash);
      return correctHash;

      function hashParam(input) {
         input += ""; //convert to string
         var output = 0;
         if (input.length != 0) {
            for (var i = 0; i < input.length; i++) {
               var char = input.charCodeAt(i);
               output = (output << 5) - output + char;
               output = output & output;
            }
         }
         return output;
      }
	}
}

function homePage() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("home").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);

   var fab = document.getElementsByClassName("fab")[0];
   fab.style.display = "none";
}

function invalidCert() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("invalid").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);

   var fab = document.getElementsByClassName("fab")[0];
   fab.style.display = "none";
}

function error() {
   var certHolder = document.getElementById("cert");
   var error = document.getElementById("error").content.cloneNode(true);
   certHolder.innerHTML = "";
   certHolder.appendChild(error);

   var fab = document.getElementsByClassName("fab")[0];
   fab.style.display = "none";
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
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var newRootSize =
         Math.min(windowWidth, (windowHeight - headerHeight) * 1.29411764706) /
            800 +
         "px";
      document.getElementsByTagName("html")[0].style.fontSize = newRootSize;
   }
}

certResize();
checkCert();
