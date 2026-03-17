export namespace contracts {
	
	export class ToDoEditReq {
	    desc?: string;
	    status?: string;
	
	    static createFrom(source: any = {}) {
	        return new ToDoEditReq(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.desc = source["desc"];
	        this.status = source["status"];
	    }
	}
	export class ToDoReq {
	    desc: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new ToDoReq(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.desc = source["desc"];
	        this.status = source["status"];
	    }
	}
	export class ToDoRes {
	    id: number;
	    desc: string;
	    status: string;
	    // Go type: time
	    createdAt: any;
	
	    static createFrom(source: any = {}) {
	        return new ToDoRes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.desc = source["desc"];
	        this.status = source["status"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

