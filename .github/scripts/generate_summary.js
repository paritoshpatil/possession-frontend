// .github/scripts/generate-summary.js
import OpenAI from 'openai';

async function generateSummary(diff, apiKey, github, context) {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    });

    console.log('Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes code changes. Keep summaries concise and focus on the key changes and their impact."
        },
        {
          role: "user",
          content: `Please summarize these code changes:\n${diff}`
        }
      ]
    });

    const summary = completion.choices[0].message.content;
    
    console.log('Posting comment to PR...');
    const commentBody = `## 🤖 AI-Generated PR Summary\n\n${summary}\n\n---\n*This summary was automatically generated using GPT-3.5-turbo*`;
    
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: commentBody
    });
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
}

export { generateSummary };