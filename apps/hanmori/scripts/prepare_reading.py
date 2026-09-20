"""Render the inspected edition of the reading PDFs for local Korean OCR.
Requires PyMuPDF. Does not upload documents or overwrite existing OCR results.
"""
import argparse, hashlib, json
from pathlib import Path
import pymupdf

APP = Path(__file__).resolve().parents[1]
EXAMS = [35,36,37,41,47,52,60,64]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--source',required=True)
    parser.add_argument('--cache',required=True)
    args=parser.parse_args()
    source=Path(args.source);cache=Path(args.cache)
    catalog=json.loads((APP/'src/content/reading-catalog.json').read_text(encoding='utf-8'))
    expected={s['file']:s['sha256'] for s in catalog['sources']}
    files=sorted(source.glob('*.pdf'))
    if set(f.name for f in files)!=set(expected):
        raise ValueError('Source filenames differ from the inspected edition; review the mapping before importing.')
    (cache/'pages').mkdir(parents=True,exist_ok=True)
    rows=[]
    for fi,file in enumerate(files):
        digest=hashlib.sha256(file.read_bytes()).hexdigest()
        if digest!=expected[file.name]:
            raise ValueError(f'Source changed: {file.name}; review questions and answer mapping first.')
        if fi==0:continue
        exams=EXAMS
        if fi in [2,3,5]:exams=[e for e in EXAMS for _ in range(2)]
        if fi==4:exams=[35,35,36,36,37,37,37,41,41,41,47,47,52,52,60,60,64,64]
        if fi==10:exams=EXAMS+[35]
        if fi==11:exams=EXAMS[1:]
        with pymupdf.open(file) as pdf:
            if len(pdf)!=len(exams):raise ValueError(f'Unexpected page count: {file.name}')
            for pn,page in enumerate(pdf,1):
                pid=f'{fi:02}-{pn:02}'
                out=cache/'pages'/f'{pid}.png'
                if not out.exists():page.get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False).save(out)
                rows.append({'id':pid,'file':file.name,'fileIndex':fi,'page':pn,'exam':exams[pn-1],'sha256':digest})
    (cache/'pages.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{len(rows)} pages ready for local OCR')

if __name__=='__main__':main()
