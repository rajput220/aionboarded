import sys
import xml.etree.ElementTree as ET

def extract_text(xml_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        texts = []
        for elem in root.iter():
            if elem.tag.endswith('}t'):
                if elem.text:
                    texts.append(elem.text)
        return ' '.join(texts)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    print(extract_text(sys.argv[1]))
