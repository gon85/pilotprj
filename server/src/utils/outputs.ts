import {GraphQLInt} from 'graphql';
import {ClassType, Field, ObjectType} from 'type-graphql';

export function ListableResponse<T>(TClass: ClassType<T>): any {
  @ObjectType({isAbstract: true})
  abstract class ListableResponseClass {
    @Field(() => [TClass])
    list!: T[];

    @Field(() => GraphQLInt, {description: 'Total count'})
    totalCount!: number;

    @Field(() => GraphQLInt, {description: 'page index (1-based)'})
    page!: number;

    @Field(() => GraphQLInt, {description: 'page size'})
    pageSize!: number;
  }
  return ListableResponseClass;
}
