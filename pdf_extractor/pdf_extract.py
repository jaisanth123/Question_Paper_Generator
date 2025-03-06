from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import os
import tempfile
import shutil
import fitz  # PyMuPDF
import pdfplumber
import re
import csv
import pandas as pd
from tabulate import tabulate
from pdf2image import convert_from_path
import pytesseract
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from concurrent.futures import ThreadPoolExecutor
import uvicorn
import subprocess 
app = FastAPI(title="PDF OCR API", description="API for OCR processing of PDF documents")
from fastapi.middleware.cors import CORSMiddleware
import shutil

# Allow requests from frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],  # Change to ["http://localhost:5173"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Configure paths - adjust these to match your environment
UPLOAD_FOLDER = tempfile.mkdtemp()
OUTPUT_FOLDER = tempfile.mkdtemp()
POPPLER_PATH = r"E:\Hacknovate\Question_Paper_Generator\pdf_extractor\poppler-24.08.0\bin"  # Adjust as needed
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Adjust as needed



def clean_text(text):
    """Clean text by removing unnecessary spaces and newlines"""
    if text is None:
        return ""
    text = re.sub(r'[\n\r\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def is_row_empty(row):
    """Check if a table row is empty"""
    return all(cell is None or cell.strip() == '' for cell in row)

def intersect_areas(bbox1, bbox2):
    """Check if two bounding boxes intersect"""
    x0_1, y0_1, x1_1, y1_1 = bbox1
    x0_2, y0_2, x1_2, y1_2 = bbox2
    return not (x1_1 < x0_2 or x0_1 > x1_2 or y1_1 < y0_2 or y0_1 > y1_2)

def is_scanned_image(image):
    """Check if an image contains text that can be extracted with OCR"""
    text = pytesseract.image_to_string(image)
    return bool(text.strip())

def extract_tables(pdf_path, page_num, output_dir):
    """Extract tables from a PDF page"""
    table_dataframes = []
    table_areas = []

    with pdfplumber.open(pdf_path) as pdf:
        try:
            tables = pdf.pages[page_num].extract_tables()
            if tables:
                for table_index, table in enumerate(tables):
                    if len(table) > 1 and not all(is_row_empty(row) for row in table):
                        table_path = os.path.join(output_dir, f"page_{page_num + 1}_table{table_index + 1}.csv")
                        with open(table_path, mode='w', newline='', encoding='utf-8') as csv_file:
                            writer = csv.writer(csv_file)
                            for row in table:
                                cleaned_row = [clean_text(cell) for cell in row]
                                writer.writerow(cleaned_row)
                        df = pd.read_csv(table_path)
                        df_str = tabulate(df, headers='keys', tablefmt='grid', showindex=False)
                        table_dataframes.append(df_str)
                        table_bbox = pdf.pages[page_num].find_tables()[table_index].bbox
                        table_areas.append(table_bbox)
        except Exception as e:
            print(f"Error extracting tables from page {page_num}: {e}")

    return table_dataframes, table_areas

def extract_image_text_from_pdf_page(pdf_path, page_num):
    """Extract text from a PDF page using OCR"""
    try:
        images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1, poppler_path=POPPLER_PATH)
        image_text = ""
        for image in images:
            if is_scanned_image(image):
                image_text = pytesseract.image_to_string(image)
        return image_text
    except Exception as e:
        print(f"Error extracting image text from page {page_num}: {e}")
        return ""

def save_report_as_pdf(report_text, pdf_path):
    """Save the extracted content as a PDF report"""
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    lines = report_text.split("\n")

    y = height - 40
    for line in lines:
        if y < 40:
            c.showPage()
            y = height - 40
        c.drawString(40, y, line)
        y -= 12
    c.save()

