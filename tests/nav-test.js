const dist=(a,b,c,d)=>Math.hypot(c-a,d-b);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ================= world ================= */
const W=1450,H=930,CS=20,GW=Math.ceil(W/CS),GH=Math.ceil(H/CS);
const ROOMS={
 study:{r:[70,80,300,210],acc:'private',label:'Study'},
 hallW:{r:[150,300,120,110],acc:'public',label:''},
 foyer:{r:[70,420,320,310],acc:'public',label:'Foyer'},
 cloak:{r:[70,750,200,130],acc:'staff',label:'Cloakroom'},
 ballroom:{r:[430,260,540,520],acc:'public',label:'Ballroom'},
 terrace:{r:[430,80,540,140],acc:'public',label:'Terrace'},
 bar:{r:[1000,500,390,280],acc:'public',label:'Bar Lounge'},
 kitchen:{r:[1100,110,290,300],acc:'staff',label:'Kitchen'},
 corr:{r:[1000,110,80,370],acc:'staff',label:'Service'}
};
const DOORS=[
 {id:'dStudy',r:[185,288,50,14],locked:true},
 {r:[180,408,60,14]},{r:[390,540,40,70]},{r:[120,728,70,24]},
 {r:[560,218,70,44]},{r:[800,218,70,44]},
 {r:[968,640,34,80]},{r:[968,340,34,70]},
 {r:[1078,240,24,70]},{r:[1020,478,50,24]}
];
const FURN_C=[[700,330,24],[620,545,20],[520,700,26],[860,690,26],[1120,710,24],[450,100,12],[950,100,12],[370,450,12],[100,445,10]];
const FURN_R=[[150,150,130,36],[1130,215,200,30],[1060,560,250,26],[880,290,70,40]];
function inRect(x,y,r){return x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];}
function roomAt(x,y){for(const k in ROOMS)if(inRect(x,y,ROOMS[k].r))return k;
 for(const d of DOORS)if(inRect(x,y,d.r))return d.id==='dStudy'?'study':'door';return null;}
/* nav + sight grids */
let navB,sightB;
function buildGrids(){
 navB=new Uint8Array(GW*GH);sightB=new Uint8Array(GW*GH);
 for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){
  const x=gx*CS+CS/2,y=gy*CS+CS/2,i=gy*GW+gx;
  let open=false;
  for(const k in ROOMS)if(inRect(x,y,ROOMS[k].r)){open=true;break;}
  if(!open){
   let door=null;
   for(const d of DOORS)if(inRect(x,y,d.r)){door=d;break;}
   if(!door){navB[i]=1;sightB[i]=1;continue;}
   if(door.locked){navB[i]=1;sightB[i]=1;}
   continue;
  }
  let fb=0;
  for(const f of FURN_C)if(dist(x,y,f[0],f[1])<f[2]+10)fb=1;
  for(const f of FURN_R)if(x>f[0]-8&&x<f[0]+f[2]+8&&y>f[1]-8&&y<f[1]+f[3]+8)fb=1;
  navB[i]=fb;
 }
}
function cellBlocked(gx,gy,grid){if(gx<0||gy<0||gx>=GW||gy>=GH)return 1;return grid[gy*GW+gx];}
function losClear(x0,y0,x1,y1){
 const steps=Math.ceil(dist(x0,y0,x1,y1)/(CS*0.5));
 for(let i=1;i<steps;i++){const t=i/steps;
  if(cellBlocked(Math.floor((x0+(x1-x0)*t)/CS),Math.floor((y0+(y1-y0)*t)/CS),sightB))return false;}
 return true;}
function navClear(x0,y0,x1,y1){
 const steps=Math.ceil(dist(x0,y0,x1,y1)/(CS*0.4));
 for(let i=1;i<steps;i++){const t=i/steps;
  if(cellBlocked(Math.floor((x0+(x1-x0)*t)/CS),Math.floor((y0+(y1-y0)*t)/CS),navB))return false;}
 return true;}
