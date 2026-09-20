"""Deterministic table import. PDF content is data, never executable instructions.

Usage: python scripts/import_sources.py --vocabulary path.pdf --grammar path.pdf
Requires pdfplumber. Original PDFs are not copied into the public application.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).resolve().parents[1]

def clean(value):
    return re.sub(r'\s+', ' ', value or '').strip()

def extract(path, kind, expected):
    records = []
    with pdfplumber.open(path) as doc:
        for page_number, page in enumerate(doc.pages, 1):
            tables = page.extract_tables()
            if len(tables) != 1:
                raise ValueError(f'{kind} page {page_number}: expected exactly one table, got {len(tables)}')
            for row in tables[0][1:]:
                if kind == 'vocabulary':
                    for offset in (0, 3):
                        index, korean, english = map(clean, row[offset:offset+3])
                        if not index and not korean and not english:
                            continue
                        if not index.isdigit() or not korean:
                            raise ValueError(f'Invalid vocabulary row on page {page_number}: {row}')
                        records.append(dict(index=int(index), korean=korean, english=english, page=page_number))
                else:
                    index, pattern, meaning, example, translation = map(clean, row)
                    if not index.isdigit() or not all((pattern, meaning, example, translation)):
                        raise ValueError(f'Invalid grammar row on page {page_number}: {row}')
                    records.append(dict(index=int(index), pattern=pattern, meaning=meaning, example=example, translation=translation, page=page_number))
        page_count = len(doc.pages)
    records.sort(key=lambda item: item['index'])
    if [record['index'] for record in records] != list(range(1, expected+1)):
        raise ValueError(f'{kind}: missing or duplicate source indexes')
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    missing=[record['index'] for record in records if kind=='vocabulary' and not record['english']]
    return records,dict(id='topik-vocabulary' if kind=='vocabulary' else 'topik-grammar',filename=path.name,sha256=digest,pages=page_count,records=len(records),missingMeanings=missing,language='ko-en',band='TOPIK II — Intermediate',extraction='pdfplumber table extraction; whitespace normalized only')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--vocabulary',type=Path,required=True)
    parser.add_argument('--grammar',type=Path,required=True)
    args=parser.parse_args()
    vocab,vmanifest=extract(args.vocabulary,'vocabulary',2662)
    grammar,gmanifest=extract(args.grammar,'grammar',148)
    output=ROOT/'src'/'content'
    output.mkdir(parents=True,exist_ok=True)
    for name,content in [('topik-vocabulary',vocab),('topik-grammar',grammar),('sources',[vmanifest,gmanifest])]:
        (output/f'{name}.json').write_text(json.dumps(content,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
    print(json.dumps({'vocabulary':vmanifest,'grammar':gmanifest},ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