def extract_contents_from_pdf(pdf_path, output_dir, report_pdf_path):
    """Process the PDF and extract text, tables, and images"""
    print(f"Starting OCR processing on {pdf_path}")
    doc = fitz.open(pdf_path)
    os.makedirs(output_dir, exist_ok=True)
    total_pages = doc.page_count
    full_report = f"OCR Processing Report\n{'='*50}\n\n"
    
    def process_page(page_num):
        print(f"Processing page {page_num + 1} of {total_pages}")
        page = doc.load_page(page_num)
        table_dataframes, table_areas = extract_tables(pdf_path, page_num, output_dir)
        extracted_text = page.get_text("blocks")
        text = ""

        for block in extracted_text:
            bbox = block[:4]
            block_text = block[4]
            if not any(intersect_areas(bbox, table_bbox) for table_bbox in table_areas):
                text += block_text

        if not text.strip():
            print(f"Text not detected on page {page_num + 1}, processing as image...")
            text = extract_image_text_from_pdf_page(pdf_path, page_num)

        page_content = f"Page {page_num + 1}:\n{text}"
        if table_dataframes:
            page_content += "\n" + "\n".join(table_dataframes)
        else:
            page_content += "\nNo tables detected on this page."
        
        return page_content

    with ThreadPoolExecutor() as thread_executor:
        page_futures = [thread_executor.submit(process_page, page_num) for page_num in range(total_pages)]
        for future in page_futures:
            full_report += future.result() + "\n" + "="*40 + "\n"

    save_report_as_pdf(full_report, report_pdf_path)
    print(f"OCR report saved to {report_pdf_path}")
    doc.close()
    return report_pdf_path  # Return the path to the OCR processed PDF

UPLOAD_FOLDER = tempfile.mkdtemp()
OUTPUT_FOLDER = "output"  # Changed to a permanent directory
os.makedirs(OUTPUT_FOLDER, exist_ok=True)  # Create the directory if it doesn't exist
POPPLER_PATH = r"E:\Hacknovate\Question_Paper_Generator\pdf_extractor\poppler-24.08.0\bin"  # Adjust as needed
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Adjust as needed


