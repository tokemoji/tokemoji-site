from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,io,concurrent.futures
root=Path(__file__).resolve().parents[1]; assets=root/'src/assets/img/emojis'; media=root/'src/assets/media';media.mkdir(exist_ok=True)
Image.open(root/'artwork/sources/pairs-higgsfield-original.png').convert('RGB').save(media/'pairs-higgsfield.webp',quality=88)
names='greed fear good evil love hate mad sad lol omg happy like'.split()
def render(name):
    source=assets/(name+'.webm');size=380
    raw=subprocess.check_output(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(source),'-vf','fps=24,scale=380:380','-f','rawvideo','-pix_fmt','rgba','-'])
    framebytes=size*size*4;count=len(raw)//framebytes
    Image.frombytes('RGBA',(size,size),raw[:framebytes]).save(assets/(name+'.webp'),quality=90)
    ring=Image.open(root/'artwork/coins'/(name+'-coin-clean.png')).convert('RGBA').resize((size,size),Image.Resampling.LANCZOS)
    mask=Image.new('L',(size,size),0);ImageDraw.Draw(mask).ellipse((61,61,319,319),fill=255)
    # Original outer ring/branding is immutable; only the inner face is composited from original animated artwork.
    hole=ring.copy();alpha=hole.getchannel('A');alpha.paste(0,(0,0),mask);hole.putalpha(alpha)
    cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s','380x380','-r','24','-i','-','-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf','34','-deadline','good','-cpu-used','4',str(assets/(name+'-coin-motion.webm'))]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for i in range(count):
        face=Image.frombytes('RGBA',(size,size),raw[i*framebytes:(i+1)*framebytes]).resize((326,326),Image.Resampling.LANCZOS)
        layer=Image.new('RGBA',(size,size),(0,0,0,0));ImageDraw.Draw(layer).ellipse((60,60,320,320),fill=(255,211,37,255));layer.alpha_composite(face,(27,27));layer.putalpha(mask);layer.alpha_composite(hole)
        if i==min(12,count-1):layer.save(media/(name+'-motion-proof.png'))
        proc.stdin.write(layer.tobytes())
    proc.stdin.close();assert proc.wait()==0
    return f'{name}: {count} frames / 24fps, original standalone + approved coin ring'
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for result in pool.map(render,names):print(result,flush=True)
