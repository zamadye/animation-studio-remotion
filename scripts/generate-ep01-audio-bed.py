#!/usr/bin/env python3
"""Deterministic synthetic low-level ambience/foley for EP01; explicitly not recorded sound effects."""
import math, random, struct, wave, os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));RATE=24000;DUR=90;N=RATE*DUR

def write(path,samples):
 with wave.open(path,'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(struct.pack('<'+'h'*len(samples),*samples))

# Quiet location bed: office fan/room air, roadside wash in 00:26-00:40, quieter porch air at end.
r=random.Random(24011);state1=state2=0.;bed=[]
for i in range(N):
 t=i/RATE;n=r.uniform(-1,1);state1+=.035*(n-state1);state2+=.006*(n-state2);air=state1-state2*.72
 if t<26 or 40<=t<72:amp=.007;hum=.0012*math.sin(2*math.pi*60*t)+.0005*math.sin(2*math.pi*120*t)
 elif 26<=t<40:
  swell=.5+.5*math.sin(2*math.pi*(t-26)/5.3);amp=.012*(.4+.6*swell);hum=.0004*math.sin(2*math.pi*52*t)
 else:amp=.004;hum=.0004*math.sin(2*math.pi*1800*t)*(.5+.5*math.sin(2*math.pi*.7*t))
 fade=max(0,min(1,t/.6,(90-t)/1));bed.append(int(max(-1,min(1,(air*amp+hum)*fade))*32767))
write(os.path.join(ROOT,'audio/ep01-roomtone-synthetic.wav'),bed)

# Sparse authored beats: dry stamp, three weak starter kicks, page handling, short phone ring.
foley=[0]*N;r=random.Random(314159)
def add(t,fn):
 start=int(t*RATE)
 for j in range(min(RATE*3,N-start)):
  f=fn(j/RATE);foley[start+j]+=int(max(-1,min(1,f))*32767)
def stamp(t):
 def f(x):
  e=math.exp(-x*38);return (.045*r.uniform(-1,1)+.11*math.sin(2*math.pi*95*x))*e
 add(t,f)
for t in (24.0,34.2,35.05,36.0):
 stamp(t)
# Deliberately sputtering, underpowered starter: short noisy low pulses, not a real motorcycle sample.
for base in (34.35,35.25,36.2):
 def crank(x):
  env=max(0,1-x/.42)*(.5+.5*math.sin(2*math.pi*7*x));return .025*r.uniform(-1,1)*env + .018*math.sin(2*math.pi*(92+14*math.sin(2*math.pi*3*x))*x)*env
 add(base,crank)
# Two gentle page rustles after the clerk flips the procedure page.
for base in (62.8,63.35):
 def rustle(x):
  e=max(0,1-x/.34);return .008*r.uniform(-1,1)*e*(.5+.5*math.sin(2*math.pi*23*x))
 add(base,rustle)
# Short two-burst old-phone ring before the child's question.
def ring(x):
 on=(x<.32) or (.52<x<.84)
 return (.022*math.sin(2*math.pi*520*x)+.012*math.sin(2*math.pi*660*x)) if on else 0
add(70.9,ring)
write(os.path.join(ROOT,'audio/ep01-foley-synthetic.wav'),[max(-32768,min(32767,x)) for x in foley])
print('Generated subtle 90s synthetic location bed and sparse synthetic foley (not recorded assets).')
