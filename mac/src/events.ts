export type EventBusCallback = (...value: any)=>void
class EventBus {
    bus = new Map<string,Set<EventBusCallback>>;
    off(id: string, callback: EventBusCallback) {
        const set = this.bus.get(id);
        if(!set)return;
        set.delete(callback);
        if(set.size === 0)
            this.bus.delete(id);
    }
    on(id: string, callback: EventBusCallback) {
        let set = this.bus.get(id)!;
        if(!set){
            set = new Set;
            this.bus.set(id,set);
        }
        set.add(callback);
        const that = this;
        return ()=>{
            that.off(id, callback)
        }
    }
    async emit(id: string, ...params: any) {
        // Defer to preserve rendering order
        await new Promise(res=>setTimeout(res,0));
        const set = this.bus.get(id);
        if(!set)return;
        for(let callback of set){
            callback(...params);
        }
    }
}

export const AppEvents = new EventBus();
