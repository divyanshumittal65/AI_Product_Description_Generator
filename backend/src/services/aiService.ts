import axios from 'axios';
import { ProductInput } from '../validators/productValidator';

const MODEL_URL = process.env.MODEL_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'qwen2.5:0.5b';

export async function generateProductDescription(input: ProductInput): Promise<{ description: string; modelUsed: string }> {
  const prompt = `Write a high-converting, engaging, and professional product description for the following item:

Product Name: ${input.productName}
Color: ${input.color}
Material: ${input.material}
Key Features: ${input.features}
Tone of Voice: ${input.tone}

Include:
1. An attention-grabbing headline.
2. A compelling introductory paragraph highlighting comfort, quality, and style.
3. Key bullet points summarizing its features.
4. A call to action.

Keep it concise, clear, and compelling.`;

  try {
    // Attempting to call Dockerized Ollama / Model Container endpoint
    const response = await axios.post(
      `${MODEL_URL}/api/generate`,
      {
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
      },
      { timeout: 15000 }
    );

    if (response.data && response.data.response) {
      return {
        description: response.data.response.trim(),
        modelUsed: `Docker (${MODEL_NAME})`,
      };
    }
  } catch (error: any) {
    console.warn(`[AI Service] Docker model service at ${MODEL_URL} not reachable or returned error: ${error?.message || error}. Using dynamic AI rule engine backup.`);
  }

  // Fallback Rule-Based AI Engine if Docker model container is starting up or downloading
  const fallbackDescription = generateRuleBasedDescription(input);
  return {
    description: fallbackDescription,
    modelUsed: 'AI Rule Engine (Fallback)',
  };
}

function generateRuleBasedDescription(input: ProductInput): string {
  const featuresList = input.features.split(',').map(f => f.trim()).filter(Boolean);
  const featureBullets = featuresList.map(f => `• ${f}`).join('\n');

  let intro = '';
  switch (input.tone.toLowerCase()) {
    case 'luxury':
    case 'premium':
      intro = `Elevate your wardrobe with the sophisticated ${input.productName}. Crafted from premium ${input.material} in a timeless ${input.color} shade, this piece exudes elegance and effortless refinement.`;
      break;
    case 'casual':
    case 'playful':
      intro = `Meet your new everyday favorite: the ${input.productName}! Styled in vibrant ${input.color} and made with ultra-comfortable ${input.material}, it's designed to keep up with your daily rhythm.`;
      break;
    case 'seo optimized':
    case 'seo':
      intro = `Looking for the best ${input.productName}? Crafted with top-tier ${input.material} and finished in sleek ${input.color}, this versatile item offers maximum durability, effortless maintenance, and unmatched comfort.`;
      break;
    default:
      intro = `Discover the perfect blend of style and durability with the ${input.productName}. Tailored in sleek ${input.color} using high-grade ${input.material}, it is crafted for everyday versatility.`;
      break;
  }

  return `### ${input.productName} - ${input.color} (${input.tone} Edition)

${intro}

#### Key Features & Highlights
${featureBullets || `• Premium ${input.material} construction\n• Stunning ${input.color} finish\n• Superior durability & comfort`}

#### Product Details
- **Material:** ${input.material}
- **Color:** ${input.color}
- **Tone:** ${input.tone}

Upgrade your lifestyle today with the ${input.productName}!`;
}
