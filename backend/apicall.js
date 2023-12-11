const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";

const API_KEY = "AIzaSyAUwwcvrhQE03_V9OHN9DxJNnWNEfE64t0"

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function generateTodoListText(todoList) {
  const todoListJsonString = JSON.stringify(todoList);

  const prompt = "This is a todo list, fill in the rank for each task, based on their due date and logical order of importance. Display in increasing order of importance\n\n" + todoListJsonString;

  try {
    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    return JSON.parse(JSON.stringify(result[0].candidates[0].output));
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
}

module.exports = {
  generateTodoListText,
};
