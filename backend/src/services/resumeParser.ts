import { PDFParse } from 'pdf-parse';
import fs from 'fs';

interface ParsedResume {
    text: string;
    email?: string;
    phone?: string;
    links?: string[];
    sections?: { [key: string]: string };
}

// Regex patterns
const SECTION_PATTERNS = {
    contact: /(contact|email|phone|address|linkedin|github)/i,
    summary: /(summary|profile|objective|about)/i,
    experience: /(experience|employment|work history|professional experience)/i,
    education: /(education|academic|degree|university|college)/i,
    skills: /(skills|technical skills|competencies|expertise|technologies)/i,
    projects: /(projects|portfolio)/i,
    certifications: /(certifications|licenses|credentials)/i,
};

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const URL_PATTERN = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)/g;

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
    const dataBuffer = fs.readFileSync(filePath);
    const pdf = new PDFParse({ data: dataBuffer });
    try {
        const result = await pdf.getText();
        return result.text;
    } finally {
        await pdf.destroy();
    }
};

export const parseResume = async (filePath: string): Promise<ParsedResume> => {
    const text = await extractTextFromPdf(filePath);
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Extract basic info
    const emailMatch = text.match(EMAIL_PATTERN);
    const phoneMatch = text.match(PHONE_PATTERN);
    const urls = text.match(URL_PATTERN) || [];

    // Extract sections (Simplified logic)
    // We will identify indices of headers and slice content
    const sections: { [key: string]: string } = {};
    const lines = text.split('\n');
    let currentSection = 'unknown';
    let currentContent: string[] = [];

    // Very naive section parser relying on keywords being on their own line or start of line
    // Improved approach: Find all regex matches in the full text and sort by position
    const sectionMatches: { name: string, index: number }[] = [];

    // Scan full text for section headers is tricky because regex matches anywhere.
    // Let's stick to lines. If a line is short and matches a keyword, it's a header.

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let isHeader = false;
        // Check if line matches a section header pattern and is reasonably short (< 50 chars)
        if (trimmed.length < 50) {
            for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
                if (pattern.test(trimmed)) {
                    // Save previous section
                    if (currentSection !== 'unknown' && currentContent.length > 0) {
                        sections[currentSection] = (sections[currentSection] || '') + '\n' + currentContent.join('\n');
                    }
                    currentSection = key;
                    currentContent = [];
                    isHeader = true;
                    break;
                }
            }
        }

        if (!isHeader) {
            currentContent.push(trimmed);
        }
    }
    // Save last section
    if (currentSection !== 'unknown' && currentContent.length > 0) {
        sections[currentSection] = (sections[currentSection] || '') + '\n' + currentContent.join('\n');
    }

    return {
        text,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        links: urls,
        sections
    };
};

export const getSummaryForAnalysis = (parsed: ParsedResume): string => {
    let summary = `Resume Content Analysis:\n`;
    if (parsed.email) summary += `Email: ${parsed.email}\n`;
    if (parsed.links?.length) summary += `Links: ${parsed.links.join(', ')}\n`;

    if (parsed.sections) {
        if (parsed.sections.skills) summary += `\nSKILLS:\n${parsed.sections.skills.substring(0, 1000)}\n`;
        if (parsed.sections.experience) summary += `\nEXPERIENCE:\n${parsed.sections.experience.substring(0, 2000)}\n`;
        if (parsed.sections.education) summary += `\nEDUCATION:\n${parsed.sections.education.substring(0, 500)}\n`;
        if (parsed.sections.summary) summary += `\nSUMMARY:\n${parsed.sections.summary.substring(0, 500)}\n`;
    }

    // Fallback if sections failed: use raw text start
    if (Object.keys(parsed.sections || {}).length === 0) {
        summary += `\nRAW CONTENT:\n${parsed.text.substring(0, 3000)}`;
    }

    return summary;
};