@app.post("/process_pdf", summary="Process a split PDF with OCR")
async def process_pdf(pdf: UploadFile = File(...)):
    """
    Process a PDF file that has been split by the Node.js backend.
    
    This endpoint:
    1. Receives a PDF file
    2. Extracts text using PyMuPDF
    3. Extracts tables using pdfplumber
    4. Performs OCR on image-based content using pytesseract
    5. Returns a processed PDF with all extracted content
    """
    try:
        print(f"Received PDF: {pdf.filename}")
        
        # Create a temporary file to store the uploaded PDF
        temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", dir=UPLOAD_FOLDER)
        temp_pdf_path = temp_pdf.name
        temp_pdf.close()
        
        # Save the uploaded file
        with open(temp_pdf_path, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)
        
        # Output directories
        output_dir = os.path.join(OUTPUT_FOLDER, "csv_output")
        os.makedirs(output_dir, exist_ok=True)
        
        # Process the PDF and create a report
        report_pdf_path = os.path.join(OUTPUT_FOLDER, f"ocr_processed_{os.path.basename(pdf.filename)}")
        ocr_pdf_path = extract_contents_from_pdf(temp_pdf_path, output_dir, report_pdf_path) # Get the OCR PDF path
        
        # Define the output text file paths
        insights_output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(os.path.basename(pdf.filename))[0]}_insights.txt")
        compressed_output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(os.path.basename(pdf.filename))[0]}_compressed.txt")
        print("-----------------")
        print(insights_output_path)
    


        # Call the summariser script and capture its output
        try:
            summarizer_process = subprocess.run(
                ["python", "e:\\Hacknovate\\Question_Paper_Generator\\pdf_extractor\\summarise.py",
                 ocr_pdf_path, insights_output_path, compressed_output_path],
                check=True,
                
                capture_output=True,
                text=True
            )
            print(f"Summarisation complete.")
        except subprocess.CalledProcessError as e:
            print(f"Error running summarisation script: {e.stderr}")
            raise HTTPException(status_code=500, detail=f"Summarisation failed: {e.stderr}")
        
        # Call the question generator script, passing the summarized text as input
        try:
            # with open(compressed_output_path, "r", encoding="utf-8") as compressed_file:
            #     compressed_text = compressed_file.read()
            
            print("------",insights_output_path)
            question_generator_process = subprocess.run(
                ["python", "e:\\Hacknovate\\Question_Paper_Generator\\question_generator\\run_qg.py",
                 "--text_file", insights_output_path,  # Read from stdin
                 "--num_questions", "25",
                 "--answer_style", "multiple_choice"],
                #input=compressed_text,  # Pass summarized text as input
                check=True,
                capture_output=True,
                text=True
            )
            question_generator_output = question_generator_process.stdout
            print(f"Question generation complete.")
            # Save the question generator output to a file
            questions_output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(os.path.basename(pdf.filename))[0]}_questions.txt")
            with open(questions_output_path, "w", encoding="utf-8") as f:
                f.write(question_generator_output)
            print(f"Questions saved to {questions_output_path}")
            FRONTEND_PUBLIC_FOLDER = "e:\\Hacknovate\\Question_Paper_Generator\\frontend\\public"
            frontend_questions_output_path = os.path.join(FRONTEND_PUBLIC_FOLDER, "ques.txt")
            shutil.copy(questions_output_path, frontend_questions_output_path)

            print(f"Questions also saved to {frontend_questions_output_path}")
        except subprocess.CalledProcessError as e:
            print(f"Error running question generator script: {e.stderr}")
            raise HTTPException(status_code=500, detail=f"Question generation failed: {e.stderr}")
        # After question generation and before returning FileResponse
        # try:
        #     # with open(questions_output_path, "w", encoding="utf-8") as f:
        #     #     f.write(question_generator_output)
        #     # Generate PDFs from questions
        #     print("Generating question paper PDFs...")
        #     print("------",questions_output_path)
        #     pdf_generator_process = subprocess.run(
        #         ["python", "e:\\Hacknovate\\Question_Paper_Generator\\question_generator\\qa_pdf_generator_enhanced.py",
        #          "--input_file", questions_output_path,
        #          "--output_file", os.path.join(OUTPUT_FOLDER, 
        #             f"{os.path.splitext(os.path.basename(pdf.filename))[0]}_exam.pdf")],
        #         check=True,
        #         capture_output=True,
        #         text=True,
        #         encoding='utf-8'
        #     )
        #     print("Question PDFs generated successfully")
        #     # Optional: Copy PDFs to frontend public folder if needed
        #     FRONTEND_PUBLIC_FOLDER = "e:\\Hacknovate\\Question_Paper_Generator\\frontend\\public"
        #     exam_base = os.path.splitext(os.path.basename(pdf.filename))[0]
        #     shutil.copy(
        #         os.path.join(OUTPUT_FOLDER, f"{exam_base}_exam_with_answers.pdf"),
        #         os.path.join(FRONTEND_PUBLIC_FOLDER, "exam_with_answers.pdf")
        #     )
        #     shutil.copy(
        #         os.path.join(OUTPUT_FOLDER, f"{exam_base}_exam_without_answers.pdf"),
        #         os.path.join(FRONTEND_PUBLIC_FOLDER, "exam_without_answers.pdf")
        #     )
        # except subprocess.CalledProcessError as e:
        #     print(f"Error generating PDFs: {e.stderr}")
        #     # Still return OCR report if PDF generation fails
        #     return FileResponse(
        #         report_pdf_path,
        #         media_type="application/pdf",
        #         filename=f"ocr_processed_{os.path.basename(pdf.filename)}"
        #     )
        # Replace all the PDF generation attempts with this single block
        try:
            print("Generating question paper PDFs...")
            input_file = "E:\\Hacknovate\\Question_Paper_Generator\\frontend\\public\\ques.txt"
            output_base = os.path.join(OUTPUT_FOLDER, 
                f"{os.path.splitext(os.path.basename(pdf.filename))[0]}_exam")
            
            # Single PDF generation call
            pdf_generator_process = subprocess.run([
                "python",
                "e:\\Hacknovate\\Question_Paper_Generator\\question_generator\\qa_pdf_generator_enhanced.py",
                "--input_file", input_file,
                "--output_file", f"{output_base}.pdf"
            ], check=True, capture_output=True, text=True, encoding='utf-8')
            
            if pdf_generator_process.returncode == 0:
                print("Question PDFs generated successfully")
                
                # Verify and copy PDFs to frontend
                with_answers = f"{output_base}_with_answers.pdf"
                without_answers = f"{output_base}_without_answers.pdf"
                
                if os.path.exists(with_answers) and os.path.exists(without_answers):
                    # Copy to frontend public folder
                    FRONTEND_PUBLIC_FOLDER = "e:\\Hacknovate\\Question_Paper_Generator\\frontend\\public"
                    shutil.copy(with_answers, os.path.join(FRONTEND_PUBLIC_FOLDER, "exam_with_answers.pdf"))
                    shutil.copy(without_answers, os.path.join(FRONTEND_PUBLIC_FOLDER, "exam_without_answers.pdf"))
                    print("PDFs copied to frontend public folder")
                else:
                    print("PDFs were not created successfully")
            else:
                print(f"Error in PDF generation: {pdf_generator_process.stderr}")

        except Exception as e:
            print(f"Error generating PDFs: {str(e)}")
            # Fall back to returning just the OCR report
            return FileResponse(
                report_pdf_path,
                media_type="application/pdf",
                filename=f"ocr_processed_{os.path.basename(pdf.filename)}"
            )
        # Return the processed PDF report
        return FileResponse(
            report_pdf_path, 
            media_type="application/pdf",
            filename=f"ocr_processed_{os.path.basename(pdf.filename)}"
        )
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

