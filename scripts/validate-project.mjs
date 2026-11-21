import fs from 'node:fs';import assert from 'node:assert/strict';
const episodes=JSON.parse(fs.readFileSync('src/data/episodes.json','utf8'));
const list=JSON.parse(fs.readFileSync('shotlist.json','utf8'));
const board=JSON.parse(fs.readFileSync('storyboard.json','utf8'));
const audio=JSON.parse(fs.readFileSync('audio-cues.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('assets-manifest.json','utf8'));
const variants=new Set(list.shots.map(s=>s.templateId));
assert.equal(episodes.length,8,'expected 8 source episodes');assert.equal(list.shots.length,48);assert.equal(board.length,48);assert.equal(audio.cues.length,48);
for(const e of episodes){assert.equal(e.shots.length,6,`${e.id}: 6 shot source rows`);assert.equal(e.shots[0].startSeconds,0,`${e.id}: begins at zero`);assert.equal(e.shots.at(-1).endSeconds,90,`${e.id}: source duration 90 sec`);let cursor=0;for(const s of e.shots){assert.equal(s.startSeconds,cursor,`${s.id}: contiguous/no overlap`);assert.equal(s.startSeconds*30,Math.round(s.startSeconds*30),`${s.id}: integer start frame`);assert.equal(s.endSeconds*30,Math.round(s.endSeconds*30),`${s.id}: integer end frame`);assert.ok(s.objective&&s.dialogue&&s.camera&&s.animation&&s.audio,`${s.id}: dialogue/action/camera/motion/audio extracted`);assert.ok(s.templateId&&s.characters.length&&s.poses.length,`${s.id}: template/cast/poses`);assert.ok(!/^(KAMERA \/ KOMPOSISI|REKOMENDASI ANIMASI|SFX \/ AUDIO):/m.test(s.dialogue),`${s.id}: field parser does not leak notes into dialogue`);cursor=s.endSeconds;}}
for(const template of ['CARTOON-STAGE-DIALOGUE','CARTOON-EVIDENCE-INSERT','CARTOON-MESSAGE-POV'])assert.ok(variants.has(template),`variant in use: ${template}`);
for(const r of ['vertical','square','landscape'])assert.match(fs.readFileSync('src/remotion.tsx','utf8'),new RegExp(r));
assert.match(fs.readFileSync('src/main.tsx','utf8'),/reducedMotion/,'reduced-motion UI toggle');assert.match(fs.readFileSync('src/motion/primitives.ts','utf8'),/progressAt|fadeAt|slideYAt|scaleAt|revealWidthAt/);
assert.equal(manifest.generatedOutputs['render.mp4'],'NOT PRODUCED','honestly marks missing render');
for(const f of ['creative-brief.md','storyboard.md','storyboard.json','shotlist.json','audio-cues.json','assets-manifest.json','character-bible.md','template-spec.json','qa-report.md'])assert.ok(fs.existsSync(f),`contract file exists: ${f}`);
console.log(`VALIDATED: ${episodes.length} episodes, ${list.shots.length} scenes, ${variants.size} structural variants, contiguous frame timing, audio cue placeholders, reduced-motion toggle and output contract.`);
