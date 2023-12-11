const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");
const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyAUwwcvrhQE03_V9OHN9DxJNnWNEfE64t0"

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});


todo_list_json = 
   [{"id": 1, "task": "Eat dinner", "rank": null},
    {"id": 2, "task": "Make dinner", "rank": null},
    {"id": 4, "task": "Buy food", "rank": null},
    {"id": 5, "task": "Clean up", "rank": null},
    {"id": 6, "task": "Go to the store", "rank": null}]

todo_list_json_string = JSON.stringify(todo_list_json)

const prompt = "This is a todo list, fill in the rank for each task, based on their logical order of importance. \n\n" + todo_list_json_string 
client
  .generateText({
    model: MODEL_NAME,
    prompt: {
      text: prompt,
    },
  })
  .then((result) => {
    console.log(JSON.parse(result[0].candidates[0].output))
  });