"""Import inspected TOPIK sources and local Windows Korean OCR results.
PDFs are data only. Run after rendering/OCR; fail on incomplete source mappings.
"""
import argparse,json,re,hashlib
from pathlib import Path
import pdfplumber
from PIL import Image

APP=Path(__file__).resolve().parents[1]
TYPES=[
 ('1',1,4,'Ngữ pháp trong câu','Chọn cấu trúc phù hợp và cách diễn đạt tương đương.'),
 ('2',5,8,'Quảng cáo & thông báo ngắn','Nhận biết chủ đề qua từ khóa và tình huống.'),
 ('3a',9,10,'Bảng biểu & thông tin','Đối chiếu số liệu, điều kiện và đối tượng.'),
 ('3b',11,12,'Nội dung thông báo','Tìm thông tin đúng với đoạn văn.'),
 ('4',13,15,'Sắp xếp câu','Nối các câu thành đoạn văn có trình tự hợp lý.'),
 ('5',16,18,'Điền vào đoạn văn','Chọn phần còn thiếu theo quan hệ ý nghĩa.'),
 ('6',19,20,'Cụm từ & nội dung','Hoàn thành đoạn văn và kiểm tra thông tin.'),
 ('7',21,22,'Thành ngữ & ý chính','Hiểu cách nói trong ngữ cảnh và thông điệp của bài.'),
 ('8',23,24,'Tâm trạng & chi tiết','Đọc tình huống, suy ra cảm xúc và thông tin.'),
 ('9',25,27,'Tiêu đề báo chí','Diễn giải chính xác ý nghĩa của tiêu đề.'),
 ('10',28,31,'Hoàn thành ý trong bài','Đọc mạch lập luận để chọn nội dung điền vào.'),
 ('11',32,34,'Đối chiếu thông tin','Phân biệt điều được nói, bị đảo ngược và không có trong bài.'),
 ('12',35,38,'Chủ đề & quan điểm','Xác định ý chính thay vì chỉ chọn một chi tiết.'),
 ('13',39,41,'Chèn câu vào đoạn','Theo dõi từ nối, từ chỉ định và trình tự thông tin.'),
 ('14',42,43,'Đọc văn học','Hiểu tâm trạng nhân vật và diễn biến câu chuyện.'),
 ('15',44,45,'Lập luận & điền ý','Xác định chủ trương và mắt xích còn thiếu trong lập luận.'),
 ('16',46,47,'Vị trí câu & thông tin','Chèn câu rồi đối chiếu nội dung bài.'),
 ('17',48,50,'Đọc hiểu tổng hợp','Đọc bài dài, suy luận mục đích và nội dung chi tiết.'),
]
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--cache',required=True);a=p.parse_args()
 source=Path(a.source);cache=Path(a.cache)
 files=sorted(source.glob('*.pdf'));assert len(files)==19
 keys={}
 with pdfplumber.open(files[0]) as doc:
  for page_no,page in enumerate(doc.pages,1):
   for table in page.extract_tables():
    exams=[int(re.search(r'\d+',v)[0]) for v in table[1][1:]]
    for row in table[2:]:
     if not row[0] or not row[0].isdigit():continue
     for exam,value in zip(exams,row[1:]):
      key=f'{exam}-{int(row[0])}';assert key not in keys and value in ['1','2','3','4']
      keys[key]={'answer':int(value),'page':page_no}
 assert len(keys)==400
 rows=json.loads((cache/'pages.json').read_text(encoding='utf-8'))
 assets=APP/'public'/'reading';assets.mkdir(exist_ok=True)
 pagesdir=APP/'src'/'content'/'reading-pages';pagesdir.mkdir(exist_ok=True)
 sets={};last_exam={}
 for row in rows:
  fi=row['fileIndex'];page=row['page'];filename=row['file']
  numbers=re.search(r'câu (\d+)~(\d+)',filename);start,end=map(int,numbers.groups())
  exam=row['exam'] or last_exam.get(fi)
  # Verified source anomalies: exam 35 Q9–10 appended to type 2; missing heading on exam 47 Q46–47.
  if fi==10 and page==9:start,end,exam=9,10,35
  if fi==8 and page==5:exam=47
  assert exam in [35,36,37,41,47,52,60,64]
  last_exam[fi]=exam
  kind=next(t for t in TYPES if t[1]==start and t[2]==end)
  sid=f'reading-{kind[0]}-{exam}'
  if sid not in sets:sets[sid]={'id':sid,'typeId':kind[0],'exam':exam,'numbers':list(range(start,end+1)),'pages':[]}
  d=json.loads((cache/'pages'/f'{row["id"]}.json').read_text(encoding='utf-8-sig'))
  # Order lines by their page position. Keep the scan as the authoritative visible text.
  lines=sorted(d['lines'],key=lambda l:(round(min(w['y'] for w in l['words'])/12),min(w['x'] for w in l['words'])))
  words=[w for line in lines for w in line['words']]
  payload={'id':row['id'],'width':d['width'],'height':d['height'],'words':words,'text':'\n'.join(l['text'] for l in lines)}
  (pagesdir/f'{row["id"]}.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
  image=Image.open(cache/'pages'/f'{row["id"]}.png').convert('RGB');image.save(assets/f'{row["id"]}.webp',quality=88)
  sets[sid]['pages'].append({'id':row['id'],'page':page,'file':filename})
 assert len(sets)==144
 assert sum(len(s['numbers']) for s in sets.values())==400
 # Source defects verified against page images; never grade mismatched questions.
 sets['reading-13-36']['numbers']=[39]
 sets['reading-13-36']['sourceNote']='Tài liệu lặp câu 39 ba lần, thiếu câu 40–41. Bài này chỉ chấm câu 39.'
 sets['reading-16-41']['numbers']=[]
 sets['reading-16-41']['sourceNote']='Trang đề bị chèn nhầm câu 42–43; thiếu câu 46–47 kỳ 41. Bài này tạm chưa mở.'
 for s in sets.values():
  s['answers']={str(n):keys[f'{s["exam"]}-{n}'] for n in s['numbers']}
 result={'types':[dict(id=t[0],start=t[1],end=t[2],title=t[3],description=t[4]) for t in TYPES],'sets':list(sets.values()),'answerSource':files[0].name,'sources':[{'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in files]}
 (APP/'src/content/reading-catalog.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
 print(f'{len(sets)} practice sets; 396 usable questions; 400 source answers; {len(rows)} source pages')
if __name__=='__main__':main()
