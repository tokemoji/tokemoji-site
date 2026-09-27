"""Render the delivered 8s film: real Seedance background + original Tokemoji motion.
No API market data is involved: every displayed price is labeled illustrative.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import subprocess,math,json,os
root=Path(__file__).resolve().parents[1];media=root/'src/assets/media';out=root/'artifacts';out.mkdir(exist_ok=True)
W,H,FPS=1280,720,24
candidates=[os.environ.get('TOKEMOJI_FONT',''), '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf']
font=next((f for f in candidates if f and Path(f).is_file()),None)
if not font: raise RuntimeError('Set TOKEMOJI_FONT to a local bold TTF font path')
fonts={s:ImageFont.truetype(font,s) for s in [12,15,18,24,30,46]}
scenes=[('AI CURES CANCER','love','fear',0),('ALIENS DEMAND RENT','fear','happy',2.875),('BILLIONAIRES CANCEL MONEY','lol','greed',5.541667)]
cache={};mask=Image.new('L',(180,180),0);ImageDraw.Draw(mask).ellipse((0,0,179,179),fill=255)
for name in {n for scene in scenes for n in scene[1:3]}:
    raw=subprocess.check_output(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(root/'src/assets/img/emojis'/(name+'-coin-motion.webm')),'-vf','fps=24,scale=180:180','-f','rawvideo','-pix_fmt','rgba','-'])
    frames=[]
    for i in range(len(raw)//(180*180*4)):
        im=Image.frombytes('RGBA',(180,180),raw[i*129600:(i+1)*129600]);im.putalpha(ImageChops.multiply(im.getchannel('A'),mask));frames.append(im)
    cache[name]=frames
reader=subprocess.Popen(['ffmpeg','-v','error','-i',str(media/'news-seedance.mp4'),'-vf','fps=24,scale=1280:720','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
output=out/'tokemoji-news-8s.mp4'
writer=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
for frame in range(192):
    data=reader.stdout.read(W*H*3)
    if len(data)!=W*H*3:raise RuntimeError('Seedance output shorter than 8 seconds')
    t=frame/FPS;idx=0 if t<2.875 else 1 if t<5.541667 else 2;headline,up,down,start=scenes[idx];p=min(1,max(0,(t-start)/((scenes[idx+1][3] if idx<2 else 8)-start)))
    im=Image.frombytes('RGB',(W,H),data).convert('RGBA');overlay=Image.new('RGBA',im.size);d=ImageDraw.Draw(overlay)
    d.rectangle((0,0,W,150),fill=(13,20,36,150));d.rounded_rectangle((24,20,246,58),radius=6,fill=(231,33,79,255));d.text((38,28),'BREAKING NEWS',font=fonts[18],fill='white');d.text((920,31),'WHAT IF? / FICTIONAL NEWS',font=fonts[15],fill='white');d.text((25,75),headline,font=fonts[46],fill='white',stroke_width=2,stroke_fill=(17,23,41,255))
    for n,sign,x in [(up,1,24),(down,-1,846)]:
        color=(0,117,64,255) if sign==1 else (203,22,66,255)
        d.rounded_rectangle((x,553,x+410,695),radius=18,fill=(255,245,219,242),outline=(17,23,41,255),width=3)
        d.text((x+195,568),n.upper(),font=fonts[24],fill=(17,23,41,255))
        price=.01*(1+sign*.18*p);d.text((x+195,602),('$%.4f'%price),font=fonts[30],fill=color)
        d.text((x+195,642),('+' if sign>0 else '-')+('%.1f%%'% (18*p))+'  '+('UP' if sign>0 else 'DOWN'),font=fonts[18],fill=color)
        d.text((x+195,674),'ILLUSTRATIVE / NOT LIVE',font=fonts[12],fill=(17,23,41,255))
    im=Image.alpha_composite(im,overlay)
    for n,sign,x in [(up,1,28),(down,-1,850)]:
        frames=cache[n];coin=frames[frame%len(frames)];y=530-round(sign*20*math.sin(p*math.pi/2));im.alpha_composite(coin,(x,y))
    if frame in [24,88,160]:im.convert('RGB').save(out/f'film-shot-{idx}.jpg',quality=90)
    writer.stdin.write(im.convert('RGB').tobytes())
writer.stdin.close();assert writer.wait()==0;reader.stdout.close();reader.wait()
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=width,height','-of','json',str(output)]));print(json.dumps({'artifact':str(output),**info},indent=2))
