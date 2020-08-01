// List all certificate types here. This will the paramater value which will go into your URL.
// If a user attempts to access a cert that is not within this list, they will recieve an error message.

//First item is the cert type, the second item is the hash salt for this cert. The hash salt can be any random text and is optional.
//Ex. ["test", "mysalt here"]
const certType = [["test", "randomTextHere"]];
