import fitz  # PyMuPDF for extracting text from PDFs
import re
import google.generativeai as genai
import os  # For file handling
import sys  # Import the sys module

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
        "Your response should be **structured, concise, and focused** on essential details while ensuring no important information is missed.\n\n"
        "**Extract and categorize the following elements:**\n"
        "1️⃣ **Key Concepts & Definitions** → Clearly define important terms and principles.\n"
        "2️⃣ **Important Facts & Figures** → Highlight any numerical data, statistics, or critical points.\n"
        "3️⃣ **Critical Explanations** → Extract detailed explanations of key topics.\n"
        "4️⃣ **Important Dates, Events, or Formulas** → Identify historical dates, events, and significant formulas relevant to the subject.\n\n"
        "### **Content for Analysis:**\n"
        f"{text}\n\n"
        "### **Expected Output Format:**\n"
        "**Concepts & Definitions:**\n"
        "- [List of key concepts]\n\n"
        "**Facts & Figures:**\n"
        "- [List of important numbers, statistics, or facts]\n\n"
        "**Explanations:**\n"
        "- [Detailed explanations of key topics]\n\n"
        "**Dates, Events & Formulas:**\n"
        "- [Historical dates, events, and significant formulas]\n\n"
        "Ensure that the extracted content is **precise**, **structured**, and **comprehensive** so that it can be used for generating **MCQs, 2-mark, 5-mark, and 10-mark questions**."
    )

    response = model.generate_content(prompt)
    return response.text if response else "Failed to extract insights."

# def compress_text_for_qg(text):
#     """Compresses extracted text while preserving essential details for MCQ and 2-mark question generation."""
#     model = genai.GenerativeModel("gemini-1.5-flash")
#     prompt = (
#         "You are an expert in summarization, tasked with condensing an academic text **without losing critical details**. "
#         "The output should be concise but preserve all key facts, concepts, and explanations so it remains useful for question generation.\n\n"
#         "**Guidelines:**\n"
#         "✅ Keep the summary under 512 tokens.\n"
#         "✅ Maintain definitions, facts, and explanations while removing redundancy.\n"
#         "✅ Ensure the summary covers all essential details for MCQ and 2-mark question generation.\n\n"
#         "**Input Text:**\n"
#         f"{text}\n\n"
#         "**Expected Output:**\n"
#         "A highly compressed version of the text that retains all necessary information for question generation."
#     )

#     response = model.generate_content(prompt)
#     return response.text if response else "Compression failed."
def compress_text_for_qg(text):
    """Compresses extracted text while preserving essential details for MCQ and 2-mark question generation."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
        "You are an expert in summarization, tasked with condensing an academic text without losing key details or critical information. "
        "The output should be **concise but comprehensive**, keeping all necessary facts, concepts, and explanations intact.\n\n"
        "**Guidelines:**\n"
        "✅ Maintain the core concepts, definitions, and critical explanations.\n"
        "✅ Avoid oversimplifying the text.\n"
        "✅ Keep the summary **comprehensive** and **relevant** while reducing unnecessary details.\n\n"
        "**Input Text:**\n"
        f"{text}\n\n"
        "**Expected Output:**\n"
        "A condensed version of the text that maintains all essential information necessary for question generation."
    )

    response = model.generate_content(prompt)
    return response.text.strip() if response else "Compression failed."

def save_results_to_file(output, insights, categorized_codes):
    """Saves extracted insights and categorized code snippets to a text file."""
    try:
        # Encode special characters safely
        safe_insights = insights.encode('utf-8', errors='replace').decode('utf-8')
        
        output.write("=== Extracted Core Insights ===\n")
        output.write(safe_insights + "\n\n")

        if categorized_codes:
            output.write("=== Detected Code Snippets ===\n")
            for idx, item in enumerate(categorized_codes, 1):
                safe_code = item['code'].encode('utf-8', errors='replace').decode('utf-8')
                output.write(f"Code {idx} ({item['category']}):\n{safe_code}\n\n")

        print(f"\nResults saved to: {output.name}")
    except UnicodeEncodeError as e:
        print(f"Warning: Some special characters could not be encoded: {str(e)}")

def main(pdf_path, insights_output, compressed_output):
    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        print("No text found in the PDF.")
        return

    # Extract and categorize code snippets
    code_snippets = extract_code_snippets(text)
    categorized_codes = categorize_code_snippets(code_snippets)

    # Extract core insights
    insights = extract_core_insights(text)
    
    # Compress text for question generation
    compressed_text = compress_text_for_qg(text)

    # Save results to a text file
    save_results_to_file(insights_output, insights, categorized_codes)
    save_results_to_file(compressed_output, compressed_text, categorized_codes)

# Modify the script to accept command-line arguments
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python summarise.py <pdf_path> <insights_output> <compressed_output>")
        sys.exit(1)

    pdf_file = sys.argv[1]
    insights_file = sys.argv[2]
    compressed_file = sys.argv[3]
    
    # Modified file opening with explicit encoding and error handling
    try:
        insights_output = (open(insights_file, "w", encoding="utf-8", errors="replace") 
                         if insights_file != "-" else sys.stdout)
        compressed_output = (open(compressed_file, "w", encoding="utf-8", errors="replace") 
                           if compressed_file != "-" else sys.stdout)
        
        main(pdf_file, insights_output, compressed_output)
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        sys.exit(1)
    finally:
        if insights_output != sys.stdout:
            insights_output.close()
        if compressed_output != sys.stdout:
            compressed_output.close()