function findPath(x0,y0,x1,y1){
 let sx=Math.floor(x0/CS),sy=Math.floor(y0/CS),tx=Math.floor(x1/CS),ty=Math.floor(y1/CS);
 if(cellBlocked(tx,ty,navB)){ // nudge target to nearest open cell
  let best=null,bd=1e9;
  for(let r=1;r<6&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
   if(!cellBlocked(tx+dx,ty+dy,navB)){const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=[tx+dx,ty+dy];}}}
  if(!best)return null;tx=best[0];ty=best[1];}
 if(cellBlocked(sx,sy,navB)){let best=null,bd=1e9;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(!cellBlocked(sx+dx,sy+dy,navB)){const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=[sx+dx,sy+dy];}}
  if(best){sx=best[0];sy=best[1];}else return null;}
 const key=(x,y)=>y*GW+x;
 const open=[[sx,sy]],g={},came={};g[key(sx,sy)]=0;
 const f={};f[key(sx,sy)]=Math.abs(tx-sx)+Math.abs(ty-sy);
 const inOpen={};inOpen[key(sx,sy)]=1;
 let guard=0;
 while(open.length&&guard++<6000){
  let bi=0;for(let i=1;i<open.length;i++)if((f[key(open[i][0],open[i][1])]||1e9)<(f[key(open[bi][0],open[bi][1])]||1e9))bi=i;
  const [cx,cy]=open.splice(bi,1)[0];delete inOpen[key(cx,cy)];
  if(cx===tx&&cy===ty){
   const path=[];let k=key(cx,cy);let px=cx,py=cy;
   while(came[k]!==undefined){path.push([px*CS+CS/2,py*CS+CS/2]);const pk=came[k];px=pk%GW;py=Math.floor(pk/GW);k=pk;}
   path.reverse();
   // smooth
   const sm=[];let cur=[x0,y0];let i=0;
   while(i<path.length){let j=path.length-1;
    for(;j>i;j--)if(navClear(cur[0],cur[1],path[j][0],path[j][1]))break;
    sm.push(path[j]);cur=path[j];i=j+1;}
   return sm;}
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
   const nx=cx+dx,ny=cy+dy;
   if(cellBlocked(nx,ny,navB))continue;
   if(dx&&dy&&(cellBlocked(cx+dx,cy,navB)||cellBlocked(cx,cy+dy,navB)))continue;
   const ng=g[key(cx,cy)]+(dx&&dy?1.4:1),nk=key(nx,ny);
   if(g[nk]===undefined||ng<g[nk]){g[nk]=ng;f[nk]=ng+Math.abs(tx-nx)+Math.abs(ty-ny);came[nk]=key(cx,cy);
    if(!inOpen[nk]){open.push([nx,ny]);inOpen[nk]=1;}}}
 }
 return null;}

buildGrids();
const start=[240,560];
const targets={glass:[1292,566],fuse:[1016,170],plate:[1260,222],poison:[1016,330],
 knife:[1175,222],coats:[120,812],band:[915,312],rail:[700,106],frontDoor:[86,586],
 barSpot:[1265,600],podium:[700,368],mingle:[600,640],closetW:[1016,430],tower:[620,545],
 barmanApproach:[1180,610],cellar:[1030,462],hallPriv:[180,350],terraceChat:[700,150]};
let ok=true;
for(const [k,[x,y]] of Object.entries(targets)){
 if(!findPath(start[0],start[1],x,y)){ok=false;console.log('NO PATH to',k);}}
let p=findPath(start[0],start[1],210,210);
if(p){const last=p[p.length-1];if(roomAt(last[0],last[1])==='study'){ok=false;console.log('LEAK: study while locked');}else console.log('locked study: path stops outside ✓');}
else console.log('locked study: unreachable ✓');
console.log('sight through locked study door (want false):',losClear(210,250,210,340));
DOORS.find(d=>d.id==='dStudy').locked=false;buildGrids();
if(!findPath(start[0],start[1],210,210)){ok=false;console.log('NO PATH to study after unlock');}else console.log('study after unlock ✓');
console.log('sight through open study door (want true):',losClear(210,250,210,340));
DOORS.find(d=>d.id==='dStudy').locked=true;buildGrids();
console.log('sight through solid wall (want false):',losClear(100,200,100,500));
console.log('sight across ballroom (want true):',losClear(500,400,900,700));
console.log('sight ballroom->bar through wall (want false):',losClear(900,400,1100,540));
const scheds={baron:[[250,560],[700,368],[1265,600],[700,106],[600,640]],
 isolde:[[285,600],[640,520],[1120,690],[565,455]],renn:[[1150,600],[880,650]],
 butler:[[1180,260],[700,560],[300,520],[640,700]],w1:[[640,480],[820,700],[1150,640]],
 w2:[[1025,300],[1100,620],[700,640]],guard2:[[460,300],[940,300],[940,740],[460,740]],
 guard3:[[1025,140],[1300,140],[1025,300],[1025,450]],
 gA:[[1170,620],[640,560]],gB:[[700,150],[560,600]],gC:[[540,455],[760,600],[520,700]],
 gD:[[730,150],[840,560]],gE:[[500,620],[700,660],[1100,650]],gF:[[300,550],[620,420],[850,480]]};
for(const [id,ws] of Object.entries(scheds))
 for(let i=0;i<ws.length;i++){const a=ws[i],b=ws[(i+1)%ws.length];
  if(!findPath(a[0],a[1],b[0],b[1])){ok=false;console.log('NPC',id,'cannot path',a,'->',b);}}
console.log(ok?'ALL NAV CHECKS PASSED':'NAV CHECKS FAILED');
