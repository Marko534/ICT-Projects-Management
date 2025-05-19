import os
import time
import PyPDF2
from openai import OpenAI
import json
from django.conf import settings
from documents.models import Document
from .models import Flashcard

# Configure OpenAI API
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file"""
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n\n"
    return text


def generate_flashcards(document_id, num_cards=10, difficulty='medium'):
    """Generate flashcards from a document using OpenAI API"""
    document = Document.objects.get(id=document_id)

    # Extract text from the PDF
    pdf_path = document.file_path.path
    document_text = extract_text_from_pdf(pdf_path)

    # Prepare prompt for OpenAI
    prompt = f"""
    Create {num_cards} flashcards from the following text.
    Each flashcard should have a question and answer format.
    Make the difficulty {difficulty} (not too easy, not too hard).

    Format the output as a JSON array with objects containing 'question' and 'answer' fields.

    Text:
    {document_text[:4000]}  # Limit text to avoid token limits
    """

    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
            "content": "You are an educational assistant that creates high-quality flashcards for students."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500,
        temperature=0.7
    )

    content = response.choices[0].message.content

    # Extract JSON from response
    try:
        # Clean up the response to extract just the JSON part
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        flashcards_data = json.loads(content)

        # Create flashcards in database
        created_flashcards = []
        for fc_data in flashcards_data:
            flashcard = Flashcard.objects.create(
                document=document,
                question=fc_data['question'],
                answer=fc_data['answer'],
                difficulty=difficulty
            )
            created_flashcards.append(flashcard)

        return created_flashcards

    except Exception as e:
        print(f"Error parsing OpenAI response: {e}")
        return []
