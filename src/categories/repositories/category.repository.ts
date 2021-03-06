import { EntityRepository, In, Repository } from "typeorm";
import { Category } from "../models/category.entity";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";


@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

  public async getCategories(paginationDTO: IPaginationDTO) {
    const qb = this.createQueryBuilder('c');
    
    if (paginationDTO.size) {
      qb.take(paginationDTO.size);
    }

    if (paginationDTO.offset) {
      qb.skip(paginationDTO.offset);
    }

    if (paginationDTO.orderBy) {
      qb.orderBy(paginationDTO.orderBy, paginationDTO.orderDirection);
    }

    return qb.getManyAndCount();
  }

  public async countCategoriesById(categoryIds: number[]) {
    return this.count({
      where: {
        id: In(categoryIds),
      }
    });
  }

  public async getCategoryByName(name: string) {
    return this.findOne({
      where: { name }
    });
  }
}