@app.on_event("shutdown")
def cleanup_temp_dirs():
    """Clean up temporary directories on shutdown"""
    try:
        shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
        shutil.rmtree(OUTPUT_FOLDER, ignore_errors=True)
    except Exception as e:
        print(f"Error cleaning up temporary directories: {e}")

if __name__ == "__main__":
    print("Starting PDF OCR Processing API")
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)

# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.responses import JSONResponse
# import os
# import tempfile
# import shutil
# import fitz  # PyMuPDF
# import pdfplumber
# import re
# import csv
# import pandas as pd
# from tabulate import tabulate
# from pdf2image import convert_from_path
# import pytesseract
# from concurrent.futures import ThreadPoolExecutor
# import uvicorn
# import google.generativeai as genai
# import json

# app = FastAPI(title="PDF OCR and Summarization API", description="API for OCR processing and summarization of PDF documents")
# from fastapi.middleware.cors import CORSMiddleware

# # Allow requests from frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure paths - adjust these to match your environment
# UPLOAD_FOLDER = tempfile.mkdtemp()
# OUTPUT_FOLDER = "output"
# POPPLER_PATH = r"E:\Hacknovate\Question_Paper_Generator\pdf_extractor\poppler-24.08.0\bin"  # Adjust as needed
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Adjust as needed

# # Configure Gemini API
# genai.configure(api_key="AIzaSyBN1ply0vEg4zTRMCTBM4DFRyjNmh2PrYU")

# def save_summary_to_txt(summary_data, filename):
#     """Saves the summary data to a formatted text file."""
#     filepath = os.path.join(OUTPUT_FOLDER, f"{filename}.txt")
#     with open(filepath, 'w', encoding='utf-8') as f:
#         f.write("Summary Data:\n")
#         f.write("=============\n\n")

