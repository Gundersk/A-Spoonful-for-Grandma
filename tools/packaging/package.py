"""Build a native c3p plus player README, no AI/tool/project-management files."""
from pathlib import Path
import argparse, hashlib, json, re, zipfile, subprocess
root=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--version',required=True);args=parser.parse_args()
if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*',args.version):parser.error('Use a simple version label')
game=root/'game';out=root/'dist'/('OneMoreSpoon_'+args.version);out.mkdir(parents=True,exist_ok=True)
try:
 source_commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True,stderr=subprocess.DEVNULL).strip()
except (subprocess.CalledProcessError,FileNotFoundError):
 source_commit='не определён (исходники без Git)'
allowed={'scripts','objectTypes','layouts','eventSheets','images','icons','flowcharts','timelines'}
files=[]
for p in sorted(game.rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(game)
 if p.name=='project.c3proj' or (rel.parts[0] in allowed and not any('uistate' in x.lower() for x in rel.parts) and p.suffix!='.bak'):files.append(p)
archive=out/'OneMoreSpoon.c3p'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,p.relative_to(game).as_posix())
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 for n in z.namelist():assert z.read(n)==(game/n).read_bytes()
 assert 'project.c3proj' in z.namelist()
 assert not any(x in n.lower() for n in z.namelist() for x in ('agents.md','llm-context','.codex','.bak','node_modules'))
(out/'README.md').write_text('''# Ложечку за бабушку — минипрототип ER-Studio

Версия пакета: '''+args.version+'''. Исходный commit: '''+source_commit+'''. При сборке с незакоммиченными изменениями commit указывает только базу; перед официальным выпуском рабочая папка должна быть чистой. Открыть OneMoreSpoon.c3p в Construct 3 и запустить Preview. Исходная версия редактора r506.3. Это редактируемый проект, не автономный exe. Для запуска Node.js, MCP и инструменты ИИ не требуются.

## Управление

WASD/стрелки — движение; E — действие и подбор; ЛКМ — бросить кастрюлю к курсору, до 220 пикселей; Q — поставить на ближайшую подходящую станцию, иначе на пол.

## Демонстрация

Подойти к кастрюле на столешнице и взять E. У банки добавлять гречку отдельными E (1 ложка=0.1, до 10). Помыть E у раковины. Поставить E на конфорку; варка 5 секунд. Забрать E, подойти к столу подачи и поставить E. 1 ложка даёт 10 вккал/1 монету, 10 ложек — 100/10. Начисляются также полезность и вредность. Повторная подача не даёт вторую награду. Если после мойки добавить крупу, нужна повторная мойка.

## Реализовано

Движение в 8 направлениях, коллизии, анимации обычной ходьбы/переноса; одна кухня; одна кастрюля со сменой содержимого/наполнения; гречка, мойка, таймер, подача и показатели; постановка на поверхности и бросок по дуге с возвратом при промахе. Статическая камера кухни и модуль следования для будущих больших сцен.

## Ограничения и проверка

Книга рецептов, инвентарь, улучшения, закупка, другие сцены, события, концовки и видимый внук ещё не реализованы. Часть графики временная. Автоматические проверки не являются запуском в Construct. Этот пакет — кандидат: последнее открытие/Preview должно быть подтверждено вручную перед сдачей. Результаты и история доступны в рабочем репозитории команды. Игровые PNG и JavaScript необходимы движку и включены; служебных файлов ИИ/MCP внутри нет.
''',encoding='utf-8')
checks={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [archive,out/'README.md']}
(out/'SHA256SUMS.txt').write_text(''.join(f'{v}  {k}\n' for k,v in checks.items()),encoding='utf-8')
bundle=root/'dist'/('OneMoreSpoon_'+args.version+'.zip')
with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as z:
 for p in [archive,out/'README.md',out/'SHA256SUMS.txt']:z.write(p,out.name+'/'+p.name)
with zipfile.ZipFile(bundle) as z:assert z.testzip() is None
print(f'Packaged {len(files)} native files. ZIP verified. Preview NOT verified. Output: {bundle}')
