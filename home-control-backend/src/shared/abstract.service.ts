import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user";

export abstract class AbstractService { 
    protected constructor(
        protected readonly repository: Repository<any>
    ) {
    }

    async save(options) {
        return this.repository.save(options);
    }
    async findAll():Promise<User[]> {
        return this.repository.find();
    }
    async findOneBy(options) {
        return this.repository.findOneBy(options);
    }
    async findOne(options) {
        return this.repository.findOne(options);
    }
    async find(options={}) {
        return this.repository.find(options);
    }
    async update(id: number, options) {
        return this.repository.update(id, options);
    }
    async delete(id: number) { 
        return this.repository.delete(id);
    }
}