#         f.write("Insights:\n")
#         f.write("---------\n")
#         for section, content in summary_data["insights"].items():
#             f.write(f"  {section.replace('_', ' ').title()}:\n")
#             if content:
#                 for item in content:
#                     f.write(f"    - {item}\n")
#             else:
#                 f.write("    No data\n")
#             f.write("\n")

#         f.write("\nCode Snippets:\n")
#         f.write("--------------\n")
#         if summary_data["code_snippets"]:
#             for snippet in summary_data["code_snippets"]:
#                 f.write(f"  ID: {snippet['id']}\n")
#                 f.write(f"  Category: {snippet['category']}\n")
#                 f.write("  Code:\n")
#                 f.write(snippet['code'])
#                 f.write("\n\n")
#         else:
#             f.write("  No code snippets found.\n")
#     return filepath


# def clean_text(text):
#     """Clean text by removing unnecessary spaces and newlines"""
#     if text is None:
#         return ""
#     text = re.sub(r'[\n\r\t]+', ' ', text)
#     text = re.sub(r'\s+', ' ', text).strip()
#     return text

# def is_row_empty(row):
#     """Check if a table row is empty"""
#     return all(cell is None or cell.strip() == '' for cell in row)

# def intersect_areas(bbox1, bbox2):
#     """Check if two bounding boxes intersect"""
#     x0_1, y0_1, x1_1, y1_1 = bbox1
#     x0_2, y0_2, x1_2, y1_2 = bbox2
#     return not (x1_1 < x0_2 or x0_1 > x1_2 or y1_1 < y0_2 or y0_1 > y1_2)

# def is_scanned_image(image):
#     """Check if an image contains text that can be extracted with OCR"""
#     text = pytesseract.image_to_string(image)
#     return bool(text.strip())

# def extract_tables(pdf_path, page_num):
#     """Extract tables from a PDF page"""
#     table_data = []
#     table_areas = []

#     with pdfplumber.open(pdf_path) as pdf:
#         try:
#             tables = pdf.pages[page_num].extract_tables()
#             if tables:
#                 for table_index, table in enumerate(tables):
#                     if len(table) > 1 and not all(is_row_empty(row) for row in table):
#                         # Clean table data
#                         cleaned_table = []
#                         for row in table:
#                             cleaned_row = [clean_text(cell) for cell in row]
#                             cleaned_table.append(cleaned_row)
                        
#                         # Convert to DataFrame for easy JSON serialization
#                         df = pd.DataFrame(cleaned_table[1:], columns=cleaned_table[0] if cleaned_table else None)
#                         table_data.append(df.to_dict(orient='records'))
                        
#                         # Store table bounding box
#                         table_bbox = pdf.pages[page_num].find_tables()[table_index].bbox
#                         table_areas.append(table_bbox)
#         except Exception as e:
#             print(f"Error extracting tables from page {page_num}: {e}")

#     return table_data, table_areas

# def extract_image_text_from_pdf_page(pdf_path, page_num):
#     """Extract text from a PDF page using OCR"""
#     try:
#         images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1, poppler_path=POPPLER_PATH)
#         image_text = ""
#         for image in images:
#             if is_scanned_image(image):
#                 image_text = pytesseract.image_to_string(image)
#         return image_text
#     except Exception as e:
#         print(f"Error extracting image text from page {page_num}: {e}")
#         return ""

# def extract_contents_from_pdf(pdf_path):
#     """Process the PDF and extract text, tables, and images"""
#     print(f"Starting OCR processing on {pdf_path}")
#     doc = fitz.open(pdf_path)
#     total_pages = doc.page_count
    
#     # Prepare structure for storing all extracted data
#     extracted_data = {
#         "pages": [],
#         "full_text": ""
#     }
    
#     def process_page(page_num):
#         print(f"Processing page {page_num + 1} of {total_pages}")
#         page = doc.load_page(page_num)
#         table_data, table_areas = extract_tables(pdf_path, page_num)
#         extracted_text_blocks = page.get_text("blocks")
        
