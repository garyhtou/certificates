//Use google sheet to generate Certificate URLs

/**
 * Creates certificate URL
 *
 * @param {"https://certificate.example.com"} baseURL   		Base url of certificate webite.
 * @param {"key", "value", "key2", "value2", ...} params   	URL params such as name, role, and type
 * @returns            													The Certificate URL.
 * @customfunction
 */
function createCertURL(baseURL, params) {
   var args = Array.prototype.slice.call(arguments, 0);
   var baseURL = args.shift();
   var certURL = baseURL + "?";
   var params = [];
   for (var i = 0; i < args.length; i += 2) {
      if (args[i] != "key") {
         certURL += args[i] + "=" + args[i + 1] + "&";
         params.push(args[i]);
         params.push(args[i + 1]);
      }
   }
   var key = keyHash(args);
   certURL += "key=" + key;
   return encodeURI(certURL.trim());

   function keyHash(args) {
      //key1, value1, key2, value2, ...

      if (args.length % 2 != 0) {
         throw new Error(
            "Incomplete params. Each param must include a key and value."
         );
         //return "ERROR: odd number of arguments (" + args.length + ") [" + Math.random() + "]"; //random number prevents correct hash
      }
      var correctHash = 0;
      for (var i = 0; i < args.length; i += 2) {
         correctHash +=
            parseInt(hashParam(args[i] + "|" + args[i + 1])) / args.length;
         console.log("Correct Hash: " + correctHash);
      }
      correctHash = hashParam(correctHash);
      console.log("Correct Hash: " + correctHash);
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
