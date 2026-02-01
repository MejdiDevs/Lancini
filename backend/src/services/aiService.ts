import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.AI_API_KEY) {
  console.warn("AI_API_KEY is not set. AI features will fail.");
}

// Lazy init
let client: OpenAI | null = null;
const getClient = () => {
  if (!client) {
    if (!process.env.AI_API_KEY) {
      throw new Error("AI_API_KEY environment variable is not set");
    }
    client = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    });
  }
  return client;
};

const MODEL = process.env.AI_MODEL || 'meta/llama-3.1-405b-instruct';

/**
 * Clean JSON response from AI
 */
const extractJson = (text: string): any => {
  let cleanText = text.trim();
  // Remove markdown
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  // Find first { and last }
  const start = cleanText.indexOf('{');
  const end = cleanText.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleanText = cleanText.substring(start, end + 1);
  }
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Text:", cleanText);
    throw new Error("Failed to parse AI response as JSON");
  }
};

export const analyzeResumeAts = async (
  resumeSummary: string,
  jobTitle: string = 'Not specified',
  company: string = 'Not specified',
  description: string = ''
) => {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `
Current date: ${currentDate}.
Role: Expert Executive Recruiter & ATS Optimization Specialist.

## Objective:
Analyze the provided resume against the target role and provide a high-impact, professional audit. Your output must be data-driven and provide a clear "Action Plan" for the candidate to increase their success rate.

## Input Data:
- **Target Job Title**: ${jobTitle}
- **Target Company**: ${company}
- **Context/Requirements**: ${description || `Infer standard industry requirements for a ${jobTitle} role.`}
- **Candidate Resume**: ${resumeSummary}

## Detailed Analysis Instructions:

### 1. ATS Performance Audit (0-100)
- **Skill Match (25%)**: Alignment with technical/hard skills.
- **Keyword Match (20%)**: Usage of industry-specific terminology found in modern job descriptions.
- **Experience Relevance (20%)**: How well past roles prepare them for the target role.
- **Resume Formatting (15%)**: Readability, standard sections, and ATS friendliness.
- **Action Verb Usage (10%)**: Strong verbs vs. passive language.
- **Job Fit (10%)**: Overall cultural and level-appropriate alignment.

### 2. Action Plan (improvement_suggestions)
Provide exactly 5 highly actionable, specific steps the candidate should take to improve their resume. 
- Avoid generic advice like "be more clear". 
- Instead, use: "Quantify the 'Increased efficiency' point in your last role with a specific percentage," or "Add 'Kubernetes' to your skills list as it is a core requirement for this role."

### 3. Matches & Gaps (top_matches, top_gaps)
- **Top 3 Matches**: Specific strengths that make them a good fit.
- **Top 3 Gaps**: Specific missing skills, certifications, or experiences they need to address.

### 4. Executive Summary (feedback_summary)
Exactly 5 concise lines. 
- 2 lines for high-level strengths.
- 3 lines for critical strategic pivots required.

### 5. Pros & Cons (pros, cons)
Exactly 3 points each. Focus on the *impact* of the resume's presentation and content.

## Strict Output Requirements:
- Return ONLY a valid JSON object.
- NO conversational text before or after the JSON.
- Ensure all keys match the schema exactly.

{
  "overall_score": 85,
  "top_matches": [
    {"title": "Skill/Experience", "description": "Why it matches"}
  ],
  "top_gaps": [
    {"title": "Missing Skill/Experience", "description": "Why it's a gap"}
  ],
  "feedback_summary": [
    "Line 1", "Line 2", "Line 3", "Line 4", "Line 5"
  ],
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "improvement_suggestions": [
     "Specific Action 1", 
     "Specific Action 2", 
     "Specific Action 3", 
     "Specific Action 4", 
     "Specific Action 5"
  ],
  "ats_criteria_ratings": {
    "skill_match_score": 0-10,
    "keyword_match_score": 0-10,
    "experience_relevance_score": 0-10,
    "resume_formatting_score": 0-10,
    "action_verb_usage_score": 0-10,
    "job_fit_score": 0-10
  },
  "confidence_score": 0-100
}
`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You are an expert ATS resume analyst. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2048
  });

  const content = response.choices[0].message.content || '{}';
  const data = extractJson(content);

  // Normalize response to ensure all expected keys exist for frontend
  return {
    overall_score: data.overall_score || 0,
    top_matches: data.top_matches || [],
    top_gaps: data.top_gaps || [],
    feedback_summary: data.feedback_summary || [],
    pros: data.pros || [],
    cons: data.cons || [],
    improvement_suggestions: data.improvement_suggestions || data.improvementSuggestions || [],
    ats_criteria_ratings: {
      skill_match_score: data.ats_criteria_ratings?.skill_match_score || 0,
      keyword_match_score: data.ats_criteria_ratings?.keyword_match_score || 0,
      experience_relevance_score: data.ats_criteria_ratings?.experience_relevance_score || 0,
      resume_formatting_score: data.ats_criteria_ratings?.resume_formatting_score || 0,
      action_verb_usage_score: data.ats_criteria_ratings?.action_verb_usage_score || 0,
      job_fit_score: data.ats_criteria_ratings?.job_fit_score || 0,
    },
    confidence_score: data.confidence_score || 0
  };
};

export const generateFirstQuestion = async (role: string, resumeSummary: string) => {
  const prompt = `
You are interviewing a candidate for a ${role} position.

Candidate's Resume Summary:
${resumeSummary}

Ask the first interview question. Make it relevant to the role and the candidate's background.
Be professional and engaging.
`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: `You are a professional technical interviewer conducting an interview for a ${role} position.` },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  return response.choices[0].message.content;
};

export const generateNextQuestion = async (role: string, historyContext: string, lastAnswer: string) => {
  const prompt = `
Interview Context:
${historyContext}

The candidate just answered your question: "${lastAnswer}"

Provide brief feedback on their answer (start with "Feedback:"), then ask the next question.
Mask sure to vary question types (technical, behavioral, scenarios).
`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: `You are a professional technical interviewer for a ${role} position. Assess the candidate's answers and ask follow-up questions.` },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 800
  });
  return response.choices[0].message.content;
};