#         page_text = ""
#         for block in extracted_text_blocks:
#             bbox = block[:4]
#             block_text = block[4]
#             if not any(intersect_areas(bbox, table_bbox) for table_bbox in table_areas):
#                 page_text += block_text

#         # If no text is detected, try OCR
#         if not page_text.strip():
#             print(f"Text not detected on page {page_num + 1}, processing as image...")
#             page_text = extract_image_text_from_pdf_page(pdf_path, page_num)

#         # Create page data structure
#         page_data = {
#             "page_number": page_num + 1,
#             "text": page_text,
#             "tables": table_data,
#         }
        
#         return page_data, page_text

#     with ThreadPoolExecutor() as thread_executor:
#         page_futures = [thread_executor.submit(process_page, page_num) for page_num in range(total_pages)]
#         for future in page_futures:
#             page_data, page_text = future.result()
#             extracted_data["pages"].append(page_data)
#             extracted_data["full_text"] += page_text + "\n"

#     doc.close()
#     return extracted_data

# def extract_code_snippets(text):
#     """Detects and extracts code snippets from the text."""
#     code_snippets = []
    
#     # Detect code written in proper ``` format
#     formatted_code_blocks = re.findall(r"```(.*?)```", text, re.DOTALL)
#     code_snippets.extend(formatted_code_blocks)

#     # Detect Python-style functions, loops, and indented blocks
#     indented_code_blocks = re.findall(r"(?:(?:def|class|for|while|if|elif|else|try|except|import)[^\n]*\n(?:\s{4,}.*\n*)+)", text)
#     code_snippets.extend(indented_code_blocks)

#     return code_snippets

# def categorize_code_snippets(code_snippets):
#     """Categorizes code snippets as 5-mark or 10-mark questions."""
#     categorized_codes = []
    
#     for code in code_snippets:
#         lines = code.count("\n") + 1
#         if lines < 10:
#             category = "5-mark question (Short Code Snippet)"
#         else:
#             category = "10-mark question (Detailed Code Block)"
        
#         categorized_codes.append({"code": code, "category": category})
    
#     return categorized_codes

# def extract_core_insights(text):
#     """Extracts key insights from the text for question generation using Gemini 1.5 Flash."""
#     model = genai.GenerativeModel("gemini-1.5-flash")
#     prompt = (
#     "You are an expert in academic content analysis, tasked with extracting the most crucial insights for question paper generation. "
#     "Your response should be **structured, concise, and focused** on essential details..... "
#     "Strictly **avoid general overviews** and instead extract key academic elements, including:\n\n"
#     "**1. Key Concepts & Definitions:** Clearly define important terms and principles.\n"
#     "**2. Important Facts & Figures:** Highlight any numerical data, statistics, or critical points.\n"
#     "**3. Critical Explanations:** Extract detailed explanations of key topics.\n"
#     "**4. Important Dates, Events, or Formulas:** Identify historical dates, events, and significant formulas relevant to the subject.\n\n"
#     "### Content for Analysis:\n"
#     f"{text}\n\n"
#     "### Expected Output Format:\n"
#     "- **Concepts & Definitions:**\n"
#     "- **Facts & Figures:**\n"
#     "- **Explanations:**\n"
#     "- **Dates, Events & Formulas:**\n\n"
#     "Ensure the extracted content is **precise**, **well-structured**, and **ready to be used for academic assessments**."
#     )

#     response = model.generate_content(prompt)
#     return response.text if response else "Failed to extract insights."

# def summarize_pdf_content(text):
#     """Summarizes the PDF content by extracting insights and code snippets."""
#     # Extract and categorize code snippets
#     code_snippets = extract_code_snippets(text)
#     categorized_codes = categorize_code_snippets(code_snippets)

#     # Extract core insights
#     insights = extract_core_insights(text)
    
