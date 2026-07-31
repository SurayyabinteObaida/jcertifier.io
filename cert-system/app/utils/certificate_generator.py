import uuid
import os
from io import BytesIO
from fpdf import FPDF
import qrcode

TEMPLATES = {
    "classic": {
        "name": "Classic Blue",
        "border": (52, 102, 204),
        "title_color": (30, 60, 150),
        "text_color": (33, 33, 33),
        "accent": (52, 102, 204),
        "title_text": "Certificate of Achievement",
    },
    "elegant": {
        "name": "Elegant Gold",
        "border": (180, 140, 60),
        "title_color": (120, 80, 20),
        "text_color": (50, 50, 50),
        "accent": (180, 140, 60),
        "title_text": "Certificate of Excellence",
    },
    "modern": {
        "name": "Modern Teal",
        "border": (0, 150, 136),
        "title_color": (0, 120, 108),
        "text_color": (40, 40, 40),
        "accent": (0, 150, 136),
        "title_text": "Certificate of Completion",
    },
}

class CertificateGenerator:
    def __init__(self, output_dir: str = "/var/data"):
        self.output_dir = output_dir
        os.makedirs(f"{output_dir}/certificates", exist_ok=True)

    def generate_token(self) -> str:
        return str(uuid.uuid4()).replace("-", "")[:32]

    def create_qr_file(self, verify_url: str, token: str) -> str:
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=2)
        qr.add_data(verify_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        token_dir = os.path.join(self.output_dir, "certificates", token[:8])
        os.makedirs(token_dir, exist_ok=True)
        qr_path = os.path.join(token_dir, f"{token}_qr.png")
        img.save(qr_path)
        return qr_path

    def generate_pdf(self, name, event_name, event_date, organization, authority, authority_name, verify_url, token, template_key="classic"):
        palette = TEMPLATES.get(template_key, TEMPLATES["classic"])
        pdf = FPDF(orientation='L', unit='mm', format='A4')
        pdf.add_page()

        border = palette["border"]
        title_color = palette["title_color"]
        text_color = palette["text_color"]
        accent = palette["accent"]

        # Outer border
        pdf.set_draw_color(*border)
        pdf.set_line_width(1.2)
        pdf.rect(8, 8, 281, 194)
        # Inner border
        pdf.set_line_width(0.3)
        pdf.rect(12, 12, 273, 186)

        # Corner accents
        pdf.set_fill_color(*accent)
        for cx, cy in [(12, 12), (285, 12), (12, 198), (285, 198)]:
            pdf.rect(cx - 2, cy - 2, 4, 4, 'F')

        # Title
        pdf.set_text_color(*title_color)
        pdf.set_font("Helvetica", "B", 36)
        pdf.set_y(30)
        pdf.cell(0, 18, palette["title_text"], ln=True, align="C")

        # Decorative line
        pdf.set_draw_color(*accent)
        pdf.set_line_width(0.5)
        mid = 148.5
        pdf.line(mid - 80, 55, mid + 80, 55)

        # Subtitle
        pdf.set_text_color(*text_color)
        pdf.set_font("Helvetica", "", 13)
        pdf.set_y(62)
        pdf.cell(0, 10, "This is to certify that", ln=True, align="C")

        # Participant name
        pdf.set_text_color(*title_color)
        pdf.set_font("Helvetica", "B", 26)
        pdf.set_y(78)
        pdf.cell(0, 16, name, ln=True, align="C")

        # Underline under name
        name_width = pdf.get_string_width(name)
        pdf.set_draw_color(*accent)
        pdf.set_line_width(0.3)
        pdf.line(mid - name_width/2 - 5, 96, mid + name_width/2 + 5, 96)

        # Completion text
        pdf.set_text_color(*text_color)
        pdf.set_font("Helvetica", "", 13)
        pdf.set_y(102)
        pdf.cell(0, 10, "has successfully participated in", ln=True, align="C")

        # Event name
        pdf.set_text_color(*title_color)
        pdf.set_font("Helvetica", "B", 20)
        pdf.set_y(116)
        pdf.cell(0, 14, event_name, ln=True, align="C")

        # Date and org
        pdf.set_text_color(*text_color)
        pdf.set_font("Helvetica", "", 11)
        pdf.set_y(136)
        pdf.cell(0, 7, f"Date: {event_date}    |    Organization: {organization}", ln=True, align="C")

        # Signature
        sig_y = 165
        pdf.set_draw_color(*text_color)
        pdf.set_line_width(0.3)
        pdf.line(50, sig_y, 130, sig_y)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_xy(50, sig_y + 2)
        pdf.cell(80, 6, authority_name, align="C")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_xy(50, sig_y + 8)
        pdf.cell(80, 5, authority, align="C")

        # QR Code
        qr_path = self.create_qr_file(verify_url, token)
        pdf.image(qr_path, x=230, y=150, w=40, h=40)
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(120, 120, 120)
        pdf.text(232, 195, f"Verify: {token[:24]}...")

        # Bottom URL
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(150, 150, 150)
        pdf.text(12, 205, f"Verification: {verify_url}")

        token_dir = os.path.join(self.output_dir, "certificates", token[:8])
        os.makedirs(token_dir, exist_ok=True)
        pdf_path = os.path.join(token_dir, f"{token}.pdf")
        pdf.output(pdf_path)
        return pdf_path

    def generate_image(self, name, event_name, event_date, organization, authority, authority_name, verify_url, token, template_key="classic"):
        return self.generate_pdf(name, event_name, event_date, organization, authority, authority_name, verify_url, token, template_key)
