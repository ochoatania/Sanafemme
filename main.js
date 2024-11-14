import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
let API_KEY = 'AIzaSyBVlbcIrfr_LyTxDmI4h-J4km8wka0iwRw'; // Replace with your actual API key

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // or gemini-1.5-pro
      systemInstruction: "you are a medicine assistant bot that knows all about medicine, specially women health care. Including women health, postpartum care,menopause,female cancer, you look for sepsis alerts, women cancer alerts and major women health concerns based on symptoms, lab work, and health information including heart echo, x-rays, mri, cat scans and more. You will guide, alert and direct doctors if they may be missing anything on the patient that could be potentially life saving. provide a checkbox after all recommended procedures or check ups. Prompt medical providers recommended steps for patient evaluation. ", 
    });

    const generationConfig = {
      temperature: 1.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: `Symptoms: ${promptInput}. ${promptInput.value}` } 
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Awaiting Sanafemme response..."); 
    
    // Display the result as markdown
    let md = new MarkdownIt();
    output.innerHTML = md.render(result.response.text());

  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);