import { DB } from "./DB";
import * as mongodb from "mongodb";
import { injectable } from "inversify";

@injectable()
export class BaseRepository<T> {
    protected db: mongodb.Db;
    private entityName: string;

    constructor(entityName: string) {
        this.entityName = entityName;
        this.db = DB.db;
    }

    public async find(query: any): Promise<T[]> {
        return this.findAndSort(query, null, null);
    }

    public async count(query: any): Promise<any> {
        return await DB.db.collection(this.entityName).count(query);
    }

    public async findAndSort(query: any, sortQuery?: any, skipLimit?: any): Promise<T[]> {
        this.normalizeSearchQuery(query);
        if (query.textSearch) {
            const searchableFields: string[] = this.getTextSearchFields();
            const searchQuery: any[] = [];
            for (let i = 0; i < searchableFields.length; i++) {
                if (!query[searchableFields[i]]) {
                    const d = {};
                    d[searchableFields[i]] = { $regex: ".*" + query.textSearch + ".*" };
                    searchQuery.push(d);
                }
            }
            if (searchQuery.length) {
                query.$or = searchQuery;
            }
            delete query.textSearch;
        }
        let queryBuild = DB.db.collection(this.entityName).find(query);
        if (sortQuery) {
            queryBuild = queryBuild.sort(sortQuery);
        }
        if (skipLimit) {
            queryBuild = queryBuild.skip(skipLimit.skip).limit(skipLimit.limit);
        }
        const result = await queryBuild.toArray();
        if (!!result && !!result.length) {
            for (let i = 0; i < result.length; i++) {
                if (!!result[i]._id) {
                    result[i].id = this.serializeObjectId(result[i]._id);
                    delete result[i]._id;
                }
            }
        }
        return result;
    }

    public async findOne(query: any): Promise<T> {
        this.normalizeSearchQuery(query);
        const result = await DB.db.collection(this.entityName).findOne(query);
        if (!!result) {
            if (!!result._id) {
                result.id = this.serializeObjectId(result._id);
                delete result._id;
            }
        }
        return result;
    }

    public async findAll(): Promise<T[]> {
        return await this.find({});
    }

    public async create(entity: T): Promise<T> {
        const result = await this.collection().insertOne(entity);
        if (!!result && !!result.ops && !!result.ops.length) {
            if (!!result.ops[0]._id) {
                result.ops[0].id = this.serializeObjectId(result.ops[0]._id);
                delete result.ops[0]._id;
            }
            return result.ops[0];
        }
        return null;
    }

    public async updateMultiple(query: any, updateObject: any): Promise<T> {
        const result = await this.collection().update(query, updateObject, {multi: true});
        return result as any;
    }

    public async update(entity: T): Promise<T> {
        const objt = entity as any;

        const objId = this.deserializeObjectId(objt.id);

        const result = await this.collection().updateOne({ _id: objId }, { $set: objt });

        const updatedDoc = await this.collection().findOne({ _id: objId });

        if (!!updatedDoc) {
            if (!!updatedDoc._id) {
                updatedDoc.id = this.serializeObjectId(updatedDoc._id);
                delete updatedDoc._id;
            }
        }

        return updatedDoc;
    }

    public async updateMany(entities: T[]): Promise<T[]> {
        const result: T[] = [];
        for (let i = 0; i < entities.length; i++) {
            result.push((await this.update(entities[i])));
        }
        return result;
    }

    public async delete(entity: T): Promise<boolean> {

        const objt = entity as any;

        const objId = this.deserializeObjectId(objt.id);

        await this.collection().deleteOne({ _id: objId });

        return true;
    }

    public async deleteByQuery(query): Promise<boolean> {
        return await this.collection().remove(query)
            .then((res) => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    }

    public collection(): mongodb.Collection {
        return this.db.collection(this.entityName);
    }

    protected getTextSearchFields(): string[] {
        return [];
    }

    protected normalizeSearchQuery(query: any): any {
        if (!query) {
            query = {};
        }
        if (!!query.id) {
            query._id = this.deserializeObjectId(query.id);
            delete query.id;
        }
        return query;
    }

    protected serializeObjectId(objId: mongodb.ObjectID): string {
        if (!!objId) {
            return objId.toString();
        }
        return "";
    }

    protected deserializeObjectId(objectId: string): mongodb.ObjectID {
        if (!!objectId) {
            try {
                return new mongodb.ObjectID(objectId);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
}
