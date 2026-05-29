import os
from PyPDF2 import PdfReader

PDF_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Business_Lab_Participant_Task_Catalogue_and_Operational_Guidelines.pdf")
_cached_text = None

def get_catalogue_text() -> str:
    global _cached_text
    if _cached_text is not None:
        return _cached_text
    
    if not os.path.exists(PDF_PATH):
        return "Task Catalogue PDF not found."
    
    try:
        reader = PdfReader(PDF_PATH)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        _cached_text = text
        return _cached_text
    except Exception as e:
        return f"Error extracting catalogue: {str(e)}"
