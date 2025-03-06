import fitz #from PyMupdf help to read pdf and handle pages
import pdfplumber #helps in table extraction
import os
import csv
import re
import pandas as pd
from tabulate import tabulate
from pdf2image import convert_from_path
import pytesseract #helps to extract content from the image 
from PIL import Image
from reportlab.lib.pagesizes import letter 
from reportlab.pdfgen import canvas #helps in generating the final report 
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def clean_text(text): #this function is to remove unnecessary spaces like newline, tag spaces etc..
    if text is None:
        return ""
    text = re.sub(r'[\n\r\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def is_row_empty(row): #this function help when a table is identified to check whether the identified table is empty or not 
    return all(cell is None or cell.strip() == '' for cell in row)

def intersect_areas(bbox1, bbox2):
    x0_1, y0_1, x1_1, y1_1 = bbox1 #to avoid overlapping of the content textbox coordinates and tableareas coordinates are tested here and thus repeates box coordinates are not included
    x0_2, y0_2, x1_2, y1_2 = bbox2 
    return not (x1_1 < x0_2 or x0_1 > x1_2 or y1_1 < y0_2 or y0_1 > y1_2)

def is_scanned_image(image):
    text = pytesseract.image_to_string(image) #if Scanned image then contents are extracted using this function
    return bool(text.strip())

# Parallelize table extraction with threading (I/O-bound)
def extract_tables(pdf_path, page_num, output_dir):
    table_dataframes = []
    table_areas = []

    with pdfplumber.open(pdf_path) as pdf:
        tables = pdf.pages[page_num].extract_tables()
        if tables:
            for table_index, table in enumerate(tables):
                if len(table) > 1 and not all(is_row_empty(row) for row in table):
                    table_path = os.path.join(output_dir, f"page_{page_num + 1}_table{table_index + 1}.csv")
                    with open(table_path, mode='w', newline='', encoding='utf-8') as csv_file: #this is used to save table data in the form of csv
                        writer = csv.writer(csv_file)
                        for row in table:
                            cleaned_row = [clean_text(cell) for cell in row] #cleans each row from extra spaces,newline
                            writer.writerow(cleaned_row)
                    df = pd.read_csv(table_path)     
                    df_str = tabulate(df, headers='keys', tablefmt='grid', showindex=False) #this is to store table contents as text in grid format            
                    table_dataframes.append(df_str)
                    table_bbox = pdf.pages[page_num].find_tables()[table_index].bbox #this stores the coordinates of tabledataframes
                    table_areas.append(table_bbox) 

    return table_dataframes, table_areas

# Parallelize OCR (CPU-bound) with multiprocessing
def extract_image_text_from_pdf_page(pdf_path, page_num):
    poppler_path = r"D:\hacknovate\poppler-24.08.0\Library\bin"  # Ensure this is the correct path
    images = convert_from_path(pdf_path, first_page=page_num+1, last_page=page_num+1, poppler_path=poppler_path)#send to this function considering it as scanned image and the content is extracted
    image_text = ""
    for image in images:
        if is_scanned_image(image):
            image_text = pytesseract.image_to_string(image)
    return image_text

def save_report_as_pdf(report_text, pdf_path):
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter #this function defines the overall look of the report this uses canvas method which includes alignment and margins of the report 
    lines = report_text.split("\n")

    y = height - 40
    for line in lines:
        if y < 40: #formatting image margins
            c.showPage()
            y = height - 40
        c.drawString(40, y, line)
        y -= 12  
    c.save()

#function where the extarction process starts
def extract_contents_from_pdf(pdf_path, output_dir, report_pdf_path):
    doc = fitz.open(pdf_path) #this helps to access the individual pdfs 
    os.makedirs(output_dir, exist_ok=True) #creation of output directory for csv files
    pages_content = {}
    total_pages = doc.page_count #takes page count
    full_report = ""
    
    def process_page(page_num): #individual pages are loaded 
        page = doc.load_page(page_num)
        table_dataframes, table_areas = extract_tables(pdf_path, page_num, output_dir)
        extracted_text = page.get_text("blocks") #this methods helps us to get the text content from the page along with their coordinates from 0-3 their will be
        text = "" #coordinates(50,100,200,100) and at 4 our text content will be their similarly("This is the introduction")

        for block in extracted_text:
            bbox = block[:4] #this helps to check for overllapping of text content in the report where bbox contains the coordinates of the textblock 
            block_text = block[4] #and table_bbox conatins the coordinates of the tables this is taken from the table areas data frame
            if not any(intersect_areas(bbox, table_bbox) for table_bbox in table_areas):
                text += block_text

        if not text.strip():
            print(f"Text not detected on page {page_num + 1}, processing as image...")
            text = extract_image_text_from_pdf_page(pdf_path, page_num)

        page_content = f"Page {page_num + 1}:\n{text}" #pagecontent contains the pageno and the text and then if the page contains the table its is also added
        if table_dataframes:
            page_content += "\n" + "\n".join(table_dataframes)
        else:
            page_content += "\nNo tables detected on this page."
        
        return page_content

    with ThreadPoolExecutor() as thread_executor, ProcessPoolExecutor() as process_executor:
        # Use threading for reading/writing (I/O) and multiprocessing for OCR (CPU-bound)
        page_futures = [thread_executor.submit(process_page, page_num) for page_num in range(total_pages)]
        for future in page_futures: #this helps to add the contents to the report
            full_report += future.result() + "\n" + "="*40 + "\n"

    save_report_as_pdf(full_report, report_pdf_path)
    print(f"Report saved to {report_pdf_path}")
    doc.close()

pdf_path = r"D:\hacknovate\Question_Paper_Generator\pdf_extractor\unit1.pdf" #defines the path of the input pdf
output_dir = r"D:\hacknovate\Question_Paper_Generator\pdf_extractor" #defines the path of the directory where the extracted table should be stored in csv format
report_pdf_path = r"D:\hacknovate\Question_Paper_Generator\pdf_extractor\dl.pdf" #defines the path of the report pdf

# Run the extraction
extract_contents_from_pdf(pdf_path, output_dir, report_pdf_path)