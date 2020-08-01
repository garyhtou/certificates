//Use Google Sheet custom function to generate Certificate URLs

/**
 * Creates certificate URL
 *
 * @param {"https://certificate.example.com"} baseURL   		Base url of certificate webite.
 * @param {"key", "value", "key2", "value2", ...} params   	URL params such as name, role, and type
 * @returns            													The Certificate URL.
 * @customfunction
 */
function createCertURL(baseURL, salt, params) {
   var params = Array.prototype.slice.call(arguments, 0);
   params.shift(); //remove baseURL
   params.shift(); //remove salt
   if (params.length > 0 && Array.isArray(params[1])) {
      //if array formula
      //oganize arrays into rows
      var sortedParams = [];
      for (let i = 0; i < params[1].length; i++) {
         var row = [];
         for (let k = 0; k < params.length; k += 2) {
            row.push(params[k]);
            row.push(params[k + 1][i][0]);
         }
         sortedParams.push(row);
      }
      var results = [];
      for (let singleParams of sortedParams) {
         //run each row though url creator
         results.push(createSingleURL(salt, baseURL, singleParams));
      }
      return results;
   } else if (isEmptyRow(params)) {
      //if not array formula and empty
      throw new Error("missing params");
   } else {
      return createSingleURL(salt, baseURL, params);
   }

   function createSingleURL(salt, singleBaseURL, singleParams) {
      //skip empty rows. Only applies to array formulas since empty non-arrayformula calls would have been caught
      if (isEmptyRow(singleParams)) {
         return;
      }

      var certURL = singleBaseURL + "?"; //create url base
      var singleKeyValueSet = [];
      for (let i = 0; i < singleParams.length; i += 2) {
         //adding url params
         if (singleParams[i] != "key") {
            certURL += singleParams[i] + "=" + singleParams[i + 1] + "&";
            singleKeyValueSet.push(singleParams[i]);
            singleKeyValueSet.push(singleParams[i + 1]);
         }
      }
      var key = keyHash(salt, singleKeyValueSet); //create key
      certURL += "key=" + key;
      return encodeURI(certURL.trim()); //encode as url (turn spaces into %20)
   }

   function isEmptyRow(params) {
      //check is values in params from google sheet is empty
      var empty = true;
      for (let i = 1; i < params.length; i += 2) {
         if (empty && params[i].trim().length != 0) {
            empty = false;
         }
      }
      if (empty) {
         return true;
      }
      return false;
   }

   function keyHash(salt, args) {
      if (args.length % 2 != 0) {
         throw new Error(
            "Incomplete params. Each param must include a key and value."
         );
      }
      var correctHash = 0;
      for (let i = 0; i < args.length; i += 2) {
         correctHash +=
            parseInt(hashParam(args[i] + "|" + args[i + 1])) / args.length;
      }
      correctHash = hashParam(correctHash + salt);
      return correctHash;

      function hashParam(input) {
         input += ""; //convert to string
         var output = 0;
         if (input.length != 0) {
            for (let i = 0; i < input.length; i++) {
               var char = input.charCodeAt(i);
               output = (output << 5) - output + char;
               output = output & output;
            }
         }
         return output;
      }
   }
}
