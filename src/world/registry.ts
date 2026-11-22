import locations from './world-locations.json';
export type WorldFamily='service'|'office'|'drain'|'bridge'|'shop'|'stockroom'|'flood'|'community'|'home'|'schoolgate'|'classroom'|'school'|'busstop'|'street'|'service-exterior'|'shop-exterior';
export type WorldLocation={id:string;episodeId:string;location:string;family:WorldFamily;night:boolean;closeup:boolean;floorY:number;actorZones:{id:string;x:number;y:number}[];interaction:{x:number;y:number}};
export const worldLocations=locations as WorldLocation[];
export const resolveWorld=(episodeId:string,location:string)=>{
 const world=worldLocations.find(w=>w.episodeId===episodeId&&w.location.toLowerCase()===location.toLowerCase());
 if(!world)throw new Error(`Unknown story world: ${episodeId} / ${location}`);
 return world;
};
export const heroWorlds=['Kantor pelayanan','Ruang wawancara','Selokan jalan','Aula sekolah','Kampung tergenang','Ruang keluarga','Jembatan rusak','Kasir minimarket'].map((location,i)=>resolveWorld(String(i+1).padStart(2,'0'),location));
