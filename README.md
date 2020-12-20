# Simple Certificates System :trophy:

Simple award certificate distribution system with a personalized link per recipient. Recipients can view their certificate on the website or download it as a PDF. The website verifies the certificate by using the hash of the URL parameters; making it more difficult to forge/modify a certificate URL.

*Originally created for [Hack the World 2020](https://hacktheworld.synhacks.org/) and [Hack the Cloud](https://cloud.hackthefog.com/) hackathons.*

![Cert Example](https://user-images.githubusercontent.com/20099646/89026587-d1f01900-d2dd-11ea-894c-916935efe598.jpg)


## Installation

### Host on GitHub Pages *(recommended)*
1. Fork this repository.
2. Follow these [instructions](https://docs.github.com/en/github/working-with-github-pages/creating-a-github-pages-site#creating-your-sites) on how to publish your repository on GitHub Pages.
3. Update [`index.html`](index.html), [`assets/logo.png`](assets/logo.png), and files in [`messages/`](messages/) to include your organization/hackathon's branding/contact information.
4. Test your installation by going to
   ```
   yourInstallLocation.com?name=Billy%20Bob%20Joe&award=1st%20Place&type=test&key=-1246086026
   ```

### Host on your own server
1. Clone this repository to your server
   ```bash
   git clone https://github.com/synHacks/certificates
   ```
2. Make the `certificates` directory public to the world.
3. Update [`index.html`](index.html), [`assets/logo.png`](assets/logo.png), and files in [`messages/`](messages/) to include your organization/hackathon's branding/contact information.
4. Test your installation by going to
   ```
   yourInstallLocation.com?name=Billy%20Bob%20Joe&award=1st%20Place&type=test&key=-1246086026
   ```

## How to use
### Create a Certificate Type
1. Duplicate [`certs/test.html`](certs/test.html) and rename it to what you would like this Certificate Type to be called (keep it short).
2. Customize your Certificate Type. Think of cert types as themes
   - Each Cert Type has its own HTML file. This new Cert Type/HTML must be added to the array in [`certs/index.js`](certs/index.js). The first string in the nested array is the name of the cert type's HTML file. The second string is the hash salt for this cert. The hash salt can be any random text and is optional.
      
      Example: `["test", "randomTextHere"]`
   - When displayed to the recipient, the design is automatically size to fit a landscape Letter sized paper (11 in. x 8.5 in.).
   - You must use [`rem`](https://css-tricks.com/theres-more-to-the-css-rem-unit-than-font-sizing/) units for all sizing (instead of `px` or `em`). This is to allow the certificate to resize based on the client's screen size while maintaining aspect ratio and placement. Although this isn't an elegant solution, it works.

      `font-size`, `font-height`, `width`, `height`, `border-width`, etc.
   - To insert parameters (name, reason of award, etc.), use the `cert-replace` HTML attribute. When the page loads, the contents of the element will be replaced with its respective parameter value in the URL.

      ```HTML
      <h1 cert-replace="name"></h1>
      ```
      If the certificate URL is `yourInstallLocation.com?name=Billy%20Bob%20Joe&award=1st%20Place&type=test&key=-1246086026`, `Billy Bob Joe` will appear inside the `<h1>` tag.
      
   - Get creative and design to your heart's content!

### Generate Certificate URLs

The easiest way to bulk generate certificate URLs is to use Google Sheets. Chances are, you already have your winner/participant's information stored there.
1. Create or open an existing Google Sheets.
2. Go to `Tools` > `Script editor`. This will open up a browser tab with a new Google Script file.
3. Delete everything inside the default Google Script file (`Code.gs`).
4. Copy the contents of [`customFunction.js`](customFunction.js).
5. Paste into the default Google Script file (`Code.gs`).
6. Save the file and give the Google Script project a name such as `Cert Generator`.
7. Return to your Google Sheets.
8. Use the custom Google Sheets function `=createCertURL()` which you have just added. FYI, the custom function supports Google Sheets' [`ArrayFormula`](https://support.google.com/docs/answer/3093275?hl=en).

   Every URL must have a `type` parameter (in other words, it must be one of your key value sets). This is how the system determines which Certificate Type to use.
   - If `type=testing` is in the URL, the website will display the cert type located at `cert/test.html`
   - If `type=hackathon` is in the URL, the website will display the cert type located at `cert/hackathon.html`

   **Syntax:**
   ```excel
   =createCertURL(baseURL, salt, key1, value1, key2, value2, ... )
   ```
   **Examples:**

   Google Sheets Formula | `=createCertURL("yourInstallLocation.com", "randomTextHere", "name", "Billy Bob Joe", "award", "1st Place", "type", "test")`|
   ----------------------|-------------------------------------------
   Result/URL | yourInstallLocation.com?name=Billy%20Bob%20Joe&award=1st%20Place&type=test&key=-1246086026 |
      
   Google Sheets Formula | `=createCertURL("https://example.com", "randomTextHere", "name", "Debra Richardson", "role", "Senior Manager", "dateAwarded", "July 31st, 2020", "type", "test")`|
   ----------------------|-------------------------------------------
   Result/URL | https://example.com?name=Debra%20Richardson&role=Senior%20Manager&dateAwarded=July%2031st,%202020&type=test&key=-1811546624 |


Alternatively, you can take the function in [`customFunction.js`](customFunction.js) and figure out how to implement it into your own javascript code.

### Sending out Certificates

Email will probably be the easiest way to send out these certificate URLs. There are three main ways to send out these unique links via email.
- Use a mass emailing service such as [MailChimp](https://mailchimp.com/help/use-merge-tags-to-send-personalized-files/) or [Sendy](https://sendy.co/forum/discussion/9205/how-to-use-custom-field-tags-in-emails/p1) that supports personalization tags/fields.
- Use an easy to set up bulk SMTP email sender such as [bulk-mail-cli](https://github.com/adventmail/bulk-mail-cli) which supports personalization tags/fields.
- Manually every email (obviously not viable/suggested).

Alternatively, you can send out these links through other mediums such as Slack or Discord. Another method, although highly discouraged, is to make your Google Sheet public and read-only. Make sure you remove any unnecessary PII (personally identifiable information) such as email addresses, phone numbers, birthdays, etc.

## Precautions
- **This system is not 100% secure.** This is a static website with no back-end. Therefore, it is possible for someone to dig through the code, get the URL generating function, find your certificate hash salt, and *generate their own "unauthorized" certificate URL*.

   I figured that building a back-end to prevent this would be unnecessary/a hassle especially since "unauthorized" certificates can be easily photoshopped anyways.
- **There is no way to recall/revoke or edit a certificate** after the link has been sent to them. Again, this is because there is no back-end/storage of who has been awarded the certificate.
   - If you really wanted to revoke someone's certificate, I guess you can add some javascript to display the `invalid certificate` message if the URL matches one of your revoked certificates.
   - If you would like to revoke all certificate of a certain type, you have multiple options
      - remove the cert type from [`certs/index.js`](cert/index.js)
      - change the cert's salt (this will allow you to re-issue new certificate using the same cert type)

## Contributors
System designed by [Gary Tou](https://github.com/garyhtou).

Special thanks to [Rafael Cenzano](https://github.com/RafaelCenzano), [Marv](https://github.com/malee31), [Cap Lee](https://github.com/calee14), and [Michael Schwamborn](https://github.com/mschwamborn) for designing for certificates for [Hack the World 2020](https://hacktheworld.synhacks.org/) and [Hack the Cloud](https://cloud.hackthefog.com/) and fixing some CSS issues.

## Questions?
Feel free to shoot me ([Gary Tou](https://github.com/garyhtou)) a message. Contact information found at [`https://garytou.com`](https://garytou.com).