#     # Parse the insights into structured format
#     structured_insights = {}
#     current_section = None
    
#     for line in insights.split('\n'):
#         line = line.strip()
#         if not line:
#             continue
            
#         # Check for section headers
#         if line.startswith('**Concepts & Definitions:**') or line.startswith('- **Concepts & Definitions:**'):
#             current_section = "concepts_definitions"
#             structured_insights[current_section] = []
#         elif line.startswith('**Facts & Figures:**') or line.startswith('- **Facts & Figures:**'):
#             current_section = "facts_figures"
#             structured_insights[current_section] = []
#         elif line.startswith('**Explanations:**') or line.startswith('- **Explanations:**'):
#             current_section = "explanations"
#             structured_insights[current_section] = []
#         elif line.startswith('**Dates, Events & Formulas:**') or line.startswith('- **Dates, Events & Formulas:**'):
#             current_section = "dates_events_formulas"
#             structured_insights[current_section] = []
#         # Add content to current section
#         elif current_section and line.startswith('- '):
#             structured_insights[current_section].append(line[2:])  # Remove the bullet point
#         elif current_section:
#             structured_insights[current_section].append(line)
    
#     # Format categorized code snippets
#     formatted_code_snippets = []
#     for i, item in enumerate(categorized_codes):
#         formatted_code_snippets.append({
#             "id": i + 1,
#             "code": item["code"],
#             "category": item["category"]
#         })
    
#     summary_data = {
#         "insights": structured_insights,
#         "code_snippets": formatted_code_snippets
#     }
    
#     return summary_data

# @app.post("/process_pdf", summary="Process a PDF with OCR and summarization")
# async def process_pdf(pdf: UploadFile = File(...)):
#     """
#     Process a PDF file with OCR and summarization.
    
#     This endpoint:
#     1. Receives a PDF file
#     2. Extracts text using PyMuPDF
#     3. Extracts tables using pdfplumber
#     4. Performs OCR on image-based content using pytesseract
#     5. Summarizes the content using AI to extract core insights
#     6. Identifies and categorizes code snippets
#     7. Returns the processed data directly in the response
#     """
#     try:
#         print(f"Received PDF: {pdf.filename}")
        
#         # Create a temporary file to store the uploaded PDF
#         temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", dir=UPLOAD_FOLDER)
#         temp_pdf_path = temp_pdf.name
#         temp_pdf.close()
        
#         # Save the uploaded file
#         with open(temp_pdf_path, "wb") as buffer:
#             shutil.copyfileobj(pdf.file, buffer)
        
#         # Extract content from PDF
#         extracted_data = extract_contents_from_pdf(temp_pdf_path)
        
#         # Summarize the extracted content
#         summary_data = summarize_pdf_content(extracted_data["full_text"])
        
#         # Save summary data to a text file
#         txt_filepath = save_summary_to_txt(summary_data, os.path.splitext(pdf.filename)[0])
#         print(f"Summary saved to {txt_filepath}")
        
#         # Combine extracted data and summary into a single response
#         response_data = {
#             "filename": pdf.filename,
#             "page_count": len(extracted_data["pages"]),
#             "ocr_data": {
#                 "pages": extracted_data["pages"]
#             },
#             "summary": summary_data
#         }
        
#         return JSONResponse(content=response_data)
    
#     except Exception as e:
#         print(f"Error processing PDF: {e}")
#         raise HTTPException(status_code=500, detail=str(e))
    
#     finally:
#         # Clean up the temporary file
#         if os.path.exists(temp_pdf_path):
#             os.remove(temp_pdf_path)

# @app.on_event("shutdown")
# def cleanup_temp_dirs():
#     """Clean up temporary directories on shutdown"""
#     try:
#         shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
#     except Exception as e:
#         print(f"Error cleaning up temporary directories: {e}")

# if __name__ == "__main__":
#     print("Starting PDF OCR Processing and Summarization API")
#     uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)