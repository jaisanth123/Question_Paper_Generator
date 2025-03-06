import fitz  # PyMuPDF for extracting text from PDFs
import re
import google.generativeai as genai
import os  # For file handling

# Configure Gemini API
genai.configure(api_key="AIzaSyBN1ply0vEg4zTRMCTBM4DFRyjNmh2PrYU")

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text

def extract_code_snippets(text):
    """Detects and extracts code snippets from the text."""
    code_snippets = []
    
    # Detect code written in proper ``` format
    formatted_code_blocks = re.findall(r"```(.*?)```", text, re.DOTALL)
    code_snippets.extend(formatted_code_blocks)

    # Detect Python-style functions, loops, and indented blocks
    indented_code_blocks = re.findall(r"(?:(?:def|class|for|while|if|elif|else|try|except|import)[^\n]*\n(?:\s{4,}.*\n*)+)", text)
    code_snippets.extend(indented_code_blocks)

    return code_snippets

def categorize_code_snippets(code_snippets):
    """Categorizes code snippets as 5-mark or 10-mark questions."""
    categorized_codes = []
    
    for code in code_snippets:
        lines = code.count("\n") + 1
        if lines < 10:
            category = "5-mark question (Short Code Snippet)"
        else:
            category = "10-mark question (Detailed Code Block)"
        
        categorized_codes.append({"code": code, "category": category})
    
    return categorized_codes

def extract_core_insights(text):
    """Extracts key insights from the text for question generation using Gemini 1.5 Flash."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
    "You are an expert in academic content analysis, tasked with extracting the most crucial insights for question paper generation. "
    "Your response should be **structured, concise, and focused** on essential details. "
    "Strictly **avoid general overviews** and instead extract key academic elements, including:\n\n"
    "**1. Key Concepts & Definitions:** Clearly define important terms and principles.\n"
    "**2. Important Facts & Figures:** Highlight any numerical data, statistics, or critical points.\n"
    "**3. Critical Explanations:** Extract detailed explanations of key topics.\n"
    "**4. Important Dates, Events, or Formulas:** Identify historical dates, events, and significant formulas relevant to the subject.\n\n"
    "### Content for Analysis:\n"
    f"{text}\n\n"
    "### Expected Output Format:\n"
    "- **Concepts & Definitions:**\n"
    "- **Facts & Figures:**\n"
    "- **Explanations:**\n"
    "- **Dates, Events & Formulas:**\n\n"
    "Ensure the extracted content is **precise**, **well-structured**, and **ready to be used for academic assessments**."
)

    response = model.generate_content(prompt)
    return response.text if response else "Failed to extract insights."

def save_results_to_file(output_path, insights, categorized_codes):
    """Saves extracted insights and categorized code snippets to a text file."""
    with open(output_path, "w", encoding="utf-8") as file:
        file.write("=== Extracted Core Insights ===\n")
        file.write(insights + "\n\n")

        if categorized_codes:
            file.write("=== Detected Code Snippets ===\n")
            for idx, item in enumerate(categorized_codes, 1):
                file.write(f"Code {idx} ({item['category']}):\n{item['code']}\n\n")

    print(f"\nResults saved to: {output_path}")

def main(pdf_path, output_txt_path):
    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        print("No text found in the PDF.")
        return

    # Extract and categorize code snippets
    code_snippets = extract_code_snippets(text)
    categorized_codes = categorize_code_snippets(code_snippets)

    # Extract core insights
    insights = extract_core_insights(text)

    # Save results to a text file
    save_results_to_file(output_txt_path, insights, categorized_codes)

# Example usage
pdf_file = r"D:\hacknovate\Question_Paper_Generator\pdf_extractor\dl.pdf"  # Use the correct file path
output_file = r"D:\hacknovate\Question_Paper_Generator\pdf_extractor\extracted_insights.txt"  # Output file path
main(pdf_file, output_file)