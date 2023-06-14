export const filter = (message) => {
    if(window.localStorage.getItem("filter")=== "true" && message.includes("Fuck")){
        console.log("Filtering post: ",message);
        return true;
    } else {
        return false;
    }
}

// export const filter = async (message) => {
//     if (window.localStorage.getItem('filter') === 'true') {
//       try {
//         const response = await fetch(
//           'https://api.openai.com/v1/engines/davinci-codex/completions',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//             body: JSON.stringify({
//               prompt: `Is the following message harmful or inappropriate? ${message}`,
//               max_tokens: 10,
//               n: 1,
//               stop: null,
//               temperature: 0.7,
//             }),
//           }
//         );
  
//         if (!response.ok) {
//           throw new Error(`GPT-3.5 API request failed: ${response.statusText}`);
//         }
  
//         const data = await response.json();
//         const answer = data.choices[0].text.trim().toLowerCase();
//         if (answer === 'yes') {
//           console.log('Filtering post: ', message);
//           return true;
//         } else {
//           return false;
//         }
//       } catch (error) {
//         console.error('Error calling GPT-3.5:', error);
//         return false;
//       }
//     } else {
//       return false;
//     }
//   };
  