import { App } from "./app/app.js";

var users = {
    "users": [
      {
        "pseudo": "Albert "        
      },
      {       
        "pseudo": "Jacquot"
      },
      {       
        "pseudo": "Patricia"
      }
    ]
  };
var users_json = JSON.stringify(users);
sessionStorage.setItem("users",users_json);
const app = new App();
await app.run();
