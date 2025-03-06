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

app = FastAPI(title="PDF OCR API", description="API for OCR processing of PDF documents")
from fastapi.middleware.cors import CORSMiddleware

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
    return report_pdf_path
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
        extract_contents_from_pdf(temp_pdf_path, output_dir, report_pdf_path)
        
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