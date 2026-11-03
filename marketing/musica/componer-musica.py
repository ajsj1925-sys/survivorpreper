# Música de fondo original para los tutoriales de Mi Plan B (compuesta por síntesis, sin muestras ajenas).
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR=44100; BPM=104; beat=60/BPM; DUR=float(__import__("sys").argv[1]) if len(__import__("sys").argv)>1 else 120
N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(7)
def note(f): return 440*2**((f-69)/12)
def env(n, a=0.005, d=0.25, s=0.0, r=0.1):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/d)*(1-s)+s
    tail=int(r*SR); 
    if n>tail: e[-tail:]*=np.linspace(1,0,tail)
    return e
def add(buf, start, sig, pan=0.0):
    i=int(start*SR); j=min(N,i+len(sig))
    if i>=N: return
    L[i:j]+=sig[:j-i]*(1-max(0,pan)); R[i:j]+=sig[:j-i]*(1+min(0,pan))
def epiano(f, dur, vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR; fr=note(f)
    s=np.sin(2*np.pi*fr*t)+0.35*np.sin(2*np.pi*2*fr*t)*np.exp(-t/0.3)+0.12*np.sin(2*np.pi*3*fr*t)*np.exp(-t/0.15)
    s+=0.15*np.sin(2*np.pi*fr*1.003*t)  # leve coro
    return 0.16*vel*s*env(n,0.004,0.55,0.0,0.08)
def bass(f, dur):
    n=int(dur*SR); t=np.arange(n)/SR; fr=note(f)
    s=np.sin(2*np.pi*fr*t)+0.25*np.sin(2*np.pi*2*fr*t)
    return 0.28*s*env(n,0.01,0.6,0.35,0.06)
def kick():
    n=int(0.25*SR); t=np.arange(n)/SR; f=55+70*np.exp(-t/0.03)
    return 0.55*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.09)
b,a=butter(2,6000/(SR/2),"high")
def shaker(vel):
    n=int(0.06*SR); s=lfilter(b,a,rng.standard_normal(n)); return 0.05*vel*s*np.exp(-np.arange(n)/SR/0.018)
def clap():
    n=int(0.15*SR); s=lfilter(*butter(2,[1200/(SR/2),5000/(SR/2)],"band"),rng.standard_normal(n)); return 0.10*s*np.exp(-np.arange(n)/SR/0.05)
# Progresión alegre: C - G - Am - F (y una variación F - G - C - C)
PROG=[[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]]
PROG2=[[53,57,60,65],[55,59,62,67],[60,64,67,72],[60,64,67,72]]
MEL=[(0,76),(1,79),(1.5,77),(2,76),(3,74)], [(0,74),(1,71),(2,74),(3,79)], [(0,72),(1,76),(1.5,74),(2,72),(3,69)], [(0,69),(1,72),(2,77),(3,76)]
bar=4*beat; t=0; k=0
while t<DUR:
    sec=(k//8)%3  # 0 intro suave, 1 con melodía, 2 variación
    chord=(PROG if (k//4)%2==0 else PROG2)[k%4]
    # arpegio en corcheas
    pat=[0,1,2,3,2,1,2,3]
    for i,idx in enumerate(pat):
        add(L, t+i*beat/2, epiano(chord[idx]+12 if i in (3,7) else chord[idx], beat*0.9, 0.8 if i%2 else 1.0), pan=(-0.3 if i%2 else 0.3))
    # bajo
    root=chord[0]-24
    for i,o in enumerate([0,0,7,0]): add(L, t+i*beat, bass(root+(o if i!=2 else 7), beat*0.95))
    # percusión
    if k>=2:
        for i in range(4): add(L, t+i*beat, kick() if i in (0,2) else clap()*(0.7 if k>=4 else 0))
        for i in range(8): add(L, t+i*beat/2, shaker(1.0 if i%2 else 0.6), pan=0.4)
    # melodía (pizzicato brillante) a partir del compás 8
    if sec>=1:
        for (pos,nt) in MEL[k%4]:
            add(L, t+pos*beat, epiano(nt+(12 if sec==2 else 0), beat*0.8, 0.9), pan=-0.15)
    t+=bar; k+=1
# Eco ligero y mezcla
d=int(beat*0.75*SR)
for buf in (L,R):
    eco=np.zeros(N); eco[d:]=buf[:-d]*0.22; buf+=eco
mix=np.stack([L,R],1)
fade=int(2.5*SR); mix[:int(1.2*SR)]*=np.linspace(0,1,int(1.2*SR))[:,None]; mix[-fade:]*=np.linspace(1,0,fade)[:,None]
mix/=np.max(np.abs(mix))*1.05
wavfile.write("musica_tutorial.wav",SR,(mix*32767).astype(np.int16))
print("ok", DUR)
