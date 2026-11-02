import json, subprocess
P=json.load(open("plan.json")); dur=P["dur"]
inputs=["-loop","1","-t",str(dur),"-i","phone_bg.png","-i","screen.mp4","-loop","1","-i","screen_mask.png"]
fc=["[1:v]scale=630:1120,format=rgba[s]","[2:v]format=gray,scale=630:1120[m]","[s][m]alphamerge[sm]","[0:v][sm]overlay=225:420:shortest=1[v0]"]
cur="v0"; idx=3
for k,(cap,a,b) in enumerate(P["caps"]):
    inputs+=["-loop","1","-t",str(dur),"-i",f"ov/{cap}.png"]
    fc.append(f"[{cur}][{idx}:v]overlay=enable='between(t,{a:.3f},{b-0.02:.3f})'[v{k+1}]"); cur=f"v{k+1}"; idx+=1
aud=[]
for j,(n,t) in enumerate(P["sounds"]):
    inputs+=["-i","click.wav" if n=="tap" else "ding.wav"]
    ms=int(t*1000); aud.append(f"[{idx}:a]adelay={ms}|{ms}[a{j}]"); idx+=1
inputs+=["-f","lavfi","-t",str(dur),"-i","anullsrc=r=48000:cl=stereo"]; base=idx
fc+=aud
fc.append("".join(f"[a{j}]" for j in range(len(aud)))+f"[{base}:a]amix=inputs={len(aud)+1}:normalize=0:duration=longest[aout]")
cmd=["ffmpeg","-v","error","-y"]+inputs+["-filter_complex",";".join(fc),"-map",f"[{cur}]","-map","[aout]","-t",str(dur),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-r","30","-c:a","aac","-b:a","160k","-ar","48000","-ac","2","s4.mp4"]
subprocess.run(cmd,check=True)
