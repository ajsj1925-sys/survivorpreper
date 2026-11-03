import json, subprocess
ev=json.load(open("ev.json"))
END=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","app.mp4"]).decode())
T0=0.4; PAD=2.6
SEGS=[(T0,28.9,1.0),(28.9,47.7,1.7),(47.7,END,1.0)]
def f(t):
    o=0
    for a,b,sp in SEGS:
        if t<=a: return o
        if t<=b: return o+(t-a)/sp
        o+=(b-a)/sp
    return o
# 1) Zoom sobre la grabación original
terms_z=[]; terms_x=[]; terms_y=[]
for n,t,bb,ms in ev:
    if n!="focus" or not bb: continue
    a=t+0.05; b=t+ms/1000+0.25
    cx=bb["x"]+bb["width"]/2; cy=bb["y"]+bb["height"]/2
    Z=max(1.15,min(1.75,0.92*1080/max(1,bb["width"]),0.92*1920/max(1,bb["height"])))
    w=f"min(1,max(0,(it-{a:.2f})/0.45))*min(1,max(0,({b:.2f}-it)/0.45))"
    terms_z.append(f"{Z-1:.3f}*{w}"); terms_x.append(f"{cx-540:.1f}*{w}"); terms_y.append(f"{cy-960:.1f}*{w}")
z="1+"+"+".join(terms_z); cxe="540+"+"+".join(terms_x); cye="960+"+"+".join(terms_y)
zp=f"zoompan=z='{z}':x='max(0,min(iw-iw/zoom,({cxe})-iw/zoom/2))':y='max(0,min(ih-ih/zoom,({cye})-ih/zoom/2))':d=1:s=1080x1920:fps=30"
import os
if not os.path.exists("zoomed.mp4"): subprocess.run(["ffmpeg","-v","error","-y","-i","app.mp4","-vf",zp,"-c:v","libx264","-preset","veryfast","-crf","17","-pix_fmt","yuv420p","zoomed.mp4"],check=True)
# 2) Velocidad por tramos + pausa final (cada tramo por separado para no gastar memoria)
seglist=[]
for i,(a,b,sp) in enumerate(SEGS):
    vf=f"setpts=(PTS-STARTPTS)/{sp}"+(f",tpad=stop_mode=clone:stop_duration={PAD}" if i==len(SEGS)-1 else "")
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-to",str(b),"-i","zoomed.mp4","-vf",vf,"-an","-c:v","libx264","-preset","veryfast","-crf","17","-pix_fmt","yuv420p","-r","30",f"seg{i}.mp4"],check=True)
    seglist.append(f"file 'seg{i}.mp4'\n")
open("segs.txt","w").write("".join(seglist))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","segs.txt","-c","copy","screen.mp4"],check=True)
dur=f(END)+PAD
# 3) Composición horizontal
steps=[(n,f(t)) for n,t,*_ in ev if n.startswith("s") and n[1:].isdigit()]
steps.sort(key=lambda x:int(x[0][1:]))
inputs=["-loop","1","-t",f"{dur}","-i","base.png","-i","screen.mp4","-loop","1","-i","mask.png"]
fc=["[1:v]scale=540:960,format=rgba[s]","[2:v]format=gray[m]","[s][m]alphamerge[sm]","[0:v][sm]overlay=1230:60:shortest=1[v0]"]
cur="v0"; idx=3
for k,(n,a) in enumerate(steps):
    i=int(n[1:]); b=steps[k+1][1] if k+1<len(steps) else dur
    a=max(0,a-0.1)
    inputs+=["-loop","1","-t",f"{dur}","-i",f"prog{i}.png","-loop","1","-t",f"{dur}","-i",f"txt{i}.png"]
    fc.append(f"[{cur}][{idx}:v]overlay=enable='between(t,{a:.3f},{b:.3f})'[q{i}]")
    fc.append(f"[{idx+1}:v]format=rgba,fade=t=in:st={a:.3f}:d=0.45:alpha=1,fade=t=out:st={max(a,b-0.25):.3f}:d=0.25:alpha=1[t{i}]")
    fc.append(f"[q{i}][t{i}]overlay=x='if(lt(t,{a+0.45:.3f}),-60+60*(t-{a:.3f})/0.45,0)':y=0:enable='between(t,{a:.3f},{b:.3f})'[w{i}]")
    cur=f"w{i}"; idx+=2
aud=[]
sounds=[("click.wav",f(t)) for n,t,*_ in ev if n=="tap" and t>=T0]+[("ding.wav",f(t)) for n,t,*_ in ev if n=="ding"]+[("whoosh.wav",max(0,a-0.15)) for n,a in steps[1:]]
for j,(w,t) in enumerate(sounds):
    inputs+=["-i",w]; ms=int(t*1000); aud.append(f"[{idx}:a]adelay={ms}|{ms}[a{j}]"); idx+=1
inputs+=["-f","lavfi","-t",f"{dur}","-i","anullsrc=r=48000:cl=stereo"]
fc+=aud; fc.append("".join(f"[a{j}]" for j in range(len(aud)))+f"[{idx}:a]amix=inputs={len(aud)+1}:normalize=0:duration=longest[aout]")
E=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-r","30","-c:a","aac","-b:a","128k","-ar","48000","-ac","2"]
subprocess.run(["ffmpeg","-v","error","-y"]+inputs+["-filter_complex",";".join(fc),"-map",f"[{cur}]","-map","[aout]","-t",f"{dur}"]+E+["main.mp4"],check=True)
# 4) Portada y cierre con movimiento
for name,img,d in (("intro.mp4","intro.png",3.2),("outro.mp4","outro.png",4.5)):
    fr=int(d*30)
    vf=f"scale=3840:-1,zoompan=z='1+0.05*on/{fr}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={fr}:s=1920x1080:fps=30,fade=in:0:9,fade=out:st={d-0.35}:d=0.35"
    subprocess.run(["ffmpeg","-v","error","-y","-loop","1","-t",str(d),"-i",img,"-f","lavfi","-t",str(d),"-i","anullsrc=r=48000:cl=stereo","-vf",vf,"-shortest"]+E+[name],check=True)
open("list.txt","w").write("file 'intro.mp4'\nfile 'main.mp4'\nfile 'outro.mp4'\n")
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","list.txt"]+E+["-movflags","+faststart","MiPlanB_tutorial_completo_1080p.mp4"],check=True)
subprocess.run(["ffmpeg","-v","error","-y","-i","MiPlanB_tutorial_completo_1080p.mp4","-vf","scale=1280:720","-c:v","libx264","-preset","slow","-crf","27","-pix_fmt","yuv420p","-c:a","aac","-b:a","96k","-movflags","+faststart","MiPlanB_tutorial_web.mp4"],check=True)
print("dur main", round(dur,1), "steps", [(n,round(a,1)) for n,a in steps])
